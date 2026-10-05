/* ================================================================
   PriceScope — scrapers/impacto.js
   Extrae hardware de impacto.com.pe (Next.js + Algolia)
   Categorías: Placas Madre, Tarjetas de Video, Procesadores, Memorias RAM

   Selectores confirmados por debug (2026-06-22):
   - Cards: a[href*="/producto/"]
   - Precio: span con clase text-2xl o similar que contenga "S/"
   - Nombre: texto del card (primer parrafo largo o heading)
================================================================ */
const puppeteer = require('puppeteer');

const CATEGORIAS = [
  {
    nombre:    'Placas Madre',
    url:       'https://www.impacto.com.pe/search?category=PLACAS%20MADRE',
    fuente:    'Impacto',
    categoria: 'Hardware PC'
  },
  {
    nombre:    'Tarjetas de Video',
    url:       'https://www.impacto.com.pe/search?category=TARJETA%20DE%20VIDEO',
    fuente:    'Impacto',
    categoria: 'Hardware PC'
  },
  {
    nombre:    'Procesadores',
    url:       'https://www.impacto.com.pe/search?category=PROCESADOR',
    fuente:    'Impacto',
    categoria: 'Hardware PC'
  },
  {
    nombre:    'Memorias RAM',
    url:       'https://www.impacto.com.pe/search?category=MEMORIAS%20RAM',
    fuente:    'Impacto',
    categoria: 'Hardware PC'
  },
  {
    nombre:    'Discos SSD Internos',
    url:       'https://www.impacto.com.pe/search?category=SSD',
    fuente:    'Impacto',
    categoria: 'Hardware PC'
  },
  {
    nombre:    'Discos Externos',
    url:       'https://www.impacto.com.pe/search?category=DISCO%20EXTERNO',
    fuente:    'Impacto',
    categoria: 'Hardware PC'
  },
  {
    nombre:    'Discos Duros Internos',
    url:       'https://www.impacto.com.pe/search?category=DISCO%20DURO',
    fuente:    'Impacto',
    categoria: 'Hardware PC'
  }
];


async function scrapeImpacto() {
  console.log('[Impacto] 🚀 Iniciando scraping...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const productos = [];

  try {
    for (const cat of CATEGORIAS) {
      console.log(`[Impacto] 📂 Categoría: ${cat.nombre}`);
      const page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
      await page.setViewport({ width: 1440, height: 900 });

      // No bloqueamos recursos para asegurar hidratación de Next.js/Algolia
      try {
        await page.goto(cat.url, { waitUntil: 'networkidle2', timeout: 45000 });

        // Impacto.com.pe usa Algolia — esperar a que aparezcan los cards reales
        // Los cards reales tienen href a /producto/...
        console.log(`[Impacto]   ⏳ Esperando carga de Algolia...`);
        try {
          await page.waitForSelector('a[href*="/producto/"]', { timeout: 25000 });
          console.log(`[Impacto]   ✅ Cards detectados`);
        } catch {
          console.log(`[Impacto]   ⚠️  Cards no aparecieron, intentando continuar...`);
        }

        // Scroll para cargar todos los productos del viewport
        await page.evaluate(async () => {
          for (let i = 0; i < 20; i++) {
            window.scrollBy(0, 700);
            await new Promise(r => setTimeout(r, 500));
          }
        });
        await new Promise(r => setTimeout(r, 2000));

        const items = await page.evaluate((catInfo) => {
          const results = [];
          const seen = new Set();

          // Cards de Impacto: elementos <a> que enlazan a /producto/
          const cards = document.querySelectorAll('a[href*="/producto/"]');

          cards.forEach((card, idx) => {
            if (idx >= 150) return; // Limite incrementado

            const href = card.href;
            if (!href || seen.has(href)) return;
            seen.add(href);

            // Nombre del producto - Impacto usa un h3 dentro del card
            const h3El = card.querySelector('h3');
            let nombre = h3El ? h3El.innerText.trim() : null;

            if (!nombre) {
              // Fallback: Buscar el texto más largo en párrafos y spans del card
              const textNodes = Array.from(card.querySelectorAll('p, span, h2, div'))
                .filter(el => {
                  const txt = (el.innerText || '').trim();
                  return txt.length > 10 && txt.length < 300
                    && !txt.includes('S/')
                    && !txt.includes('CÓD:')
                    && !txt.includes('STOCK')
                    && el.children.length === 0; // nodo hoja
                })
                .sort((a, b) => (b.innerText || '').length - (a.innerText || '').length);

              if (textNodes.length > 0) {
                nombre = textNodes[0].innerText.trim();
              }
            }

            // Segundo fallback: usar el texto completo del card
            if (!nombre) {
              const textoCompleto = (card.innerText || '').trim();
              const lineas = textoCompleto.split('\n').map(l => l.trim()).filter(l => l.length > 8);
              nombre = lineas.find(l =>
                !l.includes('S/') && !l.includes('CÓD') && !l.includes('STOCK') && l.length > 15
              ) || null;
            }

            if (!nombre || nombre.length < 5) return;

            // Precio — buscar elementos con "S/" en texto hoja
            let precioActual = null;
            let precioAnterior = null;

            const precios = [];
            const spansPrecio = Array.from(card.querySelectorAll('span, p, div'))
              .filter(el => {
                const txt = (el.innerText || '').trim();
                return txt.includes('S/') && txt.length < 35 && el.children.length === 0;
              });

            spansPrecio.forEach(el => {
              const txt = (el.innerText || '').trim();
              const match = txt.match(/S\/\s*([\d,]+\.?\d*)/);
              if (match) {
                const num = parseFloat(match[1].replace(/,/g, ''));
                if (!isNaN(num) && num > 0) precios.push(num);
              }
            });

            if (precios.length === 0) return;
            precioActual = Math.min(...precios);
            if (precios.length > 1) {
              precioAnterior = Math.max(...precios);
              if (precioAnterior === precioActual) precioAnterior = null;
            }

            // Imagen
            const imgEl = card.querySelector('img');
            let imagen = imgEl ? (imgEl.src || imgEl.getAttribute('data-src')) : null;
            if (imagen && imagen.startsWith('//')) imagen = 'https:' + imagen;

            results.push({
              nombre:          nombre.replace(/\s+/g, ' ').trim().substring(0, 299),
              precio_actual:   precioActual,
              precio_anterior: precioAnterior || null,
              imagen,
              url_producto:    href,
              fuente:          catInfo.fuente,
              categoria:       catInfo.categoria
            });
          });

          return results;
        }, cat);

        console.log(`[Impacto]   ✅ ${items.length} productos encontrados en "${cat.nombre}"`);
        productos.push(...items);

      } catch (e) {
        console.error(`[Impacto]   ❌ Error en ${cat.url}:`, e.message);
      } finally {
        await page.close();
      }

      await new Promise(r => setTimeout(r, 3000));
    }
  } finally {
    await browser.close();
  }

  console.log(`[Impacto] ✅ Total productos extraídos: ${productos.length}`);
  return productos;
}

module.exports = { scrapeImpacto };
