/* ================================================================
   PriceScope — scrapers/falabella.js
   Extrae Televisores y Smartphones de Falabella Perú
   Plataforma: Next.js (React SSR) con datos en __NEXT_DATA__
   Estrategia: interceptar JSON de la API interna de búsqueda

   Precios capturados:
   - precio_normal:  normalPrice (precio de lista)
   - precio_oferta:  offerPrice (precio con descuento)
   - precio_tarjeta: cmrPrice (precio exclusivo tarjeta CMR de Falabella)
================================================================ */
const puppeteer = require('puppeteer');

const CATEGORIAS = [
  {
    nombre:    'Televisores',
    urlBrowse: 'https://www.falabella.com.pe/falabella-pe/category/cat50015/Televisores',
    apiPath:   '/falabella-pe/api/2.0/page/category/cat50015?page=1&productView=grid',
    fuente:    'Falabella',
    categoria: 'Televisores'
  },
  {
    nombre:    'Smartphones',
    urlBrowse: 'https://www.falabella.com.pe/falabella-pe/category/cat7270022/Smartphones',
    apiPath:   '/falabella-pe/api/2.0/page/category/cat7270022?page=1&productView=grid',
    fuente:    'Falabella',
    categoria: 'Celulares'
  }
];

/* ── Extraer los 3 tipos de precio desde el objeto prices de Falabella ── */
function extraerPrecios(prod) {
  const prices = prod.prices || {};

  // Precio CMR (tarjeta Falabella) — a veces aparece como cmrPrice o cardPrice
  const precioCMR = parseFloat(
    prices.cmrPrice?.originalPrice
    || prices.cardPrice?.originalPrice
    || prices.cencosudCard?.originalPrice
    || 0
  ) || null;

  // Precio oferta
  const precioOferta = parseFloat(
    prices.offerPrice?.originalPrice
    || prices.salePrice?.originalPrice
    || 0
  ) || null;

  // Precio normal (de lista)
  const precioNormal = parseFloat(
    prices.normalPrice?.originalPrice
    || prices.listPrice?.originalPrice
    || 0
  ) || null;

  // precio_actual = el más bajo disponible
  const precioActual = precioCMR || precioOferta || precioNormal || 0;

  return {
    precio_actual:   precioActual,
    precio_normal:   precioNormal,
    precio_oferta:   precioOferta || precioNormal,
    precio_tarjeta:  precioCMR || null,
    precio_anterior: (precioNormal && precioNormal !== precioActual) ? precioNormal : null
  };
}

