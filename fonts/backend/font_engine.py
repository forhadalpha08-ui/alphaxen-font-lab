#!/usr/bin/env python3
"""
Font Engine for Image-to-Vector Font Generation System
Converts font reference images into genuine vector OpenType (.otf) and TrueType (.ttf)
fonts with three distinct weights: Regular, Semi-Bold, and Bold.
"""

import os
import io
import math
import zipfile
import base64
import cv2
import numpy as np
import pyclipper
from PIL import Image

from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.ttLib import TTFont, newTable
from fontTools.ttLib.tables.S_V_G_ import SVGDocument

# Typography Constants
UNITS_PER_EM = 1000
ASCENDER = 850
DESCENDER = -200
CAP_HEIGHT = 700
X_HEIGHT = 500
LINE_GAP = 90
WIN_ASCENT = 950
WIN_DESCENT = 250
DEFAULT_SPACE_WIDTH = 450
DEFAULT_LSB = 40
DEFAULT_RSB = 40


def shoelace_signed_area(pts):
    """Compute signed area of a 2D polygon using Shoelace formula."""
    n = len(pts)
    if n < 3:
        return 0.0
    area = 0.0
    for i in range(n):
        j = (i + 1) % n
        area += pts[i][0] * pts[j][1]
        area -= pts[i][1] * pts[j][0]
    return area / 2.0


