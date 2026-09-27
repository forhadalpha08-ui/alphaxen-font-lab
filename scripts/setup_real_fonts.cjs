const fs = require('fs');
const path = require('path');

const fontsSrcDir = path.join(__dirname, '..', 'fonts');
const fontsDestDir = path.join(__dirname, '..', 'public', 'fonts');

if (!fs.existsSync(fontsDestDir)) {
  fs.mkdirSync(fontsDestDir, { recursive: true });
}

// Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const fontFamilies = [
  'Abdullah Martel',
  'Abdullah Metallic Chrome',
  'Abdullah Molten Chrome',
  'Abdullah Moon Chrome',
  'Abdullah Stone Chrome',
  'Abdullah Stone Moon'
];

fontFamilies.forEach(f => {
  const src = path.join(fontsSrcDir, f);
  const dest = path.join(fontsDestDir, f);
  if (fs.existsSync(src)) {
    console.log(`Copying ${f}...`);
    copyDir(src, dest);
  } else {
    console.warn(`Source not found: ${src}`);
  }
});

console.log('Font copy complete!');