async function scrapeFalabella() {
  console.log('[Falabella] 🚀 Iniciando scraping...');
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
      console.log(`[Falabella] 📂 Categoría: ${cat.nombre}`);
      const page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
      await page.setViewport({ width: 1280, height: 900 });
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'es-PE,es;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      });

      /* ── Estrategia 1: Interceptar la respuesta JSON de la API interna ── */
      let apiProductos = [];
      const apiUrl = `https://www.falabella.com.pe${cat.apiPath}`;

      try {
        const response = await page.goto(apiUrl, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });

        const text = await response.text();
        const json = JSON.parse(text);

        const resultados = json?.data?.results?.[0]?.products
          || json?.results?.[0]?.products
          || json?.data?.products
          || [];

        if (resultados.length > 0) {
          console.log(`[Falabella]   📡 API encontró ${resultados.length} productos`);

          resultados.slice(0, 40).forEach(prod => {
            try {
              const nombre = prod.displayName || prod.name || prod.title;
              if (!nombre) return;

              const precios = extraerPrecios(prod);
              if (!precios.precio_actual || precios.precio_actual <= 0) return;

              const imagen = prod.mediaUrls?.[0]
                || prod.thumbnailUrl
                || prod.images?.[0];

              const urlProducto = prod.url
                ? (prod.url.startsWith('http') ? prod.url : `https://www.falabella.com.pe${prod.url}`)
                : null;
              if (!urlProducto) return;

              apiProductos.push({
                nombre,
                ...precios,
                imagen,
                url_producto:    urlProducto,
                fuente:          cat.fuente,
                categoria:       cat.categoria
              });
            } catch { /* saltar producto malformado */ }
          });
        }
      } catch (e) {
        console.log(`[Falabella]   ⚠️  API no disponible, usando scraping visual: ${e.message}`);
      }

      /* ── Estrategia 2: Scraping visual si la API falló ── */
      if (apiProductos.length === 0) {
        try {
          await page.goto(cat.urlBrowse, { waitUntil: 'networkidle2', timeout: 40000 });

          await page.waitForSelector(
            '[data-testid="product-card"], .product-card, [class*="product-card"], [class*="ProductCard"]',
            { timeout: 20000 }
          ).catch(() => console.log('[Falabella]   ⚠️  Selector fallback'));

          // Intentar leer __NEXT_DATA__ (SSR data)
          const nextData = await page.evaluate(() => {
            const el = document.getElementById('__NEXT_DATA__');
            if (!el) return null;
            try { return JSON.parse(el.textContent); } catch { return null; }
          });

          if (nextData) {
            const buscarProductos = (obj, depth = 0) => {
              if (depth > 10 || !obj || typeof obj !== 'object') return [];
              if (Array.isArray(obj)) {
                if (obj.length > 0 && obj[0]?.displayName && obj[0]?.prices) return obj;
                return obj.flatMap(i => buscarProductos(i, depth + 1));
              }
              return Object.values(obj).flatMap(v => buscarProductos(v, depth + 1));
            };

            const prods = buscarProductos(nextData?.props?.pageProps);
            if (prods.length > 0) {
              console.log(`[Falabella]   📦 __NEXT_DATA__ encontró ${prods.length} productos`);
              prods.slice(0, 40).forEach(prod => {
                try {
                  const nombre = prod.displayName || prod.name;
                  if (!nombre) return;
                  const precios = extraerPrecios(prod);
                  if (!precios.precio_actual) return;
                  const imagen = prod.mediaUrls?.[0] || prod.thumbnailUrl;
                  const urlProducto = prod.url
                    ? (prod.url.startsWith('http') ? prod.url : `https://www.falabella.com.pe${prod.url}`)
                    : null;
                  if (!urlProducto) return;

                  apiProductos.push({
                    nombre,
                    ...precios,
                    imagen,
                    url_producto:    urlProducto,
                    fuente:          cat.fuente,
                    categoria:       cat.categoria
                  });
                } catch { /* skip */ }
              });
            }
          }

          // Si aún no hay productos — extraer del DOM directamente
          if (apiProductos.length === 0) {
            await page.evaluate(async () => {
              for (let i = 0; i < 20; i++) {
                window.scrollBy(0, 1000);
                await new Promise(r => setTimeout(r, 600));
              }
            });

            const domItems = await page.evaluate((catInfo) => {
              const results = [];
              const cards = document.querySelectorAll(
                '[data-testid="product-card"], [class*="product-card"], [class*="ProductCard"], [class*="pod-"]'
              );

              cards.forEach((card, idx) => {
                if (idx >= 150) return; // Limite incrementado

                const nombreEl = card.querySelector(
                  '[data-testid="product-title"], [class*="product-title"], [class*="ProductTitle"], h2, h3'
                );
                const nombre = nombreEl ? nombreEl.textContent.trim() : null;
                if (!nombre || nombre.length < 3) return;

                const extraerPrecio = (el) => {
                  if (!el) return null;
                  const txt = el.textContent.replace(/[^\d.]/g, '');
                  const num = parseFloat(txt);
                  return isNaN(num) ? null : num;
                };

                // Precio normal (tachado)
                const precioNormalEl = card.querySelector(
                  '[data-testid="list-crossed-price"], [class*="original-price"], [class*="crossed"]'
                );
                // Precio oferta
                const precioOfertaEl = card.querySelector(
                  '[data-testid="list-prices-value"], [class*="price-value"], [class*="sale-price"], [class*="priceValue"]'
                );
                // Precio CMR (tarjeta)
                const precioCMREl = card.querySelector(
                  '[class*="cmr-price"], [class*="card-price"], [data-testid="cmr-price"]'
                );

                const precioNormal   = extraerPrecio(precioNormalEl);
                const precioOferta   = extraerPrecio(precioOfertaEl);
                const precioCMR      = extraerPrecio(precioCMREl);
                const precioActual   = precioCMR || precioOferta;
                if (!precioActual) return;

                const imgs = Array.from(card.querySelectorAll('img'));
                const validImg = imgs.find(img => {
                  const s = img.getAttribute('src') || img.dataset?.src || '';
                  return s.length > 5 && !s.includes('data:image');
                });
                
                let imagen = null;
                if (validImg) {
                  imagen = validImg.dataset?.src || validImg.getAttribute('src');
                }

                const linkEl = card.querySelector('a[href]');
                let urlProducto = linkEl ? linkEl.href : null;
                if (!urlProducto) return;

                results.push({
                  nombre,
                  precio_actual:   precioActual,
                  precio_anterior: precioNormal || null,
                  precio_normal:   precioNormal || null,
                  precio_oferta:   precioOferta || precioActual,
                  precio_tarjeta:  precioCMR || null,
                  imagen,
                  url_producto:    urlProducto,
                  fuente:          catInfo.fuente,
                  categoria:       catInfo.categoria
                });
              });

              return results;
            }, cat);

            apiProductos.push(...domItems);
          }
        } catch (e) {
          console.error(`[Falabella]   ❌ Error en scraping visual:`, e.message);
        }
      }

      console.log(`[Falabella]   ✅ ${apiProductos.length} productos en ${cat.nombre}`);
      productos.push(...apiProductos);
      await page.close();

      await new Promise(r => setTimeout(r, 3000));
    }
  } finally {
    await browser.close();
  }

  console.log(`[Falabella] ✅ Total productos extraídos: ${productos.length}`);
  return productos;
}

module.exports = { scrapeFalabella };
