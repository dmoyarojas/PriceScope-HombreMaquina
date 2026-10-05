const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'scrapers');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') && f !== 'index.js');

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace idx limit
  content = content.replace(/if\s*\(\s*idx\s*>=\s*\d+\s*\)\s*return;(\s*\/\/[^\n]+)?/g, 'if (idx >= 150) return; // Limite incrementado');

  // Increase scroll loops (typically: for (let i = 0; i < 6; i++))
  content = content.replace(/for\s*\(\s*let\s+i\s*=\s*0;\s*i\s*<\s*([3456789])\s*;\s*i\+\+\s*\)/g, (match, p1) => {
    return 'for (let i = 0; i < 20; i++)';
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${file}`);
}
