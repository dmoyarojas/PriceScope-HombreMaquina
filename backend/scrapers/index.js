/* ================================================================
   PriceScope — scrapers/index.js
   Orquestador de scrapers: normaliza, deduplicata y guarda en Supabase
================================================================ */
const { scrapePlazaVea }  = require('./plazavea');
const { scrapeLaCuracao } = require('./lacuracao');
const { scrapeHiraoka }   = require('./hiraoka');
const { scrapeFalabella } = require('./falabella');
const { scrapeWilson }    = require('./wilson');
const { scrapeImpacto }   = require('./impacto');
const { scrapeCyC }       = require('./cyc');
const { scrapeCompuVision } = require('./compuvision');
const { scrapeSercoplus }  = require('./sercoplus');
const supabase            = require('../db');
const crypto              = require('crypto');

/* ── Genera un ID determinista a partir de la URL del producto ── */
const PREFIJOS = {
  PlazaVea:  'pv',
  LaCuracao: 'lc',
  Hiraoka:   'hk',
  Falabella: 'fb',
  Wilson:    'wl',
  Impacto:   'im',
  CyC:       'cy',
  CompuVision: 'cv',
  Sercoplus: 'sp'
};

function generarId(urlProducto, fuente) {
  const hash = crypto.createHash('md5').update(urlProducto).digest('hex').slice(0, 12);
  const prefijo = PREFIJOS[fuente] || 'xx';
  return `${prefijo}-${hash}`;
}

function extraerMarca(nombre) {
  if (!nombre) return 'Genérico';
  const n = nombre.toLowerCase();

  // TV / Cellphone brands
  if (n.includes('samsung')) return 'Samsung';
  if (/\blg\b/.test(n)) return 'LG';
  if (n.includes('sony')) return 'Sony';
  if (n.includes('xiaomi') || n.includes('redmi') || n.includes('poco')) return 'Xiaomi';
  if (n.includes('apple') || n.includes('iphone') || n.includes('ipad')) return 'Apple';
  if (n.includes('motorola') || /\bmoto\b/.test(n)) return 'Motorola';
  if (n.includes('tcl')) return 'TCL';
  if (n.includes('hisense')) return 'Hisense';
  if (/\baoc\b/.test(n)) return 'AOC';
  if (n.includes('philips')) return 'Philips';
  if (n.includes('panasonic')) return 'Panasonic';
  if (/\bzte\b/.test(n)) return 'ZTE';
  if (n.includes('realme')) return 'Realme';
  if (n.includes('honor')) return 'Honor';
  if (n.includes('huawei')) return 'Huawei';
  if (n.includes('oppo')) return 'Oppo';
  if (n.includes('infinix')) return 'Infinix';

  // Hardware/PC brands
  if (n.includes('nvidia') || n.includes('geforce') || n.includes('rtx') || n.includes('gtx')) return 'NVIDIA';
  if (n.includes('amd') || n.includes('ryzen') || n.includes('radeon') || /\brx\b/.test(n)) return 'AMD';
  if (n.includes('intel') || n.includes('core i')) return 'Intel';
  if (n.includes('kingston') || n.includes('fury') || n.includes('beast')) return 'Kingston';
  if (n.includes('corsair') || n.includes('vengeance')) return 'Corsair';
  if (n.includes('seagate') || n.includes('barracuda') || n.includes('expansion')) return 'Seagate';
  if (n.includes('western digital') || /\bwd\b/.test(n) || n.includes('caviar')) return 'Western Digital';
  if (n.includes('toshiba')) return 'Toshiba';
  if (n.includes('crucial')) return 'Crucial';
  if (n.includes('g.skill') || n.includes('gskill')) return 'G.Skill';
  if (n.includes('adata') || n.includes('xpg')) return 'ADATA';
  if (n.includes('gigabyte') || n.includes('aorus')) return 'Gigabyte';
  if (n.includes('asus') || /\brog\b/.test(n) || /\btuf\b/.test(n)) return 'ASUS';
  if (/\bmsi\b/.test(n)) return 'MSI';
  if (n.includes('evga')) return 'EVGA';
  if (n.includes('zotac')) return 'Zotac';
  if (/\bpny\b/.test(n)) return 'PNY';
  if (n.includes('sapphire')) return 'Sapphire';
  if (/\bxfx\b/.test(n)) return 'XFX';
  if (n.includes('patriot')) return 'Patriot';
  if (n.includes('teamgroup') || n.includes('t-force')) return 'TeamGroup';

  return 'Genérico';
}

