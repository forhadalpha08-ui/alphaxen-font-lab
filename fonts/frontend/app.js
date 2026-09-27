/**
 * Abdullah FontStudio Pro - Application Controller
 * Handles image upload/selection, canvas bounding boxes, glyph review grid,
 * noise/particle purging, font compilation, dynamic @font-face injection,
 * live multi-weight type tester, and file exports.
 */

// Global State
const state = {
  sessionId: null,
  filename: '',
  imageObj: new Image(),
  isDark: true,
  glyphs: [],
  selectedGlyph: null,
  activeFilter: 'all',
  currentWeight: 'regular',
  fontSessionId: null,
  fontFamily: 'Abdullah Cowboy',
  fontSize: 52,
  letterSpacing: 2,
  lineHeight: 1.2,
  textAlign: 'left',
  theme: 'gold'
};

// DOM Elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const sampleGrid = document.getElementById('sample-grid');
const referenceCanvas = document.getElementById('reference-canvas');
const ctx = referenceCanvas.getContext('2d');
const glyphGrid = document.getElementById('glyph-grid');
const systemStatus = document.getElementById('system-status');
const statActiveCount = document.getElementById('stat-active-count');
const statPolarity = document.getElementById('stat-polarity');
const statFamilyName = document.getElementById('stat-family-name');

// Inputs & Controls
const ctrlPolarity = document.getElementById('ctrl-polarity');
const ctrlNoise = document.getElementById('ctrl-noise');
const valNoise = document.getElementById('val-noise');
const ctrlMinArea = document.getElementById('ctrl-min-area');
const valArea = document.getElementById('val-area');
const ctrlSmoothness = document.getElementById('ctrl-smoothness');
const valSmooth = document.getElementById('val-smooth');
const btnRedetect = document.getElementById('btn-redetect');
const btnCleanNoise = document.getElementById('btn-clean-noise');
const btnAutoMap = document.getElementById('btn-auto-map');
const btnProceedGenerate = document.getElementById('btn-proceed-generate');
const chkShowBoxes = document.getElementById('chk-show-boxes');
const chkShowLabels = document.getElementById('chk-show-labels');
const glyphSearch = document.getElementById('glyph-search');

// Metadata Inputs
const metaFamily = document.getElementById('meta-family');
const metaDesigner = document.getElementById('meta-designer');
const metaVersion = document.getElementById('meta-version');
const metaCopyright = document.getElementById('meta-copyright');
const ctrlSemiOffset = document.getElementById('ctrl-semi-offset');
const valSemiOffset = document.getElementById('val-semi-offset');
const ctrlBoldOffset = document.getElementById('ctrl-bold-offset');
const valBoldOffset = document.getElementById('val-bold-offset');

// Preview Elements
const liveTypeTester = document.getElementById('live-type-tester');
const singleWeightView = document.getElementById('single-weight-view');
const compareWeightView = document.getElementById('compare-weight-view');
const compareTextRegular = document.getElementById('compare-text-regular');
const compareTextSemiBold = document.getElementById('compare-text-semibold');
const compareTextBold = document.getElementById('compare-text-bold');
const ctrlFontSize = document.getElementById('ctrl-font-size');
const valFontSize = document.getElementById('val-font-size');
const ctrlLetterSpacing = document.getElementById('ctrl-letter-spacing');
const valLetterSpacing = document.getElementById('val-letter-spacing');
const ctrlLineHeight = document.getElementById('ctrl-line-height');
const valLineHeight = document.getElementById('val-line-height');
const dynamicStyles = document.getElementById('dynamic-font-styles');

// Export Buttons
const btnDlRegularOtf = document.getElementById('btn-dl-regular-otf');
const btnDlRegularTtf = document.getElementById('btn-dl-regular-ttf');
const btnDlSemiBoldOtf = document.getElementById('btn-dl-semibold-otf');
const btnDlSemiBoldTtf = document.getElementById('btn-dl-semibold-ttf');
const btnDlBoldOtf = document.getElementById('btn-dl-bold-otf');
const btnDlBoldTtf = document.getElementById('btn-dl-bold-ttf');
const btnDlAllZip = document.getElementById('btn-dl-all-zip');

