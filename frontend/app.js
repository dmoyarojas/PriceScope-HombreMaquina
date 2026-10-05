/* ================================================================
   PriceScope — app.js
   Plataforma de comparación de precios — datos simulados
   Backend: http://localhost:3000/api
================================================================ */

const CONFIG = {
  USD_TO_PEN: 3.70
};

const CAT_KEYWORDS = {
  'Televisores': 'smart tv',
  'Hardware PC': 'hardware pc componentes',
  'Celulares': 'celular smartphone'
};


/* ─────────────────────────────────────────────────────────────
   2. PRODUCTOS HARDCODEADOS — vitrina inicial
   Reemplazan a Fake Store. Productos realistas con
   imágenes públicas, precios en soles y las 3 categorías.
───────────────────────────────────────────────────────────── */
const VITRINA = [

  /* ── TELEVISORES ── */
  {
    id: 'demo-tv-1',
    fuente: 'Demo',
    categoria: 'Televisores',
    titulo: 'Samsung Smart TV 55" QLED 4K QN55Q70C',
    imagen: 'https://images.samsung.com/is/image/samsung/p6pim/levant/qn55q70cafxza/gallery/levant-qled-q70c-qn55q70cafxza-536919466?$650_519_PNG$',
    precio: 'S/ 2,149.00',
    precioNum: 2149,
    precioOld: 'S/ 2,619.00',
    url: '#',
    vendedor: 'Demo — MercadoLibre'
  },
  {
    id: 'demo-tv-2',
    fuente: 'Demo',
    categoria: 'Televisores',
    titulo: 'LG Smart TV 65" OLED evo C3 4K',
    imagen: 'https://www.lg.com/us/images/tvs/md08003672/gallery/medium01.jpg',
    precio: 'S/ 4,899.00',
    precioNum: 4899,
    precioOld: null,
    url: '#',
    vendedor: 'Demo — MercadoLibre'
  },
  {
    id: 'demo-tv-3',
    fuente: 'Demo',
    categoria: 'Televisores',
    titulo: 'TCL Smart TV 50" QLED 4K Google TV S546G',
    imagen: 'https://www.tcl.com/content/dam/tcl/product-images/tv/s5-qled/50/tcl-50s546-front.png',
    precio: 'S/ 1,299.00',
    precioNum: 1299,
    precioOld: 'S/ 1,879.00',
    url: '#',
    vendedor: 'Demo — eBay'
  },
  {
    id: 'demo-tv-4',
    fuente: 'Demo',
    categoria: 'Televisores',
    titulo: 'Sony Bravia XR 75" Mini LED 4K X90L',
    imagen: 'https://www.sony.com/image/5d02da5df552836db894cead8a68f5f3?fmt=png-alpha&wid=440',
    precio: 'S/ 6,250.00',
    precioNum: 6250,
    precioOld: null,
    url: '#',
    vendedor: 'Demo — Amazon'
  },

  /* ── HARDWARE PC ── */
  {
    id: 'demo-hw-1',
    fuente: 'Demo',
    categoria: 'Hardware PC',
    titulo: 'NVIDIA GeForce RTX 4070 Super 12GB GDDR6X',
    imagen: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4070-super/geforce-ada-4070-super-shop-630-d@2x.jpg',
    precio: 'S/ 2,880.00',
    precioNum: 2880,
    precioOld: 'S/ 3,270.00',
    url: '#',
    vendedor: 'Demo — MercadoLibre'
  },
  {
    id: 'demo-hw-2',
    fuente: 'Demo',
    categoria: 'Hardware PC',
    titulo: 'AMD Ryzen 9 7950X 16-Core AM5 5.7GHz',
    imagen: 'https://www.amd.com/system/files/2022-08/ryzen-9-7950x-pib-left-facing.png',
    precio: 'S/ 2,199.00',
    precioNum: 2199,
    precioOld: null,
    url: '#',
    vendedor: 'Demo — MercadoLibre'
  },
  {
    id: 'demo-hw-3',
    fuente: 'Demo',
    categoria: 'Hardware PC',
    titulo: 'Kingston FURY Beast DDR5 32GB 6000MHz CL36',
    imagen: 'https://www.kingston.com/dataSheets/KF560C36BBEK2-32_en.pdf',
    precio: 'S/ 389.00',
    precioNum: 389,
    precioOld: 'S/ 499.00',
    url: '#',
    vendedor: 'Demo — eBay'
  },
  {
    id: 'demo-hw-4',
    fuente: 'Demo',
    categoria: 'Hardware PC',
    titulo: 'Samsung 990 Pro NVMe M.2 SSD 2TB PCIe 4.0',
    imagen: 'https://images.samsung.com/is/image/samsung/p6pim/levant/mz-v9p2t0bw/gallery/levant-990-pro-mz-v9p2t0bw-536765656?$650_519_PNG$',
    precio: 'S/ 549.00',
    precioNum: 549,
    precioOld: null,
    url: '#',
    vendedor: 'Demo — Amazon'
  },

  /* ── CELULARES ── */
  {
    id: 'demo-cel-1',
    fuente: 'Demo',
    categoria: 'Celulares',
    titulo: 'Apple iPhone 16 Pro Max 256GB Titanio Negro',
    imagen: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-deserttitanium?wid=400&hei=400&fmt=png-alpha',
    precio: 'S/ 6,499.00',
    precioNum: 6499,
    precioOld: null,
    url: '#',
    vendedor: 'Demo — MercadoLibre'
  },
  {
    id: 'demo-cel-2',
    fuente: 'Demo',
    categoria: 'Celulares',
    titulo: 'Samsung Galaxy S24 Ultra 512GB Titanium Gray',
    imagen: 'https://images.samsung.com/is/image/samsung/p6pim/levant/sm-s928bzageub/gallery/levant-galaxy-s24-ultra-sm-s928bzageub-thumb-539770798?$650_519_PNG$',
    precio: 'S/ 4,890.00',
    precioNum: 4890,
    precioOld: 'S/ 5,750.00',
    url: '#',
    vendedor: 'Demo — MercadoLibre'
  },
  {
    id: 'demo-cel-3',
    fuente: 'Demo',
    categoria: 'Celulares',
    titulo: 'Xiaomi 14 Ultra 512GB Leica Optics 6.73"',
    imagen: 'https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0/pms_1708336920.35303497.png',
    precio: 'S/ 3,780.00',
    precioNum: 3780,
    precioOld: null,
    url: '#',
    vendedor: 'Demo — eBay'
  },
  {
    id: 'demo-cel-4',
    fuente: 'Demo',
    categoria: 'Celulares',
    titulo: 'Google Pixel 9 Pro 256GB Porcelain 6.3"',
    imagen: 'https://lh3.googleusercontent.com/nu4jLpUkFg7JVVaJGxKjhA5aEA1EeD63oBbV-5x-YzR_hHbmgVMJMy4NrPzaQh39_0I2HFTqlWIc=rw-e365-w440',
    precio: 'S/ 3,199.00',
    precioNum: 3199,
    precioOld: 'S/ 3,999.00',
    url: '#',
    vendedor: 'Demo — Amazon'
  }
];


/* ─────────────────────────────────────────────────────────────
   3. ESTADO GLOBAL
───────────────────────────────────────────────────────────── */
const STATE = {
  query: '',
  categoria: 'Todas las categorías',
  apiOffset: 0,
  pageSize: 4,            // muestra de a 4
  results: [],           // productos visibles en pantalla
  allFetched: [],           // todos los traídos (se van mostrando de a 4)
  isLoading: false,
  hasMore: true,
  mode: 'vitrina'
};


/* ─────────────────────────────────────────────────────────────
   4. REFERENCIAS AL DOM
───────────────────────────────────────────────────────────── */
const DOM = {
  grid: document.querySelector('.products-grid'),
  loadMoreWrap: document.querySelector('.loadmore-wrap'),
  loadMoreBtn: document.querySelector('.btn-loadmore'),
  searchInput: document.querySelector('.search-input'),
  searchBtn: document.querySelector('.search-btn'),
  catBtn: document.getElementById('catBtn'),
  catLabel: document.getElementById('catLabel'),
  catArrow: document.getElementById('catArrow'),
  catDropdown: document.getElementById('catDropdown'),
  sectionTitle: document.querySelector('.catalogo .section-title'),
  sectionDesc: document.querySelector('.catalogo .section-desc')
};


/* ─────────────────────────────────────────────────────────────
   5. CONVERSIÓN Y FORMATO DE MONEDA
───────────────────────────────────────────────────────────── */
function usdToPen(usd) {
  const n = parseFloat(usd);
  return isNaN(n) ? null : parseFloat((n * CONFIG.USD_TO_PEN).toFixed(2));
}