/* ── Guardar productos en Supabase ── */
async function guardarProductos(productos) {
  let insertados = 0;
  let actualizados = 0;
  let errores = 0;

  for (const p of productos) {
    if (!p.nombre || !p.precio_actual || !p.url_producto) continue;

    const id = generarId(p.url_producto, p.fuente);

    try {
      /* Verificar si ya existe y comparar precio */
      const { data: existente } = await supabase
        .from('productos')
        .select('id, precio_actual')
        .eq('id', id)
        .maybeSingle();

      const precioAnterior = existente ? parseFloat(existente.precio_actual) : null;
      const precioActual   = parseFloat(p.precio_actual);

      // Normalizar los 3 tipos de precio
      // precio_normal  = precio de lista (sin descuento). Solo se guarda si es MAYOR al precio actual
      //                  para evitar mostrar precio tachado cuando la tienda solo tiene un precio.
      // precio_oferta  = precio con descuento visible en web
      // precio_tarjeta = precio exclusivo con tarjeta del retail (null si no aplica)
      const precioOferta  = p.precio_oferta  ? parseFloat(p.precio_oferta)  : precioActual;
      const precioTarjeta = p.precio_tarjeta ? parseFloat(p.precio_tarjeta) : null;

      // precio_normal: solo asignar si existe explícitamente Y es mayor al precio actual
      let precioNormal = null;
      if (p.precio_normal && parseFloat(p.precio_normal) > precioActual) {
        precioNormal = parseFloat(p.precio_normal);
      } else if (p.precio_anterior && parseFloat(p.precio_anterior) > precioActual) {
        precioNormal = parseFloat(p.precio_anterior);
      }
      // Si no hay precio anterior mayor → precioNormal queda null (no hay descuento real)

      const datos = {
        id,
        nombre:          p.nombre.slice(0, 299),
        marca:           extraerMarca(p.nombre),
        categoria:       p.categoria,
        imagen:          p.imagen   || null,
        precio_actual:   precioActual,
        precio_anterior: p.precio_anterior || precioAnterior || null,
        precio_normal:   precioNormal,
        precio_oferta:   precioOferta,
        precio_tarjeta:  precioTarjeta,
        url_producto:    p.url_producto,
        fuente:          p.fuente,
        activo:          true,
        fecha_actualizacion: new Date().toISOString()
      };

      if (!existente) {
        /* Insertar nuevo */
        datos.detalle_id = id;
        const { error } = await supabase.from('productos').insert(datos);
        if (error) throw error;
        insertados++;
      } else {
        /* Actualizar */
        const { error } = await supabase
          .from('productos')
          .update(datos)
          .eq('id', id);
        if (error) throw error;
        actualizados++;

        /* Registrar en historial_precios si el precio cambió */
        if (precioAnterior && Math.abs(precioActual - precioAnterior) > 0.01) {
          await supabase.from('historial_precios').insert({
            producto_nombre: p.nombre.slice(0, 299),
            precio:          precioActual,
            fuente:          p.fuente,
            url_producto:    p.url_producto
          });
        }
      }
    } catch (e) {
      console.error(`[Scrapers] ❌ Error guardando "${p.nombre}":`, e.message);
      errores++;
    }
  }

  return { insertados, actualizados, errores };
}

/* ── Función principal: ejecutar todos los scrapers ── */
async function ejecutarScraping() {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║     PriceScope — Scraping iniciado   ║');
  console.log('╚══════════════════════════════════════╝\n');
  const inicio = Date.now();

  let todosLosProductos = [];

  /* Plaza Vea */
  try {
    const pvProductos = await scrapePlazaVea();
    todosLosProductos.push(...pvProductos);
  } catch (e) {
    console.error('[Scrapers] ❌ Error en Plaza Vea:', e.message);
  }

  /* La Curacao */
  try {
    const lcProductos = await scrapeLaCuracao();
    todosLosProductos.push(...lcProductos);
  } catch (e) {
    console.error('[Scrapers] ❌ Error en La Curacao:', e.message);
  }

  /* Hiraoka */
  try {
    const hkProductos = await scrapeHiraoka();
    todosLosProductos.push(...hkProductos);
  } catch (e) {
    console.error('[Scrapers] ❌ Error en Hiraoka:', e.message);
  }

  /* Falabella */
  try {
    const fbProductos = await scrapeFalabella();
    todosLosProductos.push(...fbProductos);
  } catch (e) {
    console.error('[Scrapers] ❌ Error en Falabella:', e.message);
  }

  /* Wilson */
  try {
    const wlProductos = await scrapeWilson();
    todosLosProductos.push(...wlProductos);
  } catch (e) {
    console.error('[Scrapers] ❌ Error en Wilson:', e.message);
  }

  /* Impacto */
  try {
    const imProductos = await scrapeImpacto();
    todosLosProductos.push(...imProductos);
  } catch (e) {
    console.error('[Scrapers] ❌ Error en Impacto:', e.message);
  }

  /* CyC */
  try {
    const cyProductos = await scrapeCyC();
    todosLosProductos.push(...cyProductos);
  } catch (e) {
    console.error('[Scrapers] ❌ Error en CyC:', e.message);
  }

  /* CompuVision */
  try {
    const cvProductos = await scrapeCompuVision();
    todosLosProductos.push(...cvProductos);
  } catch (e) {
    console.error('[Scrapers] ❌ Error en CompuVision:', e.message);
  }

  /* Sercoplus */
  try {
    const spProductos = await scrapeSercoplus();
    todosLosProductos.push(...spProductos);
  } catch (e) {
    console.error('[Scrapers] ❌ Error en Sercoplus:', e.message);
  }

  console.log(`\n[Scrapers] 📦 Total productos scrapeados: ${todosLosProductos.length}`);

  /* Guardar en Supabase */
  if (todosLosProductos.length > 0) {
    const stats = await guardarProductos(todosLosProductos);
    const duracion = ((Date.now() - inicio) / 1000).toFixed(1);
    console.log(`[Scrapers] ✅ Completado en ${duracion}s`);
    console.log(`[Scrapers]    ➕ Insertados: ${stats.insertados}`);
    console.log(`[Scrapers]    🔄 Actualizados: ${stats.actualizados}`);
    console.log(`[Scrapers]    ❌ Errores: ${stats.errores}`);
    return stats;
  } else {
    console.log('[Scrapers] ⚠️  No se extrajo ningún producto');
    return { insertados: 0, actualizados: 0, errores: 0 };
  }
}

module.exports = { ejecutarScraping, guardarProductos, generarId };