// Modal Elements
const glyphModal = document.getElementById('glyph-modal');
const modalGlyphTitle = document.getElementById('modal-glyph-title');
const modalRasterImg = document.getElementById('modal-raster-img');
const modalSvgPath = document.getElementById('modal-svg-path');
const modalCharInput = document.getElementById('modal-char-input');
const modalLsbInput = document.getElementById('modal-lsb-input');

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  loadSampleGallery();
});

function updateStatus(text, isError = false) {
  systemStatus.textContent = text;
  systemStatus.style.color = isError ? '#ff4d4d' : '#9ca3af';
}

// 1. SAMPLE GALLERY & FILE UPLOAD
async function loadSampleGallery() {
  try {
    const res = await fetch('/api/samples');
    const data = await res.json();
    if (data.samples && data.samples.length > 0) {
      renderSampleGallery(data.samples);
      // Auto-load the first sample (e.g. Abdullah Cowboy) for instant working demo
      loadSample(data.samples[0].filename);
    } else {
      sampleGrid.innerHTML = '<div class="empty-state">No sample images found in workspace.</div>';
    }
  } catch (err) {
    console.error('Failed to load sample gallery:', err);
    sampleGrid.innerHTML = '<div class="empty-state">Failed to load samples.</div>';
  }
}

function renderSampleGallery(samples) {
  sampleGrid.innerHTML = '';
  samples.forEach(sample => {
    const card = document.createElement('div');
    card.className = 'sample-card';
    card.dataset.filename = sample.filename;
    card.innerHTML = `
      <img src="${sample.thumb_b64}" class="sample-thumb" alt="${sample.filename}">
      <span class="sample-name" title="${sample.filename}">${sample.filename.replace('.png', '')}</span>
      <span class="sample-dim">${sample.width}×${sample.height}</span>
    `;
    card.addEventListener('click', () => {
      document.querySelectorAll('.sample-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      loadSample(sample.filename);
    });
    sampleGrid.appendChild(card);
  });
}

async function loadSample(filename) {
  updateStatus(`Loading specimen '${filename}' and running intelligent segmentation...`);
  try {
    const res = await fetch('/api/load-sample', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename })
    });
    const data = await res.json();
    if (data.error) {
      updateStatus(`Error: ${data.error}`, true);
      return;
    }
    handleLoadedImage(data);
  } catch (err) {
    console.error(err);
    updateStatus('Failed to load specimen image.', true);
  }
}

async function uploadFile(file) {
  updateStatus(`Uploading ${file.name} and analyzing contours...`);
  const formData = new FormData();
  formData.append('image', file);
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.error) {
      updateStatus(`Upload Error: ${data.error}`, true);
      return;
    }
    handleLoadedImage(data);
  } catch (err) {
    console.error(err);
    updateStatus('Failed to upload image.', true);
  }
}

function handleLoadedImage(data) {
  state.sessionId = data.session_id;
  state.filename = data.filename;
  state.isDark = data.is_dark;
  state.glyphs = data.glyphs || [];

  // Update Family Name guess based on filename
  const cleanName = data.filename.replace(/\.[^/.]+$/, '').trim();
  metaFamily.value = cleanName;
  state.fontFamily = cleanName;
  statFamilyName.textContent = cleanName;

  statPolarity.textContent = state.isDark ? 'Dark Canvas' : 'Light Paper';
  updateActiveCount();

  // Load Image into Canvas
  state.imageObj = new Image();
  state.imageObj.onload = () => {
    referenceCanvas.width = state.imageObj.width;
    referenceCanvas.height = state.imageObj.height;
    renderCanvas();
  };
  state.imageObj.src = data.image_b64;

  renderGlyphBoard();
  updateStatus(`Specimen loaded: ${state.glyphs.length} components detected (${getActiveGlyphs().length} active glyphs).`);
}

// 2. CANVAS RENDERING & INTERACTIVE BOUNDING BOXES
function renderCanvas() {
  if (!state.imageObj.src) return;
  ctx.clearRect(0, 0, referenceCanvas.width, referenceCanvas.height);
  ctx.drawImage(state.imageObj, 0, 0);

  if (chkShowBoxes.checked) {
    state.glyphs.forEach(g => {
      if (!g.is_active) return;
      ctx.strokeStyle = '#ffc72c';
      ctx.lineWidth = 2;
      ctx.strokeRect(g.x, g.y, g.w, g.h);

      if (chkShowLabels.checked && g.char && g.char !== '—') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(g.x, Math.max(0, g.y - 18), 24, 18);
        ctx.fillStyle = '#ffc72c';
        ctx.font = 'bold 13px JetBrains Mono';
        ctx.fillText(g.char, g.x + 4, Math.max(14, g.y - 4));
      }
    });
  }
}