function formatPen(amount) {
  const n = parseFloat(amount);
  if (isNaN(n)) return 'S/ —';
  return 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ─────────────────────────────────────────────────────────────
   9. DETECTAR CATEGORÍA desde el título
───────────────────────────────────────────────────────────── */
function detectarCategoria(titulo) {
  const t = titulo.toLowerCase();
  if (/tv|televisor|smart tv|qled|oled|led \d+|pantalla/.test(t)) return 'Televisores';
  if (/iphone|samsung galaxy|xiaomi|pixel|celular|smartphone|android/.test(t)) return 'Celulares';
  if (/gpu|rtx|gtx|cpu|ryzen|intel|ram|ssd|nvme|motherboard|placa/.test(t)) return 'Hardware PC';
  return 'Otros';
}


/* ─────────────────────────────────────────────────────────────
   10. SKELETON LOADER
───────────────────────────────────────────────────────────── */
function mostrarSkeletons(cantidad) {
  DOM.grid.innerHTML = '';
  DOM.grid.style.display = 'grid';
  for (let i = 0; i < cantidad; i++) {
    DOM.grid.innerHTML += `
      <article class="pcard pcard--skeleton">
        <div class="skeleton skeleton--img"></div>
        <div class="pcard__body">
          <div class="skeleton skeleton--line skeleton--line-short"></div>
          <div class="skeleton skeleton--line"></div>
          <div class="skeleton skeleton--line skeleton--line-med"></div>
          <div class="skeleton skeleton--price"></div>
          <div class="skeleton skeleton--btn"></div>
        </div>
      </article>`;
  }
}

function agregarSkeletons(cantidad) {
  for (let i = 0; i < cantidad; i++) {
    const art = document.createElement('article');
    art.className = 'pcard pcard--skeleton';
    art.innerHTML = `
      <div class="skeleton skeleton--img"></div>
      <div class="pcard__body">
        <div class="skeleton skeleton--line skeleton--line-short"></div>
        <div class="skeleton skeleton--line"></div>
        <div class="skeleton skeleton--line skeleton--line-med"></div>
        <div class="skeleton skeleton--price"></div>
        <div class="skeleton skeleton--btn"></div>
      </div>`;
    DOM.grid.appendChild(art);
  }
}

function quitarSkeletons() {
  document.querySelectorAll('.pcard--skeleton').forEach(el => el.remove());
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/* ─────────────────────────────────────────────────────────────
   11. RENDERIZAR CARDS (agrega al grid sin borrar lo anterior)
───────────────────────────────────────────────────────────── */
function renderCards(productos) {
  if (productos.length === 0 && STATE.results.length === 0) {
    DOM.grid.innerHTML = `
      <div class="state-empty" style="grid-column:1/-1">
        <div class="state-empty__icon">😕</div>
        <p class="state-empty__title">No encontramos resultados</p>
        <p class="state-empty__desc">Intentá con otro nombre, marca o categoría.</p>
      </div>`;
    DOM.loadMoreWrap.style.display = 'none';
    return;
  }

  productos.forEach(p => {
    // Badge: solo muestra descuento si hay precio anterior, si no nada
    const badgeHtml = p.precioOld
      ? `<span class="badge badge--deal">Oferta</span>`
      : '';

    // Precio tachado solo si existe
    const precioOld = p.precioOld
      ? `<p class="pold">${p.precioOld}</p>` : '';

    // Imagen: real o gradiente de fondo
    const imgClass = getImgClass(p.categoria);
    const imgHtml = p.imagen
      ? `<img src="${p.imagen}" alt="${escapeHtml(p.titulo)}" class="pcard__img pcard__img--real" loading="lazy" onerror="this.onerror=null; this.src='https://placehold.co/400x400/eeeeee/999999?text=Sin+Imagen';">`
      : `<div class="pcard__img ${imgClass}"></div>`;

    // Tags de tiendas — sin "Demo"
    const tags = getFuenteTags(p);

    const card = document.createElement('article');
    card.className = 'pcard';
    card.dataset.id = p.id;
    card.innerHTML = `
      <div class="pcard__img-wrap">
        ${imgHtml}
        ${badgeHtml}
        <button class="btn-bell" aria-label="Alerta de precio" onclick="abrirAlerta(event,'${p.id}')">
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>
      </div>
      <div class="pcard__body">
        <span class="pbrand">${escapeHtml(p.categoria)}</span>
        <h3 class="pname">${escapeHtml(p.titulo)}</h3>
        <div class="pprice-row">
          <p class="pprice">${p.precio}</p>
          ${precioOld}
        </div>
        <div class="stags">${tags}</div>
        <a href="detalle-producto.html?id=${VITRINA_TO_DETALLE[p.id] || p.id}" class="btn-ver">Ver precios</a>
      </div>`;

    DOM.grid.appendChild(card);
    STATE.results.push(p);
  });
}

// Devuelve la clase de gradiente según categoría
function getImgClass(categoria) {
  const map = {
    'Televisores': 'pimg--tv',
    'Celulares': 'pimg--cel',
    'Hardware PC': 'pimg--hw',
  };
  return map[categoria] || 'pimg--default';
}

// Tag de tienda — productos simulados muestran su categoría como fuente
function getFuenteTags(p) {
  const categoria = p.categoria || '';
  const map = {
    'Televisores': '<span class="stag stag--meli">Televisores</span>',
    'Celulares':   '<span class="stag stag--ebay">Celulares</span>',
    'Hardware PC': '<span class="stag stag--api3">Hardware PC</span>',
  };
  return map[categoria] || '<span class="stag stag--fake">Simulado</span>';
}

function getFuenteTag(fuente) {
  return `<span class="stag stag--fake">${fuente}</span>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}


/* ─────────────────────────────────────────────────────────────
   12. ACTUALIZAR BOTÓN CARGAR MÁS
───────────────────────────────────────────────────────────── */
function actualizarBotonCargarMas() {
  const hayMasEnMemoria = STATE.results.length < STATE.allFetched.length;
  const hayMasEnAPI = STATE.hasMore;
  DOM.loadMoreWrap.style.display = (hayMasEnMemoria || hayMasEnAPI) ? 'flex' : 'none';
}


/* ─────────────────────────────────────────────────────────────
   13. VITRINA INICIAL — muestra los 12 productos demo de a 4
───────────────────────────────────────────────────────────── */
async function cargarVitrina() {
  if (!DOM.grid) return;
  STATE.mode = 'vitrina';
  STATE.results = [];
  STATE.hasMore = false;

  DOM.grid.innerHTML = '';
  DOM.grid.style.display = 'grid';
  DOM.loadMoreWrap.style.display = 'none';

  mostrarSkeletons(STATE.pageSize);

  try {
    const url = STATE.categoria && STATE.categoria !== 'Todas las categorías'
      ? `${API}/productos?categoria=${encodeURIComponent(STATE.categoria)}`
      : `${API}/productos`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.ok || !data.productos?.length) {
      quitarSkeletons();
      DOM.grid.innerHTML = `
        <div class="state-empty" style="grid-column:1/-1">
          <div class="state-empty__icon">😕</div>
          <p class="state-empty__title">No hay productos disponibles</p>
        </div>`;
      return;
    }

    /* Normalizar formato para que sea compatible con renderCards */
    STATE.allFetched = data.productos.map(p => ({
      id:        p.id,
      fuente:    'Simulado',
      categoria: p.categoria,
      titulo:    p.nombre,
      imagen:    p.imagen || null,
      precio:    formatPen(p.precio_actual),
      precioNum: parseFloat(p.precio_actual),
      precioOld: p.precio_anterior ? formatPen(p.precio_anterior) : null,
      url:       '#',
      vendedor:  p.fuente || 'Simulado',
      marca:     p.marca || ''
    }));

    quitarSkeletons();
    renderCards(STATE.allFetched.slice(0, STATE.pageSize));
    actualizarBotonCargarMas();

  } catch (e) {
    console.error('Error cargando vitrina:', e);
    quitarSkeletons();
    DOM.grid.innerHTML = `
      <div class="state-empty" style="grid-column:1/-1">
        <p class="state-empty__title">Error cargando productos</p>
        <p class="state-empty__desc">Verificá que el servidor esté corriendo.</p>
      </div>`;
  }
}


/* ─────────────────────────────────────────────────────────────
   14. MOSTRAR SIGUIENTE PÁGINA — de a 4 desde allFetched
   Si se agota la memoria, pide más a las APIs
───────────────────────────────────────────────────────────── */
async function mostrarSiguientePagina() {
  if (STATE.isLoading) return;

  const yaVistos = STATE.results.length;
  const disponibles = STATE.allFetched.slice(yaVistos, yaVistos + STATE.pageSize);

  if (disponibles.length > 0) {
    /* Hay productos en memoria → mostrar los próximos 4 */
    agregarSkeletons(disponibles.length);
    await delay(400);
    quitarSkeletons();
    renderCards(disponibles);
    actualizarBotonCargarMas();
  } else {
    /* Se agotó la memoria → pedir más a las APIs */
    await pedirMasALaAPI();
  }
}


/* ─────────────────────────────────────────────────────────────
   15. BÚSQUEDA PRINCIPAL
   MercadoLibre → llamada directa desde el navegador (CORS OK)
   Backend      → solo para login, alertas e historial
───────────────────────────────────────────────────────────── */

/* Llamada directa a MercadoLibre desde el navegador */
async function fetchMeliDirecto(query, offset) {
  try {
    const url = `https://api.mercadolibre.com/sites/MPE/search?q=${encodeURIComponent(query)}&offset=${offset}&limit=20`;
    const res = await fetch(url);
    const data = await res.json();
    return (data.results || []).map(p => ({
      id: 'meli-' + p.id,
      fuente: 'MercadoLibre',
      titulo: p.title,
      imagen: p.thumbnail ? p.thumbnail.replace('I.jpg', 'O.jpg') : null,
      precio: formatPen(p.price),
      precioNum: parseFloat(p.price) || 0,
      precioOld: p.original_price ? formatPen(p.original_price) : null,
      url: p.permalink,
      vendedor: p.seller?.nickname || 'Vendedor MeLi',
      marca: '',
      modelo: '',
      pulgadas: ''
    }));
  } catch (e) {
    console.error('MeLi error:', e.message);
    return [];
  }
}

async function buscar(query, resetear) {
  if (STATE.isLoading) return;

  const q = query.trim();

  if (!q && STATE.categoria === 'Todas las categorías') {
    cargarVitrina();
    return;
  }

  STATE.isLoading = true;
  STATE.mode = 'busqueda';
  STATE.query = q;

  if (resetear) {
    STATE.apiOffset = 0;
    STATE.results = [];
    STATE.allFetched = [];
    STATE.hasMore = false;
    DOM.grid.innerHTML = '';
  }

  actualizarTituloSeccion(q);
  mostrarSkeletons(STATE.pageSize);
  DOM.loadMoreWrap.style.display = 'none';

  try {
    /* Traer todos los productos de la BD y filtrar localmente */
    const res = await fetch(`${API}/productos`);
    const data = await res.json();

    if (!data.ok) throw new Error('Error en API');

    let productos = data.productos.map(p => ({
      id:        p.id,
      fuente:    'Simulado',
      categoria: p.categoria,
      titulo:    p.nombre,
      imagen:    p.imagen || null,
      precio:    formatPen(p.precio_actual),
      precioNum: parseFloat(p.precio_actual),
      precioOld: p.precio_anterior ? formatPen(p.precio_anterior) : null,
      url:       '#',
      vendedor:  p.fuente || 'Simulado',
      marca:     p.marca || ''
    }));

    /* Filtrar por query */
    if (q) {
      productos = productos.filter(p =>
        p.titulo.toLowerCase().includes(q.toLowerCase()) ||
        (p.marca && p.marca.toLowerCase().includes(q.toLowerCase()))
      );
    }

    /* Filtrar por categoría */
    if (STATE.categoria !== 'Todas las categorías') {
      productos = productos.filter(p => p.categoria === STATE.categoria);
    }

    /* Ordenar */
    const orden = document.querySelector('.sort-select')?.value || 'relevance';
    if (orden === 'price-asc')  productos.sort((a, b) => a.precioNum - b.precioNum);
    if (orden === 'price-desc') productos.sort((a, b) => b.precioNum - a.precioNum);

    STATE.allFetched = productos;

    quitarSkeletons();
    DOM.grid.innerHTML = '';
    STATE.results = [];
    renderCards(STATE.allFetched.slice(0, STATE.pageSize));
    actualizarBotonCargarMas();

  } catch (e) {
    console.warn('Error buscando:', e.message);
    quitarSkeletons();
    DOM.grid.innerHTML = '';
    STATE.results = [];
    mostrarToast('Error al buscar productos');
  }

  STATE.isLoading = false;
}

async function pedirMasALaAPI() {
  /* En modo simulado, todos los productos ya están en STATE.allFetched */
  const yaVistos = STATE.results.length;
  const disponibles = STATE.allFetched.slice(yaVistos, yaVistos + STATE.pageSize);

  if (!disponibles.length) {
    mostrarToast('No hay más productos para mostrar');
    DOM.loadMoreWrap.style.display = 'none';
    return;
  }

  agregarSkeletons(disponibles.length);
  await delay(400);
  quitarSkeletons();
  renderCards(disponibles);
  actualizarBotonCargarMas();
}

/* ─────────────────────────────────────────────────────────────
   17. ACTUALIZAR TÍTULO DE SECCIÓN
───────────────────────────────────────────────────────────── */
function actualizarTituloSeccion(q) {
  if (!DOM.sectionTitle) return;
  if (q) {
    DOM.sectionTitle.textContent = `Resultados para "${q}"`;
    if (DOM.sectionDesc) DOM.sectionDesc.textContent = 'Precios en soles desde MercadoLibre, eBay y Amazon';
  } else if (STATE.categoria !== 'Todas las categorías') {
    DOM.sectionTitle.textContent = STATE.categoria;
    if (DOM.sectionDesc) DOM.sectionDesc.textContent = 'Precios en soles desde todas las plataformas';
  } else {
    DOM.sectionTitle.textContent = 'Explorá productos por categoría';
    if (DOM.sectionDesc) DOM.sectionDesc.textContent = 'Usá el buscador o elegí una categoría para ver los precios actuales.';
  }
}


function verProducto(id) {
  const p = STATE.results.find(r => r.id === id);
  if (!p) return;

  // Buscar si existe una página de detalle por ID demo
  const DETALLE_IDS = {
    'demo-cel-1': 'iphone15',
    'demo-cel-2': 'galaxy-s24',
    'demo-tv-2': 'lg-oled-c3',
    'demo-tv-1': 'sony-bravia-a80l'
  };

  const detalleId = DETALLE_IDS[id];
  if (detalleId) {
    window.location.href = `detalle-producto.html?id=${detalleId}`;
    return;
  }

  // Productos de API: redirigir con datos en la URL
  const params = new URLSearchParams({
    nombre: p.titulo,
    precio: p.precio,
    imagen: p.imagen || '',
    fuente: p.fuente,
    url: p.url,
    categoria: p.categoria || ''
  });
  window.location.href = `detalle-producto.html?${params.toString()}`;
}

/* ─────────────────────────────────────────────────────────────
   19. HISTORIAL DE PRECIOS (simulado)
───────────────────────────────────────────────────────────── */
function verHistorial(id) {
  const p = STATE.results.find(r => r.id === id);
  if (!p) return;
  const puntos = generarHistorialSimulado(p.precioNum || 100, 8);
  cerrarModal();
  setTimeout(() => abrirHistorial(p, puntos), 260);
}

function generarHistorialSimulado(base, n) {
  const meses = ['Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'];
  return meses.slice(0, n).map((mes, i) => {
    const v = (Math.random() - 0.45) * base * 0.15;
    return { mes, precio: parseFloat(Math.max(base * 0.7, base + v * (i % 3 === 0 ? -1 : 1)).toFixed(2)) };
  });
}

function abrirHistorial(p, puntos) {
  document.getElementById('modalHistorial')?.remove();
  const min = Math.min(...puntos.map(x => x.precio));
  const max = Math.max(...puntos.map(x => x.precio));
  const prom = (puntos.reduce((a, b) => a + b.precio, 0) / puntos.length).toFixed(2);

  const svgH = 140, svgPad = 20;
  const xs = puntos.map((_, i) => 40 + i * (460 / (puntos.length - 1)));
  const ys = puntos.map(pt => {
    const range = max - min || 1;
    return svgH - ((pt.precio - min) / range) * (svgH - svgPad) + 20;
  });

  const polyline = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
  const polygon = `${xs[0]},${ys[0]} ` + polyline + ` ${xs[xs.length - 1]},${svgH + 20} ${xs[0]},${svgH + 20}`;
  const dots = xs.map((x, i) => `<circle cx="${x}" cy="${ys[i]}" r="4" fill="${i === ys.length - 1 ? '#fff' : 'var(--blue-600)'}" stroke="var(--blue-600)" stroke-width="2"/>`).join('');
  const labels = xs.map((x, i) => `<text x="${x}" y="${svgH + 40}" text-anchor="middle" font-size="10" fill="#94a3b8">${puntos[i].mes}</text>`).join('');

  const modal = document.createElement('div');
  modal.id = 'modalHistorial';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <button class="modal__close" onclick="document.getElementById('modalHistorial').remove();document.body.style.overflow=''" aria-label="Cerrar">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <h3 class="modal__view-title">Historial de precios</h3>
      <p class="modal__view-sub">${escapeHtml(p.titulo)}</p>
      <div class="chart-wrap">
        <svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg" style="width:100%">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#2563eb" stop-opacity="0.15"/>
              <stop offset="100%" stop-color="#2563eb" stop-opacity="0.01"/>
            </linearGradient>
          </defs>
          <line x1="40" y1="20"  x2="520" y2="20"  stroke="#e2e8f0" stroke-width="1"/>
          <line x1="40" y1="60"  x2="520" y2="60"  stroke="#e2e8f0" stroke-width="1"/>
          <line x1="40" y1="100" x2="520" y2="100" stroke="#e2e8f0" stroke-width="1"/>
          <line x1="40" y1="140" x2="520" y2="140" stroke="#e2e8f0" stroke-width="1"/>
          <polygon points="${polygon}" fill="url(#chartGrad)"/>
          <polyline points="${polyline}" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
          ${dots}
          ${labels}
        </svg>
      </div>
      <div class="hstats">
        <div class="hstat"><p class="hstat__lbl">Precio actual</p><p class="hstat__val hstat__val--cur">${p.precio}</p></div>
        <div class="hstat"><p class="hstat__lbl">Mínimo histórico</p><p class="hstat__val hstat__val--low">${formatPen(min)}</p></div>
        <div class="hstat"><p class="hstat__lbl">Máximo histórico</p><p class="hstat__val hstat__val--high">${formatPen(max)}</p></div>
        <div class="hstat"><p class="hstat__lbl">Promedio 8 meses</p><p class="hstat__val">${formatPen(prom)}</p></div>
      </div>
    </div>`;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('is-open'));
  document.body.style.overflow = 'hidden';
}


/* ─────────────────────────────────────────────────────────────
   20. MODAL ALERTA DE PRECIO
───────────────────────────────────────────────────────────── */
function abrirAlerta(event, id) {
  event.stopPropagation();
  abrirAlertaModal(id);
}

function abrirAlertaModal(id) {
  const p = STATE.results.find(r => r.id === id);
  if (!p) return;

  document.getElementById('modalAlerta')?.remove();

  const modal = document.createElement('div');
  modal.id = 'modalAlerta';
  modal.className = 'modal-overlay';

  if (!SESSION.token) {
    modal.innerHTML = `
      <div class="alert-modal-custom">
        <button class="alert-modal-custom__close"
          onclick="document.getElementById('modalAlerta').remove();document.body.style.overflow=''">×</button>
        <div class="alert-modal-custom__icon">
          <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </div>
        <h3 class="alert-modal-custom__title">Inicia sesión para crear alertas</h3>
        <p class="alert-modal-custom__text">
          Para guardar alertas de <strong>${escapeHtml(p.titulo)}</strong>
          necesitamos saber a quién avisarle.
        </p>
        <a href="login.html" class="alert-modal-custom__btn">Iniciar sesión</a>
      </div>`;
  } else {
    modal.innerHTML = `
      <div class="alert-price-modal">
        <button class="alert-price-modal__close"
          onclick="document.getElementById('modalAlerta').remove();document.body.style.overflow=''">×</button>
        <div class="alert-price-modal__header">
          <div class="alert-price-modal__icon">🔔</div>
          <div>
            <p class="alert-price-modal__title">Crear alerta de precio</p>
            <p class="alert-price-modal__product">${escapeHtml(p.titulo)}</p>
          </div>
        </div>
        <div class="alert-price-modal__current">
          Precio actual: <strong>${p.precio}</strong>
        </div>
        <div class="alert-tabs">
          <button class="alert-tab active" id="tabRango" onclick="switchAlertTab('rango')">Rango de precio</button>
          <button class="alert-tab" id="tabExacto" onclick="switchAlertTab('exacto')">Precio exacto</button>
        </div>
        <div id="alertPanelRango">
          <div class="alert-grid">
            <div>
              <label>Precio mínimo (S/)</label>
              <input type="number" id="alertMin" value="${Math.round(p.precioNum * 0.85)}" min="0"/>
            </div>
            <div>
              <label>Precio máximo (S/)</label>
              <input type="number" id="alertMax" value="${p.precioNum}" min="0"/>
            </div>
          </div>
        </div>
        <div id="alertPanelExacto" style="display:none">
          <div class="alert-single">
            <label class="alert-single__label">Avísame cuando llegue a (S/)</label>
            <input type="number" class="alert-single__input" id="alertPrecioExacto"
              value="${Math.round(p.precioNum * 0.90)}" min="0"/>
            <p class="alert-single__help">Te notificamos cuando el precio coincida con ese valor o sea menor.</p>
          </div>
        </div>
        <button class="alert-confirm-btn" onclick="guardarAlerta('${p.id}')">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          Confirmar alerta
        </button>
      </div>`;
  }

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('is-open'));
  document.body.style.overflow = 'hidden';
}

function switchAlertTab(tab) {
  const esRango = tab === 'rango';
  const tabRango = document.getElementById('tabRango');
  const tabExacto = document.getElementById('tabExacto');
  const panelRango = document.getElementById('alertPanelRango');
  const panelExacto = document.getElementById('alertPanelExacto');
  if (!tabRango || !tabExacto || !panelRango || !panelExacto) return;
  tabRango.classList.toggle('active', esRango);
  tabExacto.classList.toggle('active', !esRango);
  panelRango.style.display = esRango ? 'block' : 'none';
  panelExacto.style.display = esRango ? 'none' : 'block';
}

function abrirAlertaStatic(eventOrId, detalleId) {
  // Soporta llamada con o sin event
  if (typeof eventOrId === 'string') {
    detalleId = eventOrId;
  } else if (eventOrId) {
    eventOrId.stopPropagation();
  }

  const p = PRODUCTOS_DETALLE[detalleId];
  if (!p) return;
  const yaExiste = STATE.results.find(r => r.id === detalleId);
  if (!yaExiste) STATE.results.push({
    id: detalleId,
    titulo: p.nombre,
    precio: p.precio,
    precioNum: p.precioNum
  });
  abrirAlertaModal(detalleId);
}

/* ─────────────────────────────────────────────────────────────
   21. TOAST
───────────────────────────────────────────────────────────── */
function mostrarToast(msg) {
  document.getElementById('psToast')?.remove();
  const t = document.createElement('div');
  t.id = 'psToast';
  t.className = 'ps-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('is-visible'));
  setTimeout(() => { t.classList.remove('is-visible'); setTimeout(() => t.remove(), 300); }, 3000);
}


/* ─────────────────────────────────────────────────────────────
   22. DROPDOWN DE CATEGORÍAS
───────────────────────────────────────────────────────────── */
function toggleCat() {
  const open = DOM.catDropdown.classList.toggle('is-open');
  DOM.catBtn.setAttribute('aria-expanded', open);
  DOM.catArrow.style.transform = open ? 'rotate(180deg)' : 'rotate(0)';
}

function selectCat(nombre, el) {
  STATE.categoria = nombre;
  DOM.catLabel.textContent = nombre;
  document.querySelectorAll('.cat-option').forEach(o => o.classList.remove('cat-option--active'));
  el.classList.add('cat-option--active');
  DOM.catDropdown.classList.remove('is-open');
  DOM.catBtn.setAttribute('aria-expanded', 'false');
  DOM.catArrow.style.transform = 'rotate(0)';
  buscar(STATE.query, true);
  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('click', function (e) {
  if (!DOM.catBtn?.closest('.cat-selector')?.contains(e.target)) {
    DOM.catDropdown?.classList.remove('is-open');
    DOM.catBtn?.setAttribute('aria-expanded', 'false');
    if (DOM.catArrow) DOM.catArrow.style.transform = 'rotate(0)';
  }
});


/* ─────────────────────────────────────────────────────────────
   23. EVENTOS
───────────────────────────────────────────────────────────── */
DOM.searchBtn?.addEventListener('click', () => {
  buscar(DOM.searchInput?.value || '', true);
  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

DOM.searchInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    buscar(DOM.searchInput.value, true);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

DOM.loadMoreBtn?.addEventListener('click', mostrarSiguientePagina);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('modalHistorial')?.remove();
    document.getElementById('modalAlerta')?.remove();
    document.body.style.overflow = '';
  }
});

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.remove();
    document.body.style.overflow = '';
  }
});


/* ─────────────────────────────────────────────────────────────
   24. INICIO
───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  cargarVitrina();
});

// ═══════════════════════════════════
// DATOS PRODUCTOS (detalle-producto)
// ═══════════════════════════════════

const VITRINA_TO_DETALLE = {
  'demo-tv-1':  'demo-tv-1',
  'demo-tv-2':  'demo-tv-2',
  'demo-tv-3':  'demo-tv-3',
  'demo-tv-4':  'demo-tv-4',
  'demo-hw-1':  'demo-hw-1',
  'demo-hw-2':  'demo-hw-2',
  'demo-hw-3':  'demo-hw-3',
  'demo-hw-4':  'demo-hw-4',
  'demo-cel-1': 'demo-cel-1',
  'demo-cel-2': 'demo-cel-2',
  'demo-cel-3': 'demo-cel-3',
  'demo-cel-4': 'demo-cel-4',
};

const PRODUCTOS_DETALLE = {
  'demo-tv-1': {
    nombre: 'Samsung Smart TV 55" QLED 4K QN55Q70C',
    categoria: 'Samsung · Televisores',
    imagen: 'https://images.samsung.com/is/image/samsung/p6pim/levant/qn55q70cafxza/gallery/levant-qled-q70c-qn55q70cafxza-536919466?$650_519_PNG$',
    precio: 'S/ 2,149',
    precioNum: 2149,
    precioOld: 'S/ 2,619',
    descuento: '-18%',
    mejorTienda: 'Mercado Libre',
    specs: [
      { label: 'Pantalla', valor: '55" QLED 4K' },
      { label: 'Procesador', valor: 'Quantum 4K' },
      { label: 'Refresh', valor: '60 Hz' },
      { label: 'Smart TV', valor: 'Tizen OS' },
    ],
    tiendas: [
      { nombre: 'Mercado Libre', precio: 'S/ 2,149', mejor: true },
      { nombre: 'eBay', precio: 'S/ 2,299', mejor: false },
      { nombre: 'Amazon', precio: 'S/ 2,389', mejor: false },
    ],
    historial: [
      {f:'2025-01-01',p:2619},{f:'2025-01-05',p:2580},{f:'2025-01-10',p:2550},
      {f:'2025-01-15',p:2499},{f:'2025-01-20',p:2520},{f:'2025-01-25',p:2480},
      {f:'2025-02-01',p:2450},{f:'2025-02-05',p:2399},{f:'2025-02-10',p:2420},
      {f:'2025-02-15',p:2380},{f:'2025-02-20',p:2350},{f:'2025-02-25',p:2299},
      {f:'2025-03-01',p:2320},{f:'2025-03-05',p:2299},{f:'2025-03-10',p:2350},
      {f:'2025-03-15',p:2299},{f:'2025-03-20',p:2250},{f:'2025-03-25',p:2299},
      {f:'2025-04-01',p:2250},{f:'2025-04-05',p:2199},{f:'2025-04-10',p:2230},
      {f:'2025-04-15',p:2199},{f:'2025-04-20',p:2170},{f:'2025-04-25',p:2149},
      {f:'2025-05-01',p:2199},{f:'2025-05-05',p:2170},{f:'2025-05-10',p:2149},
      {f:'2025-05-15',p:2199},{f:'2025-05-20',p:2149},{f:'2025-05-25',p:2149},
    ]
,
    historial: [
      {f:'2025-01-01',p:5499},{f:'2025-01-05',p:5399},{f:'2025-01-10',p:5299},
      {f:'2025-01-15',p:5199},{f:'2025-01-20',p:5099},{f:'2025-01-25',p:4999},
      {f:'2025-02-01',p:5099},{f:'2025-02-05',p:4999},{f:'2025-02-10',p:4950},
      {f:'2025-02-15',p:4899},{f:'2025-02-20',p:4950},{f:'2025-02-25',p:4899},
      {f:'2025-03-01',p:4950},{f:'2025-03-05',p:4899},{f:'2025-03-10',p:4950},
      {f:'2025-03-15',p:4899},{f:'2025-03-20',p:4850},{f:'2025-03-25',p:4899},
      {f:'2025-04-01',p:4850},{f:'2025-04-05',p:4899},{f:'2025-04-10',p:4850},
      {f:'2025-04-15',p:4899},{f:'2025-04-20',p:4850},{f:'2025-04-25',p:4899},
      {f:'2025-05-01',p:4850},{f:'2025-05-05',p:4899},{f:'2025-05-10',p:4850},
      {f:'2025-05-15',p:4899},{f:'2025-05-20',p:4850},{f:'2025-05-25',p:4899},
    ]
,
    historial: [
      {f:'2025-01-01',p:1879},{f:'2025-01-05',p:1799},{f:'2025-01-10',p:1749},
      {f:'2025-01-15',p:1699},{f:'2025-01-20',p:1649},{f:'2025-01-25',p:1599},
      {f:'2025-02-01',p:1549},{f:'2025-02-05',p:1499},{f:'2025-02-10',p:1549},
      {f:'2025-02-15',p:1499},{f:'2025-02-20',p:1450},{f:'2025-02-25',p:1399},
      {f:'2025-03-01',p:1450},{f:'2025-03-05',p:1399},{f:'2025-03-10',p:1450},
      {f:'2025-03-15',p:1399},{f:'2025-03-20',p:1350},{f:'2025-03-25',p:1399},
      {f:'2025-04-01',p:1350},{f:'2025-04-05',p:1299},{f:'2025-04-10',p:1350},
      {f:'2025-04-15',p:1299},{f:'2025-04-20',p:1350},{f:'2025-04-25',p:1299},
      {f:'2025-05-01',p:1350},{f:'2025-05-05',p:1299},{f:'2025-05-10',p:1350},
      {f:'2025-05-15',p:1299},{f:'2025-05-20',p:1350},{f:'2025-05-25',p:1299},
    ]
,
    historial: [
      {f:'2025-01-01',p:7200},{f:'2025-01-05',p:7099},{f:'2025-01-10',p:6999},
      {f:'2025-01-15',p:6899},{f:'2025-01-20',p:6799},{f:'2025-01-25',p:6699},
      {f:'2025-02-01',p:6599},{f:'2025-02-05',p:6699},{f:'2025-02-10',p:6599},
      {f:'2025-02-15',p:6499},{f:'2025-02-20',p:6599},{f:'2025-02-25',p:6499},
      {f:'2025-03-01',p:6399},{f:'2025-03-05',p:6499},{f:'2025-03-10',p:6399},
      {f:'2025-03-15',p:6299},{f:'2025-03-20',p:6399},{f:'2025-03-25',p:6299},
      {f:'2025-04-01',p:6350},{f:'2025-04-05',p:6299},{f:'2025-04-10',p:6350},
      {f:'2025-04-15',p:6299},{f:'2025-04-20',p:6250},{f:'2025-04-25',p:6299},
      {f:'2025-05-01',p:6250},{f:'2025-05-05',p:6299},{f:'2025-05-10',p:6250},
      {f:'2025-05-15',p:6299},{f:'2025-05-20',p:6250},{f:'2025-05-25',p:6250},
    ]
,
    historial: [
      {f:'2025-01-01',p:3270},{f:'2025-01-05',p:3199},{f:'2025-01-10',p:3150},
      {f:'2025-01-15',p:3099},{f:'2025-01-20',p:3050},{f:'2025-01-25',p:2999},
      {f:'2025-02-01',p:3050},{f:'2025-02-05',p:2999},{f:'2025-02-10',p:2950},
      {f:'2025-02-15',p:2999},{f:'2025-02-20',p:2950},{f:'2025-02-25',p:2920},
      {f:'2025-03-01',p:2950},{f:'2025-03-05',p:2920},{f:'2025-03-10',p:2950},
      {f:'2025-03-15',p:2920},{f:'2025-03-20',p:2899},{f:'2025-03-25',p:2920},
      {f:'2025-04-01',p:2899},{f:'2025-04-05',p:2920},{f:'2025-04-10',p:2899},
      {f:'2025-04-15',p:2880},{f:'2025-04-20',p:2899},{f:'2025-04-25',p:2880},
      {f:'2025-05-01',p:2899},{f:'2025-05-05',p:2880},{f:'2025-05-10',p:2899},
      {f:'2025-05-15',p:2880},{f:'2025-05-20',p:2899},{f:'2025-05-25',p:2880},
    ]
,
    historial: [
      {f:'2025-01-01',p:2699},{f:'2025-01-05',p:2599},{f:'2025-01-10',p:2549},
      {f:'2025-01-15',p:2499},{f:'2025-01-20',p:2450},{f:'2025-01-25',p:2399},
      {f:'2025-02-01',p:2350},{f:'2025-02-05',p:2399},{f:'2025-02-10',p:2350},
      {f:'2025-02-15',p:2299},{f:'2025-02-20',p:2350},{f:'2025-02-25',p:2299},
      {f:'2025-03-01',p:2250},{f:'2025-03-05',p:2299},{f:'2025-03-10',p:2250},
      {f:'2025-03-15',p:2299},{f:'2025-03-20',p:2250},{f:'2025-03-25',p:2230},
      {f:'2025-04-01',p:2250},{f:'2025-04-05',p:2230},{f:'2025-04-10',p:2199},
      {f:'2025-04-15',p:2230},{f:'2025-04-20',p:2199},{f:'2025-04-25',p:2230},
      {f:'2025-05-01',p:2199},{f:'2025-05-05',p:2230},{f:'2025-05-10',p:2199},
      {f:'2025-05-15',p:2230},{f:'2025-05-20',p:2199},{f:'2025-05-25',p:2199},
    ]
,
    historial: [
      {f:'2025-01-01',p:499},{f:'2025-01-05',p:479},{f:'2025-01-10',p:469},
      {f:'2025-01-15',p:459},{f:'2025-01-20',p:449},{f:'2025-01-25',p:459},
      {f:'2025-02-01',p:449},{f:'2025-02-05',p:439},{f:'2025-02-10',p:449},
      {f:'2025-02-15',p:439},{f:'2025-02-20',p:429},{f:'2025-02-25',p:439},
      {f:'2025-03-01',p:429},{f:'2025-03-05',p:419},{f:'2025-03-10',p:429},
      {f:'2025-03-15',p:419},{f:'2025-03-20',p:409},{f:'2025-03-25',p:419},
      {f:'2025-04-01',p:409},{f:'2025-04-05',p:399},{f:'2025-04-10',p:409},
      {f:'2025-04-15',p:399},{f:'2025-04-20',p:409},{f:'2025-04-25',p:399},
      {f:'2025-05-01',p:409},{f:'2025-05-05',p:399},{f:'2025-05-10',p:389},
      {f:'2025-05-15',p:399},{f:'2025-05-20',p:389},{f:'2025-05-25',p:389},
    ]
,
    historial: [
      {f:'2025-01-01',p:699},{f:'2025-01-05',p:679},{f:'2025-01-10',p:659},
      {f:'2025-01-15',p:639},{f:'2025-01-20',p:619},{f:'2025-01-25',p:609},
      {f:'2025-02-01',p:599},{f:'2025-02-05',p:609},{f:'2025-02-10',p:599},
      {f:'2025-02-15',p:589},{f:'2025-02-20',p:599},{f:'2025-02-25',p:589},
      {f:'2025-03-01',p:579},{f:'2025-03-05',p:589},{f:'2025-03-10',p:579},
      {f:'2025-03-15',p:569},{f:'2025-03-20',p:579},{f:'2025-03-25',p:569},
      {f:'2025-04-01',p:559},{f:'2025-04-05',p:569},{f:'2025-04-10',p:559},
      {f:'2025-04-15',p:549},{f:'2025-04-20',p:559},{f:'2025-04-25',p:549},
      {f:'2025-05-01',p:559},{f:'2025-05-05',p:549},{f:'2025-05-10',p:559},
      {f:'2025-05-15',p:549},{f:'2025-05-20',p:559},{f:'2025-05-25',p:549},
    ]
,
    historial: [
      {f:'2025-01-01',p:7299},{f:'2025-01-05',p:7199},{f:'2025-01-10',p:7099},
      {f:'2025-01-15',p:6999},{f:'2025-01-20',p:6899},{f:'2025-01-25',p:6799},
      {f:'2025-02-01',p:6899},{f:'2025-02-05',p:6799},{f:'2025-02-10',p:6699},
      {f:'2025-02-15',p:6799},{f:'2025-02-20',p:6699},{f:'2025-02-25',p:6599},
      {f:'2025-03-01',p:6699},{f:'2025-03-05',p:6599},{f:'2025-03-10',p:6699},
      {f:'2025-03-15',p:6599},{f:'2025-03-20',p:6499},{f:'2025-03-25',p:6599},
      {f:'2025-04-01',p:6499},{f:'2025-04-05',p:6599},{f:'2025-04-10',p:6499},
      {f:'2025-04-15',p:6599},{f:'2025-04-20',p:6499},{f:'2025-04-25',p:6599},
      {f:'2025-05-01',p:6499},{f:'2025-05-05',p:6599},{f:'2025-05-10',p:6499},
      {f:'2025-05-15',p:6599},{f:'2025-05-20',p:6499},{f:'2025-05-25',p:6499},
    ]
,
    historial: [
      {f:'2025-01-01',p:5750},{f:'2025-01-05',p:5650},{f:'2025-01-10',p:5550},
      {f:'2025-01-15',p:5450},{f:'2025-01-20',p:5350},{f:'2025-01-25',p:5250},
      {f:'2025-02-01',p:5150},{f:'2025-02-05',p:5099},{f:'2025-02-10',p:5050},
      {f:'2025-02-15',p:4999},{f:'2025-02-20',p:5050},{f:'2025-02-25',p:4999},
      {f:'2025-03-01',p:4950},{f:'2025-03-05',p:4999},{f:'2025-03-10',p:4950},
      {f:'2025-03-15',p:4920},{f:'2025-03-20',p:4950},{f:'2025-03-25',p:4920},
      {f:'2025-04-01',p:4899},{f:'2025-04-05',p:4920},{f:'2025-04-10',p:4899},
      {f:'2025-04-15',p:4890},{f:'2025-04-20',p:4899},{f:'2025-04-25',p:4890},
      {f:'2025-05-01',p:4899},{f:'2025-05-05',p:4890},{f:'2025-05-10',p:4899},
      {f:'2025-05-15',p:4890},{f:'2025-05-20',p:4899},{f:'2025-05-25',p:4890},
    ]
,
    historial: [
      {f:'2025-01-01',p:4299},{f:'2025-01-05',p:4199},{f:'2025-01-10',p:4099},
      {f:'2025-01-15',p:3999},{f:'2025-01-20',p:3899},{f:'2025-01-25',p:3850},
      {f:'2025-02-01',p:3799},{f:'2025-02-05',p:3850},{f:'2025-02-10',p:3799},
      {f:'2025-02-15',p:3850},{f:'2025-02-20',p:3799},{f:'2025-02-25',p:3780},
      {f:'2025-03-01',p:3799},{f:'2025-03-05',p:3780},{f:'2025-03-10',p:3799},
      {f:'2025-03-15',p:3780},{f:'2025-03-20',p:3799},{f:'2025-03-25',p:3780},
      {f:'2025-04-01',p:3799},{f:'2025-04-05',p:3780},{f:'2025-04-10',p:3799},
      {f:'2025-04-15',p:3780},{f:'2025-04-20',p:3799},{f:'2025-04-25',p:3780},
      {f:'2025-05-01',p:3799},{f:'2025-05-05',p:3780},{f:'2025-05-10',p:3799},
      {f:'2025-05-15',p:3780},{f:'2025-05-20',p:3799},{f:'2025-05-25',p:3780},
    ]
,
    historial: [
      {f:'2025-01-01',p:3999},{f:'2025-01-05',p:3899},{f:'2025-01-10',p:3799},
      {f:'2025-01-15',p:3699},{f:'2025-01-20',p:3599},{f:'2025-01-25',p:3499},
      {f:'2025-02-01',p:3399},{f:'2025-02-05',p:3450},{f:'2025-02-10',p:3399},
      {f:'2025-02-15',p:3350},{f:'2025-02-20',p:3399},{f:'2025-02-25',p:3350},
      {f:'2025-03-01',p:3299},{f:'2025-03-05',p:3350},{f:'2025-03-10',p:3299},
      {f:'2025-03-15',p:3350},{f:'2025-03-20',p:3299},{f:'2025-03-25',p:3250},
      {f:'2025-04-01',p:3299},{f:'2025-04-05',p:3250},{f:'2025-04-10',p:3299},
      {f:'2025-04-15',p:3250},{f:'2025-04-20',p:3199},{f:'2025-04-25',p:3250},
      {f:'2025-05-01',p:3199},{f:'2025-05-05',p:3250},{f:'2025-05-10',p:3199},
      {f:'2025-05-15',p:3250},{f:'2025-05-20',p:3199},{f:'2025-05-25',p:3199},
    ]
,
    historial: [
      {f:'2025-01-01',p:4899},{f:'2025-01-05',p:4799},{f:'2025-01-10',p:4750},
      {f:'2025-01-15',p:4699},{f:'2025-01-20',p:4650},{f:'2025-01-25',p:4599},
      {f:'2025-02-01',p:4550},{f:'2025-02-05',p:4499},{f:'2025-02-10',p:4550},
      {f:'2025-02-15',p:4499},{f:'2025-02-20',p:4450},{f:'2025-02-25',p:4399},
      {f:'2025-03-01',p:4450},{f:'2025-03-05',p:4399},{f:'2025-03-10',p:4450},
      {f:'2025-03-15',p:4399},{f:'2025-03-20',p:4350},{f:'2025-03-25',p:4399},
      {f:'2025-04-01',p:4350},{f:'2025-04-05',p:4299},{f:'2025-04-10',p:4350},
      {f:'2025-04-15',p:4299},{f:'2025-04-20',p:4350},{f:'2025-04-25',p:4299},
      {f:'2025-05-01',p:4350},{f:'2025-05-05',p:4299},{f:'2025-05-10',p:4350},
      {f:'2025-05-15',p:4299},{f:'2025-05-20',p:4350},{f:'2025-05-25',p:4299},
    ]
,
    historial: [
      {f:'2025-01-01',p:4299},{f:'2025-01-05',p:4199},{f:'2025-01-10',p:4150},
      {f:'2025-01-15',p:4099},{f:'2025-01-20',p:4050},{f:'2025-01-25',p:3999},
      {f:'2025-02-01',p:4050},{f:'2025-02-05',p:3999},{f:'2025-02-10',p:3950},
      {f:'2025-02-15',p:3999},{f:'2025-02-20',p:3950},{f:'2025-02-25',p:3920},
      {f:'2025-03-01',p:3950},{f:'2025-03-05',p:3920},{f:'2025-03-10',p:3899},
      {f:'2025-03-15',p:3920},{f:'2025-03-20',p:3899},{f:'2025-03-25',p:3920},
      {f:'2025-04-01',p:3899},{f:'2025-04-05',p:3920},{f:'2025-04-10',p:3899},
      {f:'2025-04-15',p:3920},{f:'2025-04-20',p:3899},{f:'2025-04-25',p:3920},
      {f:'2025-05-01',p:3899},{f:'2025-05-05',p:3920},{f:'2025-05-10',p:3899},
      {f:'2025-05-15',p:3920},{f:'2025-05-20',p:3899},{f:'2025-05-25',p:3899},
    ]
,
    historial: [
      {f:'2025-01-01',p:6499},{f:'2025-01-05',p:6299},{f:'2025-01-10',p:6099},
      {f:'2025-01-15',p:5999},{f:'2025-01-20',p:5899},{f:'2025-01-25',p:5799},
      {f:'2025-02-01',p:5699},{f:'2025-02-05',p:5799},{f:'2025-02-10',p:5699},
      {f:'2025-02-15',p:5599},{f:'2025-02-20',p:5699},{f:'2025-02-25',p:5599},
      {f:'2025-03-01',p:5499},{f:'2025-03-05',p:5599},{f:'2025-03-10',p:5499},
      {f:'2025-03-15',p:5399},{f:'2025-03-20',p:5499},{f:'2025-03-25',p:5399},
      {f:'2025-04-01',p:5299},{f:'2025-04-05',p:5399},{f:'2025-04-10',p:5299},
      {f:'2025-04-15',p:5399},{f:'2025-04-20',p:5299},{f:'2025-04-25',p:5399},
      {f:'2025-05-01',p:5299},{f:'2025-05-05',p:5399},{f:'2025-05-10',p:5299},
      {f:'2025-05-15',p:5399},{f:'2025-05-20',p:5299},{f:'2025-05-25',p:5299},
    ]
,
    historial: [
      {f:'2025-01-01',p:8999},{f:'2025-01-05',p:8799},{f:'2025-01-10',p:8599},
      {f:'2025-01-15',p:8399},{f:'2025-01-20',p:8299},{f:'2025-01-25',p:8199},
      {f:'2025-02-01',p:8099},{f:'2025-02-05',p:8199},{f:'2025-02-10',p:8099},
      {f:'2025-02-15',p:7999},{f:'2025-02-20',p:8099},{f:'2025-02-25',p:7999},
      {f:'2025-03-01',p:7899},{f:'2025-03-05',p:7999},{f:'2025-03-10',p:7899},
      {f:'2025-03-15',p:7999},{f:'2025-03-20',p:7899},{f:'2025-03-25',p:7999},
      {f:'2025-04-01',p:7899},{f:'2025-04-05',p:7999},{f:'2025-04-10',p:7899},
      {f:'2025-04-15',p:7999},{f:'2025-04-20',p:7899},{f:'2025-04-25',p:7999},
      {f:'2025-05-01',p:7899},{f:'2025-05-05',p:7999},{f:'2025-05-10',p:7899},
      {f:'2025-05-15',p:7999},{f:'2025-05-20',p:7899},{f:'2025-05-25',p:7899},
    ]
,
    historial: [
      {f:'2025-01-01',p:3200},{f:'2025-01-05',p:3150},{f:'2025-01-10',p:3099},
      {f:'2025-01-15',p:3050},{f:'2025-01-20',p:2999},{f:'2025-01-25',p:3050},
      {f:'2025-02-01',p:2999},{f:'2025-02-05',p:2950},{f:'2025-02-10',p:2980},
      {f:'2025-02-15',p:2950},{f:'2025-02-20',p:2920},{f:'2025-02-25',p:2950},
      {f:'2025-03-01',p:2920},{f:'2025-03-05',p:2899},{f:'2025-03-10',p:2920},
      {f:'2025-03-15',p:2899},{f:'2025-03-20',p:2880},{f:'2025-03-25',p:2899},
      {f:'2025-04-01',p:2880},{f:'2025-04-05',p:2899},{f:'2025-04-10',p:2880},
      {f:'2025-04-15',p:2899},{f:'2025-04-20',p:2880},{f:'2025-04-25',p:2899},
      {f:'2025-05-01',p:2880},{f:'2025-05-05',p:2899},{f:'2025-05-10',p:2880},
      {f:'2025-05-15',p:2899},{f:'2025-05-20',p:2880},{f:'2025-05-25',p:2880},
    ]
,
    historial: [
      {f:'2025-01-01',p:2499},{f:'2025-01-05',p:2450},{f:'2025-01-10',p:2399},
      {f:'2025-01-15',p:2450},{f:'2025-01-20',p:2399},{f:'2025-01-25',p:2350},
      {f:'2025-02-01',p:2399},{f:'2025-02-05',p:2350},{f:'2025-02-10',p:2299},
      {f:'2025-02-15',p:2350},{f:'2025-02-20',p:2299},{f:'2025-02-25',p:2250},
      {f:'2025-03-01',p:2299},{f:'2025-03-05',p:2250},{f:'2025-03-10',p:2299},
      {f:'2025-03-15',p:2250},{f:'2025-03-20',p:2199},{f:'2025-03-25',p:2250},
      {f:'2025-04-01',p:2199},{f:'2025-04-05',p:2250},{f:'2025-04-10',p:2199},
      {f:'2025-04-15',p:2149},{f:'2025-04-20',p:2199},{f:'2025-04-25',p:2149},
      {f:'2025-05-01',p:2199},{f:'2025-05-05',p:2149},{f:'2025-05-10',p:2199},
      {f:'2025-05-15',p:2149},{f:'2025-05-20',p:2199},{f:'2025-05-25',p:2149},
    ]
  },
  'demo-tv-2': {
    nombre: 'LG Smart TV 65" OLED evo C3 4K',
    categoria: 'LG · Televisores',
    imagen: 'https://www.lg.com/us/images/tvs/md08003672/gallery/medium01.jpg',
    precio: 'S/ 4,899',
    precioNum: 4899,
    precioOld: null,
    descuento: null,
    mejorTienda: 'Mercado Libre',
    specs: [
      { label: 'Pantalla', valor: '65" OLED evo 4K' },
      { label: 'Procesador', valor: 'α9 Gen6 AI' },
      { label: 'Refresh', valor: '120 Hz' },
      { label: 'Smart TV', valor: 'webOS 23' },
    ],
    tiendas: [
      { nombre: 'Mercado Libre', precio: 'S/ 4,899', mejor: true },
      { nombre: 'Amazon', precio: 'S/ 5,199', mejor: false },
    ]
,
    historial: [
      {f:'2025-01-01',p:5499},{f:'2025-01-05',p:5399},{f:'2025-01-10',p:5299},
      {f:'2025-01-15',p:5199},{f:'2025-01-20',p:5099},{f:'2025-01-25',p:4999},
      {f:'2025-02-01',p:5099},{f:'2025-02-05',p:4999},{f:'2025-02-10',p:4950},
      {f:'2025-02-15',p:4899},{f:'2025-02-20',p:4950},{f:'2025-02-25',p:4899},
      {f:'2025-03-01',p:4950},{f:'2025-03-05',p:4899},{f:'2025-03-10',p:4950},
      {f:'2025-03-15',p:4899},{f:'2025-03-20',p:4850},{f:'2025-03-25',p:4899},
      {f:'2025-04-01',p:4850},{f:'2025-04-05',p:4899},{f:'2025-04-10',p:4850},
      {f:'2025-04-15',p:4899},{f:'2025-04-20',p:4850},{f:'2025-04-25',p:4899},
      {f:'2025-05-01',p:4850},{f:'2025-05-05',p:4899},{f:'2025-05-10',p:4850},
      {f:'2025-05-15',p:4899},{f:'2025-05-20',p:4850},{f:'2025-05-25',p:4899},
    ]
  },
  'demo-tv-3': {
    nombre: 'TCL Smart TV 50" QLED 4K Google TV S546G',
    categoria: 'TCL · Televisores',
    imagen: 'https://www.tcl.com/content/dam/tcl/product-images/tv/s5-qled/50/tcl-50s546-front.png',
    precio: 'S/ 1,299',
    precioNum: 1299,
    precioOld: 'S/ 1,879',
    descuento: '-31%',
    mejorTienda: 'eBay',
    specs: [
      { label: 'Pantalla', valor: '50" QLED 4K' },
      { label: 'Procesador', valor: 'AiPQ 3.0' },
      { label: 'Refresh', valor: '60 Hz' },
      { label: 'Smart TV', valor: 'Google TV' },
    ],
    tiendas: [
      { nombre: 'eBay', precio: 'S/ 1,299', mejor: true },
      { nombre: 'Amazon', precio: 'S/ 1,499', mejor: false },
    ]
,
    historial: [
      {f:'2025-01-01',p:1879},{f:'2025-01-05',p:1799},{f:'2025-01-10',p:1749},
      {f:'2025-01-15',p:1699},{f:'2025-01-20',p:1649},{f:'2025-01-25',p:1599},
      {f:'2025-02-01',p:1549},{f:'2025-02-05',p:1499},{f:'2025-02-10',p:1549},
      {f:'2025-02-15',p:1499},{f:'2025-02-20',p:1450},{f:'2025-02-25',p:1399},
      {f:'2025-03-01',p:1450},{f:'2025-03-05',p:1399},{f:'2025-03-10',p:1450},
      {f:'2025-03-15',p:1399},{f:'2025-03-20',p:1350},{f:'2025-03-25',p:1399},
      {f:'2025-04-01',p:1350},{f:'2025-04-05',p:1299},{f:'2025-04-10',p:1350},
      {f:'2025-04-15',p:1299},{f:'2025-04-20',p:1350},{f:'2025-04-25',p:1299},
      {f:'2025-05-01',p:1350},{f:'2025-05-05',p:1299},{f:'2025-05-10',p:1350},
      {f:'2025-05-15',p:1299},{f:'2025-05-20',p:1350},{f:'2025-05-25',p:1299},
    ]
  },
  'demo-tv-4': {
    nombre: 'Sony Bravia XR 75" Mini LED 4K X90L',
    categoria: 'Sony · Televisores',
    imagen: 'https://www.sony.com/image/5d02da5df552836db894cead8a68f5f3?fmt=png-alpha&wid=440',
    precio: 'S/ 6,250',
    precioNum: 6250,
    precioOld: null,
    descuento: null,
    mejorTienda: 'Amazon',
    specs: [
      { label: 'Pantalla', valor: '75" Mini LED 4K' },
      { label: 'Procesador', valor: 'Cognitive XR' },
      { label: 'Refresh', valor: '120 Hz' },
      { label: 'Smart TV', valor: 'Google TV' },
    ],
    tiendas: [
      { nombre: 'Amazon', precio: 'S/ 6,250', mejor: true },
      { nombre: 'eBay', precio: 'S/ 6,599', mejor: false },
    ]
,
    historial: [
      {f:'2025-01-01',p:7200},{f:'2025-01-05',p:7099},{f:'2025-01-10',p:6999},
      {f:'2025-01-15',p:6899},{f:'2025-01-20',p:6799},{f:'2025-01-25',p:6699},
      {f:'2025-02-01',p:6599},{f:'2025-02-05',p:6699},{f:'2025-02-10',p:6599},
      {f:'2025-02-15',p:6499},{f:'2025-02-20',p:6599},{f:'2025-02-25',p:6499},
      {f:'2025-03-01',p:6399},{f:'2025-03-05',p:6499},{f:'2025-03-10',p:6399},
      {f:'2025-03-15',p:6299},{f:'2025-03-20',p:6399},{f:'2025-03-25',p:6299},
      {f:'2025-04-01',p:6350},{f:'2025-04-05',p:6299},{f:'2025-04-10',p:6350},
      {f:'2025-04-15',p:6299},{f:'2025-04-20',p:6250},{f:'2025-04-25',p:6299},
      {f:'2025-05-01',p:6250},{f:'2025-05-05',p:6299},{f:'2025-05-10',p:6250},
      {f:'2025-05-15',p:6299},{f:'2025-05-20',p:6250},{f:'2025-05-25',p:6250},
    ]
  },
  'demo-hw-1': {
    nombre: 'NVIDIA GeForce RTX 4070 Super 12GB GDDR6X',
    categoria: 'NVIDIA · Hardware PC',
    imagen: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4070-super/geforce-ada-4070-super-shop-630-d@2x.jpg',
    precio: 'S/ 2,880',
    precioNum: 2880,
    precioOld: 'S/ 3,270',
    descuento: '-12%',
    mejorTienda: 'Mercado Libre',
    specs: [
      { label: 'VRAM', valor: '12GB GDDR6X' },
      { label: 'Arquitectura', valor: 'Ada Lovelace' },
      { label: 'CUDA Cores', valor: '7168' },
      { label: 'TDP', valor: '220W' },
    ],
    tiendas: [
      { nombre: 'Mercado Libre', precio: 'S/ 2,880', mejor: true },
      { nombre: 'eBay', precio: 'S/ 2,990', mejor: false },
      { nombre: 'Amazon', precio: 'S/ 3,100', mejor: false },
    ]
,
    historial: [
      {f:'2025-01-01',p:3270},{f:'2025-01-05',p:3199},{f:'2025-01-10',p:3150},
      {f:'2025-01-15',p:3099},{f:'2025-01-20',p:3050},{f:'2025-01-25',p:2999},
      {f:'2025-02-01',p:3050},{f:'2025-02-05',p:2999},{f:'2025-02-10',p:2950},
      {f:'2025-02-15',p:2999},{f:'2025-02-20',p:2950},{f:'2025-02-25',p:2920},
      {f:'2025-03-01',p:2950},{f:'2025-03-05',p:2920},{f:'2025-03-10',p:2950},
      {f:'2025-03-15',p:2920},{f:'2025-03-20',p:2899},{f:'2025-03-25',p:2920},
      {f:'2025-04-01',p:2899},{f:'2025-04-05',p:2920},{f:'2025-04-10',p:2899},
      {f:'2025-04-15',p:2880},{f:'2025-04-20',p:2899},{f:'2025-04-25',p:2880},
      {f:'2025-05-01',p:2899},{f:'2025-05-05',p:2880},{f:'2025-05-10',p:2899},
      {f:'2025-05-15',p:2880},{f:'2025-05-20',p:2899},{f:'2025-05-25',p:2880},
    ]
  },
  'demo-hw-2': {
    nombre: 'AMD Ryzen 9 7950X 16-Core AM5 5.7GHz',
    categoria: 'AMD · Hardware PC',
    imagen: 'https://www.amd.com/system/files/2022-08/ryzen-9-7950x-pib-left-facing.png',
    precio: 'S/ 2,199',
    precioNum: 2199,
    precioOld: null,
    descuento: null,
    mejorTienda: 'Mercado Libre',
    specs: [
      { label: 'Núcleos', valor: '16C / 32T' },
      { label: 'Boost', valor: '5.7 GHz' },
      { label: 'Socket', valor: 'AM5' },
      { label: 'TDP', valor: '170W' },
    ],
    tiendas: [
      { nombre: 'Mercado Libre', precio: 'S/ 2,199', mejor: true },
      { nombre: 'Amazon', precio: 'S/ 2,350', mejor: false },
    ]
,
    historial: [
      {f:'2025-01-01',p:2699},{f:'2025-01-05',p:2599},{f:'2025-01-10',p:2549},
      {f:'2025-01-15',p:2499},{f:'2025-01-20',p:2450},{f:'2025-01-25',p:2399},
      {f:'2025-02-01',p:2350},{f:'2025-02-05',p:2399},{f:'2025-02-10',p:2350},
      {f:'2025-02-15',p:2299},{f:'2025-02-20',p:2350},{f:'2025-02-25',p:2299},
      {f:'2025-03-01',p:2250},{f:'2025-03-05',p:2299},{f:'2025-03-10',p:2250},
      {f:'2025-03-15',p:2299},{f:'2025-03-20',p:2250},{f:'2025-03-25',p:2230},
      {f:'2025-04-01',p:2250},{f:'2025-04-05',p:2230},{f:'2025-04-10',p:2199},
      {f:'2025-04-15',p:2230},{f:'2025-04-20',p:2199},{f:'2025-04-25',p:2230},
      {f:'2025-05-01',p:2199},{f:'2025-05-05',p:2230},{f:'2025-05-10',p:2199},
      {f:'2025-05-15',p:2230},{f:'2025-05-20',p:2199},{f:'2025-05-25',p:2199},
    ]
  },
  'demo-hw-3': {
    nombre: 'Kingston FURY Beast DDR5 32GB 6000MHz CL36',
    categoria: 'Kingston · Hardware PC',
    imagen: '',
    precio: 'S/ 389',
    precioNum: 389,
    precioOld: 'S/ 499',
    descuento: '-22%',
    mejorTienda: 'eBay',
    specs: [
      { label: 'Capacidad', valor: '32GB (2x16GB)' },
      { label: 'Velocidad', valor: '6000 MHz' },
      { label: 'Latencia', valor: 'CL36' },
      { label: 'Tipo', valor: 'DDR5' },
    ],
    tiendas: [
      { nombre: 'eBay', precio: 'S/ 389', mejor: true },
      { nombre: 'Amazon', precio: 'S/ 429', mejor: false },
    ]
,
    historial: [
      {f:'2025-01-01',p:499},{f:'2025-01-05',p:479},{f:'2025-01-10',p:469},
      {f:'2025-01-15',p:459},{f:'2025-01-20',p:449},{f:'2025-01-25',p:459},
      {f:'2025-02-01',p:449},{f:'2025-02-05',p:439},{f:'2025-02-10',p:449},
      {f:'2025-02-15',p:439},{f:'2025-02-20',p:429},{f:'2025-02-25',p:439},
      {f:'2025-03-01',p:429},{f:'2025-03-05',p:419},{f:'2025-03-10',p:429},
      {f:'2025-03-15',p:419},{f:'2025-03-20',p:409},{f:'2025-03-25',p:419},
      {f:'2025-04-01',p:409},{f:'2025-04-05',p:399},{f:'2025-04-10',p:409},
      {f:'2025-04-15',p:399},{f:'2025-04-20',p:409},{f:'2025-04-25',p:399},
      {f:'2025-05-01',p:409},{f:'2025-05-05',p:399},{f:'2025-05-10',p:389},
      {f:'2025-05-15',p:399},{f:'2025-05-20',p:389},{f:'2025-05-25',p:389},
    ]
  },
  'demo-hw-4': {
    nombre: 'Samsung 990 Pro NVMe M.2 SSD 2TB PCIe 4.0',
    categoria: 'Samsung · Hardware PC',
    imagen: 'https://images.samsung.com/is/image/samsung/p6pim/levant/mz-v9p2t0bw/gallery/levant-990-pro-mz-v9p2t0bw-536765656?$650_519_PNG$',
    precio: 'S/ 549',
    precioNum: 549,
    precioOld: null,
    descuento: null,
    mejorTienda: 'Amazon',
    specs: [
      { label: 'Capacidad', valor: '2TB' },
      { label: 'Interfaz', valor: 'PCIe 4.0 x4' },
      { label: 'Lectura', valor: '7,450 MB/s' },
      { label: 'Escritura', valor: '6,900 MB/s' },
    ],
    tiendas: [
      { nombre: 'Amazon', precio: 'S/ 549', mejor: true },
      { nombre: 'Mercado Libre', precio: 'S/ 589', mejor: false },
    ]
,
    historial: [
      {f:'2025-01-01',p:699},{f:'2025-01-05',p:679},{f:'2025-01-10',p:659},
      {f:'2025-01-15',p:639},{f:'2025-01-20',p:619},{f:'2025-01-25',p:609},
      {f:'2025-02-01',p:599},{f:'2025-02-05',p:609},{f:'2025-02-10',p:599},
      {f:'2025-02-15',p:589},{f:'2025-02-20',p:599},{f:'2025-02-25',p:589},
      {f:'2025-03-01',p:579},{f:'2025-03-05',p:589},{f:'2025-03-10',p:579},
      {f:'2025-03-15',p:569},{f:'2025-03-20',p:579},{f:'2025-03-25',p:569},
      {f:'2025-04-01',p:559},{f:'2025-04-05',p:569},{f:'2025-04-10',p:559},
      {f:'2025-04-15',p:549},{f:'2025-04-20',p:559},{f:'2025-04-25',p:549},
      {f:'2025-05-01',p:559},{f:'2025-05-05',p:549},{f:'2025-05-10',p:559},
      {f:'2025-05-15',p:549},{f:'2025-05-20',p:559},{f:'2025-05-25',p:549},
    ]
  },
  'demo-cel-1': {
    nombre: 'Apple iPhone 16 Pro Max 256GB Titanio Negro',
    categoria: 'Apple · Celulares',
    imagen: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-deserttitanium?wid=400&hei=400&fmt=png-alpha',
    precio: 'S/ 6,499',
    precioNum: 6499,
    precioOld: null,
    descuento: null,
    mejorTienda: 'Mercado Libre',
    specs: [
      { label: 'Pantalla', valor: '6.9" Super Retina XDR' },
      { label: 'Chip', valor: 'A18 Pro' },
      { label: 'Almacenamiento', valor: '256 GB' },
      { label: 'Cámara', valor: '48 MP triple' },
    ],
    tiendas: [
      { nombre: 'Mercado Libre', precio: 'S/ 6,499', mejor: true },
      { nombre: 'eBay', precio: 'S/ 6,699', mejor: false },
      { nombre: 'Amazon', precio: 'S/ 6,799', mejor: false },
    ]
,
    historial: [
      {f:'2025-01-01',p:7299},{f:'2025-01-05',p:7199},{f:'2025-01-10',p:7099},
      {f:'2025-01-15',p:6999},{f:'2025-01-20',p:6899},{f:'2025-01-25',p:6799},
      {f:'2025-02-01',p:6899},{f:'2025-02-05',p:6799},{f:'2025-02-10',p:6699},
      {f:'2025-02-15',p:6799},{f:'2025-02-20',p:6699},{f:'2025-02-25',p:6599},
      {f:'2025-03-01',p:6699},{f:'2025-03-05',p:6599},{f:'2025-03-10',p:6699},
      {f:'2025-03-15',p:6599},{f:'2025-03-20',p:6499},{f:'2025-03-25',p:6599},
      {f:'2025-04-01',p:6499},{f:'2025-04-05',p:6599},{f:'2025-04-10',p:6499},
      {f:'2025-04-15',p:6599},{f:'2025-04-20',p:6499},{f:'2025-04-25',p:6599},
      {f:'2025-05-01',p:6499},{f:'2025-05-05',p:6599},{f:'2025-05-10',p:6499},
      {f:'2025-05-15',p:6599},{f:'2025-05-20',p:6499},{f:'2025-05-25',p:6499},
    ]
  },
  'demo-cel-2': {
    nombre: 'Samsung Galaxy S24 Ultra 512GB Titanium Gray',
    categoria: 'Samsung · Celulares',
    imagen: 'https://images.samsung.com/is/image/samsung/p6pim/levant/sm-s928bzageub/gallery/levant-galaxy-s24-ultra-sm-s928bzageub-thumb-539770798?$650_519_PNG$',
    precio: 'S/ 4,890',
    precioNum: 4890,
    precioOld: 'S/ 5,750',
    descuento: '-15%',
    mejorTienda: 'Mercado Libre',
    specs: [
      { label: 'Pantalla', valor: '6.8" Dynamic AMOLED 2X' },
      { label: 'Chip', valor: 'Snapdragon 8 Gen 3' },
      { label: 'Almacenamiento', valor: '512 GB' },
      { label: 'Cámara', valor: '200 MP cuádruple' },
    ],
    tiendas: [
      { nombre: 'Mercado Libre', precio: 'S/ 4,890', mejor: true },
      { nombre: 'eBay', precio: 'S/ 4,999', mejor: false },
    ]
,
    historial: [
      {f:'2025-01-01',p:5750},{f:'2025-01-05',p:5650},{f:'2025-01-10',p:5550},
      {f:'2025-01-15',p:5450},{f:'2025-01-20',p:5350},{f:'2025-01-25',p:5250},
      {f:'2025-02-01',p:5150},{f:'2025-02-05',p:5099},{f:'2025-02-10',p:5050},
      {f:'2025-02-15',p:4999},{f:'2025-02-20',p:5050},{f:'2025-02-25',p:4999},
      {f:'2025-03-01',p:4950},{f:'2025-03-05',p:4999},{f:'2025-03-10',p:4950},
      {f:'2025-03-15',p:4920},{f:'2025-03-20',p:4950},{f:'2025-03-25',p:4920},
      {f:'2025-04-01',p:4899},{f:'2025-04-05',p:4920},{f:'2025-04-10',p:4899},
      {f:'2025-04-15',p:4890},{f:'2025-04-20',p:4899},{f:'2025-04-25',p:4890},
      {f:'2025-05-01',p:4899},{f:'2025-05-05',p:4890},{f:'2025-05-10',p:4899},
      {f:'2025-05-15',p:4890},{f:'2025-05-20',p:4899},{f:'2025-05-25',p:4890},
    ]
  },
  'demo-cel-3': {
    nombre: 'Xiaomi 14 Ultra 512GB Leica Optics 6.73"',
    categoria: 'Xiaomi · Celulares',
    imagen: 'https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0/pms_1708336920.35303497.png',
    precio: 'S/ 3,780',
    precioNum: 3780,
    precioOld: null,
    descuento: null,
    mejorTienda: 'eBay',
    specs: [
      { label: 'Pantalla', valor: '6.73" LTPO AMOLED' },
      { label: 'Chip', valor: 'Snapdragon 8 Gen 3' },
      { label: 'Almacenamiento', valor: '512 GB' },
      { label: 'Cámara', valor: 'Leica 50 MP cuádruple' },
    ],
    tiendas: [
      { nombre: 'eBay', precio: 'S/ 3,780', mejor: true },
      { nombre: 'Amazon', precio: 'S/ 3,950', mejor: false },
    ]
,
    historial: [
      {f:'2025-01-01',p:4299},{f:'2025-01-05',p:4199},{f:'2025-01-10',p:4099},
      {f:'2025-01-15',p:3999},{f:'2025-01-20',p:3899},{f:'2025-01-25',p:3850},
      {f:'2025-02-01',p:3799},{f:'2025-02-05',p:3850},{f:'2025-02-10',p:3799},
      {f:'2025-02-15',p:3850},{f:'2025-02-20',p:3799},{f:'2025-02-25',p:3780},
      {f:'2025-03-01',p:3799},{f:'2025-03-05',p:3780},{f:'2025-03-10',p:3799},
      {f:'2025-03-15',p:3780},{f:'2025-03-20',p:3799},{f:'2025-03-25',p:3780},
      {f:'2025-04-01',p:3799},{f:'2025-04-05',p:3780},{f:'2025-04-10',p:3799},
      {f:'2025-04-15',p:3780},{f:'2025-04-20',p:3799},{f:'2025-04-25',p:3780},
      {f:'2025-05-01',p:3799},{f:'2025-05-05',p:3780},{f:'2025-05-10',p:3799},
      {f:'2025-05-15',p:3780},{f:'2025-05-20',p:3799},{f:'2025-05-25',p:3780},
    ]
  },
  'demo-cel-4': {
    nombre: 'Google Pixel 9 Pro 256GB Porcelain 6.3"',
    categoria: 'Google · Celulares',
    imagen: 'https://lh3.googleusercontent.com/nu4jLpUkFg7JVVaJGxKjhA5aEA1EeD63oBbV-5x-YzR_hHbmgVMJMy4NrPzaQh39_0I2HFTqlWIc=rw-e365-w440',
    precio: 'S/ 3,199',
    precioNum: 3199,
    precioOld: 'S/ 3,999',
    descuento: '-20%',
    mejorTienda: 'Amazon',
    specs: [
      { label: 'Pantalla', valor: '6.3" LTPO OLED' },
      { label: 'Chip', valor: 'Google Tensor G4' },
      { label: 'Almacenamiento', valor: '256 GB' },
      { label: 'Cámara', valor: '50 MP triple' },
    ],
    tiendas: [
      { nombre: 'Amazon', precio: 'S/ 3,199', mejor: true },
      { nombre: 'Mercado Libre', precio: 'S/ 3,350', mejor: false },
      { nombre: 'eBay', precio: 'S/ 3,399', mejor: false },
    ]
,
    historial: [
      {f:'2025-01-01',p:3999},{f:'2025-01-05',p:3899},{f:'2025-01-10',p:3799},
      {f:'2025-01-15',p:3699},{f:'2025-01-20',p:3599},{f:'2025-01-25',p:3499},
      {f:'2025-02-01',p:3399},{f:'2025-02-05',p:3450},{f:'2025-02-10',p:3399},
      {f:'2025-02-15',p:3350},{f:'2025-02-20',p:3399},{f:'2025-02-25',p:3350},
      {f:'2025-03-01',p:3299},{f:'2025-03-05',p:3350},{f:'2025-03-10',p:3299},
      {f:'2025-03-15',p:3350},{f:'2025-03-20',p:3299},{f:'2025-03-25',p:3250},
      {f:'2025-04-01',p:3299},{f:'2025-04-05',p:3250},{f:'2025-04-10',p:3299},
      {f:'2025-04-15',p:3250},{f:'2025-04-20',p:3199},{f:'2025-04-25',p:3250},
      {f:'2025-05-01',p:3199},{f:'2025-05-05',p:3250},{f:'2025-05-10',p:3199},
      {f:'2025-05-15',p:3250},{f:'2025-05-20',p:3199},{f:'2025-05-25',p:3199},
    ]
  },
  'iphone15': {
    nombre: 'iPhone 15 Pro 256GB',
    categoria: 'Apple · Celulares',
    imagen: '',
    precio: 'S/ 4,299',
    precioNum: 4299,
    precioOld: 'S/ 4,899',
    descuento: '-12%',
    mejorTienda: 'Mercado Libre',
    specs: [
      { label: 'Pantalla', valor: '6.1" Super Retina XDR' },
      { label: 'Chip', valor: 'A17 Pro' },
      { label: 'Almacenamiento', valor: '256 GB' },
      { label: 'Cámara', valor: '48 MP triple' },
    ],
    tiendas: [
      { nombre: 'Mercado Libre', precio: 'S/ 4,299', mejor: true },
      { nombre: 'eBay', precio: 'S/ 4,389', mejor: false },
      { nombre: 'Amazon', precio: 'S/ 4,450', mejor: false },
    ]
,
    historial: [
      {f:'2025-01-01',p:4899},{f:'2025-01-05',p:4799},{f:'2025-01-10',p:4750},
      {f:'2025-01-15',p:4699},{f:'2025-01-20',p:4650},{f:'2025-01-25',p:4599},
      {f:'2025-02-01',p:4550},{f:'2025-02-05',p:4499},{f:'2025-02-10',p:4550},
      {f:'2025-02-15',p:4499},{f:'2025-02-20',p:4450},{f:'2025-02-25',p:4399},
      {f:'2025-03-01',p:4450},{f:'2025-03-05',p:4399},{f:'2025-03-10',p:4450},
      {f:'2025-03-15',p:4399},{f:'2025-03-20',p:4350},{f:'2025-03-25',p:4399},
      {f:'2025-04-01',p:4350},{f:'2025-04-05',p:4299},{f:'2025-04-10',p:4350},
      {f:'2025-04-15',p:4299},{f:'2025-04-20',p:4350},{f:'2025-04-25',p:4299},
      {f:'2025-05-01',p:4350},{f:'2025-05-05',p:4299},{f:'2025-05-10',p:4350},
      {f:'2025-05-15',p:4299},{f:'2025-05-20',p:4350},{f:'2025-05-25',p:4299},
    ]
  },
  'galaxy-s24': {
    nombre: 'Samsung Galaxy S24 Ultra',
    categoria: 'Samsung · Celulares',
    imagen: '',
    precio: 'S/ 3,899',
    precioNum: 3899,
    precioOld: 'S/ 4,299',
    descuento: '-9%',
    mejorTienda: 'Mercado Libre',
    specs: [
      { label: 'Pantalla', valor: '6.8" Dynamic AMOLED 2X' },
      { label: 'Chip', valor: 'Snapdragon 8 Gen 3' },
      { label: 'Almacenamiento', valor: '256 GB' },
      { label: 'Cámara', valor: '200 MP cuádruple' },
    ],
    tiendas: [
      { nombre: 'Mercado Libre', precio: 'S/ 3,899', mejor: true },
      { nombre: 'eBay', precio: 'S/ 3,999', mejor: false },
    ]
,
    historial: [
      {f:'2025-01-01',p:4299},{f:'2025-01-05',p:4199},{f:'2025-01-10',p:4150},
      {f:'2025-01-15',p:4099},{f:'2025-01-20',p:4050},{f:'2025-01-25',p:3999},
      {f:'2025-02-01',p:4050},{f:'2025-02-05',p:3999},{f:'2025-02-10',p:3950},
      {f:'2025-02-15',p:3999},{f:'2025-02-20',p:3950},{f:'2025-02-25',p:3920},
      {f:'2025-03-01',p:3950},{f:'2025-03-05',p:3920},{f:'2025-03-10',p:3899},
      {f:'2025-03-15',p:3920},{f:'2025-03-20',p:3899},{f:'2025-03-25',p:3920},
      {f:'2025-04-01',p:3899},{f:'2025-04-05',p:3920},{f:'2025-04-10',p:3899},
      {f:'2025-04-15',p:3920},{f:'2025-04-20',p:3899},{f:'2025-04-25',p:3920},
      {f:'2025-05-01',p:3899},{f:'2025-05-05',p:3920},{f:'2025-05-10',p:3899},
      {f:'2025-05-15',p:3920},{f:'2025-05-20',p:3899},{f:'2025-05-25',p:3899},
    ]
  },
  'lg-oled-c3': {
    nombre: 'LG OLED C3 55"',
    categoria: 'LG · Televisores',
    imagen: '',
    precio: 'S/ 5,299',
    precioNum: 5299,
    precioOld: 'S/ 6,499',
    descuento: '-18%',
    mejorTienda: 'Mercado Libre',
    specs: [
      { label: 'Pantalla', valor: '55" OLED 4K' },
      { label: 'Procesador', valor: 'α9 Gen6 AI' },
      { label: 'Refresh', valor: '120 Hz' },
      { label: 'Smart TV', valor: 'webOS 23' },
    ],
    tiendas: [
      { nombre: 'Mercado Libre', precio: 'S/ 5,299', mejor: true },
      { nombre: 'Amazon', precio: 'S/ 5,599', mejor: false },
    ]
,
    historial: [
      {f:'2025-01-01',p:6499},{f:'2025-01-05',p:6299},{f:'2025-01-10',p:6099},
      {f:'2025-01-15',p:5999},{f:'2025-01-20',p:5899},{f:'2025-01-25',p:5799},
      {f:'2025-02-01',p:5699},{f:'2025-02-05',p:5799},{f:'2025-02-10',p:5699},
      {f:'2025-02-15',p:5599},{f:'2025-02-20',p:5699},{f:'2025-02-25',p:5599},
      {f:'2025-03-01',p:5499},{f:'2025-03-05',p:5599},{f:'2025-03-10',p:5499},
      {f:'2025-03-15',p:5399},{f:'2025-03-20',p:5499},{f:'2025-03-25',p:5399},
      {f:'2025-04-01',p:5299},{f:'2025-04-05',p:5399},{f:'2025-04-10',p:5299},
      {f:'2025-04-15',p:5399},{f:'2025-04-20',p:5299},{f:'2025-04-25',p:5399},
      {f:'2025-05-01',p:5299},{f:'2025-05-05',p:5399},{f:'2025-05-10',p:5299},
      {f:'2025-05-15',p:5399},{f:'2025-05-20',p:5299},{f:'2025-05-25',p:5299},
    ]
  },
  'sony-bravia-a80l': {
    nombre: 'Sony Bravia XR A80L 65"',
    categoria: 'Sony · Televisores',
    imagen: '',
    precio: 'S/ 7,899',
    precioNum: 7899,
    precioOld: 'S/ 8,999',
    descuento: '-12%',
    mejorTienda: 'eBay',
    specs: [
      { label: 'Pantalla', valor: '65" OLED 4K' },
      { label: 'Procesador', valor: 'Cognitive XR' },
      { label: 'Refresh', valor: '120 Hz' },
      { label: 'Smart TV', valor: 'Google TV' },
    ],
    tiendas: [
      { nombre: 'eBay', precio: 'S/ 7,899', mejor: true },
      { nombre: 'Amazon', precio: 'S/ 8,199', mejor: false },
    ]
,
    historial: [
      {f:'2025-01-01',p:8999},{f:'2025-01-05',p:8799},{f:'2025-01-10',p:8599},
      {f:'2025-01-15',p:8399},{f:'2025-01-20',p:8299},{f:'2025-01-25',p:8199},
      {f:'2025-02-01',p:8099},{f:'2025-02-05',p:8199},{f:'2025-02-10',p:8099},
      {f:'2025-02-15',p:7999},{f:'2025-02-20',p:8099},{f:'2025-02-25',p:7999},
      {f:'2025-03-01',p:7899},{f:'2025-03-05',p:7999},{f:'2025-03-10',p:7899},
      {f:'2025-03-15',p:7999},{f:'2025-03-20',p:7899},{f:'2025-03-25',p:7999},
      {f:'2025-04-01',p:7899},{f:'2025-04-05',p:7999},{f:'2025-04-10',p:7899},
      {f:'2025-04-15',p:7999},{f:'2025-04-20',p:7899},{f:'2025-04-25',p:7999},
      {f:'2025-05-01',p:7899},{f:'2025-05-05',p:7999},{f:'2025-05-10',p:7899},
      {f:'2025-05-15',p:7999},{f:'2025-05-20',p:7899},{f:'2025-05-25',p:7899},
    ]
  },
  'rtx4070super': {
    nombre: 'GeForce RTX 4070 Super 12GB',
    categoria: 'NVIDIA · Hardware PC',
    imagen: '',
    precio: 'S/ 2,880',
    precioNum: 2880,
    precioOld: 'S/ 3,200',
    descuento: '-10%',
    mejorTienda: 'Mercado Libre',
    specs: [
      { label: 'VRAM', valor: '12GB GDDR6X' },
      { label: 'Arquitectura', valor: 'Ada Lovelace' },
      { label: 'CUDA Cores', valor: '7168' },
      { label: 'TDP', valor: '220W' },
    ],
    tiendas: [
      { nombre: 'Mercado Libre', precio: 'S/ 2,880', mejor: true },
      { nombre: 'eBay', precio: 'S/ 2,990', mejor: false },
    ]
,
    historial: [
      {f:'2025-01-01',p:3200},{f:'2025-01-05',p:3150},{f:'2025-01-10',p:3099},
      {f:'2025-01-15',p:3050},{f:'2025-01-20',p:2999},{f:'2025-01-25',p:3050},
      {f:'2025-02-01',p:2999},{f:'2025-02-05',p:2950},{f:'2025-02-10',p:2980},
      {f:'2025-02-15',p:2950},{f:'2025-02-20',p:2920},{f:'2025-02-25',p:2950},
      {f:'2025-03-01',p:2920},{f:'2025-03-05',p:2899},{f:'2025-03-10',p:2920},
      {f:'2025-03-15',p:2899},{f:'2025-03-20',p:2880},{f:'2025-03-25',p:2899},
      {f:'2025-04-01',p:2880},{f:'2025-04-05',p:2899},{f:'2025-04-10',p:2880},
      {f:'2025-04-15',p:2899},{f:'2025-04-20',p:2880},{f:'2025-04-25',p:2899},
      {f:'2025-05-01',p:2880},{f:'2025-05-05',p:2899},{f:'2025-05-10',p:2880},
      {f:'2025-05-15',p:2899},{f:'2025-05-20',p:2880},{f:'2025-05-25',p:2880},
    ]
  },
  'rx7900xtx': {
    nombre: 'Radeon RX 7900 XTX 24GB',
    categoria: 'AMD · Hardware PC',
    imagen: '',
    precio: 'S/ 3,450',
    precioNum: 3450,
    precioOld: 'S/ 4,100',
    descuento: '-16%',
    mejorTienda: 'Mercado Libre',
    specs: [
      { label: 'VRAM', valor: '24GB GDDR6' },
      { label: 'Arquitectura', valor: 'RDNA 3' },
      { label: 'Stream Proc.', valor: '12288' },
      { label: 'TDP', valor: '355W' },
    ],
    tiendas: [
      { nombre: 'Mercado Libre', precio: 'S/ 3,450', mejor: true },
      { nombre: 'Amazon', precio: 'S/ 3,699', mejor: false },
    ]
,
    historial: [
      {f:'2025-01-01',p:4100},{f:'2025-01-05',p:3999},{f:'2025-01-10',p:3899},
      {f:'2025-01-15',p:3799},{f:'2025-01-20',p:3699},{f:'2025-01-25',p:3799},
      {f:'2025-02-01',p:3699},{f:'2025-02-05',p:3599},{f:'2025-02-10',p:3699},
      {f:'2025-02-15',p:3599},{f:'2025-02-20',p:3550},{f:'2025-02-25',p:3599},
      {f:'2025-03-01',p:3550},{f:'2025-03-05',p:3499},{f:'2025-03-10',p:3550},
      {f:'2025-03-15',p:3499},{f:'2025-03-20',p:3450},{f:'2025-03-25',p:3499},
      {f:'2025-04-01',p:3450},{f:'2025-04-05',p:3499},{f:'2025-04-10',p:3450},
      {f:'2025-04-15',p:3499},{f:'2025-04-20',p:3450},{f:'2025-04-25',p:3499},
      {f:'2025-05-01',p:3450},{f:'2025-05-05',p:3499},{f:'2025-05-10',p:3450},
      {f:'2025-05-15',p:3499},{f:'2025-05-20',p:3450},{f:'2025-05-25',p:3450},
    ]
  },
  'galaxya55': {
    nombre: 'Galaxy A55 5G 128GB',
    categoria: 'Samsung · Celulares',
    imagen: '',
    precio: 'S/ 2,190',
    precioNum: 2190,
    precioOld: 'S/ 2,380',
    descuento: '-8%',
    mejorTienda: 'Mercado Libre',
    specs: [
      { label: 'Pantalla', valor: '6.6" Super AMOLED' },
      { label: 'Chip', valor: 'Exynos 1480' },
      { label: 'Almacenamiento', valor: '128 GB' },
      { label: 'Cámara', valor: '50 MP triple' },
    ],
    tiendas: [
      { nombre: 'Mercado Libre', precio: 'S/ 2,190', mejor: true },
    ]
,
    historial: [
      {f:'2025-01-01',p:2380},{f:'2025-01-05',p:2350},{f:'2025-01-10',p:2320},
      {f:'2025-01-15',p:2299},{f:'2025-01-20',p:2320},{f:'2025-01-25',p:2299},
      {f:'2025-02-01',p:2280},{f:'2025-02-05',p:2299},{f:'2025-02-10',p:2270},
      {f:'2025-02-15',p:2250},{f:'2025-02-20',p:2270},{f:'2025-02-25',p:2250},
      {f:'2025-03-01',p:2230},{f:'2025-03-05',p:2250},{f:'2025-03-10',p:2230},
      {f:'2025-03-15',p:2210},{f:'2025-03-20',p:2230},{f:'2025-03-25',p:2210},
      {f:'2025-04-01',p:2199},{f:'2025-04-05',p:2210},{f:'2025-04-10',p:2199},
      {f:'2025-04-15',p:2190},{f:'2025-04-20',p:2199},{f:'2025-04-25',p:2190},
      {f:'2025-05-01',p:2199},{f:'2025-05-05',p:2190},{f:'2025-05-10',p:2199},
      {f:'2025-05-15',p:2190},{f:'2025-05-20',p:2199},{f:'2025-05-25',p:2190},
    ]
  },
  'qn55q70c': {
    nombre: 'Smart TV 55" QLED 4K QN55Q70C',
    categoria: 'Samsung · Televisores',
    imagen: '',
    precio: 'S/ 2,149',
    precioNum: 2149,
    precioOld: 'S/ 2,499',
    descuento: '-14%',
    mejorTienda: 'Mercado Libre',
    specs: [
      { label: 'Pantalla', valor: '55" QLED 4K' },
      { label: 'Procesador', valor: 'Quantum 4K' },
      { label: 'Refresh', valor: '60 Hz' },
      { label: 'Smart TV', valor: 'Tizen OS' },
    ],
    tiendas: [
      { nombre: 'Mercado Libre', precio: 'S/ 2,149', mejor: true },
      { nombre: 'eBay', precio: 'S/ 2,299', mejor: false },
    ]
,
    historial: [
      {f:'2025-01-01',p:2499},{f:'2025-01-05',p:2450},{f:'2025-01-10',p:2399},
      {f:'2025-01-15',p:2450},{f:'2025-01-20',p:2399},{f:'2025-01-25',p:2350},
      {f:'2025-02-01',p:2399},{f:'2025-02-05',p:2350},{f:'2025-02-10',p:2299},
      {f:'2025-02-15',p:2350},{f:'2025-02-20',p:2299},{f:'2025-02-25',p:2250},
      {f:'2025-03-01',p:2299},{f:'2025-03-05',p:2250},{f:'2025-03-10',p:2299},
      {f:'2025-03-15',p:2250},{f:'2025-03-20',p:2199},{f:'2025-03-25',p:2250},
      {f:'2025-04-01',p:2199},{f:'2025-04-05',p:2250},{f:'2025-04-10',p:2199},
      {f:'2025-04-15',p:2149},{f:'2025-04-20',p:2199},{f:'2025-04-25',p:2149},
      {f:'2025-05-01',p:2199},{f:'2025-05-05',p:2149},{f:'2025-05-10',p:2199},
      {f:'2025-05-15',p:2149},{f:'2025-05-20',p:2199},{f:'2025-05-25',p:2149},
    ]
  },
};

// ═══════════════════════════════════
// RENDERIZAR DETALLE-PRODUCTO
// ═══════════════════════════════════
async function inicializarDetalleProducto() {
  if (!document.querySelector('.product-page')) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  let p = PRODUCTOS_DETALLE[id];

  if (!p) {
    try {
      const baseUrl = typeof API !== 'undefined' ? API : 'http://localhost:4000/api';
      const res = await fetch(`${baseUrl}/productos/${id}`);
      const data = await res.json();
      if (data.ok && data.producto) {
        const dp = data.producto;
        const formatedCurrent = parseFloat(dp.precio_actual).toLocaleString('es-PE', {minimumFractionDigits:2});
        const formatedOld = dp.precio_anterior ? parseFloat(dp.precio_anterior).toLocaleString('es-PE', {minimumFractionDigits:2}) : null;
        
        let descuentoText = '';
        if (dp.precio_anterior && dp.precio_actual < dp.precio_anterior) {
          const desc = Math.round((1 - (dp.precio_actual / dp.precio_anterior)) * 100);
          descuentoText = `-${desc}%`;
        }
        
        p = {
          id: dp.id,
          nombre: dp.nombre,
          categoria: dp.categoria || '',
          imagen: dp.imagen || '',
          precio: 'S/ ' + formatedCurrent,
          precioNum: dp.precio_actual,
          precioOld: formatedOld ? 'S/ ' + formatedOld : '',
          descuento: descuentoText,
          mejorTienda: dp.fuente || 'Tienda',
          specs: [
            { label: 'Marca', valor: dp.marca || '-' },
            { label: 'Fuente', valor: dp.fuente || '-' }
          ],
          tiendas: [
            { nombre: dp.fuente || 'Tienda', precio: 'S/ ' + formatedCurrent, mejor: true, url: dp.url_producto || '#' }
          ],
          historial: data.historial || []
        };
      }
    } catch (err) {
      console.error('[Detalle] Error obteniendo producto del backend:', err);
    }
  }

  if (!p) {
    document.querySelector('.product-page').innerHTML =
      '<div class="container" style="padding:4rem 0;text-align:center"><h2>Producto no encontrado</h2><a href="catalogo.html" class="btn-ver" style="display:inline-block;margin-top:1rem">Volver al catálogo</a></div>';
    return;
  }

  // Título de la página
  document.title = `${p.nombre} — PriceScope`;

  // Imagen
  const img = document.querySelector('.product-gallery img');
  if (img) {
    img.src = p.imagen || '';
    img.alt = p.nombre;
    if (!p.imagen) img.style.display = 'none';
  }

  // Categoría y nombre
  const cat = document.querySelector('.product-category');
  if (cat) cat.textContent = p.categoria;

  const h1 = document.querySelector('.product-info h1');
  if (h1) h1.textContent = p.nombre;

  // Precio
  const precioEl = document.querySelector('.current-price');
  const oldEl = document.querySelector('.old-price');
  const descEl = document.querySelector('.discount-badge');
  const bestEl = document.querySelector('.best-price');
  if (precioEl) precioEl.textContent = p.precio;
  if (oldEl) oldEl.textContent = p.precioOld;
  if (descEl) descEl.textContent = p.descuento;
  if (bestEl) bestEl.textContent = `Mejor precio en ${p.mejorTienda}`;

  // Botón alerta
  const btnAlerta = document.querySelector('.btn-alert');
  if (btnAlerta) btnAlerta.onclick = () => abrirAlertaDesdeDetalle(p, id);

  // Verificar si ya tiene alerta creada
  const alertasIds = JSON.parse(localStorage.getItem('ps_alertas_ids') || '[]');
  if (alertasIds.includes(id)) {
    btnAlerta.innerHTML = '✓ Alerta creada';
    btnAlerta.disabled = true;
    btnAlerta.style.background = '#16a34a';
    btnAlerta.style.opacity = '0.85';
    btnAlerta.style.cursor = 'default';
  }

  // Specs
  const grid = document.querySelector('.specs-grid');
  if (grid) {
    grid.innerHTML = p.specs.map(s => `
      <div>
        <span>${escapeHtml(s.label.toUpperCase())}</span>
        <strong>${escapeHtml(s.valor)}</strong>
      </div>`).join('');
  }

  // Tiendas
  const pricesCard = document.querySelector('.prices-card');
  if (pricesCard) {
    pricesCard.innerHTML = `<h3>Comparación de precios</h3>` +
      p.tiendas.map(t => `
        <div class="store-item ${t.mejor ? 'best-store' : ''}">
          <div>
            <strong>${escapeHtml(t.nombre)}</strong>
            ${t.mejor ? '<small>Mejor precio</small>' : ''}
          </div>
          <div class="store-right">
            <span>${escapeHtml(t.precio)}</span>
            <button onclick="window.open('${escapeHtml(t.url || '#')}','_blank')">↗</button>
          </div>
        </div>`).join('');
  }

  // Historial de precios dinámico
  if (p.historial) {
    renderizarHistorial(p.historial, 'mensual');
    document.querySelectorAll('.chart-filters button').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.chart-filters button').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const t = this.textContent.toLowerCase();
        const filtro = t.includes('dia') ? 'diario' : t.includes('sem') ? 'semanal' : 'mensual';
        renderizarHistorial(p.historial, filtro);
      });
    });
  }
}

/* ─── Lightweight Charts instance (singleton por página) ─── */
let _lwChart = null;
let _lwSeries = null;

function renderizarHistorial(historial, filtro) {
  let datos = [...historial];
  if (filtro === 'diario')   datos = datos.slice(-7);
  else if (filtro === 'semanal') datos = datos.slice(-14);

  const precios = datos.map(d => d.p);
  const min = Math.min(...precios);
  const max = Math.max(...precios);

  const elMin = document.getElementById('chartMin');
  const elMax = document.getElementById('chartMax');
  if (elMin) elMin.textContent = `S/ ${min.toLocaleString('es-PE')}`;
  if (elMax) elMax.textContent = `S/ ${max.toLocaleString('es-PE')}`;

  const container = document.getElementById('chartContainer');
  if (!container) return;

  const seriesData = datos.map(d => ({ time: d.f, value: d.p }));

  if (!_lwChart) {
    _lwChart = LightweightCharts.createChart(container, {
      width:  container.clientWidth,
      height: 260,
      layout: {
        background: { type: 'solid', color: '#ffffff' },
        textColor: '#64748b',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
      },
      grid: {
        vertLines: { color: '#f1f5f9' },
        horzLines: { color: '#f1f5f9' },
      },
      crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
      rightPriceScale: {
        borderColor: '#e2e8f0',
        scaleMargins: { top: 0.15, bottom: 0.1 },
      },
      timeScale: { borderColor: '#e2e8f0' },
      localization: {
        priceFormatter: (p) => `S/ ${p.toLocaleString('es-PE')}`,
      },
      handleScroll: false,
      handleScale:  false,
    });

    _lwSeries = _lwChart.addSeries(LightweightCharts.LineSeries, {
      color: '#1f255e',
      lineWidth: 2.5,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 5,
      crosshairMarkerBorderColor: '#1f255e',
      crosshairMarkerBackgroundColor: '#ffffff',
      lastValueVisible: true,
      priceLineVisible: false,
    });

    const ro = new ResizeObserver(() => {
      if (_lwChart && container.clientWidth > 0)
        _lwChart.applyOptions({ width: container.clientWidth });
    });
    ro.observe(container);
  }

  _lwSeries.setData(seriesData);
  _lwChart.timeScale().fitContent();
}

function abrirAlertaDesdeDetalle(pContext, idContext) {
  const params = new URLSearchParams(window.location.search);
  const id = idContext || params.get('id');
  const p = pContext || PRODUCTOS_DETALLE[id];
  if (!p) return;

  // Verificar si ya tiene alerta creada
  const alertas = JSON.parse(localStorage.getItem('ps_alertas_ids') || '[]');
  if (alertas.includes(id)) {
    mostrarToast('Ya tienes una alerta activa para este producto.');
    return;
  }

  const yaExiste = STATE.results.find(r => r.id === id);
  if (!yaExiste) {
    STATE.results.push({
      id: id,
      titulo: p.nombre,
      precio: p.precio,
      precioNum: p.precioNum !== undefined ? p.precioNum : parseFloat((p.precio || '').replace(/[^\d.]/g, '')),
      fuente: p.tiendas && p.tiendas.length > 0 ? p.tiendas[0].nombre : 'Desconocida'
    });
  }

  abrirAlertaModal(id);
}

// Llamarlo en DOMContentLoaded
document.addEventListener('DOMContentLoaded', inicializarDetalleProducto);

/* ═══════════════════════════════════════════════
   LOGIN / REGISTRO / SESIÓN
═══════════════════════════════════════════════ */
const API = 'http://localhost:3000/api';

/* ── Estado de sesión ── */
let SESSION = {
  token: localStorage.getItem('ps_token') || null,
  usuario: JSON.parse(localStorage.getItem('ps_usuario') || 'null')
};

/* ── Inicializar sesión al cargar ── */
function inicializarSesion() {
  if (SESSION.token && SESSION.usuario) {
    mostrarUsuarioLogueado(SESSION.usuario);
    verificarNotificaciones(); // ← AGREGAR ESTA LÍNEA
  }
}

function mostrarUsuarioLogueado(usuario) {
  document.getElementById('authGuest').style.display = 'none';
  document.getElementById('authUser').style.display = 'flex';
  document.getElementById('authNombre').textContent = usuario.nombre;
  document.getElementById('navAlertas').style.display = 'inline';
  const misAlertas = document.getElementById('mis-alertas');
  if (misAlertas) misAlertas.style.display = 'block';
  cargarMisAlertas();

  // Pre-rellenar campos de contacto si el usuario está logueado
  const campoNombre = document.getElementById('contactNombre');
  const campoCorreo = document.getElementById('contactCorreo');
  if (campoNombre) campoNombre.value = usuario.nombre;
  if (campoCorreo) campoCorreo.value = usuario.correo;
}

function cerrarSesion() {
  SESSION = { token: null, usuario: null };
  localStorage.removeItem('ps_token');
  localStorage.removeItem('ps_usuario');
  document.getElementById('authGuest').style.display = 'flex';
  document.getElementById('authUser').style.display = 'none';
  document.getElementById('navAlertas').style.display = 'none';
  document.getElementById('mis-alertas').style.display = 'none';
  mostrarToast('👋 Sesión cerrada');
}

/* ── Abrir / cerrar modal login ── */
function abrirLogin() {
  document.getElementById('loginOverlay').classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function cerrarLogin() {
  document.getElementById('loginOverlay').classList.remove('is-open');
  document.body.style.overflow = '';
  limpiarCamposLogin();
}

function cerrarLoginOverlay(e) {
  if (e.target === document.getElementById('loginOverlay')) cerrarLogin();
}

function limpiarCamposLogin() {
  ['loginCorreo', 'loginPassword', 'regNombre', 'regCorreo', 'regPassword', 'regPasswordConfirm', 'regCodigo'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('loginError').textContent = '';
  document.getElementById('registroError').textContent = '';
  const principal = document.getElementById('regFormPrincipal');
  const codigo = document.getElementById('regFormCodigo');
  if (principal) principal.style.display = 'block';
  if (codigo) codigo.style.display = 'none';
}

/* ── Tabs login / registro ── */
// DESPUÉS
function switchTab(tab) {
  const formLogin   = document.getElementById('formLogin');
  const formRegistro = document.getElementById('formRegistro');
  const bottomLink  = document.getElementById('authBottomLink');
  const bottomText  = document.getElementById('authBottomText');

  if (tab === 'registro') {
    formLogin?.style.setProperty('display', 'none');
    formRegistro?.style.setProperty('display', 'block');
    if (bottomText) bottomText.childNodes[0].textContent = '¿Ya tienes cuenta? ';
    if (bottomLink) {
      bottomLink.textContent = 'Inicia sesión';
      bottomLink.onclick = (e) => { e.preventDefault(); switchTab('login'); };
    }
  } else {
    formLogin?.style.setProperty('display', 'block');
    formRegistro?.style.setProperty('display', 'none');
    if (bottomText) bottomText.childNodes[0].textContent = '¿No tienes cuenta? ';
    if (bottomLink) {
      bottomLink.textContent = 'Regístrate gratis';
      bottomLink.onclick = (e) => { e.preventDefault(); switchTab('registro'); };
    }
  }
}

/* ── Hacer login ── */
async function hacerLogin() {
  const correo = document.getElementById('loginCorreo').value.trim();
  const contrasena = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  const btn = document.querySelector('#formLogin .login-submit');

  if (!correo || !contrasena) { errEl.textContent = 'Completá todos los campos.'; return; }

  btn.disabled = true;
  btn.textContent = 'Ingresando…';
  errEl.textContent = '';

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena })
    });
    const data = await res.json();

    if (!data.ok) { errEl.textContent = data.error || 'Error al iniciar sesión.'; return; }

    SESSION.token = data.token;
    SESSION.usuario = data.usuario;
    localStorage.setItem('ps_token', data.token);
    localStorage.setItem('ps_usuario', JSON.stringify(data.usuario));

    if (window.location.pathname.includes('login.html')) {
      window.location.href = 'index.html';
      return;
    }
    cerrarLogin();
    mostrarUsuarioLogueado(data.usuario);
    mostrarToast(`✅ Bienvenido, ${data.usuario.nombre}`);
  } catch {
    errEl.textContent = 'No se pudo conectar al servidor.';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Iniciar sesión';
  }
}

/* ── Hacer registro — PASO 1: enviar código al correo ── */
async function hacerRegistro() {
  const nombre = document.getElementById('regNombre').value.trim();
  const correo = document.getElementById('regCorreo').value.trim();
  const contrasena = document.getElementById('regPassword').value;
  const errEl = document.getElementById('registroError');
  const btn = document.querySelector('#regFormPrincipal .login-submit');

  const confirmar = document.getElementById('regPasswordConfirm')?.value || '';
  if (!nombre || !correo || !contrasena) { errEl.textContent = 'Completá todos los campos.'; return; }
  if (contrasena.length < 6) { errEl.textContent = 'La contraseña debe tener al menos 6 caracteres.'; return; }
  if (contrasena !== confirmar) { errEl.textContent = 'Las contraseñas no coinciden.'; return; }

  btn.disabled = true;
  btn.textContent = 'Enviando código…';
  errEl.textContent = '';

  try {
    const res = await fetch(`${API}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, contrasena })
    });
    const data = await res.json();

    if (!data.ok) { errEl.textContent = data.error || 'Error al registrarse.'; return; }

    /* Guardar correo para el paso 2 */
    document.getElementById('regCorreoOculto').value = correo;

    /* Mostrar panel del código, ocultar formulario principal */
    document.getElementById('regFormPrincipal').style.display = 'none';
    document.getElementById('regFormCodigo').style.display = 'block';
    errEl.textContent = '';

  } catch {
    errEl.textContent = 'No se pudo conectar al servidor.';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Crear cuenta';
  }
}

