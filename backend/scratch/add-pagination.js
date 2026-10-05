const fs = require('fs');
const path = require('path');

function addPagination(filename) {
  const filePath = path.join(__dirname, '..', 'scrapers', filename);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Skip if already paginated
  if (content.includes('for (let pagina = 1; pagina <= 3; pagina++)')) return;

  // Replace the inner logic for category
  content = content.replace(
    /for\s*\(\s*const\s+cat\s+of\s+CATEGORIAS\s*\)\s*\{\s*console\.log\(`\[([^\]]+)\] 📂 Categoría: \$\{cat\.nombre\}`\);\s*const\s+page\s*=\s*await\s+browser\.newPage\(\);\s*await\s+page\.setUserAgent\([^;]+\);\s*await\s+page\.setViewport\([^;]+\);\s*try\s*\{\s*await\s+page\.goto\(cat\.url/,
    `for (const cat of CATEGORIAS) {
      console.log(\`[$1] 📂 Categoría: \${cat.nombre}\`);

      for (let pagina = 1; pagina <= 3; pagina++) {
        const url = pagina === 1 ? cat.url : \`\${cat.url}?page=\${pagina}\`;
        console.log(\`[$1]   → Página \${pagina}: \${url}\`);
        
        const page = await browser.newPage();
        await page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );
        await page.setViewport({ width: 1280, height: 900 });

        try {
          await page.goto(url`
  );

  // Find the closing brace for the try/catch/finally block of the category
  // In the original, it looks like:
  //      } finally {
  //        await page.close();
  //      }
  //      await new Promise(r => setTimeout(r, 2000));
  //    } // end of for cat
  
  content = content.replace(
    /finally\s*\{\s*await\s+page\.close\(\);\s*\}\s*await\s+new\s+Promise\(r\s*=>\s*setTimeout\(r,\s*2000\)\);\s*\}/,
    `finally {
          await page.close();
        }
        await new Promise(r => setTimeout(r, 2000));
      }
    }`
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Paginated ${filename}`);
}

addPagination('cyc.js');
addPagination('sercoplus.js');
