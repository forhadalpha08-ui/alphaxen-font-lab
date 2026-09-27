const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'public', 'fonts', 'fonts.css');
if (fs.existsSync(cssPath)) {
  let content = fs.readFileSync(cssPath, 'utf8');
  content = content.replace(/url\(['"]?\/fonts\//g, "url('./");
  fs.writeFileSync(cssPath, content, 'utf8');
  console.log('Successfully updated fonts.css to use relative URLs!');
}