// 3. GLYPH REVIEW BOARD
function getActiveGlyphs() {
  return state.glyphs.filter(g => g.is_active && g.char && g.char !== '—');
}

function updateActiveCount() {
  const activeCount = getActiveGlyphs().length;
  statActiveCount.textContent = activeCount;

  // Filter Counts
  const letters = state.glyphs.filter(g => g.is_active && /[a-zA-Z]/.test(g.char)).length;
  const numbers = state.glyphs.filter(g => g.is_active && /[0-9]/.test(g.char)).length;
  const symbols = state.glyphs.filter(g => g.is_active && !/[a-zA-Z0-9]/.test(g.char) && g.char !== '—').length;
  const excluded = state.glyphs.filter(g => !g.is_active || g.char === '—').length;

  document.getElementById('count-all').textContent = state.glyphs.length;
  document.getElementById('count-letters').textContent = letters;
  document.getElementById('count-numbers').textContent = numbers;
  document.getElementById('count-symbols').textContent = symbols;
  document.getElementById('count-excluded').textContent = excluded;
}

function renderGlyphBoard() {
  glyphGrid.innerHTML = '';
  const searchQ = glyphSearch.value.trim().toLowerCase();

  const filtered = state.glyphs.filter(g => {
    // Category filtering
    if (state.activeFilter === 'letters' && (!g.is_active || !/[a-zA-Z]/.test(g.char))) return false;
    if (state.activeFilter === 'numbers' && (!g.is_active || !/[0-9]/.test(g.char))) return false;
    if (state.activeFilter === 'symbols' && (!g.is_active || /[a-zA-Z0-9]/.test(g.char) || g.char === '—')) return false;
    if (state.activeFilter === 'excluded' && g.is_active && g.char !== '—') return false;

    // Search query
    if (searchQ && !g.char.toLowerCase().includes(searchQ)) return false;
    return true;
  });

  if (filtered.length === 0) {
    glyphGrid.innerHTML = '<div class="empty-state">No glyphs match the current filter.</div>';
    return;
  }

  filtered.forEach(glyph => {
    const card = document.createElement('div');
    card.className = `glyph-card ${!glyph.is_active ? 'excluded' : ''}`;
    card.id = `card-${glyph.id}`;

    card.innerHTML = `
      <div class="card-glyph-img-wrap">
        <img src="${glyph.preview_b64}" class="card-glyph-img" alt="Glyph ${glyph.char}">
      </div>
      <div class="glyph-input-row">
        <input type="text" class="char-badge-input" value="${glyph.char}" maxlength="2" data-id="${glyph.id}">
      </div>
      <div class="glyph-card-actions">
        <button class="btn-glyph-inspect" data-id="${glyph.id}" title="Inspect Vector Outline">🔍 Inspect</button>
        <button class="btn-glyph-toggle" data-id="${glyph.id}" title="${glyph.is_active ? 'Exclude' : 'Include'}">
          ${glyph.is_active ? '🗑' : '➕'}
        </button>
      </div>
    `;

    // Char input change listener
    const charInput = card.querySelector('.char-badge-input');
    charInput.addEventListener('change', (e) => {
      glyph.char = e.target.value.trim();
      updateActiveCount();
      renderCanvas();
    });

    // Inspect listener
    card.querySelector('.btn-glyph-inspect').addEventListener('click', () => {
      openGlyphModal(glyph);
    });

    // Toggle/Delete listener
    card.querySelector('.btn-glyph-toggle').addEventListener('click', () => {
      glyph.is_active = !glyph.is_active;
      card.classList.toggle('excluded', !glyph.is_active);
      updateActiveCount();
      renderCanvas();
    });

    glyphGrid.appendChild(card);
  });
}

// 4. PURGE NOISE & PARTICLES
function purgeNoiseAndDust() {
  let purgedCount = 0;
  state.glyphs.forEach(g => {
    // Strict criteria for stray noise specks or tiny particles
    if (g.is_dust || g.is_header || g.area < 100 || (g.w < 12 && g.h < 12 && !':;.,'.includes(g.char))) {
      if (g.is_active) {
        g.is_active = false;
        purgedCount++;
      }
    }
  });
  updateActiveCount();
  renderGlyphBoard();
  renderCanvas();
  updateStatus(`Purged ${purgedCount} noise particles, dust specks, and stray border fragments!`);
}