/* ── Hacer registro — PASO 2: verificar código ── */
async function verificarCodigo() {
  const correo = document.getElementById('regCorreoOculto').value;
  const codigo = document.getElementById('regCodigo').value.trim();
  const errEl = document.getElementById('registroError');
  const btn = document.getElementById('btnVerificarCodigo');

  if (!codigo || codigo.length !== 4) { errEl.textContent = 'Ingresá el código de 4 dígitos.'; return; }

  btn.disabled = true;
  btn.textContent = 'Verificando…';
  errEl.textContent = '';

  try {
    const res = await fetch(`${API}/auth/verificar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, codigo })
    });
    const data = await res.json();

    if (!data.ok) { errEl.textContent = data.error || 'Código incorrecto.'; return; }

    SESSION.token = data.token;
    SESSION.usuario = data.usuario;
    localStorage.setItem('ps_token', data.token);
    localStorage.setItem('ps_usuario', JSON.stringify(data.usuario));

    if (window.location.pathname.includes('login.html')) {
      window.location.href = 'index.html';
      return;
    }
    cerrarLogin();
    mostrarUsuarioLogueado(data.usuario);
    mostrarToast(`✅ Cuenta creada. Bienvenido, ${data.usuario.nombre}`);

  } catch {
    errEl.textContent = 'No se pudo conectar al servidor.';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Confirmar código';
  }
}

/* ── Volver al paso 1 del registro ── */
function volverARegistro() {
  document.getElementById('regFormPrincipal').style.display = 'block';
  document.getElementById('regFormCodigo').style.display = 'none';
  document.getElementById('regCodigo').value = '';
  document.getElementById('registroError').textContent = '';
}

function mostrarRecuperacion() {
  const formLogin = document.getElementById('formLogin');
  const formRegistro = document.getElementById('formRegistro');
  const bottom = document.getElementById('authBottomText');

  if (formLogin) formLogin.style.display = 'none';
  if (formRegistro) formRegistro.style.display = 'none';

  let panel = document.getElementById('formRecuperacion');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'formRecuperacion';
    panel.innerHTML = `
      <input type="hidden" id="recCorreoOculto">

      <!-- PASO 1: ingresar correo -->
      <div id="recPaso1">
        <p style="margin-bottom:16px;color:#374151;font-size:14px">
          Ingresa tu correo y te enviaremos un código para restablecer tu contraseña.
        </p>
        <div class="field">
          <label>Correo electrónico</label>
          <input type="email" id="recCorreo" placeholder="tu@correo.com">
        </div>
        <p id="recError" style="color:red;font-size:13px;margin:0 0 8px"></p>
        <p id="recOk"   style="color:green;font-size:13px;margin:0 0 8px;display:none"></p>
        <button type="button" class="auth-btn login-submit" onclick="enviarRecuperacion()">
          Enviar código
        </button>
      </div>

      <!-- PASO 2: código + nueva contraseña -->
      <div id="recPaso2" style="display:none">
        <p style="margin-bottom:16px;color:#374151;font-size:14px">
          Ingresa el código de 4 dígitos que enviamos a tu correo y tu nueva contraseña.
        </p>
        <div class="field">
          <label>Código de verificación</label>
          <input type="text" id="recCodigo" maxlength="4" placeholder="0000"
            style="letter-spacing:8px;font-size:24px;text-align:center">
        </div>
        <div class="field">
          <label>Nueva contraseña</label>
          <input type="password" id="recNuevaPass" placeholder="Mínimo 6 caracteres">
        </div>
        <p id="recError2" style="color:red;font-size:13px;margin:0 0 8px"></p>
        <button type="button" class="auth-btn login-submit" id="btnConfirmarRec" onclick="confirmarRecuperacion()">
          Confirmar
        </button>
        <button type="button" class="auth-btn"
          style="background:transparent;color:#64748b;margin-top:8px"
          onclick="document.getElementById('recPaso1').style.display='block';document.getElementById('recPaso2').style.display='none'">
          ← Volver
        </button>
      </div>
    `;
    formLogin.parentNode.insertBefore(panel, formLogin.nextSibling);
  } else {
    panel.style.display = 'block';
    document.getElementById('recPaso1').style.display = 'block';
    document.getElementById('recPaso2').style.display = 'none';
  }

  if (bottom) bottom.innerHTML =
    '<a href="#" onclick="volverALoginDesdeRec();return false" style="color:#1e40af;font-weight:600">← Volver al inicio de sesión</a>';
}

function volverALoginDesdeRec() {
  document.getElementById('formRecuperacion').style.display = 'none';
  document.getElementById('formLogin').style.display = 'block';
  document.getElementById('recError').textContent = '';
  document.getElementById('recOk').textContent = '';
  const bottom = document.getElementById('authBottomText');
  if (bottom) bottom.innerHTML =
    '¿No tienes cuenta? <a href="#" onclick="switchTab(\'registro\');return false" style="color:#1e40af;font-weight:600">Regístrate gratis</a>';
}

async function enviarRecuperacion() {
  const correo = document.getElementById('recCorreo').value.trim();
  const errEl = document.getElementById('recError');
  const okEl = document.getElementById('recOk');
  const btn = document.querySelector('#formRecuperacion .login-submit');

  if (!correo) { errEl.textContent = 'Ingresa tu correo.'; return; }

  btn.disabled = true;
  btn.textContent = 'Enviando…';
  errEl.textContent = '';
  okEl.style.display = 'none';

  try {
    const res = await fetch(`${API}/auth/recuperar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo })
    });
    const data = await res.json();

    if (!data.ok) { errEl.textContent = data.error || 'Error al enviar.'; return; }

    // Guardar correo y mostrar panel paso 2
    document.getElementById('recCorreoOculto').value = correo;
    document.getElementById('recPaso1').style.display = 'none';
    document.getElementById('recPaso2').style.display = 'block';

  } catch {
    errEl.textContent = 'No se pudo conectar al servidor.';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Enviar código';
  }
}