class FontEngine:
    def __init__(self):
        pass

    @staticmethod
    def detect_background_polarity(image):
        """
        Analyze corner pixels to determine whether image has a dark background
        (e.g. black / dark canvas) or light background (e.g. paper / white).
        Returns True if background is dark (foreground is light).
        """
        h, w = image.shape[:2]
        corner_size = max(5, min(w, h) // 30)
        corners = [
            image[0:corner_size, 0:corner_size],
            image[0:corner_size, w - corner_size:w],
            image[h - corner_size:h, 0:corner_size],
            image[h - corner_size:h, w - corner_size:w]
        ]
        mean_vals = [np.mean(c) for c in corners]
        avg_bg = np.mean(mean_vals)
        return bool(avg_bg < 128)

    @staticmethod
    def preprocess_image(image, is_dark=None, thresh_val=None):
        """
        Produce a clean binary mask (white foreground on black background)
        and filtered grayscale image.
        """
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image.copy()

        if is_dark is None:
            is_dark = FontEngine.detect_background_polarity(image)

        if not is_dark:
            # Invert so text is bright, background is dark
            gray = cv2.bitwise_not(gray)

        # Remove subtle noise using bilateral / gaussian filter
        smoothed = cv2.bilateralFilter(gray, 7, 50, 50)

        if thresh_val is not None and thresh_val > 0:
            _, bin_mask = cv2.threshold(smoothed, thresh_val, 255, cv2.THRESH_BINARY)
        else:
            # Otsu's thresholding with bias towards clean edges
            otsu_val, _ = cv2.threshold(smoothed, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            # Clip threshold to avoid capturing background haze
            effective_thresh = max(25, int(otsu_val * 0.85))
            _, bin_mask = cv2.threshold(smoothed, effective_thresh, 255, cv2.THRESH_BINARY)

        return bin_mask, gray, is_dark

    @staticmethod
    def segment_glyphs(image, min_area=80, noise_cutoff=50, split_touching=True):
        """
        Segment individual glyphs from the image.
        Detects rows, groups multi-part glyphs (!, ?, :, ;, =, %, etc.),
        and suppresses noise particles, dust, decorative dividers, and borders.
        """
        h, w = image.shape[:2]
        bin_mask, gray, is_dark = FontEngine.preprocess_image(image)

        # 1. Suppress extreme full-width borders and decorative separator lines
        horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (int(w * 0.3), 1))
        horizontal_lines = cv2.morphologyEx(bin_mask, cv2.MORPH_OPEN, horizontal_kernel)
        bin_mask_no_lines = cv2.subtract(bin_mask, horizontal_lines)

        # 2. Connected component analysis
        num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(bin_mask_no_lines)

        components = []
        for i in range(1, num_labels):
            x = int(stats[i, cv2.CC_STAT_LEFT])
            y = int(stats[i, cv2.CC_STAT_TOP])
            bw = int(stats[i, cv2.CC_STAT_WIDTH])
            bh = int(stats[i, cv2.CC_STAT_HEIGHT])
            area = int(stats[i, cv2.CC_STAT_AREA])

            # Filter out giant background blocks or decorative side banners
            if bw > w * 0.75 or bh > h * 0.75:
                continue
            # Filter out very thin horizontal lines that survived
            if bw > bh * 10 and bh < 15:
                continue
            # Filter out micro noise particles
            if area < noise_cutoff:
                continue

            components.append({
                'x': x, 'y': y, 'w': bw, 'h': bh,
                'x2': x + bw, 'y2': y + bh,
                'area': area,
                'centroid': centroids[i]
            })

        if not components:
            return [], is_dark

        # 3. Estimate median glyph height among prominent components to detect titles vs glyphs
        areas = [c['area'] for c in components]
        heights = [c['h'] for c in components if c['area'] > np.median(areas) * 0.5]
        median_h = np.median(heights) if heights else 80.0

        # Filter components that are way too small (isolated dust particles < 10% of median height unless in symbol cluster)
        valid_comps = []
        for c in components:
            if c['h'] < median_h * 0.12 and c['area'] < min_area:
                continue
            valid_comps.append(c)

        # 4. Multi-part component grouping (e.g. dot of '!', colon, semicolon, quote marks, percent)
        valid_comps.sort(key=lambda c: (c['y'], c['x']))
        merged_boxes = []
        used = [False] * len(valid_comps)

        for i in range(len(valid_comps)):
            if used[i]:
                continue
            c1 = valid_comps[i]
            used[i] = True
            bx1, by1, bx2, by2 = c1['x'], c1['y'], c1['x2'], c1['y2']
            total_area = c1['area']

            for j in range(i + 1, len(valid_comps)):
                if used[j]:
                    continue
                c2 = valid_comps[j]

                # Check if c2 is a vertical companion (e.g. dot of !, colon, semicolon)
                # Overlap in X
                x_overlap = max(0, min(bx2, c2['x2']) - max(bx1, c2['x']))
                min_box_w = min(bx2 - bx1, c2['w'])
                v_gap = c2['y'] - by2

                # If vertically stacked with close distance
                is_vertical_companion = (
                    x_overlap > 0.3 * min_box_w and
                    0 <= v_gap < median_h * 0.55 and
                    (by2 - by1 + c2['h'] + v_gap) < median_h * 1.6
                )

                # Check if c2 is a horizontal companion (e.g. double quotes "" or equals sign =)
                h_gap = c2['x'] - bx2
                y_overlap = max(0, min(by2, c2['y2']) - max(by1, c2['y']))
                min_box_h = min(by2 - by1, c2['h'])
                is_horizontal_companion = (
                    y_overlap > 0.6 * min_box_h and
                    0 <= h_gap < min_box_w * 0.4 and
                    max(by2 - by1, c2['h']) < median_h * 0.45
                )

                if is_vertical_companion or is_horizontal_companion:
                    bx1 = min(bx1, c2['x'])
                    by1 = min(by1, c2['y'])
                    bx2 = max(bx2, c2['x2'])
                    by2 = max(by2, c2['y2'])
                    total_area += c2['area']
                    used[j] = True

            merged_boxes.append({
                'x': bx1, 'y': by1, 'w': bx2 - bx1, 'h': by2 - by1,
                'x2': bx2, 'y2': by2, 'area': total_area
            })

        # 5. Row clustering and smart sorting (top-to-bottom, left-to-right)
        # Cluster boxes whose vertical centers are within 40% of median height
        row_groups = []
        # Sort primarily by vertical center
        merged_boxes.sort(key=lambda b: (b['y'] + b['h'] / 2.0))

        for b in merged_boxes:
            b_cy = b['y'] + b['h'] / 2.0
            placed = False
            for group in row_groups:
                group_cy = np.mean([item['y'] + item['h'] / 2.0 for item in group])
                if abs(b_cy - group_cy) < median_h * 0.45:
                    group.append(b)
                    placed = True
                    break
            if not placed:
                row_groups.append([b])

        # Sort each row group horizontally from left to right
        sorted_boxes = []
        for group in row_groups:
            group.sort(key=lambda b: b['x'])
            sorted_boxes.extend(group)

        # 6. Automatic Character Assignment Heuristic
        # Typical specimen sheets:
        # Title at top (can be identified if width > 60% of w or height > 1.8 * median)
        # Row 1: A-M (13 letters)
        # Row 2: N-Z (13 letters)
        # Row 3: a-m (13 letters) or 0-9 (10 numbers)
        # Row 4: n-z (13 letters) or symbols
        # Subsequent rows: Numbers and Punctuation/Symbols
        detected_glyphs = []
        char_idx = 0

        # Standard specimen candidate list
        specimen_chars = (
            [chr(c) for c in range(ord('A'), ord('Z') + 1)] +
            [str(d) for d in range(10)] +
            ['!', '?', '@', '#', '$', '%', '&', '*', '(', ')', '-', '_', '+', '=',
             ':', ';', '"', "'", ',', '.', '<', '>', '/', '\\', '|', '{', '}', '~', '^', '€', '£', '¥', '©', '®']
        )

        for idx, box in enumerate(sorted_boxes):
            # Check if this box is likely a header title (very tall or wide)
            is_header = (box['h'] > median_h * 2.2 or box['w'] > w * 0.55)
            # Check if this box is an isolated tiny particle (< 4% of median area and not grouped)
            is_dust = (box['area'] < min_area * 0.8 and box['h'] < median_h * 0.2)

            is_active = not (is_header or is_dust)
            assigned_char = ""
            if is_active:
                if char_idx < len(specimen_chars):
                    assigned_char = specimen_chars[char_idx]
                    char_idx += 1
                else:
                    assigned_char = f"g{char_idx}"
                    char_idx += 1
            else:
                assigned_char = "—"

            # Create clean crop image for preview
            pad = 6
            cx1 = max(0, box['x'] - pad)
            cy1 = max(0, box['y'] - pad)
            cx2 = min(w, box['x2'] + pad)
            cy2 = min(h, box['y2'] + pad)
            crop_img = image[cy1:cy2, cx1:cx2]

            # Encode crop to base64 JPEG/PNG
            _, buf = cv2.imencode('.png', crop_img)
            crop_b64 = base64.b64encode(buf).decode('utf-8')

            detected_glyphs.append({
                'id': f"glyph_{idx + 1}",
                'char': assigned_char,
                'x': int(box['x']),
                'y': int(box['y']),
                'w': int(box['w']),
                'h': int(box['h']),
                'area': int(box['area']),
                'is_header': bool(is_header),
                'is_dust': bool(is_dust),
                'is_active': bool(is_active),
                'preview_b64': f"data:image/png;base64,{crop_b64}"
            })

        return detected_glyphs, is_dark

    @staticmethod
    def extract_clean_glyph_mask(image, x, y, w, h, is_dark=True, thresh_val=None, noise_filter=True):
        """
        Crop glyph region, isolate the dominant glyph component(s),
        and rigorously suppress stray particles, border bleed from adjacent letters,
        and compression noise.
        """
        img_h, img_w = image.shape[:2]
        # Pad bounds slightly to avoid cutting glyph edges
        pad = 4
        x1 = max(0, x - pad)
        y1 = max(0, y - pad)
        x2 = min(img_w, x + w + pad)
        y2 = min(img_h, y + h + pad)

        crop = image[y1:y2, x1:x2]
        if crop.size == 0:
            return np.zeros((h, w), dtype=np.uint8), (0, 0, w, h)

        if len(crop.shape) == 3:
            gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
        else:
            gray = crop.copy()

        if not is_dark:
            gray = cv2.bitwise_not(gray)

        # Bilateral filter for noise removal while preserving crisp edges
        filtered = cv2.bilateralFilter(gray, 5, 45, 45)

        if thresh_val is not None and thresh_val > 0:
            _, binary = cv2.threshold(filtered, thresh_val, 255, cv2.THRESH_BINARY)
        else:
            otsu_val, _ = cv2.threshold(filtered, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            eff_thresh = max(25, int(otsu_val * 0.8))
            _, binary = cv2.threshold(filtered, eff_thresh, 255, cv2.THRESH_BINARY)

        # Particle & Border-Bleed Purger
        if noise_filter:
            # 1. Connected components within the crop
            num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(binary)
            if num_labels > 1:
                # Find maximum component area (the main glyph body)
                max_area = 0
                main_label = 1
                for lbl in range(1, num_labels):
                    area = stats[lbl, cv2.CC_STAT_AREA]
                    if area > max_area:
                        max_area = area
                        main_label = lbl

                clean_mask = np.zeros_like(binary)
                ch, cw = binary.shape

                # Keep main component and any legitimate companion components
                # (e.g. dot of 'i' or '!', punctuation marks, colon, etc.)
                for lbl in range(1, num_labels):
                    area = stats[lbl, cv2.CC_STAT_AREA]
                    lx = stats[lbl, cv2.CC_STAT_LEFT]
                    ly = stats[lbl, cv2.CC_STAT_TOP]
                    lw = stats[lbl, cv2.CC_STAT_WIDTH]
                    lh = stats[lbl, cv2.CC_STAT_HEIGHT]

                    # Condition A: It is the main component
                    if lbl == main_label:
                        clean_mask[labels == lbl] = 255
                        continue

                    # Condition B: Border bleed rejection. If a small component touches
                    # the absolute boundary of the crop, it is likely bleed from an adjacent letter
                    touches_border = (lx <= 1 or ly <= 1 or (lx + lw) >= cw - 1 or (ly + lh) >= ch - 1)
                    if touches_border and area < max_area * 0.35:
                        continue

                    # Condition C: Legitimate companion (area at least 3% of main, or reasonable size)
                    if area >= max_area * 0.035 or area > 35:
                        clean_mask[labels == lbl] = 255

                binary = clean_mask

            # 2. Morphological closing to fill tiny speckle pinholes in strokes
            close_kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
            binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, close_kernel)

        return binary, (x1, y1, x2 - x1, y2 - y1)

    @staticmethod
    def vectorize_glyph_mask(mask, target_height=UNITS_PER_EM * 0.72, epsilon=0.9, char=None):
        """
        Trace contours from clean binary mask, optimize curves via Douglas-Peucker,
        and generate valid 2D polygon paths (outer contours clockwise, holes counter-clockwise).
        """
        # Find contours with full hierarchy (outer + inner holes)
        contours, hierarchy = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
        if hierarchy is None or len(contours) == 0:
            return [], (0, 0, 0, 0)

        # Bounding box of white pixels in mask
        ys, xs = np.where(mask > 128)
        if len(xs) == 0:
            return [], (0, 0, 0, 0)

        min_x, max_x = int(np.min(xs)), int(np.max(xs))
        min_y, max_y = int(np.min(ys)), int(np.max(ys))
        glyph_w = max_x - min_x + 1
        glyph_h = max_y - min_y + 1

        scale = target_height / max(1.0, float(glyph_h))

        polygons = []
        COUNTER_CHARS = set("ABDOPQR04689abdegopq@%&#©®")
        for idx, cnt in enumerate(contours):
            area = cv2.contourArea(cnt)
            # Filter negligible contour specks
            if area < 6.0:
                continue

            is_hole = (hierarchy[0][idx][3] != -1)
            # For characters that legitimately should have NO counter holes (like C, S, M, Z),
            # reject any holes caused by surface texture or cracks
            if is_hole and char and len(char) == 1 and char not in COUNTER_CHARS:
                continue

            # Smooth curve approximation
            approx = cv2.approxPolyDP(cnt, epsilon, closed=True)
            pts = approx.reshape(-1, 2)
            if len(pts) < 3:
                continue

            font_pts = []
            for pt in pts:
                fx = (pt[0] - min_x) * scale
                fy = (max_y - pt[1]) * scale
                font_pts.append((float(fx), float(fy)))

            s_area = shoelace_signed_area(font_pts)

            # Enforce TrueType winding conventions:
            # Outer contour must have positive area (clockwise in TTF screen space)
            # Holes must have negative area (counter-clockwise)
            if not is_hole and s_area < 0:
                font_pts.reverse()
            elif is_hole and s_area > 0:
                font_pts.reverse()

            polygons.append({
                'is_hole': is_hole,
                'points': font_pts
            })

        scaled_w = int(round(glyph_w * scale))
        scaled_h = int(round(glyph_h * scale))
        return polygons, (0, 0, scaled_w, scaled_h)

    @staticmethod
    def apply_weight_offset(polygons, offset_delta=0.0):
        """
        Dilate/expand glyph strokes geometrically using pyclipper.
        Outward expansion for outer boundaries, inward contraction for inner holes.
        Preserves curves with rounded joins (JT_ROUND).
        """
        if offset_delta == 0.0 or not polygons:
            return polygons

        pco = pyclipper.PyclipperOffset()
        # Scale coordinates for integer precision in pyclipper
        CLIPPER_SCALE = 1000.0

        for poly in polygons:
            scaled_path = []
            for pt in poly['points']:
                scaled_path.append((int(round(pt[0] * CLIPPER_SCALE)), int(round(pt[1] * CLIPPER_SCALE))))
            if len(scaled_path) >= 3:
                pco.AddPath(scaled_path, pyclipper.JT_ROUND, pyclipper.ET_CLOSEDPOLYGON)

        # Execute offset
        # offset_delta in font units -> scaled by CLIPPER_SCALE
        solution = pco.Execute(float(offset_delta * CLIPPER_SCALE))
        if not solution:
            return polygons

        offset_polygons = []
        for path in solution:
            pts = []
            for pt in path:
                pts.append((float(pt[0]) / CLIPPER_SCALE, float(pt[1]) / CLIPPER_SCALE))
            if len(pts) < 3:
                continue

            area = shoelace_signed_area(pts)
            is_hole = (area < 0)

            offset_polygons.append({
                'is_hole': is_hole,
                'points': pts
            })

        return offset_polygons

    @staticmethod
    def polygons_to_svg_path(polygons, lsb=DEFAULT_LSB):
        """Convert list of polygons to an SVG path string for web preview."""
        d_parts = []
        for poly in polygons:
            pts = poly['points']
            if not pts:
                continue
            # Note: in standard SVG, Y is downwards, so we invert Y for standard rendering
            start_x = pts[0][0] + lsb
            start_y = CAP_HEIGHT - pts[0][1]
            d_parts.append(f"M {start_x:.1f} {start_y:.1f}")
            for pt in pts[1:]:
                x = pt[0] + lsb
                y = CAP_HEIGHT - pt[1]
                d_parts.append(f"L {x:.1f} {y:.1f}")
            d_parts.append("Z")
        return " ".join(d_parts)

    @staticmethod
    def extract_alpha_texture(crop, is_dark=True, min_area=25, char=None):
        """
        Extract photorealistic RGBA texture with smooth antialiased alpha transparency,
        purging all background noise, dust, and border bleed while preserving 100% solid opacity
        for all internal colors, cowhide fur, chrome reflections, metallic bevels, and stone cracks.
        """
        h, w = crop.shape[:2]
        if h == 0 or w == 0:
            return np.zeros((10, 10, 4), dtype=np.uint8), 0, 0, w, h
        gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)

        # 1. Background color estimation from corners
        corners = np.concatenate([crop[:4, :4], crop[:4, -4:], crop[-4:, :4], crop[-4:, -4:]], axis=0)
        bg_color = np.median(corners.reshape(-1, 3), axis=0)

        if is_dark:
            diff = np.linalg.norm(crop.astype(float) - bg_color, axis=2)
            is_bg = (diff < 15) & (gray < 22)
        else:
            diff = np.linalg.norm(crop.astype(float) - bg_color, axis=2)
            is_bg = (diff < 20) & (gray > 225)

        # 2. Flood-fill from borders to find strictly external canvas
        bg_mask = np.zeros((h + 2, w + 2), dtype=np.uint8)
        fill_canvas = is_bg.astype(np.uint8) * 255
        for y in [0, h - 1]:
            for x in range(w):
                if fill_canvas[y, x] == 255:
                    cv2.floodFill(fill_canvas, bg_mask, (x, y), 128)
        for x in [0, w - 1]:
            for y in range(h):
                if fill_canvas[y, x] == 255:
                    cv2.floodFill(fill_canvas, bg_mask, (x, y), 128)

        ext_bg = (fill_canvas == 128)

        # 3. Handle true structural counter holes (inside O, A, B, 0, etc.)
        counters = (fill_canvas == 255)
        num, labels, stats, _ = cv2.connectedComponentsWithStats(counters.astype(np.uint8))
        valid_counters = np.zeros((h, w), dtype=bool)

        COUNTER_CHARS = set("ABDOPQR04689abdegopq@%&#©®")
        allow_counters = True
        if char and len(char) == 1 and char not in COUNTER_CHARS:
            allow_counters = False

        if allow_counters:
            for i in range(1, num):
                if stats[i, cv2.CC_STAT_AREA] > 20:
                    valid_counters[labels == i] = True

        transparent_mask = ext_bg | valid_counters
        letter_mask = (~transparent_mask).astype(np.uint8) * 255

        # 4. Clean small stray noise outside main glyph body
        num_l, labels_l, stats_l, _ = cv2.connectedComponentsWithStats(letter_mask)
        clean_letter = np.zeros_like(letter_mask)
        if num_l > 1:
            for i in range(1, num_l):
                if stats_l[i, cv2.CC_STAT_AREA] > min_area:
                    clean_letter[labels_l == i] = 255
        else:
            clean_letter = letter_mask

        # 5. Antialiased alpha edge
        blurred = cv2.GaussianBlur(clean_letter.astype(float), (3, 3), 0.7)
        alpha = np.clip(blurred / 255.0 * 255.0, 0, 255).astype(np.uint8)

        rgba = np.zeros((h, w, 4), dtype=np.uint8)
        rgba[:, :, :3] = crop[:, :, :3]
        rgba[:, :, 3] = alpha

        ys, xs = np.where(rgba[:, :, 3] > 10)
        if len(xs) == 0:
            return np.zeros((10, 10, 4), dtype=np.uint8), 0, 0, w, h

        y1, y2 = int(np.min(ys)), int(np.max(ys))
        x1, x2 = int(np.min(xs)), int(np.max(xs))
        trimmed = rgba[y1:y2 + 1, x1:x2 + 1]
        return trimmed, x1, y1, x2 - x1 + 1, y2 - y1 + 1

    @staticmethod
    def render_specimen_grid(cards, out_path, watermark_img=None, cols=12, card_size=96):
        """
        Renders a high-resolution dark specimen grid sheet showcasing all
        photorealistic color textured glyphs with character labels and the Abdullah watermark.
        """
        n = len(cards)
        if n == 0:
            return
        rows = (n + cols - 1) // cols
        header_h = 100 if watermark_img is not None else 30
        grid_w = cols * card_size
        grid_h = header_h + rows * card_size + 40

        grid_img = np.zeros((grid_h, grid_w, 4), dtype=np.uint8)
        grid_img[:, :, 0:3] = 10
        grid_img[:, :, 3] = 255

        if watermark_img is not None:
            wh, ww = watermark_img.shape[:2]
            scale_wm = min(70.0 / float(wh), (grid_w - 60) / float(ww))
            new_ww = int(round(ww * scale_wm))
            new_wh = int(round(wh * scale_wm))
            resized_wm = cv2.resize(watermark_img, (new_ww, new_wh), interpolation=cv2.INTER_AREA)
            wm_x = (grid_w - new_ww) // 2
            wm_y = 15

            if resized_wm.shape[2] == 4:
                a_s = resized_wm[:, :, 3] / 255.0
                a_l = 1.0 - a_s
                for ch in range(3):
                    grid_img[wm_y:wm_y+new_wh, wm_x:wm_x+new_ww, ch] = (
                        a_s * resized_wm[:, :, ch] + a_l * grid_img[wm_y:wm_y+new_wh, wm_x:wm_x+new_ww, ch]
                    ).astype(np.uint8)
            else:
                grid_img[wm_y:wm_y+new_wh, wm_x:wm_x+new_ww, :3] = resized_wm

        for idx, (name, rgba) in enumerate(cards):
            r = idx // cols
            c = idx % cols
            x0 = c * card_size
            y0 = header_h + r * card_size

            cv2.rectangle(grid_img, (x0 + 2, y0 + 2), (x0 + card_size - 3, y0 + card_size - 3), (28, 32, 42, 255), 1)

            th, tw = rgba.shape[:2]
            if th == 0 or tw == 0:
                continue
            scale = min((card_size - 24) / float(tw), (card_size - 30) / float(th))
            nw = max(1, int(round(tw * scale)))
            nh = max(1, int(round(th * scale)))
            resized = cv2.resize(rgba, (nw, nh), interpolation=cv2.INTER_AREA)

            ox = x0 + (card_size - nw) // 2
            oy = y0 + 6 + (card_size - 32 - nh) // 2

            if resized.shape[2] == 4:
                alpha_s = resized[:, :, 3] / 255.0
                alpha_l = 1.0 - alpha_s
                for ch in range(3):
                    grid_img[oy:oy+nh, ox:ox+nw, ch] = (
                        alpha_s * resized[:, :, ch] + alpha_l * grid_img[oy:oy+nh, ox:ox+nw, ch]
                    ).astype(np.uint8)
            else:
                grid_img[oy:oy+nh, ox:ox+nw, :3] = resized

            display_char = name if len(name) <= 3 else name[:3]
            cv2.putText(grid_img, display_char, (x0 + 6, y0 + card_size - 8),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.35, (255, 199, 44, 255), 1, cv2.LINE_AA)

        cv2.imwrite(out_path, grid_img)

    @staticmethod
    def build_font(family_name, style_name, weight_class, glyph_defs, is_ttf=True,
                   designer="Abdullah Font Foundry", version="Version 1.000",
                   copyright_info="Copyright (c) 2026 Abdullah. All rights reserved.",
                   svg_docs=None):
        """
        Compile genuine OpenType (.otf with CFF) or TrueType (.ttf with glyf)
        with fully compliant OpenType tables and exact weight class.
        """
        units_per_em = UNITS_PER_EM
        glyph_order = ['.notdef', 'space']
        cmap = {32: 'space'}

        # Character mapping & glyph names
        for g in glyph_defs:
            char = g['char']
            gname = g['name']
            if gname not in glyph_order:
                glyph_order.append(gname)

            if len(char) == 1:
                codepoint = ord(char)
                cmap[codepoint] = gname
                # Case fallback: if uppercase, also map lowercase if not present
                if 'A' <= char <= 'Z':
                    lower_cp = ord(char.lower())
                    if lower_cp not in cmap:
                        cmap[lower_cp] = gname
                elif 'a' <= char <= 'z':
                    upper_cp = ord(char.upper())
                    if upper_cp not in cmap:
                        cmap[upper_cp] = gname

            for alt in g.get('alt_chars', []):
                if len(alt) == 1:
                    cmap[ord(alt)] = gname

        # FontBuilder setup
        fb = FontBuilder(units_per_em, isTTF=is_ttf)
        fb.setupGlyphOrder(glyph_order)
        fb.setupCharacterMap(cmap)

        ttf_glyphs = {}
        cff_charstrings = {}
        h_metrics = {}

        # 1. Setup .notdef (standard empty or rectangular fallback)
        notdef_w = 400
        h_metrics['.notdef'] = (notdef_w, 50)
        if is_ttf:
            pen_nd = TTGlyphPen(None)
            pen_nd.moveTo((50, 0))
            pen_nd.lineTo((50, 700))
            pen_nd.lineTo((350, 700))
            pen_nd.lineTo((350, 0))
            pen_nd.closePath()
            pen_nd.moveTo((90, 40))
            pen_nd.lineTo((310, 40))
            pen_nd.lineTo((310, 660))
            pen_nd.lineTo((90, 660))
            pen_nd.closePath()
            ttf_glyphs['.notdef'] = pen_nd.glyph()
        else:
            cpen_nd = T2CharStringPen(notdef_w, None)
            cpen_nd.moveTo((50, 0))
            cpen_nd.lineTo((350, 0))
            cpen_nd.lineTo((350, 700))
            cpen_nd.lineTo((50, 700))
            cpen_nd.closePath()
            cff_charstrings['.notdef'] = cpen_nd.getCharString()

        # 2. Setup space
        space_w = DEFAULT_SPACE_WIDTH
        h_metrics['space'] = (space_w, 0)
        if is_ttf:
            ttf_glyphs['space'] = TTGlyphPen(None).glyph()
        else:
            cff_charstrings['space'] = T2CharStringPen(space_w, None).getCharString()

        # 3. Setup individual glyphs
        for g in glyph_defs:
            gname = g['name']
            polygons = g['polygons']
            lsb = int(round(g.get('lsb', DEFAULT_LSB)))
            adv_w = int(round(g.get('advance_width', 600)))
            h_metrics[gname] = (adv_w, lsb)

            if is_ttf:
                pen = TTGlyphPen(None)
                for poly in polygons:
                    pts = poly['points']
                    if len(pts) < 3:
                        continue
                    # Apply LSB shift
                    start_pt = (int(round(pts[0][0] + lsb)), int(round(pts[0][1])))
                    pen.moveTo(start_pt)
                    for pt in pts[1:]:
                        pen.lineTo((int(round(pt[0] + lsb)), int(round(pt[1]))))
                    pen.closePath()
                ttf_glyphs[gname] = pen.glyph()
            else:
                cpen = T2CharStringPen(adv_w, None)
                for poly in polygons:
                    pts = poly['points']
                    if len(pts) < 3:
                        continue
                    start_pt = (int(round(pts[0][0] + lsb)), int(round(pts[0][1])))
                    cpen.moveTo(start_pt)
                    for pt in pts[1:]:
                        cpen.lineTo((int(round(pt[0] + lsb)), int(round(pt[1]))))
                    cpen.closePath()
                cff_charstrings[gname] = cpen.getCharString()

        # Finalize table bindings
        clean_ps_family = "".join(c for c in family_name if c.isalnum())
        ps_name = f"{clean_ps_family}-{style_name}".replace(" ", "")

        if is_ttf:
            fb.setupGlyf(ttf_glyphs)
        else:
            fb.setupCFF(
                psName=ps_name,
                fontInfo={'FamilyName': family_name, 'FullName': f"{family_name} {style_name}"},
                charStringsDict=cff_charstrings,
                privateDict={}
            )

        fb.setupHorizontalMetrics(h_metrics)
        fb.setupHorizontalHeader(ascent=ASCENDER, descent=DESCENDER)

        # Name Table
        name_records = {
            'familyName': family_name,
            'styleName': style_name,
            'uniqueFontIdentifier': f"{ps_name}:2026",
            'fullName': f"{family_name} {style_name}",
            'version': version,
            'psName': ps_name,
            'designer': designer,
            'copyright': copyright_info,
            'description': f"Vector font {family_name} ({style_name}) generated with Abdullah FontStudio Pro."
        }
        fb.setupNameTable(name_records)

        # OS/2 Table with precise weight classes
        is_bold = (weight_class >= 700)
        fs_selection = 0x20 if is_bold else (0x40 if style_name.lower() == 'regular' else 0x0)
        mac_style = 0x01 if is_bold else 0x00
        fb.setupHead(macStyle=mac_style)
        fb.setupOS2(
            sTypoAscender=ASCENDER,
            sTypoDescender=DESCENDER,
            sTypoLineGap=LINE_GAP,
            usWinAscent=WIN_ASCENT,
            usWinDescent=WIN_DESCENT,
            sxHeight=X_HEIGHT,
            sCapHeight=CAP_HEIGHT,
            usWeightClass=weight_class,
            fsSelection=fs_selection
        )

        fb.setupPost()

        # Attach OpenType-SVG table if color textures provided
        if svg_docs and len(svg_docs) > 0:
            svg_table = newTable('SVG ')
            svg_table.docList = svg_docs
            fb.font['SVG '] = svg_table

        buf = io.BytesIO()
        fb.save(buf)
        return buf.getvalue()

    @staticmethod
    def generate_complete_font_suite(family_name, glyph_list, output_dir,
                                      designer="Abdullah Font Foundry",
                                      version="Version 1.000",
                                      copyright_info="Copyright (c) 2026 Abdullah",
                                      semi_bold_offset=14.0,
                                      bold_offset=28.0):
        """
        Generate all 6 font files:
          1. <Family>-Regular.otf
          2. <Family>-Regular.ttf
          3. <Family>-SemiBold.otf
          4. <Family>-SemiBold.ttf
          5. <Family>-Bold.otf
          6. <Family>-Bold.ttf
        Plus a comprehensive .zip bundle.
        """
        os.makedirs(output_dir, exist_ok=True)
        clean_name = family_name.replace(" ", "")

        # Weight definitions: (styleName, weightClass, offsetDelta)
        weights = [
            ("Regular", 400, 0.0),
            ("SemiBold", 600, float(semi_bold_offset)),
            ("Bold", 700, float(bold_offset))
        ]

        generated_files = {}

        for style, weight_cls, delta in weights:
            # Build weight-adjusted glyph definitions
            weight_glyphs = []
            for g in glyph_list:
                polys = g['polygons']
                if delta > 0.0:
                    dilated_polys = FontEngine.apply_weight_offset(polys, offset_delta=delta)
                else:
                    dilated_polys = polys

                # Adjust advance width and side bearings for dilated strokes
                orig_adv = g.get('advance_width', 600)
                orig_lsb = g.get('lsb', DEFAULT_LSB)
                orig_rsb = g.get('rsb', DEFAULT_RSB)

                # Heavier strokes need slightly more breathing room
                adj_adv = int(round(orig_adv + 2.0 * delta))
                adj_lsb = max(10, int(round(orig_lsb + delta * 0.5)))

                weight_glyphs.append({
                    'name': g['name'],
                    'char': g['char'],
                    'polygons': dilated_polys,
                    'lsb': adj_lsb,
                    'advance_width': adj_adv
                })

            # Compile TTF
            ttf_bytes = FontEngine.build_font(
                family_name=family_name,
                style_name=style,
                weight_class=weight_cls,
                glyph_defs=weight_glyphs,
                is_ttf=True,
                designer=designer,
                version=version,
                copyright_info=copyright_info
            )
            ttf_filename = f"{clean_name}-{style}.ttf"
            ttf_path = os.path.join(output_dir, ttf_filename)
            with open(ttf_path, 'wb') as f:
                f.write(ttf_bytes)
            generated_files[f"{style.lower()}_ttf"] = {
                'filename': ttf_filename,
                'path': ttf_path,
                'size': len(ttf_bytes),
                'style': style,
                'format': 'TTF',
                'weight': weight_cls
            }

            # Compile OTF
            otf_bytes = FontEngine.build_font(
                family_name=family_name,
                style_name=style,
                weight_class=weight_cls,
                glyph_defs=weight_glyphs,
                is_ttf=False,
                designer=designer,
                version=version,
                copyright_info=copyright_info
            )
            otf_filename = f"{clean_name}-{style}.otf"
            otf_path = os.path.join(output_dir, otf_filename)
            with open(otf_path, 'wb') as f:
                f.write(otf_bytes)
            generated_files[f"{style.lower()}_otf"] = {
                'filename': otf_filename,
                'path': otf_path,
                'size': len(otf_bytes),
                'style': style,
                'format': 'OTF',
                'weight': weight_cls
            }

        # Create master ZIP bundle
        zip_filename = f"{clean_name}-Font-Family.zip"
        zip_path = os.path.join(output_dir, zip_filename)
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
            for key, info in generated_files.items():
                zf.write(info['path'], arcname=info['filename'])

            # Include README.txt in zip
            readme_text = f"""==================================================
{family_name} Typeface Family
==================================================
Designer: {designer}
Version: {version}
Copyright: {copyright_info}

INCLUDED FONT FILES:
1. {clean_name}-Regular.otf (OpenType CFF - Weight 400)
2. {clean_name}-Regular.ttf (TrueType - Weight 400)
3. {clean_name}-SemiBold.otf (OpenType CFF - Weight 600)
4. {clean_name}-SemiBold.ttf (TrueType - Weight 600)
5. {clean_name}-Bold.otf (OpenType CFF - Weight 700)
6. {clean_name}-Bold.ttf (TrueType - Weight 700)

INSTALLATION INSTRUCTIONS:
- Windows: Right-click any .otf or .ttf file and select 'Install' or 'Install for all users'.
- macOS: Double-click the font file and click 'Install Font' in Font Book.
- Adobe Photoshop / Illustrator / Figma: The font family '{family_name}' will appear in the font picker with styles: Regular, SemiBold, and Bold.
- Web: Use the provided fonts with standard CSS @font-face rules.
==================================================
Generated with Abdullah FontStudio Pro
"""
            zf.writestr("README.txt", readme_text)

        generated_files['zip'] = {
            'filename': zip_filename,
            'path': zip_path,
            'size': os.path.getsize(zip_path)
        }

        return generated_files
