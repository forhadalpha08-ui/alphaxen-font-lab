const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, '..', 'public', 'fonts');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

const fontFaces = [];

const fontMap = {
  'Abdullah Martel': 'Abdullah Martel',
  'Abdullah Metallic Chrome': 'Abdullah Metallic Chrome',
  'Abdullah Molten Chrome': 'Abdullah Molten Chrome',
  'Abdullah Moon Chrome': 'Abdullah Moon Chrome',
  'Abdullah Stone Chrome': 'Abdullah Stone Chrome',
  'Abdullah Stone Moon': 'Abdullah Stone Moon'
};

Object.entries(fontMap).forEach(([folderName, familyName]) => {
  const folderPath = path.join(fontsDir, folderName);
  if (!fs.existsSync(folderPath)) return;

  const files = fs.readdirSync(folderPath);
  
  files.forEach(file => {
    if (!file.endsWith('.ttf') && !file.endsWith('.otf')) return;
    
    const format = file.endsWith('.ttf') ? 'truetype' : 'opentype';
    const relativeUrl = `/fonts/${encodeURIComponent(folderName)}/${encodeURIComponent(file)}`;
    
    let weight = 400;
    let style = 'normal';
    
    const lower = file.toLowerCase();
    if (lower.includes('color')) {
      weight = 800;
      // Also add specific family name
      fontFaces.push(`@font-face {
  font-family: '${familyName} Color';
  src: url('${relativeUrl}') format('${format}');
  font-weight: 800;
  font-style: normal;
  font-display: swap;
}`);
    } else if (lower.includes('bold') && !lower.includes('semibold')) {
      weight = 700;
    } else if (lower.includes('semibold') || lower.includes('semi-bold') || lower.includes('semi_bold')) {
      weight = 600;
    } else if (lower.includes('black') || lower.includes('heavy')) {
      weight = 900;
    } else if (lower.includes('vector')) {
      weight = 800;
    } else if (lower.includes('light')) {
      weight = 300;
    } else if (lower.includes('thin')) {
      weight = 100;
    } else if (lower.includes('medium')) {
      weight = 500;
    } else {
      weight = 400;
    }

    if (lower.includes('italic')) {
      style = 'italic';
    }

    fontFaces.push(`@font-face {
  font-family: '${familyName}';
  src: url('${relativeUrl}') format('${format}');
  font-weight: ${weight};
  font-style: ${style};
  font-display: swap;
}`);
  });
});

const fontFaceCSS = `/* =========================================================
   TRUE AUTHENTIC ALPHAXEN FONT FAMILIES (TTF / OTF)
   ========================================================= */
${fontFaces.join('\n\n')}
`;

fs.writeFileSync(path.join(__dirname, '..', 'public', 'fonts', 'fonts.css'), fontFaceCSS);
console.log('Saved to public/fonts/fonts.css');