async function confirmarRecuperacion() {
  const correo = document.getElementById('recCorreoOculto').value;
  const codigo = document.getElementById('recCodigo').value.trim();
  const nuevaContrasena = document.getElementById('recNuevaPass').value;
  const errEl = document.getElementById('recError2');
  const btn = document.getElementById('btnConfirmarRec');

  if (!codigo || codigo.length !== 4) { errEl.textContent = 'Ingresa el código de 4 dígitos.'; return; }
  if (!nuevaContrasena || nuevaContrasena.length < 6) { errEl.textContent = 'La contraseña debe tener al menos 6 caracteres.'; return; }

  btn.disabled = true;
  btn.textContent = 'Verificando…';
  errEl.textContent = '';

  try {
    const res = await fetch(`${API}/auth/recuperar/verificar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, codigo, nuevaContrasena })
    });
    const data = await res.json();

    if (!data.ok) { errEl.textContent = data.error || 'Error al verificar.'; return; }

    // Éxito → volver al login con mensaje
    volverALoginDesdeRec();
    mostrarToast('✅ Contraseña actualizada. Ya puedes iniciar sesión.');

  } catch {
    errEl.textContent = 'No se pudo conectar al servidor.';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Confirmar';
  }
}

async function guardarAlerta(id) {
  const p = STATE.results.find(r => r.id === id);
  const esRango = document.getElementById('alertPanelRango')?.style.display !== 'none';

  let precio_objetivo, precio_min, precio_max, mensajeConfirmacion;

  if (esRango) {
    precio_min = parseFloat(document.getElementById('alertMin')?.value);
    precio_max = parseFloat(document.getElementById('alertMax')?.value);
    if (!precio_min || !precio_max || precio_min >= precio_max) {
      mostrarToast('El rango de precio no es válido.'); return;
    }
    if (p && p.precioNum && precio_max >= p.precioNum) {
      mostrarToast('El precio máximo buscado debe ser menor al precio actual (' + p.precio + ').'); return;
    }
    precio_objetivo = precio_min;
    mensajeConfirmacion = `Te avisaremos cuando el precio de <strong>${escapeHtml(p.titulo)}</strong> esté entre S/ ${precio_min.toLocaleString('es-PE')} y S/ ${precio_max.toLocaleString('es-PE')}.`;
  } else {
    precio_objetivo = parseFloat(document.getElementById('alertPrecioExacto')?.value);
    if (!precio_objetivo || precio_objetivo <= 0) {
      mostrarToast('Ingresa un precio objetivo válido.'); return;
    }
    if (p && p.precioNum && precio_objetivo >= p.precioNum) {
      mostrarToast('El precio objetivo debe ser menor al precio actual (' + p.precio + ').'); return;
    }
    mensajeConfirmacion = `Te avisaremos cuando <strong>${escapeHtml(p.titulo)}</strong> llegue exactamente a S/ ${precio_objetivo.toLocaleString('es-PE')}.`;
  }
  // Leer propiedades antes de cerrar el modal
  const modalA = document.getElementById('modalAlerta');
  const isRenewId = modalA ? modalA.dataset.renewId : null;
  const isEditId = modalA ? modalA.dataset.editId : null;

  // Cerrar modal de alerta
  modalA?.remove();
  document.body.style.overflow = '';

  // Guardar id localmente para saber que ya tiene alerta
  const alertasIds = JSON.parse(localStorage.getItem('ps_alertas_ids') || '[]');
  if (!alertasIds.includes(id)) {
    alertasIds.push(id);
    localStorage.setItem('ps_alertas_ids', JSON.stringify(alertasIds));
  }

  // Cambiar botón en detalle-producto si estamos ahí
  // Cambiar botón en detalle-producto si estamos ahí
  const btnAlerta = document.querySelector('.btn-alert');
  if (btnAlerta) {
    btnAlerta.innerHTML = '✓ Alerta creada';
    btnAlerta.disabled = true;
    btnAlerta.style.background = '#16a34a';
    btnAlerta.style.opacity = '0.85';
    btnAlerta.style.cursor = 'default';
  }

  // Mostrar modal de éxito
  mostrarAlertaCreada(mensajeConfirmacion);

  // Llamada al backend en segundo plano
  try {
    let res;

    if (isRenewId || isEditId) {
      const targetId = isEditId ? isEditId : isRenewId;
      const endpoint = isEditId ? `${API}/alertas/${targetId}` : `${API}/alertas/${targetId}/reactivar`;
      res = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SESSION.token}`
        },
        body: JSON.stringify({
          precio_objetivo,
          precio_min: esRango ? precio_min : null,
          precio_max: esRango ? precio_max : null
        })
      });
    } else {
      res = await fetch(`${API}/alertas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SESSION.token}`
        },
        body: JSON.stringify({
          producto_nombre: p?.titulo || id,
          producto_marca: p?.marca || '',
          producto_modelo: p?.modelo || '',
          pulgadas: p?.pulgadas || '',
          precio_objetivo,
          precio_min: esRango ? precio_min : null,
          precio_max: esRango ? precio_max : null,
          fuentes: p?.fuente || 'MercadoLibre,eBay',
          detalle_id: id
        })
      });
    }
    
    const data = await res.json();
    if (data.ok && window.location.pathname.includes('mis-alertas.html')) {
       cargarMisAlertas();
    }
  } catch (e) {
    console.error('Error guardando alerta:', e);
  }
}

