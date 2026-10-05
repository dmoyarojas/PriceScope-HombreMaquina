const puppeteer = require('puppeteer');

async function main() {
  console.log('[DEBUG CompuVision] Iniciando...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 900 });

  try {
    await page.goto('https://compuvisionperu.pe/CYM/shop-list-ctg.php?ctg=001', { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 6000));

    const data = await page.evaluate(() => {
      // Buscar elementos a que apunten a shop-product-detail.php
      const links = Array.from(document.querySelectorAll('a[href*="shop-product-detail.php"]'));
      
      // Buscar el ancestro que actúa como card de producto (usualmente tiene imagen y precio)
      const cards = [];
      const seen = new Set();
      
      links.forEach(a => {
        // Encontrar un contenedor común
        let parent = a.parentElement;
        while (parent && parent !== document.body) {
          if (parent.className.includes('product') || parent.className.includes('grid') || parent.className.includes('item') || parent.tagName === 'DIV' && parent.querySelector('.price, [class*="price"]')) {
            const path = parent.className;
            if (!seen.has(parent)) {
              seen.add(parent);
              cards.push({
                className: parent.className,
                tagName: parent.tagName,
                text: parent.innerText.substring(0, 300),
                html: parent.outerHTML.substring(0, 800)
              });
            }
            break;
          }
          parent = parent.parentElement;
        }
      });

      return {
        totalLinks: links.length,
        links: links.slice(0, 5).map(a => ({ href: a.href, text: a.innerText })),
        cards: cards.slice(0, 3)
      };
    });

    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