// Auto-Map Preset (A-Z, 0-9, Symbols)
function autoMapSpecimen() {
  const specimenChars = (
    [...Array(26)].map((_, i) => String.fromCharCode(65 + i)) // A-Z
      .concat([...Array(10)].map((_, i) => String(i))) // 0-9
      .concat(['!', '?', '@', '#', '$', '%', '&', '*', '(', ')', '-', '_', '+', '=', ':', ';', '"', "'", ',', '.', '<', '>', '/', '\\', '|'])
  );

  let mappedIdx = 0;
  state.glyphs.forEach(g => {
    if (g.is_active) {
      if (mappedIdx < specimenChars.length) {
        g.char = specimenChars[mappedIdx];
        mappedIdx++;
      }
    }
  });

  updateActiveCount();
  renderGlyphBoard();
  renderCanvas();
  updateStatus(`Auto-mapped ${mappedIdx} glyphs sequentially to standard typography specimen.`);
}

// 5. VECTOR GLYPH INSPECTION MODAL
async function openGlyphModal(glyph) {
  state.selectedGlyph = glyph;
  modalGlyphTitle.textContent = `Glyph Inspection: '${glyph.char}' (${glyph.id})`;
  modalRasterImg.src = glyph.preview_b64;
  modalCharInput.value = glyph.char;
  modalLsbInput.value = glyph.lsb || 40;

  // Fetch real-time vectorization for this glyph
  try {
    const res = await fetch('/api/vectorize-single', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: state.sessionId,
        x: glyph.x,
        y: glyph.y,
        w: glyph.w,
        h: glyph.h,
        is_dark: state.isDark,
        smoothness: parseFloat(ctrlSmoothness.value)
      })
    });
    const data = await res.json();
    if (data.svg_path) {
      modalSvgPath.setAttribute('d', data.svg_path);
    }
  } catch (err) {
    console.error('Failed to vectorize single glyph:', err);
  }

  glyphModal.classList.remove('hidden');
}

function closeGlyphModal() {
  glyphModal.classList.add('hidden');
  state.selectedGlyph = null;
}

function saveGlyphModal() {
  if (state.selectedGlyph) {
    state.selectedGlyph.char = modalCharInput.value.trim();
    state.selectedGlyph.lsb = parseInt(modalLsbInput.value, 10) || 40;
    updateActiveCount();
    renderGlyphBoard();
    renderCanvas();
  }
  closeGlyphModal();
}

// 6. COMPILE & GENERATE VECTOR FONTS
async function generateVectorFonts() {
  const activeGlyphs = getActiveGlyphs();
  if (activeGlyphs.length === 0) {
    alert('Please ensure at least one glyph is active before generating fonts.');
    return;
  }

  updateStatus(`Compiling full font suite across Regular, Semi-Bold, and Bold weights...`);
  btnProceedGenerate.disabled = true;
  btnProceedGenerate.innerHTML = '<span>⏳ Compiling OTF & TTF...</span>';

  const payload = {
    session_id: state.sessionId,
    is_dark: state.isDark,
    metadata: {
      family_name: metaFamily.value.trim() || 'CustomFont',
      designer: metaDesigner.value.trim(),
      version: metaVersion.value.trim(),
      copyright: metaCopyright.value.trim()
    },
    semi_bold_offset: parseFloat(ctrlSemiOffset.value),
    bold_offset: parseFloat(ctrlBoldOffset.value),
    smoothness: parseFloat(ctrlSmoothness.value),
    glyphs: activeGlyphs.map(g => ({
      id: g.id,
      char: g.char,
      x: g.x,
      y: g.y,
      w: g.w,
      h: g.h,
      lsb: g.lsb || 40,
      is_active: true
    }))
  };

  try {
    const res = await fetch('/api/generate-fonts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.error) {
      updateStatus(`Font Generation Error: ${data.error}`, true);
      btnProceedGenerate.disabled = false;
      btnProceedGenerate.innerHTML = '<span>⚡ Generate Vector Fonts</span>';
      return;
    }

    state.fontSessionId = data.font_session_id;
    state.fontFamily = data.family_name;

    // Inject dynamic @font-face rules into DOM
    injectDynamicFontFaces(data.font_session_id, data.family_name);

    // Update Export Suite Buttons
    setupDownloadButtons(data.downloads);

    updateStatus(`Font Suite generated successfully! 6 files ready for download.`);
    btnProceedGenerate.disabled = false;
    btnProceedGenerate.innerHTML = '<span>✓ Fonts Ready! (Re-generate)</span>';

    // Smooth scroll to preview section
    document.getElementById('preview-section').scrollIntoView({ behavior: 'smooth' });

  } catch (err) {
    console.error(err);
    updateStatus('Failed to generate font family.', true);
    btnProceedGenerate.disabled = false;
    btnProceedGenerate.innerHTML = '<span>⚡ Generate Vector Fonts</span>';
  }
}