function mostrarAlertaCreada(mensaje) {
  document.getElementById('modalAlertaOk')?.remove();

  const modal = document.createElement('div');
  modal.id = 'modalAlertaOk';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="alerta-ok-modal">
      <button class="alerta-ok-modal__close"
        onclick="document.getElementById('modalAlertaOk').remove();document.body.style.overflow=''">
        ×
      </button>
      <div class="alerta-ok-modal__icon">
        <svg width="28" height="28" fill="none" stroke="#16a34a" stroke-width="2.5" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h3 class="alerta-ok-modal__title">¡Alerta creada!</h3>
      <p class="alerta-ok-modal__desc">${mensaje}</p>
      <button class="alerta-ok-modal__btn"
        onclick="document.getElementById('modalAlertaOk').remove();document.body.style.overflow=''">
        Listo
      </button>
    </div>`;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('is-open'));
  document.body.style.overflow = 'hidden';
}

/* ═══════════════════════════════════════════════
   NOTIFICACIONES — alertas de precio disparadas
═══════════════════════════════════════════════ */

async function verificarNotificaciones() {
  if (!SESSION.token) return;

  try {
    const res = await fetch(`${API}/alertas/notificaciones`, {
      headers: { 'Authorization': `Bearer ${SESSION.token}` }
    });
    const data = await res.json();

    if (!data.ok || !data.notificaciones?.length) return;

    const notifs = data.notificaciones;

    /* Marcar como vistas en el backend inmediatamente */
    fetch(`${API}/alertas/notificaciones/marcar-vistas`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${SESSION.token}` }
    }).catch(() => { });

    /* Mostrar badge en el link "Mis Alertas" del navbar */
    const navAlertas = document.getElementById('navAlertas');
    if (navAlertas) {
      navAlertas.style.position = 'relative';
      const badge = document.createElement('span');
      badge.id = 'alertasBadge';
      badge.textContent = notifs.length;
      badge.style.cssText = `
        position:absolute; top:-6px; right:-10px;
        background:#ef4444; color:#fff;
        font-size:10px; font-weight:700;
        min-width:16px; height:16px;
        border-radius:999px; padding:0 4px;
        display:flex; align-items:center; justify-content:center;
        line-height:1;
      `;
      /* Evitar duplicados */
      document.getElementById('alertasBadge')?.remove();
      navAlertas.appendChild(badge);
    }

    /* Mostrar un toast por cada alerta disparada (máx 3) */
    const limite = Math.min(notifs.length, 3);
    for (let i = 0; i < limite; i++) {
      const n = notifs[i];
      const precioTexto = n.precio_min && n.precio_max
        ? `S/ ${parseFloat(n.precio_min).toLocaleString('es-PE')} – S/ ${parseFloat(n.precio_max).toLocaleString('es-PE')}`
        : `S/ ${parseFloat(n.precio_objetivo).toLocaleString('es-PE')}`;

      /* Escalonar toasts para que no se apilen todos al mismo tiempo */
      setTimeout(() => {
        mostrarToastAlerta(n.producto_nombre, precioTexto, n.detalle_id);
      }, i * 1200);
    }

    /* Si hay más de 3, mostrar un resumen final */
    if (notifs.length > 3) {
      setTimeout(() => {
        mostrarToast(`🔔 +${notifs.length - 3} alertas más alcanzaron su precio objetivo`);
      }, 3 * 1200 + 800);
    }

  } catch (e) {
    console.error('Error verificando notificaciones:', e);
  }
}

