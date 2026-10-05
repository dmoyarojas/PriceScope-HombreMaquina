/* ================================================================
   debug-wilson-network.js  — Captura las peticiones de red de Wilson
   para encontrar la API AJAX que carga los productos
================================================================ */
require('dotenv').config();
const puppeteer = require('puppeteer');

async function main() {
  console.log('[DEBUG Wilson Network] Iniciando...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
           '--disable-blink-features=AutomationControlled']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1280, height: 900 });

  const requests = [];

  // Interceptar todas las peticiones de red
  page.on('request', req => {
    const url = req.url();
    const method = req.method();
    if (!url.includes('google') && !url.includes('doubleclick') && !url.includes('analytics')
        && !url.includes('.css') && !url.includes('.js') && !url.includes('.png')
        && !url.includes('.jpg') && !url.includes('.gif') && !url.includes('.ico')
        && !url.includes('.woff') && !url.includes('adsbygoogle')) {
      requests.push({ method, url: url.substring(0, 200) });
    }
  });

  page.on('response', async res => {
    const url = res.url();
    const status = res.status();
    const ct = res.headers()['content-type'] || '';
    if (ct.includes('json') && !url.includes('analytics') && !url.includes('google')) {
      try {
        const body = await res.text();
        if (body.length > 100 && body.length < 50000) {
          console.log(`\n[AJAX RESPONSE] ${status} ${url.substring(0, 200)}`);
          console.log(`  Content-Type: ${ct}`);
          console.log(`  Body preview: ${body.substring(0, 500)}`);
        }
      } catch {}
    }
  });

  await page.goto('https://www.tiendasenwilson.com/arma-tu-pc/procesadores/?pag=1&&q=procesadores',
    { waitUntil: 'networkidle2', timeout: 45000 });

  await new Promise(r => setTimeout(r, 8000));

  console.log('\n\n[REQUESTS CAPTURADAS]:');
  requests.forEach(r => console.log(`  [${r.method}] ${r.url}`));

  // También mostrar el HTML actual del contenedor de resultados
  const html = await page.evaluate(() => {
    const section = document.querySelector('.categoriasweb, #resultados, .resultados, [class*="result"]');
    if (section) return section.innerHTML.substring(0, 8000);

    // Buscar divs con muchos elementos hijo que sean productos
    const candidatos = Array.from(document.querySelectorAll('div'))
      .filter(d => d.children.length > 4)
      .sort((a, b) => b.children.length - a.children.length)
      .slice(0, 3);

    return candidatos.map((d, i) =>
      `\n--- Div #${i} (${d.children.length} hijos, clase: ${d.className.substring(0,50)}) ---\n` +
      d.innerHTML.substring(0, 2000)
    ).join('\n');
  });

  console.log('\n\n[HTML CONTENEDOR LISTING]:');
  console.log(html);

  await browser.close();
}

main().catch(console.error);
