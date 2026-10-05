/* ================================================================
   debug-new-stores.js — Inspecciona las nuevas tiendas
   ================================================================ */
const puppeteer = require('puppeteer');

async function debugStore(name, url, selectorCheck) {
  console.log(`\n============================================================`);
  console.log(`[DEBUG] Tienda: ${name} | URL: ${url}`);
  console.log(`============================================================`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 900 });

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 5000));

    const data = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return { found: false, bodyPreview: document.body.innerHTML.substring(0, 1000) };

      // Obtener HTML del elemento
      const outerHtml = el.outerHTML;
      const text = el.innerText || '';
      
      // Encontrar todos los enlaces
      const links = Array.from(el.querySelectorAll('a')).map(a => ({ href: a.getAttribute('href'), text: a.innerText }));
      const imgs = Array.from(el.querySelectorAll('img')).map(i => ({ src: i.getAttribute('src') || i.getAttribute('data-src'), alt: i.getAttribute('alt') }));

      return {
        found: true,
        outerHtml: outerHtml.substring(0, 3000),
        text: text.substring(0, 500),
        links,
        imgs
      };
    }, selectorCheck);

    console.log(data);
  } catch (e) {
    console.error(`Error en ${name}:`, e.message);
  } finally {
    await browser.close();
  }
}

async function main() {
  // Probar C&C Computer
  await debugStore('CyC Computer', 'https://cyccomputer.pe/categoria/234-tarjetas-graficas', '.product-miniature, .product-container, [class*="product-miniature"]');

  // Probar Sercoplus
  await debugStore('Sercoplus', 'https://sercoplus.com/37-procesadores', '.product-miniature, .js-product-miniature, [class*="product-miniature"]');

  // Probar CompuVision
  await debugStore('CompuVision', 'https://compuvisionperu.pe/CYM/shop-list-ctg.php?ctg=001', '.col-lg-3, .col-md-3, [class*="col-"]');
}

main().catch(console.error);
