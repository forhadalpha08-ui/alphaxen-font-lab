const fs = require('fs');
const path = require('path');

const fonts = [
  { id: 'abdullah-martel', name: 'Abdullah Martel', dir: 'Abdullah Martel' },
  { id: 'abdullah-metallic-chrome', name: 'Abdullah Metallic Chrome', dir: 'Abdullah Metallic Chrome' },
  { id: 'abdullah-molten-chrome', name: 'Abdullah Molten Chrome', dir: 'Abdullah Molten Chrome' },
  { id: 'abdullah-moon-chrome', name: 'Abdullah Moon Chrome', dir: 'Abdullah Moon Chrome' },
  { id: 'abdullah-stone-chrome', name: 'Abdullah Stone Chrome', dir: 'Abdullah Stone Chrome' },
  { id: 'abdullah-stone-moon', name: 'Abdullah Stone Moon', dir: 'Abdullah Stone Moon' }
];

const outDir = path.join(__dirname, '..', 'public', 'fonts_data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fonts.forEach(f => {
  const pDir = path.join(__dirname, '..', 'public', 'fonts', f.dir);
  const files = fs.readdirSync(pDir);
  const preview = files.find(file => file.startsWith('preview_') && file.endsWith('.html'));
  if (!preview) {
    console.error('No preview found for', f.name);
    return;
  }
  const content = fs.readFileSync(path.join(pDir, preview), 'utf8');
  const start = content.indexOf('const glyphMap =');
  const nextConst = content.indexOf('const charLookup', start);
  if (start !== -1 && nextConst !== -1) {
    const sub = content.substring(start + 16, nextConst).trim().replace(/;$/, '');
    
    // Parse using pattern matching: {"char": ..., "b64": ...}
    const map = {};
    const regex = /"char":\s*"((?:\\"|[^"])*)",\s*"b64":\s*"(data:image\/png;base64,[^"]+)"/g;
    let match;
    let count = 0;
    while ((match = regex.exec(sub)) !== null) {
      let ch = match[1];
      // unescape characters if needed
      if (ch === '\\"') ch = '"';
      if (ch === '\\\\') ch = '\\';
      map[ch] = match[2];
      count++;
    }

    fs.writeFileSync(path.join(outDir, f.id + '.json'), JSON.stringify(map));
    console.log(`[SUCCESS] Extracted ${count} glyphs for ${f.name} -> public/fonts_data/${f.id}.json`);
  } else {
    console.error('Could not find glyphMap boundaries for', f.name);
  }
});