/* Toast especial para alerta de precio alcanzado */
function mostrarToastAlerta(producto, precioObjetivo, detalleId) {
  const toast = document.createElement('div');
  toast.className = 'toast-notif';

  const verHtml = detalleId
    ? `<a href="detalle-producto.html?id=${detalleId}"
          style="color:#fff;font-weight:700;text-decoration:underline;white-space:nowrap">
         Ver →
       </a>`
    : `<a href="mis-alertas.html"
          style="color:#fff;font-weight:700;text-decoration:underline;white-space:nowrap">
         Ver →
       </a>`;

  toast.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:10px">
      <span style="font-size:20px;line-height:1.2">🎯</span>
      <div style="flex:1;min-width:0">
        <p style="margin:0 0 2px;font-weight:700;font-size:13px;color:#fff">¡Precio objetivo alcanzado!</p>
        <p style="margin:0;font-size:12px;color:rgba(255,255,255,.85);
                  white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          ${producto}
        </p>
        <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,.75)">
          Objetivo: ${precioObjetivo}
        </p>
      </div>
      ${verHtml}
    </div>`;

  toast.style.cssText = `
    position:fixed; bottom:24px; right:24px; z-index:9999;
    background:#16a34a; color:#fff;
    padding:14px 18px; border-radius:10px;
    box-shadow:0 4px 20px rgba(0,0,0,.18);
    max-width:320px; width:calc(100vw - 48px);
    transform:translateY(20px); opacity:0;
    transition:transform .3s ease,opacity .3s ease;
    cursor:pointer;
  `;

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });

  /* Auto-cierre a los 7 segundos */
  const timer = setTimeout(() => cerrarToastAlerta(toast), 7000);
  toast.addEventListener('click', () => { clearTimeout(timer); cerrarToastAlerta(toast); });
}

function cerrarToastAlerta(toast) {
  toast.style.transform = 'translateY(20px)';
  toast.style.opacity = '0';
  setTimeout(() => toast.remove(), 300);
}

/* ── Cargar mis alertas ── */
let TODAS_MIS_ALERTAS = [];

async function cargarMisAlertas() {
  if (!SESSION.token) return;
  const gridActivas = document.getElementById('alertasGrid');
  const gridExpiradas = document.getElementById('alertasExpiradas');
  const tabsContainer = document.getElementById('alertasTabsContainer');
  if (!gridActivas) return; // Puede que no estemos en mis-alertas.html

  gridActivas.innerHTML = '<p style="color:#94a3b8;padding:2rem 0">Cargando alertas…</p>';
  if (gridExpiradas) gridExpiradas.innerHTML = '';

  try {
    const res = await fetch(`${API}/alertas`, {
      headers: { 'Authorization': `Bearer ${SESSION.token}` }
    });
    const data = await res.json();

    if (!data.ok || data.alertas.length === 0) {
      gridActivas.innerHTML = `
        <div class="alertas-empty">
          <p>No tienes alertas activas todavía.</p>
          <p>Busca un producto y haz clic en 🔔 para crear una.</p>
        </div>`;
      if (tabsContainer) tabsContainer.style.display = 'none';
      return;
    }

    TODAS_MIS_ALERTAS = data.alertas;
    const activas = data.alertas.filter(a => a.activa === true || a.disparada === true);
    const expiradas = data.alertas.filter(a => a.activa === false && a.disparada === false);

    if (tabsContainer) {
      tabsContainer.style.display = 'inline-flex';
      document.getElementById('countActivas').textContent = activas.length;
      document.getElementById('countExpiradas').textContent = expiradas.length;
    }

    if (activas.length === 0) {
      gridActivas.innerHTML = `
        <div class="alertas-empty">
          <p>No tienes alertas activas.</p>
        </div>`;
    } else {
      gridActivas.innerHTML = activas.map(a => renderAlertCard(a, false)).join('');
    }

    if (gridExpiradas) {
      if (expiradas.length === 0) {
        gridExpiradas.innerHTML = `
          <div class="alertas-empty">
            <p>No tienes alertas expiradas.</p>
          </div>`;
      } else {
        gridExpiradas.innerHTML = expiradas.map(a => renderAlertCard(a, true)).join('');
      }
    }

  } catch (e) {
    console.error('Error cargando alertas:', e);
    gridActivas.innerHTML = '<p style="color:red;padding:2rem 0">Error al cargar las alertas.</p>';
  }
}

function renderAlertCard(a, isExpired) {
  const precioActual = a.precio_disparado
    ? parseFloat(a.precio_disparado)
    : (a.precio_producto ? parseFloat(a.precio_producto)
      : (a.precio_actual ? parseFloat(a.precio_actual) : null));
  const precioObjetivo = parseFloat(a.precio_objetivo);
  const alcanzado = a.disparada === true;
  const detalleId = a.detalle_id || '';

  let estadoTexto = '';
  if (isExpired) {
    const fechaExpiracion = new Date(a.fecha_creacion);
    fechaExpiracion.setDate(fechaExpiracion.getDate() + 21);
    const hoy = new Date();
    const diffTime = Math.abs(hoy - fechaExpiracion);
    const diffDaysExpirado = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const fechaEliminacion = new Date(fechaExpiracion);
    fechaEliminacion.setDate(fechaEliminacion.getDate() + 14);
    const diffTimeElim = Math.max(0, fechaEliminacion - hoy);
    const diffDaysElim = Math.ceil(diffTimeElim / (1000 * 60 * 60 * 24));

    estadoTexto = `<div style="display:flex;gap:12px;margin-top:8px;">
      <span class="alert-duracion alert-duracion--expired" style="background:transparent; border:none; padding:0;">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin-right:2px"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        Expiró hace ${diffDaysExpirado} día${diffDaysExpirado !== 1 ? 's' : ''}
      </span>
      <span class="alert-duracion alert-duracion--expired" style="border:none;">
        Se eliminará en ${diffDaysElim} día${diffDaysElim !== 1 ? 's' : ''} si no la renuevas
      </span>
    </div>`;
  } else {
    estadoTexto = alcanzado
      ? '<span class="alert-status alert-status--success">✓ ¡Se alcanzó el precio objetivo!</span>'
      : '<span class="alert-status">Monitoreando precio…</span>';
  }

  const objetivoHtml = a.precio_min && a.precio_max
    ? `<strong>S/ ${parseFloat(a.precio_min).toLocaleString('es-PE')} – S/ ${parseFloat(a.precio_max).toLocaleString('es-PE')}</strong>`
    : `<strong>S/ ${precioObjetivo.toLocaleString('es-PE')}</strong>`;

  return `
    <article class="alert-card ${alcanzado ? 'alert-card--success' : ''} ${isExpired ? 'alert-card--expired' : ''}">
      <div class="alert-product">
        <img src="${a.imagen || ''}" alt="${escapeHtml(a.producto_nombre)}"
          onerror="this.onerror=null; this.src='https://placehold.co/400x400/eeeeee/999999?text=Sin+Imagen';">
        <div class="alert-product-info">
          <span class="alert-brand">${escapeHtml((a.producto_marca || '').toUpperCase())}</span>
          <h3>${escapeHtml(a.producto_nombre)}</h3>
          ${precioActual !== null
      ? `<p class="alert-precio-actual">Precio actual: <strong>S/ ${precioActual.toLocaleString('es-PE')}</strong></p>`
      : '<p class="alert-precio-sin-dato">Precio aún no monitoreado</p>'}
          ${estadoTexto}
        </div>
      </div>
      <div class="alert-actions">
        <div class="alert-target">
          <span>Objetivo</span>
          ${objetivoHtml}
        </div>
        
        ${isExpired 
          ? '<span class="badge-expired">Expirada</span>' 
          : (alcanzado ? '<span class="badge-success">¡Objetivo!</span>' : '<span class="badge-active">Activa</span>')
        }

        ${isExpired 
          ? `<button class="btn-renew" onclick="renovarAlerta('${a.id}')" title="Renovar alerta">
               <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
               Renovar
             </button>` 
          : `<button class="btn-${alcanzado ? 'go-success' : 'view'}"
              onclick="${detalleId ? `window.location.href='detalle-producto.html?id=${detalleId}'` : `window.location.href='catalogo.html'`}">
              ${alcanzado ? 'Ir →' : 'Ver'}
             </button>
             ${!alcanzado ? `<button class="btn-edit" onclick="editarAlerta('${a.id}')" title="Editar alerta">✏️</button>` : ''}`
        }
        
        <button class="btn-delete" onclick="eliminarAlerta(${a.id})" title="Eliminar alerta">
          🗑
        </button>
      </div>
    </article>`;
}

function switchAlertsTab(tab) {
  const btnActivas = document.getElementById('tabActivas');
  const btnExpiradas = document.getElementById('tabExpiradas');
  const secActivas = document.getElementById('seccionActivas');
  const secExpiradas = document.getElementById('seccionExpiradas');

  if (tab === 'activas') {
    btnActivas.classList.add('active');
    btnExpiradas.classList.remove('active');
    secActivas.style.display = 'block';
    secExpiradas.style.display = 'none';
  } else {
    btnActivas.classList.remove('active');
    btnExpiradas.classList.add('active');
    secActivas.style.display = 'none';
    secExpiradas.style.display = 'block';
  }
}

function renovarAlerta(alertaId) {
  const alerta = TODAS_MIS_ALERTAS.find(a => a.id.toString() === alertaId.toString());
  if (!alerta) return;

  const yaExiste = STATE.results.find(r => r.id === alerta.detalle_id);
  if (!yaExiste) {
    STATE.results.push({
      id: alerta.detalle_id,
      titulo: alerta.producto_nombre,
      precio: alerta.precio_producto ? 'S/ ' + alerta.precio_producto : '',
      precioNum: alerta.precio_producto || null,
      fuente: 'Reactivar'
    });
  }
  
  abrirAlertaModal(alerta.detalle_id || alertaId);

  setTimeout(() => {
    const modalA = document.getElementById('modalAlerta');
    if (modalA) {
      modalA.dataset.renewId = alerta.id;
      const title = document.querySelector('.alert-price-modal__title');
      if (title) title.textContent = 'Renovar Alerta';
      if(alerta.precio_min && alerta.precio_max) {
        switchAlertTab('rango');
        document.getElementById('alertMin').value = alerta.precio_min;
        document.getElementById('alertMax').value = alerta.precio_max;
      } else {
        switchAlertTab('exacto');
        document.getElementById('alertPrecioExacto').value = alerta.precio_objetivo;
      }
    }
  }, 100);
}

function editarAlerta(alertaId) {
  const alerta = TODAS_MIS_ALERTAS.find(a => a.id.toString() === alertaId.toString());
  if (!alerta) return;

  const yaExiste = STATE.results.find(r => r.id === alerta.detalle_id);
  if (!yaExiste) {
    STATE.results.push({
      id: alerta.detalle_id,
      titulo: alerta.producto_nombre,
      precio: alerta.precio_producto ? 'S/ ' + alerta.precio_producto : '',
      precioNum: alerta.precio_producto || null,
      fuente: 'Editar'
    });
  }
  
  abrirAlertaModal(alerta.detalle_id || alertaId);

  setTimeout(() => {
    const modalA = document.getElementById('modalAlerta');
    if (modalA) {
      modalA.dataset.editId = alerta.id;
      const title = document.querySelector('.alert-price-modal__title');
      if (title) title.textContent = 'Editar Alerta';
      if(alerta.precio_min && alerta.precio_max) {
        switchAlertTab('rango');
        document.getElementById('alertMin').value = alerta.precio_min;
        document.getElementById('alertMax').value = alerta.precio_max;
      } else {
        switchAlertTab('exacto');
        document.getElementById('alertPrecioExacto').value = alerta.precio_objetivo;
      }
    }
  }, 100);
}

/* ── Eliminar alerta ── */
async function eliminarAlerta(id) {
  if (!SESSION.token) return;
  try {
    const res = await fetch(`${API}/alertas/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${SESSION.token}` }
    });
    const data = await res.json();

    // Limpiar del localStorage si tiene detalle_id
    if (data.detalle_id) {
      const alertasIds = JSON.parse(localStorage.getItem('ps_alertas_ids') || '[]');
      const nuevas = alertasIds.filter(aid => aid !== data.detalle_id);
      localStorage.setItem('ps_alertas_ids', JSON.stringify(nuevas));
    }

    mostrarToast('🗑️ Alerta eliminada');
    cargarMisAlertas();
  } catch (e) {
    console.error('Error eliminando alerta:', e);
  }
}

/* ── Cerrar login con Escape ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    cerrarLogin();
  }
});


/* ═══════════════════════════════════════════════
   OJO — mostrar/ocultar contraseña
═══════════════════════════════════════════════ */
function toggleEye(inputId, btn) {
  const input = document.getElementById(inputId);
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.querySelector('.eye-show').style.display = isHidden ? 'none' : '';
  btn.querySelector('.eye-hide').style.display = isHidden ? '' : 'none';
}


/* ═══════════════════════════════════════════════
   CATÁLOGO — filtrado y ordenamiento visual
═══════════════════════════════════════════════ */

function filtrarCategoria(cat, btn) {
  categoriaActiva = cat;
  document.querySelectorAll('.filter-cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filtrarProductos();
}

function actualizarSlider(input) {
  const val = input.value;
  const pct = ((val - 500) / (10000 - 500)) * 100;
  input.style.setProperty('--val', pct + '%');
  document.getElementById('precioLabel').textContent = 'S/ ' + Number(val).toLocaleString('es-PE');
  document.getElementById('precioMax').textContent = 'S/' + Number(val).toLocaleString('es-PE');
  filtrarProductos();
}

function filtrarProductos() {
  const texto = document.getElementById('catSearchInput')?.value.toLowerCase().trim();
  const marca = document.getElementById('filtroMarca')?.value;
  const precMax = parseInt(document.getElementById('filtroSlider')?.value);
  const sort = document.getElementById('sortSelect')?.value;

  const cards = Array.from(document.querySelectorAll('#catGrid .pcard'));
  let visibles = 0;

  cards.forEach(card => {
    const cat = card.dataset.cat;
    const cMarca = card.dataset.marca;
    const precio = parseInt(card.dataset.precio);
    const nombre = card.querySelector('.pname').textContent.toLowerCase();
    const brand = card.querySelector('.pbrand').textContent.toLowerCase();

    const okCat = categoriaActiva === 'todos' || cat === categoriaActiva;
    const okMarca = marca === 'todas' || cMarca === marca;
    const okPrecio = precio <= precMax;
    const okTexto = !texto || nombre.includes(texto) || brand.includes(texto);

    if (okCat && okMarca && okPrecio && okTexto) {
      card.style.display = '';
      visibles++;
    } else {
      card.style.display = 'none';
    }
  });

  // Ordenar visibles
  const grid = document.getElementById('catGrid');
  if (grid) {
    const visCards = cards.filter(c => c.style.display !== 'none');
    if (sort === 'precio-asc') visCards.sort((a, b) => parseInt(a.dataset.precio) - parseInt(b.dataset.precio));
    if (sort === 'precio-desc') visCards.sort((a, b) => parseInt(b.dataset.precio) - parseInt(a.dataset.precio));
    if (sort === 'descuento') visCards.sort((a, b) => parseInt(b.dataset.descuento) - parseInt(a.dataset.descuento));
    visCards.forEach(c => grid.appendChild(c));

    document.getElementById('conteoProductos').textContent = visibles;
    document.getElementById('emptyState').style.display = visibles === 0 ? 'block' : 'none';
  }
}


/* ═══════════════════════════════════════════════
   CONTACTO — envío por EmailJS
═══════════════════════════════════════════════ */
if (typeof emailjs !== 'undefined') {
  emailjs.init('Hk7uZcB--GP-5wCiw');
}

async function enviarContacto(e) {
  e.preventDefault();

  const errEl = document.getElementById('contactError');
  const okEl = document.getElementById('contactOk');
  errEl.style.display = 'none';
  okEl.style.display = 'none';

  if (!SESSION.token) {
    errEl.textContent = 'Debes iniciar sesión para enviar un mensaje.';
    errEl.style.display = 'block';
    return;
  }

  const nombre = SESSION.usuario?.nombre || document.getElementById('contactNombre').value.trim();
  const correo = SESSION.usuario?.correo || document.getElementById('contactCorreo').value.trim();
  const mensaje = document.getElementById('contactMensaje').value.trim();
  const btn = document.getElementById('contactBtn');

  if (!mensaje) {
    errEl.textContent = 'Por favor escribe un mensaje.';
    errEl.style.display = 'block';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Enviando...';

  try {
    await emailjs.send('service_2ku5une', 'template_7sazywq', { nombre, correo, mensaje });
    okEl.style.display = 'block';
    
    // Guardar los datos para que permanezcan, limpiar el resto del formulario
    const currentNombre = document.getElementById('contactNombre').value;
    const currentCorreo = document.getElementById('contactCorreo').value;
    document.getElementById('contactForm').reset();
    document.getElementById('contactNombre').value = currentNombre;
    document.getElementById('contactCorreo').value = currentCorreo;
  } catch (err) {
    errEl.textContent = 'No se pudo enviar. Intenta de nuevo.';
    errEl.style.display = 'block';
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.innerHTML = `
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/>
      </svg>
      Enviar mensaje`;
  }
}


/* ═══════════════════════════════════════════════
   CATÁLOGO — init slider al cargar
═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  inicializarSesion();
  const slider = document.getElementById('filtroSlider');
  if (slider) slider.style.setProperty('--val', '100%');
});

/* ═══════════════════════════════════════════════════════════
   CATÁLOGO — lógica dinámica para catalogo.html
   Opera sobre #catGrid con datos desde GET /api/productos
═══════════════════════════════════════════════════════════ */

let CATALOGO_TODOS = [];  // cache de todos los productos desde la BD
let categoriaActiva = 'todos';

async function cargarCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;  // no estamos en catalogo.html

  grid.innerHTML = '<p style="padding:2rem;color:#64748b">Cargando productos...</p>';

  try {
    const res  = await fetch(`${API}/productos`);
    const data = await res.json();

    if (!data.ok || !data.productos?.length) {
      grid.innerHTML = `
        <div class="state-empty" style="grid-column:1/-1">
          <div class="state-empty__icon">😕</div>
          <p class="state-empty__title">No hay productos disponibles</p>
        </div>`;
      return;
    }

    CATALOGO_TODOS = data.productos;
    /* Poblar marcas dinámicamente */
const selectMarca = document.getElementById('filtroMarca');
if (selectMarca) {
  const marcas = [...new Set(
    data.productos
      .map(p => p.marca)
      .filter(Boolean)
      .sort()
  )];
  selectMarca.innerHTML = '<option value="todas">Todas</option>' +
    marcas.map(m => `<option value="${m.toLowerCase()}">${m}</option>`).join('');
}
    filtrarProductos();  // renderiza con filtros en estado inicial

  } catch (e) {
    console.error('[Catálogo] Error cargando productos:', e.message);
    grid.innerHTML = `
      <div class="state-empty" style="grid-column:1/-1">
        <p class="state-empty__title">Error al cargar productos</p>
        <p class="state-empty__desc">Verificá que el servidor esté corriendo.</p>
      </div>`;
  }
}

/* ── Renderiza cards en #catGrid según filtros activos ── */
function filtrarProductos() {
  const grid = document.getElementById('catGrid');
  if (!grid || !CATALOGO_TODOS.length) return;

  const query      = (document.getElementById('catSearchInput')?.value || '').toLowerCase().trim();
  const marca      = document.getElementById('filtroMarca')?.value || 'todas';
  const precioMax  = parseInt(document.getElementById('filtroSlider')?.value || '10000');
  const orden      = document.getElementById('sortSelect')?.value || 'relevancia';
  const catActiva = categoriaActiva;

  let productos = [...CATALOGO_TODOS];

  /* Filtro categoría */
  if (catActiva !== 'todos') {
    const mapCat = {
      'televisores': 'Televisores',
      'hardware':    ['Hardware', 'Hardware PC'],
      'celulares':   ['Celulares', 'Smartphones']
    };
    const cats = mapCat[catActiva];
    if (Array.isArray(cats)) {
      productos = productos.filter(p => cats.includes(p.categoria));
    } else if (cats) {
      productos = productos.filter(p => p.categoria === cats);
    }
  }

  /* Filtro búsqueda */
  if (query) {
    productos = productos.filter(p =>
      p.nombre.toLowerCase().includes(query) ||
      (p.marca && p.marca.toLowerCase().includes(query))
    );
  }

  /* Filtro marca */
  if (marca !== 'todas') {
    productos = productos.filter(p =>
      p.marca && p.marca.toLowerCase() === marca.toLowerCase()
    );
  }

  /* Filtro precio máximo */
  productos = productos.filter(p => parseFloat(p.precio_actual) <= precioMax);

  /* Ordenar */
  if (orden === 'precio-asc')  productos.sort((a, b) => a.precio_actual - b.precio_actual);
  if (orden === 'precio-desc') productos.sort((a, b) => b.precio_actual - a.precio_actual);
  if (orden === 'descuento')   productos.sort((a, b) => {
    const descA = a.precio_anterior ? a.precio_anterior - a.precio_actual : 0;
    const descB = b.precio_anterior ? b.precio_anterior - b.precio_actual : 0;
    return descB - descA;
  });

  /* Actualizar contador */
  const conteo = document.getElementById('conteoProductos');
  if (conteo) conteo.textContent = productos.length;

  /* Estado vacío */
  const emptyState = document.getElementById('emptyState');

  if (!productos.length) {
    grid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'flex';
    return;
  }
  if (emptyState) emptyState.style.display = 'none';

  /* Renderizar */
  grid.innerHTML = productos.map(p => {
    const precioActual   = parseFloat(p.precio_actual);
    const precioAnterior = p.precio_anterior ? parseFloat(p.precio_anterior) : null;
    const descuento      = precioAnterior
      ? Math.round((1 - precioActual / precioAnterior) * 100)
      : null;

    const badgeHtml = descuento && descuento > 0
      ? `<span class="badge badge--deal">−${descuento}%</span>`
      : '';

    const precioOldHtml = precioAnterior
      ? `<p class="pold">${formatPen(precioAnterior)}</p>`
      : '';

    const imgHtml = p.imagen
      ? `<img src="${escapeHtml(p.imagen)}" alt="${escapeHtml(p.nombre)}"
             class="pcard__img pcard__img--real" loading="lazy"
             onerror="this.onerror=null; this.src='https://placehold.co/400x400/eeeeee/999999?text=Sin+Imagen';">`
      : `<div class="pcard__img ${getImgClass(p.categoria)}"></div>`;

    /* Badge de fuente (tienda scrapeada) */
    const fuenteLabel = {
      'LaCuracao': 'La Curaçao',
      'PlazaVea':  'Plaza Vea',
      'Hiraoka':   'Hiraoka',
      'Falabella': 'Falabella',
      'Wilson':    'Wilson',
      'Impacto':   'Impacto',
      'CyC':       'C&C Computer',
      'CompuVision': 'CompuVision',
      'Sercoplus': 'Sercoplus',
      'Manual':    null
    }[p.fuente] || null;

    const fuenteBadge = fuenteLabel
      ? `<span class="stag stag--fuente stag--${(p.fuente || '').toLowerCase()}">${fuenteLabel}</span>`
      : `<span class="stag stag--meli">${escapeHtml(p.categoria)}</span>`;

    /* Botones de acción: siempre mostrar "Ver historial", y si hay tienda/comparar, mostrarlos abajo */
    const btnAccion = p.url_producto
      ? `<a href="detalle-producto.html?id=${escapeHtml(p.detalle_id || p.id)}" class="btn-ver" style="margin-top:0.75rem; background:var(--indigo); color:white;">
            📊 Ver historial y gráfico
         </a>
         <div style="display:flex; gap:0.5rem; width:100%; margin-top:0.5rem;">
          <a href="${escapeHtml(p.url_producto)}" target="_blank" rel="noopener noreferrer"
             class="btn-ver btn-ver--store" style="flex:1; text-align:center; padding:0.5rem 0; font-size:0.85rem;">
             Tienda ↗
          </a>
          <button onclick="abrirComparador(event, '${escapeHtml(p.id)}')" 
                  class="btn-ver" style="flex:1; background:var(--blue-50); color:var(--blue-700); border:1px solid var(--blue-200); cursor:pointer; font-weight:600; display:flex; align-items:center; justify-content:center; gap:4px; padding:0.5rem 0; font-size:0.85rem;">
                  ⚖ Comparar
          </button>
         </div>`
      : `<a href="detalle-producto.html?id=${escapeHtml(p.detalle_id || p.id)}" class="btn-ver" style="margin-top:0.75rem; background:var(--indigo); color:white;">
            📊 Ver historial y precios
         </a>`;

    return `
      <article class="pcard"
        data-cat="${(p.categoria || '').toLowerCase().replace(' ', '')}"
        data-marca="${(p.marca || '').toLowerCase()}"
        data-precio="${precioActual}"
        data-descuento="${descuento || 0}">
        <div class="pcard__img-wrap">
          ${imgHtml}
          ${badgeHtml}
          <button class="btn-bell" aria-label="Alerta de precio"
            onclick="abrirAlertaCatalogo(event,'${escapeHtml(p.id)}')">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
        </div>
        <div class="pcard__body">
          <span class="pbrand">${escapeHtml(p.marca || p.categoria)}</span>
          <h3 class="pname">${escapeHtml(p.nombre)}</h3>
          <div class="pprice-row">
            <p class="pprice">${formatPen(precioActual)}</p>
            ${precioOldHtml}
          </div>
          <div class="stags">
            ${fuenteBadge}
          </div>
          ${btnAccion}
        </div>
      </article>`;
  }).join('');
}

/* ── Filtro por categoría desde los botones del panel ── */
function filtrarCategoria(cat, btn) {
  categoriaActiva = cat;
  document.querySelectorAll('.filter-cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filtrarProductos();
}

/* ── Slider de precio máximo ── */
function actualizarSlider(input) {
  const val = parseInt(input.value).toLocaleString('es-PE');
  const label = document.getElementById('precioLabel');
  const maxLabel = document.getElementById('precioMax');
  if (label)    label.textContent    = `S/ ${val}`;
  if (maxLabel) maxLabel.textContent = `S/${val}`;
  filtrarProductos();
}

/* ── Abrir modal de alerta desde catálogo dinámico ── */
function abrirAlertaCatalogo(event, productoId) {
  event.stopPropagation();
  const p = CATALOGO_TODOS.find(x => x.id === productoId);
  if (!p) return;

  /* Inyectar en STATE.results para que abrirAlertaModal lo encuentre */
  const yaExiste = STATE.results.find(r => r.id === productoId);
  if (!yaExiste) {
    STATE.results.push({
      id:        p.id,
      titulo:    p.nombre,
      precio:    formatPen(p.precio_actual),
      precioNum: parseFloat(p.precio_actual)
    });
  }

  abrirAlertaModal(productoId);
}

/* ── Inicializar catálogo al cargar la página ── */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('catGrid')) {
    cargarCatalogo();
  }
});

/* ═══════════════════════════════════════════════
   COMPARADOR DE PRECIOS — busca similitudes en BD
   y muestra la comparativa en un modal
   ═══════════════════════════════════════════════ */

function encontrarProductosSimilares(pOriginal) {
  if (!pOriginal || !pOriginal.nombre) return [];
  const nombreLargo = pOriginal.nombre.toLowerCase();
  
  // Limpiar signos de puntuación y separar en palabras
  const palabras = nombreLargo
    .replace(/[(),.\-\[\]\/]/g, ' ') // limpiar signos
    .split(/\s+/)
    .filter(Boolean);

  // Intentamos extraer códigos específicos del modelo de hardware
  const modelosClave = palabras.filter(w => {
    // Si contiene dígitos y letras (ej: 7800x3d, 3000g, rtx4070) pero ignorando palabras irrelevantes de hardware
    if (/\d+[a-zA-Z]|[a-zA-Z]+\d+/.test(w)) {
      return !['bits', 'ventiladores', 'ventilador', 'fan', 'watts', '180w', '90w', '65w', '128bits', '256bits', '192bits'].some(ex => w.includes(ex));
    }
    // Si es un número puro de 3 o más dígitos (ej: 5060, 5050, 5600, 12700)
    if (/^\d{3,}$/.test(w)) return true;
    // Series de GPU/CPU conocidas
    if (['rtx', 'gtx', 'rx', 'ryzen', 'athlon', 'i3', 'i5', 'i7', 'i9'].includes(w)) return true;
    return false;
  });

  // Si encontramos identificadores específicos de modelo, los usamos obligatoriamente
  let palabrasBusqueda = [...modelosClave];
  
  // Si no hay modelos específicos detectados (por ejemplo, en periféricos u otros componentes), usamos fallback de palabras normales
  if (palabrasBusqueda.length === 0) {
    const palabrasFiltradas = palabras.filter(w => 
      w.length > 2 && 
      !['tarjeta', 'video', 'placa', 'madre', 'procesador', 'memoria', 'disco', 'duro', 'externo', 'interno', 'solido',
        'ghz', 'core', 'hasta', 'nucleos', 'smartcache', 'lga1700', 'am4', 'am5', 'oem', 'w/cool', 'smart', 'intel', 'amd', 'gb', 'asus', 'gigabyte', 'msi', 'evga'].includes(w)
    );
    palabrasBusqueda = palabrasFiltradas.slice(0, 3);
  }

  if (palabrasBusqueda.length === 0) return [];

  return CATALOGO_TODOS.filter(p => {
    if (p.id === pOriginal.id) return false;
    
    const pNombre = p.nombre.toLowerCase();
    // Debe cumplir con TODAS las palabras clave de búsqueda
    return palabrasBusqueda.every(word => pNombre.includes(word));
  });
}

function abrirComparador(event, productoId) {
  if (event) event.stopPropagation();
  
  const p = CATALOGO_TODOS.find(x => x.id === productoId);
  if (!p) return;

  document.getElementById('modalComparar')?.remove();

  const comparables = encontrarProductosSimilares(p);
  
  // Formatear el listado
  let listHtml = '';
  const originalTienda = {
    'LaCuracao': 'La Curaçao',
    'PlazaVea':  'Plaza Vea',
    'Hiraoka':   'Hiraoka',
    'Falabella': 'Falabella',
    'Wilson':    'Wilson',
    'Impacto':   'Impacto',
    'CyC':       'C&C Computer',
    'CompuVision': 'CompuVision',
    'Sercoplus': 'Sercoplus'
  }[p.fuente] || p.fuente || 'Tu selección';

  // Mostrar el seleccionado como encabezado destacado
  let originalItemHtml = `
    <div class="store-item" style="display:flex; justify-content:space-between; align-items:center; padding:1.15rem 1.25rem; background:#f0f4ff; border-radius:var(--radius-lg); margin-bottom:1.25rem; border-left:4px solid var(--blue-600); box-shadow: 0 2px 8px rgba(37,99,235,0.06); border-top: 1px solid var(--blue-100); border-right: 1px solid var(--blue-100); border-bottom: 1px solid var(--blue-100);">
      <div>
        <strong style="color:var(--navy); font-size:1.05rem;">${escapeHtml(originalTienda)}</strong>
        <small style="display:block; color:var(--blue-600); font-weight:600; margin-top:2px;">Producto seleccionado</small>
      </div>
      <div class="store-right" style="display:flex; align-items:center; gap:1.25rem;">
        <span style="font-size:1.25rem; font-weight:800; color:var(--navy);">${formatPen(p.precio_actual)}</span>
        ${p.url_producto ? `
        <a href="${escapeHtml(p.url_producto)}" target="_blank" rel="noopener noreferrer" 
           style="background:var(--blue-600); color:#fff; border:none; padding:0.45rem 0.9rem; border-radius:var(--radius-md); font-weight:600; text-decoration:none; font-size:0.88rem; display:flex; align-items:center; gap:4px;">
           Ir ↗
        </a>` : '<span style="color:#94a3b8">—</span>'}
      </div>
    </div>`;

  if (comparables.length > 0) {
    // Ordenar por precio ascendente
    comparables.sort((a, b) => parseFloat(a.precio_actual) - parseFloat(b.precio_actual));
    
    const listadoAlt = comparables.map(c => {
      const tiendaName = {
        'LaCuracao': 'La Curaçao',
        'PlazaVea':  'Plaza Vea',
        'Hiraoka':   'Hiraoka',
        'Falabella': 'Falabella',
        'Wilson':    'Wilson',
        'Impacto':   'Impacto',
        'CyC':       'C&C Computer',
        'CompuVision': 'CompuVision',
        'Sercoplus': 'Sercoplus'
      }[c.fuente] || c.fuente || 'Tienda';
      
      const esMasBarato = parseFloat(c.precio_actual) < parseFloat(p.precio_actual);
      
      return `
        <div class="store-item" style="display:flex; justify-content:space-between; align-items:center; padding:1.15rem 1.25rem; border-bottom:1px solid #f1f5f9; border-radius:var(--radius-md); transition: background-color 0.2s;">
          <div>
            <strong style="color:var(--navy); font-size:1.02rem; display:block;">${escapeHtml(tiendaName)}</strong>
            <span style="font-size:0.85rem; color:#64748b; display:block; margin-top:2px; max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(c.nombre)}">${escapeHtml(c.nombre)}</span>
            ${esMasBarato ? '<span style="display:inline-block; background:#dcfce7; color:#15803d; font-size:0.75rem; font-weight:700; padding:2px 6px; border-radius:4px; margin-top:6px;">✓ Más económico</span>' : ''}
          </div>
          <div class="store-right" style="display:flex; align-items:center; gap:1.25rem;">
            <span style="font-size:1.2rem; font-weight:800; color:var(--navy);">${formatPen(c.precio_actual)}</span>
            <a href="${escapeHtml(c.url_producto)}" target="_blank" rel="noopener noreferrer" 
               style="background:#f1f5f9; color:var(--navy); border:1px solid #e2e8f0; padding:0.45rem 0.9rem; border-radius:var(--radius-md); font-weight:600; text-decoration:none; font-size:0.88rem; display:inline-block;"
               onmouseover="this.style.background='#e2e8f0'"
               onmouseout="this.style.background='#f1f5f9'">
               Ver tienda ↗
            </a>
          </div>
        </div>`;
    }).join('');
    
    listHtml = `
      <div style="margin-top:1.5rem;">
        <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; tracking:0.05em; margin-bottom:0.75rem;">Alternativas encontradas</h4>
        <div style="display:flex; flex-direction:column; gap:0.25rem; border:1px solid #e2e8f0; border-radius:var(--radius-lg); overflow:hidden; background:#fff;">
          ${listadoAlt}
        </div>
      </div>`;
  } else {
    listHtml = `
      <div style="text-align:center; padding:3rem 1.5rem; background:#f8fafc; border:1px dashed #e2e8f0; border-radius:var(--radius-xl); margin-top:1.5rem;">
        <div style="font-size:2.25rem; margin-bottom:0.75rem;">🔍</div>
        <h4 style="font-size:1.05rem; font-weight:700; color:var(--navy); margin-bottom:0.25rem;">No se encontraron otros precios</h4>
        <p style="font-size:0.88rem; color:#64748b; max-width:320px; margin:0 auto;">Este modelo no está registrado en otras tiendas actualmente para comparar de forma idéntica.</p>
      </div>`;
  }

  const modal = document.createElement('div');
  modal.id = 'modalComparar';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal" style="max-width:640px;">
      <button class="modal__close" onclick="document.getElementById('modalComparar').remove();document.body.style.overflow=''" aria-label="Cerrar">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:0.5rem;">
        <span style="font-size:1.75rem;">⚖</span>
        <h3 class="modal__view-title" style="margin:0; font-size:1.35rem; font-weight:800; color:var(--navy);">Comparador de Precios</h3>
      </div>
      <p class="modal__view-sub" style="font-size:0.95rem; color:#475569; margin:0 0 1.5rem 0; line-height:1.4; border-bottom:1px solid #f1f5f9; padding-bottom:1rem;">
        <strong>${escapeHtml(p.nombre)}</strong>
      </p>
      
      <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; tracking:0.05em; margin-bottom:0.5rem;">Tu selección</h4>
      ${originalItemHtml}
      
      ${listHtml}
    </div>`;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('is-open'));
  document.body.style.overflow = 'hidden';
}

