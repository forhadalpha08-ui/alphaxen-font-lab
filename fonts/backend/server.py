#!/usr/bin/env python3
"""
Flask Web Server & API for Image-to-Font Vector Generation System.
Serves interactive studio, handles image uploads, runs computer vision detection,
compiles genuine OpenType & TrueType font files in 3 weights, and serves font downloads.
"""

import os
import sys
import glob
import uuid
import base64
import json
import cv2
import numpy as np
from flask import Flask, request, jsonify, send_file, send_from_directory, make_response
from flask_cors import CORS

from font_engine import FontEngine, UNITS_PER_EM, CAP_HEIGHT, DEFAULT_LSB, DEFAULT_RSB

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend')
OUTPUT_DIR = os.path.join(BASE_DIR, 'generated_fonts')
TEMP_DIR = os.path.join(BASE_DIR, 'temp_uploads')

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path='')
CORS(app)

# In-memory storage for active sessions (loaded images and detection cache)
session_cache = {}


def get_image_thumbnail_b64(img, max_size=200):
    """Generate thumbnail base64 representation."""
    h, w = img.shape[:2]
    scale = min(max_size / float(w), max_size / float(h), 1.0)
    nw, nh = int(round(w * scale)), int(round(h * scale))
    resized = cv2.resize(img, (nw, nh), interpolation=cv2.INTER_AREA)
    _, buf = cv2.imencode('.jpg', resized, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
    return f"data:image/jpeg;base64,{base64.b64encode(buf).decode('utf-8')}"


@app.route('/')
def index():
    """Serve frontend index.html."""
    return send_from_directory(FRONTEND_DIR, 'index.html')


@app.route('/api/samples', methods=['GET'])
def get_sample_images():
    """Return available reference images found in the workspace."""
    sample_files = []
    # Search for PNG, JPG, WEBP in the workspace root
    for ext in ('*.png', '*.jpg', '*.jpeg', '*.webp'):
        for path in glob.glob(os.path.join(BASE_DIR, ext)):
            fname = os.path.basename(path)
            # Skip test or output images
            if fname.startswith(('test_', 'out_')):
                continue
            try:
                img = cv2.imread(path)
                if img is None:
                    continue
                h, w = img.shape[:2]
                thumb_b64 = get_image_thumbnail_b64(img, max_size=180)
                sample_files.append({
                    'filename': fname,
                    'width': w,
                    'height': h,
                    'size': os.path.getsize(path),
                    'thumb_b64': thumb_b64
                })
            except Exception as e:
                print(f"Error reading sample {fname}: {e}")

    sample_files.sort(key=lambda x: x['filename'])
    return jsonify({'samples': sample_files})


@app.route('/api/load-sample', methods=['POST'])
def load_sample_image():
    """Load a reference image from workspace samples and perform initial detection."""
    data = request.get_json() or {}
    filename = data.get('filename')
    if not filename:
        return jsonify({'error': 'Filename required'}), 400

    filepath = os.path.join(BASE_DIR, filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404

    img = cv2.imread(filepath)
    if img is None:
        return jsonify({'error': 'Failed to decode image'}), 400

    session_id = str(uuid.uuid4())
    session_cache[session_id] = {
        'image': img,
        'filename': filename,
        'path': filepath
    }

    h, w = img.shape[:2]
    # Initial segmentation with default settings
    glyphs, is_dark = FontEngine.segment_glyphs(img)

    # Encode full reference image for canvas display
    _, buf = cv2.imencode('.png', img)
    img_b64 = f"data:image/png;base64,{base64.b64encode(buf).decode('utf-8')}"

    return jsonify({
        'session_id': session_id,
        'filename': filename,
        'width': w,
        'height': h,
        'is_dark': is_dark,
        'glyphs': glyphs,
        'image_b64': img_b64
    })


@app.route('/api/upload', methods=['POST'])
def upload_image():
    """Upload a new custom font reference image."""
    if 'image' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    session_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1].lower() or '.png'
    save_path = os.path.join(TEMP_DIR, f"{session_id}{ext}")
    file.save(save_path)

    img = cv2.imread(save_path)
    if img is None:
        return jsonify({'error': 'Invalid image file'}), 400

    session_cache[session_id] = {
        'image': img,
        'filename': file.filename,
        'path': save_path
    }

    h, w = img.shape[:2]
    glyphs, is_dark = FontEngine.segment_glyphs(img)

    _, buf = cv2.imencode('.png', img)
    img_b64 = f"data:image/png;base64,{base64.b64encode(buf).decode('utf-8')}"

    return jsonify({
        'session_id': session_id,
        'filename': file.filename,
        'width': w,
        'height': h,
        'is_dark': is_dark,
        'glyphs': glyphs,
        'image_b64': img_b64
    })


@app.route('/api/detect', methods=['POST'])
def detect_glyphs_endpoint():
    """Re-run glyph detection with custom user parameters."""
    data = request.get_json() or {}
    session_id = data.get('session_id')
    if session_id not in session_cache:
        return jsonify({'error': 'Session expired or not found'}), 404

    img = session_cache[session_id]['image']
    min_area = int(data.get('min_area', 80))
    noise_cutoff = int(data.get('noise_cutoff', 50))
    polarity_mode = data.get('polarity', 'auto')
    thresh_val = data.get('thresh_val')

    if polarity_mode == 'dark':
        forced_dark = True
    elif polarity_mode == 'light':
        forced_dark = False
    else:
        forced_dark = None

    glyphs, is_dark = FontEngine.segment_glyphs(
        img,
        min_area=min_area,
        noise_cutoff=noise_cutoff
    )

    return jsonify({
        'glyphs': glyphs,
        'is_dark': is_dark
    })


@app.route('/api/vectorize-single', methods=['POST'])
def vectorize_single_glyph():
    """Vectorize a specific glyph on-demand and return its SVG path representation."""
    data = request.get_json() or {}
    session_id = data.get('session_id')
    if session_id not in session_cache:
        return jsonify({'error': 'Session not found'}), 404

    img = session_cache[session_id]['image']
    x = int(data.get('x', 0))
    y = int(data.get('y', 0))
    w = int(data.get('w', 10))
    h = int(data.get('h', 10))
    is_dark = bool(data.get('is_dark', True))
    thresh_val = data.get('thresh_val')
    if thresh_val is not None:
        thresh_val = int(thresh_val)

    epsilon = float(data.get('smoothness', 0.9))

    mask, crop_bbox = FontEngine.extract_clean_glyph_mask(
        img, x, y, w, h, is_dark=is_dark, thresh_val=thresh_val, noise_filter=True
    )
    polygons, (bx, by, bw, bh) = FontEngine.vectorize_glyph_mask(mask, epsilon=epsilon)
    svg_path = FontEngine.polygons_to_svg_path(polygons)

    # Convert clean mask to base64
    _, buf = cv2.imencode('.png', mask)
    mask_b64 = f"data:image/png;base64,{base64.b64encode(buf).decode('utf-8')}"

    return jsonify({
        'svg_path': svg_path,
        'mask_b64': mask_b64,
        'width': bw,
        'height': bh,
        'polygons_count': len(polygons)
    })


@app.route('/api/generate-fonts', methods=['POST'])
def generate_fonts_endpoint():
    """
    Compile complete font family across all 3 weights (Regular, Semi-Bold, Bold)
    in both .OTF and .TTF formats.
    """
    data = request.get_json() or {}
    session_id = data.get('session_id')
    if session_id not in session_cache:
        return jsonify({'error': 'Session not found'}), 404

    img = session_cache[session_id]['image']
    metadata = data.get('metadata', {})
    family_name = metadata.get('family_name', 'CustomFont').strip() or 'CustomFont'
    designer = metadata.get('designer', 'Abdullah Font Foundry').strip()
    version = metadata.get('version', 'Version 1.000').strip()
    copyright_info = metadata.get('copyright', 'Copyright (c) 2026 Abdullah. All rights reserved.').strip()

    is_dark = bool(data.get('is_dark', True))
    glyph_configs = data.get('glyphs', [])
    semi_bold_offset = float(data.get('semi_bold_offset', 14.0))
    bold_offset = float(data.get('bold_offset', 28.0))
    epsilon = float(data.get('smoothness', 0.9))

    if not glyph_configs:
        return jsonify({'error': 'No active glyphs provided'}), 400

    # Vectorize all active glyphs
    compiled_glyphs = []
    for g in glyph_configs:
        if not g.get('is_active', True):
            continue

        char = g.get('char', '').strip()
        if not char or char == '—':
            continue

        x = int(g['x'])
        y = int(g['y'])
        w = int(g['w'])
        h = int(g['h'])
        thresh_val = g.get('thresh_val')
        if thresh_val is not None:
            thresh_val = int(thresh_val)

        mask, _ = FontEngine.extract_clean_glyph_mask(
            img, x, y, w, h, is_dark=is_dark, thresh_val=thresh_val, noise_filter=True
        )
        polygons, (bx, by, bw, bh) = FontEngine.vectorize_glyph_mask(mask, epsilon=epsilon)

        if not polygons:
            continue

        # Determine standard PostScript glyph name
        if len(char) == 1:
            if char.isalnum():
                gname = f"uni{ord(char):04X}"
            else:
                gname = f"glyph_{ord(char)}"
        else:
            gname = f"glyph_{g['id']}"

        lsb = int(g.get('lsb', DEFAULT_LSB))
        advance_w = max(int(bw + lsb + DEFAULT_RSB), 380)

        compiled_glyphs.append({
            'name': gname,
            'char': char,
            'polygons': polygons,
            'lsb': lsb,
            'rsb': DEFAULT_RSB,
            'advance_width': advance_w
        })

    if not compiled_glyphs:
        return jsonify({'error': 'No valid vector glyphs could be generated'}), 400

    font_session_id = str(uuid.uuid4())
    font_out_dir = os.path.join(OUTPUT_DIR, font_session_id)

    results = FontEngine.generate_complete_font_suite(
        family_name=family_name,
        glyph_list=compiled_glyphs,
        output_dir=font_out_dir,
        designer=designer,
        version=version,
        copyright_info=copyright_info,
        semi_bold_offset=semi_bold_offset,
        bold_offset=bold_offset
    )

    # Prepare response with download URLs and live preview endpoints
    downloads = {
        'regular_otf': f"/api/download/{font_session_id}/{results['regular_otf']['filename']}",
        'regular_ttf': f"/api/download/{font_session_id}/{results['regular_ttf']['filename']}",
        'semibold_otf': f"/api/download/{font_session_id}/{results['semibold_otf']['filename']}",
        'semibold_ttf': f"/api/download/{font_session_id}/{results['semibold_ttf']['filename']}",
        'bold_otf': f"/api/download/{font_session_id}/{results['bold_otf']['filename']}",
        'bold_ttf': f"/api/download/{font_session_id}/{results['bold_ttf']['filename']}",
        'zip': f"/api/download/{font_session_id}/{results['zip']['filename']}"
    }

    # Direct preview URLs for CSS @font-face
    preview_urls = {
        'regular': f"/api/fonts/{font_session_id}/Regular/ttf",
        'semibold': f"/api/fonts/{font_session_id}/SemiBold/ttf",
        'bold': f"/api/fonts/{font_session_id}/Bold/ttf"
    }

    return jsonify({
        'status': 'success',
        'font_session_id': font_session_id,
        'family_name': family_name,
        'glyph_count': len(compiled_glyphs),
        'downloads': downloads,
        'preview_urls': preview_urls,
        'files_info': {
            'regular_otf': results['regular_otf'],
            'regular_ttf': results['regular_ttf'],
            'semibold_otf': results['semibold_otf'],
            'semibold_ttf': results['semibold_ttf'],
            'bold_otf': results['bold_otf'],
            'bold_ttf': results['bold_ttf'],
            'zip': results['zip']
        }
    })


@app.route('/api/fonts/<session_id>/<weight>/<fmt>', methods=['GET'])
def serve_font_file(session_id, weight, fmt):
    """Serve font binary directly for browser @font-face loading."""
    target_dir = os.path.join(OUTPUT_DIR, session_id)
    if not os.path.exists(target_dir):
        return jsonify({'error': 'Font session not found'}), 404

    # Locate matching font file
    ext = f".{fmt.lower()}"
    matched_file = None
    for f in os.listdir(target_dir):
        if f.lower().endswith(ext) and weight.lower() in f.lower():
            matched_file = os.path.join(target_dir, f)
            break

    if not matched_file:
        return jsonify({'error': 'Font file not found'}), 404

    mimetype = 'font/ttf' if ext == '.ttf' else 'font/otf'
    response = make_response(send_file(matched_file, mimetype=mimetype))
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Cache-Control'] = 'no-cache'
    return response


@app.route('/api/download/<session_id>/<filename>', methods=['GET'])
def download_font_file(session_id, filename):
    """Trigger browser attachment download for individual font files or ZIP package."""
    target_dir = os.path.join(OUTPUT_DIR, session_id)
    file_path = os.path.join(target_dir, filename)
    if not os.path.exists(file_path):
        return jsonify({'error': 'File not found'}), 404

    return send_file(file_path, as_attachment=True, download_name=filename)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"==================================================")
    print(f"Abdullah FontStudio Pro Server Starting")
    print(f"Open your browser at: http://localhost:{port}")
    print(f"==================================================")
    app.run(host='0.0.0.0', port=port, debug=False)