// 7. INJECT DYNAMIC @font-face
function injectDynamicFontFaces(sessionId, familyName) {
  const cssRules = `
    @font-face {
      font-family: 'GeneratedFont-Regular';
      src: url('/api/fonts/${sessionId}/Regular/ttf') format('truetype');
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: 'GeneratedFont-SemiBold';
      src: url('/api/fonts/${sessionId}/SemiBold/ttf') format('truetype');
      font-weight: 600;
      font-style: normal;
    }
    @font-face {
      font-family: 'GeneratedFont-Bold';
      src: url('/api/fonts/${sessionId}/Bold/ttf') format('truetype');
      font-weight: 700;
      font-style: normal;
    }
    @font-face {
      font-family: 'GeneratedFont';
      src: url('/api/fonts/${sessionId}/Regular/ttf') format('truetype');
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: 'GeneratedFont';
      src: url('/api/fonts/${sessionId}/SemiBold/ttf') format('truetype');
      font-weight: 600;
      font-style: normal;
    }
    @font-face {
      font-family: 'GeneratedFont';
      src: url('/api/fonts/${sessionId}/Bold/ttf') format('truetype');
      font-weight: 700;
      font-style: normal;
    }
  `;
  dynamicStyles.textContent = cssRules;

  // Apply to Preview Stage
  applyPreviewWeight(state.currentWeight);
}

// 8. PREVIEW CONTROLS & WEIGHT SWITCHER
function applyPreviewWeight(weight) {
  state.currentWeight = weight;

  if (weight === 'compare') {
    singleWeightView.classList.add('hidden');
    compareWeightView.classList.remove('hidden');
    syncCompareText();
    return;
  }

  singleWeightView.classList.remove('hidden');
  compareWeightView.classList.add('hidden');

  if (weight === 'regular') {
    liveTypeTester.style.fontFamily = "'GeneratedFont-Regular', sans-serif";
    liveTypeTester.style.fontWeight = '400';
  } else if (weight === 'semibold') {
    liveTypeTester.style.fontFamily = "'GeneratedFont-SemiBold', sans-serif";
    liveTypeTester.style.fontWeight = '600';
  } else if (weight === 'bold') {
    liveTypeTester.style.fontFamily = "'GeneratedFont-Bold', sans-serif";
    liveTypeTester.style.fontWeight = '700';
  }

  // Update Waterfall samples font
  document.querySelectorAll('.waterfall-sample').forEach(el => {
    el.style.fontFamily = liveTypeTester.style.fontFamily;
    el.style.fontWeight = liveTypeTester.style.fontWeight;
  });
}

function syncCompareText() {
  const text = liveTypeTester.value;
  compareTextRegular.textContent = text;
  compareTextSemiBold.textContent = text;
  compareTextBold.textContent = text;
}

function applyPreviewStyles() {
  liveTypeTester.style.fontSize = `${state.fontSize}px`;
  liveTypeTester.style.letterSpacing = `${state.letterSpacing}px`;
  liveTypeTester.style.lineHeight = state.lineHeight;
  liveTypeTester.style.textAlign = state.textAlign;

  if (state.theme === 'gold') {
    liveTypeTester.style.color = '#ffc72c';
    liveTypeTester.style.textShadow = '0 0 10px rgba(255, 199, 44, 0.3)';
  } else if (state.theme === 'chrome') {
    liveTypeTester.style.color = '#e2e8f0';
    liveTypeTester.style.textShadow = '0 0 8px rgba(255, 255, 255, 0.4)';
  } else {
    liveTypeTester.style.color = '#ffffff';
    liveTypeTester.style.textShadow = 'none';
  }
}