/* ─────────────────────────────────────────────────────────────
   MÓDULO DE PUBLICIDAD SELECTIVA
───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Solo se muestra en index y catalogo
  const path = window.location.pathname;
  const isTargetPage = path.includes('index.html') || path.includes('catalogo.html') || path === '/' || path.endsWith('pricescope/') || path.endsWith('frontend/');
  
  if (!isTargetPage) return;

  const AD_COOLDOWN = 0; // 0 minutos para pruebas (antes 30 min)
  const closedAtStr = localStorage.getItem('adPopupClosedAt_v2');
  if (closedAtStr) {
    const closedAt = parseInt(closedAtStr, 10);
    if (Date.now() - closedAt < AD_COOLDOWN) {
      return; // Aún en cooldown, no mostrar
    }
  }

  // Secuencia fija de empresas (usando tiendas reales scrapeadas)
  const AD_COMPANIES = ['CyC', 'Impacto', 'CompuVision', 'Sercoplus'];
  const COMPANY_LABELS = {
    'CyC': 'C&C Computer',
    'Impacto': 'Impacto',
    'CompuVision': 'CompuVision',
    'Sercoplus': 'Sercoplus'
  };

  let compIndex = parseInt(localStorage.getItem('adCompanyIndex_v3') || '0', 10);
  if (compIndex >= AD_COMPANIES.length || isNaN(compIndex)) compIndex = 0;
  
  const currentCompany = AD_COMPANIES[compIndex];
  const companyLabel = COMPANY_LABELS[currentCompany];

  // Fetch dinámico de la BD para sacar productos reales
  const API_URL = typeof API !== 'undefined' ? API : 'http://localhost:3000/api';
  fetch(`${API_URL}/productos`)
    .then(res => res.json())
    .then(data => {
      if (!data.ok || !data.productos) return;

      const companyProducts = data.productos.filter(p => p.fuente === currentCompany && p.imagen && p.imagen.length > 5);
      if (companyProducts.length === 0) return; // No hay productos
      
      localStorage.setItem('adCompanyIndex_v3', (compIndex + 1) % AD_COMPANIES.length);

      // Mezclar los productos aleatoriamente y tomar 4
      companyProducts.sort(() => Math.random() - 0.5);
      const ads = companyProducts.slice(0, 4);

      // Construir el HTML del pop-up
      const popup = document.createElement('div');
      popup.id = 'adPopupModal';
      popup.className = 'ad-popup-overlay';
      popup.innerHTML = `
        <div class="ad-popup-modal">
          <div class="ad-popup-progress-bar" id="adProgressBar"></div>
          <button class="ad-popup-close" id="adPopupCloseBtn" aria-label="Cerrar publicidad">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <div class="ad-popup-header">
            <span class="ad-popup-sponsor">Promociones destacadas en</span>
            <h3 class="ad-popup-company">${companyLabel}</h3>
          </div>
          <div class="ad-popup-slider-container">
            <div class="ad-popup-slider" id="adPopupSlider">
              ${ads.map((ad, i) => `
                <div class="ad-popup-slide" style="transform: translateX(${i * 100}%)" data-url="${ad.url_producto}">
                  <div class="ad-badge-wrap"><span class="ad-badge">🔥 DESTACADO</span></div>
                  <img src="${ad.imagen}" alt="${escapeHtml(ad.nombre)}" />
                  <div class="ad-popup-info">
                    <h4>${escapeHtml(ad.nombre)}</h4>
                    <p class="ad-price">${formatPen(parseFloat(ad.precio_actual))}</p>
                    <button class="ad-cta">¡Ver Oferta!</button>
                  </div>
                </div>
              `).join('')}
            </div>
            ${ads.length > 1 ? `
            <button class="ad-slider-btn prev" id="adSliderPrev">◀</button>
            <button class="ad-slider-btn next" id="adSliderNext">▶</button>
            <div class="ad-slider-dots">
              ${ads.map((_, i) => `<span class="ad-dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></span>`).join('')}
            </div>
            ` : ''}
          </div>
        </div>
      `;

      document.body.appendChild(popup);

      // Lógica del Slider
      let currentSlide = 0;
      const slides = popup.querySelectorAll('.ad-popup-slide');
      const dots = popup.querySelectorAll('.ad-dot');
      const totalSlides = slides.length;
      let autoSlideInterval;

      function updateSlider() {
        slides.forEach((slide, i) => {
          slide.style.transform = `translateX(${(i - currentSlide) * 100}%)`;
        });
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentSlide);
        });
      }

      function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
      }

      function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
      }

      function startAutoSlide() {
        if (totalSlides > 1) {
          autoSlideInterval = setInterval(nextSlide, 4000);
        }
      }

      function stopAutoSlide() {
        clearInterval(autoSlideInterval);
      }

      if (totalSlides > 1) {
        popup.querySelector('#adSliderNext').addEventListener('click', () => {
          stopAutoSlide(); nextSlide(); startAutoSlide();
        });
        popup.querySelector('#adSliderPrev').addEventListener('click', () => {
          stopAutoSlide(); prevSlide(); startAutoSlide();
        });
        dots.forEach(dot => {
          dot.addEventListener('click', (e) => {
            stopAutoSlide();
            currentSlide = parseInt(e.target.dataset.idx, 10);
            updateSlider();
            startAutoSlide();
          });
        });
      }

      // Redirigir a la oferta al hacer clic en el slide
      slides.forEach(slide => {
        slide.addEventListener('click', (e) => {
          if (!e.target.closest('.ad-slider-btn') && !e.target.closest('.ad-dot')) {
             const url = slide.dataset.url && slide.dataset.url !== '#' ? slide.dataset.url : 'https://www.google.com/search?q=' + encodeURIComponent(companyLabel);
             window.open(url, '_blank');
          }
        });
      });

      popup.querySelector('#adPopupCloseBtn').addEventListener('click', () => {
        popup.classList.remove('is-open');
        setTimeout(() => popup.remove(), 300);
        localStorage.setItem('adPopupClosedAt_v2', Date.now().toString());
      });

      // Mostrar el pop-up tras un breve retraso
      setTimeout(() => {
        popup.classList.add('is-open');
        startAutoSlide();
      }, 1200);

    })
    .catch(err => console.error("Error cargando productos para popup:", err));

});
