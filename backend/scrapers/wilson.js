/* ================================================================
   PriceScope — scrapers/wilson.js
   Extrae hardware de TiendasEnWilson (Bootstrap / AJAX)
   Categorías: Disco Duro Externo, Motherboards, Tarjetas de Video,
                Memoria RAM, Procesadores
================================================================ */
const puppeteer = require('puppeteer');

const CATEGORIAS = [
  {
    nombre:    'Disco Duro Externo',
    url:       'https://www.tiendasenwilson.com/arma-tu-pc/disco-duro-externo/?pag=1&&q=disco%20duro%20externo',
    fuente:    'Wilson',
    categoria: 'Hardware PC'
  },
  {
    nombre:    'Motherboards',
    url:       'https://www.tiendasenwilson.com/arma-tu-pc/motherboards/?pag=1&&q=motherboards',
    fuente:    'Wilson',
    categoria: 'Hardware PC'
  },
  {
    nombre:    'Tarjetas de Video',
    url:       'https://www.tiendasenwilson.com/arma-tu-pc/tarjetas-de-video/?pag=1&&q=tarjetas%20de%20video',
    fuente:    'Wilson',
    categoria: 'Hardware PC'
  },
  {
    nombre:    'Memoria RAM',
    url:       'https://www.tiendasenwilson.com/arma-tu-pc/memoria-ram/?pag=1&&q=memoria%20ram',
    fuente:    'Wilson',
    categoria: 'Hardware PC'
  },
  {
    nombre:    'Procesadores',
    url:       'https://www.tiendasenwilson.com/arma-tu-pc/procesadores/?pag=1&&q=procesadores',
    fuente:    'Wilson',
    categoria: 'Hardware PC'
  }
];

