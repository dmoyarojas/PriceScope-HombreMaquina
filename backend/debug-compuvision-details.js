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

    const html = await page.evaluate(() => {
      // Buscar la primera coincidencia que contenga shop-product-detail.php
      const titleLink = document.querySelector('h6.product_title a, .product_title a');
      if (!titleLink) return 'LINK NO ENCONTRADO';
      
      // Buscar un contenedor abuelo común
      let card = titleLink.closest('.product') || titleLink.closest('.product_box') || titleLink.closest('.col-lg-3') || titleLink.parentElement.parentElement;
      return card ? card.outerHTML : 'CARD NO ENCONTRADA';
    });

    console.log(html);
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
