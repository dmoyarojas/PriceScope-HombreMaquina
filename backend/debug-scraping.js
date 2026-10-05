/* ================================================================
   debug2-scraping.js  — Debug más profundo para Wilson e Impacto
   Espera más tiempo y examina el DOM completo del listing
================================================================ */
require('dotenv').config();
const puppeteer = require('puppeteer');

async function debugWilson(browser) {
  console.log('\n' + '='.repeat(60));
  console.log('[DEBUG] Wilson — esperando 15s y analizando DOM completo');
  console.log('='.repeat(60));

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1280, height: 900 });

  try {
    await page.goto('https://www.tiendasenwilson.com/arma-tu-pc/procesadores/?pag=1&&q=procesadores',
      { waitUntil: 'networkidle2', timeout: 45000 });

    // Esperar mucho más
    await new Promise(r => setTimeout(r, 10000));

    // Scroll agresivo
    await page.evaluate(async () => {
      for (let i = 0; i < 8; i++) {
        window.scrollBy(0, 800);
        await new Promise(r => setTimeout(r, 800));
      }
      window.scrollTo(0, 0);
    });
    await new Promise(r => setTimeout(r, 3000));

    const resultado = await page.evaluate(() => {
      // Buscar cualquier elemento que tenga un precio (S/)
      const conPrecio = Array.from(document.querySelectorAll('*'))
        .filter(el => {
          const txt = el.innerText || '';
          return txt.includes('S/') && txt.length < 200 && el.children.length < 5;
        })
        .map(el => ({
          tag: el.tagName,
          class: el.className.substring(0, 80),
          id: el.id,
          texto: el.innerText.substring(0, 100),
          parentClass: (el.parentElement?.className || '').substring(0, 80)
        }));

      // HTML del contenedor principal del listing (buscar el section.categoriasweb)
      const section = document.querySelector('.categoriasweb, #contenido, .contenido, main, [class*="product"], [class*="listing"]');
      const htmlSection = section ? section.innerHTML.substring(0, 5000) : 'NO ENCONTRADO';

      // Todo el HTML de body (primeros 8000 chars)
      const bodyHtml = document.body.innerHTML.substring(3000, 8000);

      // Buscar imgs con src de producto
      const imagenes = Array.from(document.querySelectorAll('img[src]'))
        .filter(img => img.src && !img.src.includes('logo') && !img.src.includes('banner'))
        .slice(0, 8)
        .map(img => ({ src: img.src.substring(0, 120), alt: img.alt.substring(0, 60), parent: img.parentElement?.className?.substring(0, 60) }));

      return { conPrecio, htmlSection, bodyHtml, imagenes };
    });

    console.log('\n--- Elementos con "S/" ---');
    resultado.conPrecio.forEach(e => console.log(`  [${e.tag}.${e.class}] "${e.texto}"`));

    console.log('\n--- Imágenes de productos ---');
    resultado.imagenes.forEach(img => console.log(`  src: ${img.src} | alt: ${img.alt} | parent: ${img.parent}`));

    console.log('\n--- HTML sección listing (5000 chars) ---');
    console.log(resultado.htmlSection);

    console.log('\n--- Body HTML posición 3000-8000 ---');
    console.log(resultado.bodyHtml);

  } catch(e) {
    console.error('[DEBUG Wilson] Error:', e.message);
  } finally {
    await page.close();
  }
}

async function debugImpacto(browser) {
  console.log('\n' + '='.repeat(60));
  console.log('[DEBUG] Impacto — esperando hidratación Next.js');
  console.log('='.repeat(60));

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 900 });

  try {
    await page.goto('https://www.impacto.com.pe/search?category=PROCESADOR',
      { waitUntil: 'domcontentloaded', timeout: 45000 });

    // Esperar explícitamente a que aparezca algún elemento con precio
    console.log('[DEBUG] Esperando hasta 25s que aparezcan productos...');
    try {
      await page.waitForFunction(() => {
        const textos = document.body.innerText;
        return textos.includes('S/') && textos.length > 5000;
      }, { timeout: 25000 });
      console.log('[DEBUG] ¡Contenido con precios detectado!');
    } catch {
      console.log('[DEBUG] Timeout — sin precios todavía');
    }

    await new Promise(r => setTimeout(r, 3000));

    const resultado = await page.evaluate(() => {
      const conPrecio = Array.from(document.querySelectorAll('*'))
        .filter(el => {
          const txt = el.innerText || '';
          return txt.includes('S/') && txt.length < 150 && el.children.length < 4;
        })
        .slice(0, 10)
        .map(el => ({
          tag: el.tagName,
          class: el.className.substring(0, 80),
          texto: el.innerText.substring(0, 100),
          parentTag: el.parentElement?.tagName,
          parentClass: (el.parentElement?.className || '').substring(0, 80)
        }));

      // Buscar cards — impacto usa clases de Tailwind
      const links = Array.from(document.querySelectorAll('a[href*="/product"]'))
        .slice(0, 5)
        .map(a => ({
          href: a.href.substring(0, 100),
          clase: a.className.substring(0, 80),
          texto: (a.innerText || '').substring(0, 80)
        }));

      const bodyHtml = document.body.innerHTML.substring(2000, 8000);

      return { conPrecio, links, bodyHtml };
    });

    console.log('\n--- Elementos con "S/" ---');
    resultado.conPrecio.forEach(e =>
      console.log(`  [${e.tag}.${e.class.substring(0,50)}] "${e.texto}"`)
    );

    console.log('\n--- Links /product ---');
    resultado.links.forEach(l => console.log(`  ${l.href} | clase: ${l.clase.substring(0,60)} | "${l.texto.substring(0,40)}"`));

    console.log('\n--- Body HTML posición 2000-8000 ---');
    console.log(resultado.bodyHtml);

  } catch(e) {
    console.error('[DEBUG Impacto] Error:', e.message);
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
           '--disable-blink-features=AutomationControlled']
  });

  try {
    await debugWilson(browser);
    await debugImpacto(browser);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