async function scrapeWilson() {
  console.log('[Wilson] 🚀 Iniciando scraping...');
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
      console.log(`[Wilson] 📂 Categoría: ${cat.nombre}`);
      for (let pagina = 1; pagina <= 3; pagina++) {
        const url = cat.url.replace('?pag=1', `?pag=${pagina}`);
        console.log(`[Wilson]   → Página ${pagina}: ${url}`);

        const page = await browser.newPage();

        await page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );
        await page.setViewport({ width: 1280, height: 900 });

        // Bloquear recursos innecesarios para agilizar
        await page.setRequestInterception(true);
        page.on('request', (req) => {
          if (['font', 'media'].includes(req.resourceType())) {
            req.abort();
          } else {
            req.continue();
          }
        });

        try {
          await page.goto(url, { waitUntil: 'networkidle2', timeout: 40000 });

        // Wilson carga las cards de producto vía AJAX — esperar el contenedor
        await page.waitForSelector('.listcategorias, .card, .producto, .item-product, [class*="card"]', { timeout: 20000 })
          .catch(() => console.log('[Wilson]   ⚠️  Esperando carga alternativa...'));

        // Scroll para activar lazy loading
        await page.evaluate(async () => {
          for (let i = 0; i < 20; i++) {
            window.scrollBy(0, 800);
            await new Promise(r => setTimeout(r, 500));
          }
        });
        await new Promise(r => setTimeout(r, 2000));

        const items = await page.evaluate((catInfo) => {
          const results = [];
          const TC = 3.70; // Tipo de cambio fijo USD -> PEN

          // Wilson usa cards Bootstrap o listcategorias — los productos están en .listcategorias o .card
          const cards = Array.from(
            document.querySelectorAll('.listcategorias, .card, .producto, div[class*="producto"], div[class*="item"]')
          ).filter(el => {
            // Filtrar solo cards que tengan precio o indicación de moneda
            return el.querySelector('img') && (
              el.querySelector('[class*="precio"]') ||
              el.querySelector('[class*="price"]') ||
              el.innerText.includes('S/') ||
              el.innerText.includes('USD') ||
              el.innerText.includes('$')
            );
          });

          cards.forEach((card, idx) => {
            if (idx >= 150) return; // Limite incrementado
            const nombreEl = card.querySelector(
              '.style_title_description, .card-title, h5.card-title, h4.card-title, h5, h4, [class*="nombre"], [class*="title"]'
            );
            let nombre = nombreEl ? nombreEl.innerText.trim() : null;
            if (!nombre || nombre.length < 3) {
              // Fallback: usar alt de imagen
              const img = card.querySelector('img');
              if (img && img.alt && img.alt.trim().length > 3) nombre = img.alt.trim();
            }
            if (!nombre || nombre.length < 3) return;

            // Selectores de precio específicos para evitar confundir actual con anterior
            const precioActualEl = card.querySelector(
              '.style_price, [class*="price"]:not(.precioant):not([class*="ant"]), [class*="precio"]:not(.precioant):not([class*="ant"]), b'
            );
            const precioAnteriorEl = card.querySelector(
              '.precioant, [class*="precioant"], [class*="anterior"], [class*="old"]'
            );

            const extraerPrecio = (el) => {
              if (!el) return null;
              const txt = el.innerText || el.textContent || '';
              // Extraer número: remover "S/", "USD", comas de miles, etc.
              const match = txt.match(/[\d,]+\.?\d*/);
              if (!match) return null;
              let num = parseFloat(match[0].replace(/,(\d{3})/g, '$1').replace(',', '.'));
              if (isNaN(num) || num <= 0) return null;
              
              // Si el texto contiene indicación de dólares, convertir a soles
              if (txt.includes('USD') || txt.includes('$')) {
                num = parseFloat((num * TC).toFixed(2));
              }
              return num;
            };

            let precioActual = extraerPrecio(precioActualEl);
            if (!precioActual) {
              // Fallback de precio en texto completo
              const textoCard = card.innerText || '';
              const matchPrecioUSD = textoCard.match(/(?:USD|\$)\s*([\d,]+\.?\d*)/i);
              if (matchPrecioUSD) {
                const num = parseFloat(matchPrecioUSD[1].replace(/,(\d{3})/g, '$1').replace(',', '.'));
                if (!isNaN(num) && num > 0) precioActual = parseFloat((num * TC).toFixed(2));
              } else {
                const matchPrecioPEN = textoCard.match(/S\/\s*([\d,]+\.?\d*)/i);
                if (matchPrecioPEN) {
                  const num = parseFloat(matchPrecioPEN[1].replace(/,(\d{3})/g, '$1').replace(',', '.'));
                  if (!isNaN(num) && num > 0) precioActual = num;
                }
              }
            }
            if (!precioActual || precioActual <= 0) return;

            const precioAnterior = extraerPrecio(precioAnteriorEl);

            // Imagen
            const imgEl = card.querySelector('img');
            let imagen = imgEl ? (imgEl.src || imgEl.getAttribute('data-src') || imgEl.getAttribute('data-lazy')) : null;
            if (imagen && imagen.startsWith('//')) imagen = 'https:' + imagen;

            // URL del producto
            const linkEl = card.querySelector('a[href]');
            let urlProducto = linkEl ? linkEl.href : null;
            if (!urlProducto) return;

            results.push({
              nombre:          nombre.replace(/\s+/g, ' ').trim(),
              precio_actual:   precioActual,
              precio_anterior: precioAnterior || null,
              imagen,
              url_producto:    urlProducto,
              fuente:          catInfo.fuente,
              categoria:       catInfo.categoria
            });
          });

          return results;
        }, cat);

        console.log(`[Wilson]   ✅ ${items.length} productos encontrados en "${cat.nombre}"`);
        productos.push(...items);

      } catch (e) {
        console.error(`[Wilson]   ❌ Error en ${url}:`, e.message);
      } finally {
        await page.close();
      }
      await new Promise(r => setTimeout(r, 2500));
      }
    }
  } finally {
    await browser.close();
  }

  console.log(`[Wilson] ✅ Total productos extraídos: ${productos.length}`);
  return productos;
}

module.exports = { scrapeWilson };