// 9. EXPORT DOWNLOAD BUTTONS
function setupDownloadButtons(downloads) {
  const setDownloadLink = (el, url) => {
    el.href = url;
    el.classList.remove('disabled');
  };

  setDownloadLink(btnDlRegularOtf, downloads.regular_otf);
  setDownloadLink(btnDlRegularTtf, downloads.regular_ttf);
  setDownloadLink(btnDlSemiBoldOtf, downloads.semibold_otf);
  setDownloadLink(btnDlSemiBoldTtf, downloads.semibold_ttf);
  setDownloadLink(btnDlBoldOtf, downloads.bold_otf);
  setDownloadLink(btnDlBoldTtf, downloads.bold_ttf);
  setDownloadLink(btnDlAllZip, downloads.zip);
}

// 10. EVENT LISTENERS
function initEventListeners() {
  // Drag & Drop
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  });

  // Sliders display sync
  ctrlNoise.addEventListener('input', (e) => valNoise.textContent = `${e.target.value}px`);
  ctrlMinArea.addEventListener('input', (e) => valArea.textContent = `${e.target.value}px`);
  ctrlSmoothness.addEventListener('input', (e) => valSmooth.textContent = e.target.value);
  ctrlSemiOffset.addEventListener('input', (e) => valSemiOffset.textContent = `${e.target.value}px`);
  ctrlBoldOffset.addEventListener('input', (e) => valBoldOffset.textContent = `${e.target.value}px`);

  // Canvas Toggles
  chkShowBoxes.addEventListener('change', renderCanvas);
  chkShowLabels.addEventListener('change', renderCanvas);

  // Search & Filters
  glyphSearch.addEventListener('input', renderGlyphBoard);
  document.querySelectorAll('.filter-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFilter = btn.dataset.filter;
      renderGlyphBoard();
    });
  });

  // Action Buttons
  btnCleanNoise.addEventListener('click', purgeNoiseAndDust);
  btnAutoMap.addEventListener('click', autoMapSpecimen);
  btnProceedGenerate.addEventListener('click', generateVectorFonts);

  // Re-detect button
  btnRedetect.addEventListener('click', async () => {
    if (!state.sessionId) return;
    updateStatus('Re-running detection with updated threshold filters...');
    try {
      const res = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: state.sessionId,
          polarity: ctrlPolarity.value,
          min_area: parseInt(ctrlMinArea.value),
          noise_cutoff: parseInt(ctrlNoise.value)
        })
      });
      const data = await res.json();
      if (data.glyphs) {
        state.glyphs = data.glyphs;
        state.isDark = data.is_dark;
        updateActiveCount();
        renderGlyphBoard();
        renderCanvas();
        updateStatus(`Re-detected ${data.glyphs.length} components.`);
      }
    } catch (err) {
      console.error(err);
      updateStatus('Detection failed.', true);
    }
  });

  // Weight Switcher
  document.querySelectorAll('.weight-switcher .weight-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.weight-switcher .weight-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyPreviewWeight(btn.dataset.weight);
    });
  });

  // Pangram Shortcuts
  document.querySelectorAll('.pangram-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      liveTypeTester.value = btn.dataset.text;
      syncCompareText();
    });
  });

  // Live Type Tester Input
  liveTypeTester.addEventListener('input', syncCompareText);

  // Preview Controls
  ctrlFontSize.addEventListener('input', (e) => {
    state.fontSize = e.target.value;
    valFontSize.textContent = `${e.target.value}px`;
    applyPreviewStyles();
  });
  ctrlLetterSpacing.addEventListener('input', (e) => {
    state.letterSpacing = e.target.value;
    valLetterSpacing.textContent = `${e.target.value}px`;
    applyPreviewStyles();
  });
  ctrlLineHeight.addEventListener('input', (e) => {
    state.lineHeight = e.target.value;
    valLineHeight.textContent = e.target.value;
    applyPreviewStyles();
  });

  // Alignment Toggles
  document.querySelectorAll('[data-align]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-align]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.textAlign = btn.dataset.align;
      applyPreviewStyles();
    });
  });

  // Theme Toggles
  document.querySelectorAll('[data-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-theme]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.theme = btn.dataset.theme;
      applyPreviewStyles();
    });
  });
}
