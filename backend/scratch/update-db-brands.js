require('dotenv').config();
const supabase = require('../db');

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

async function run() {
  console.log('Fetching all products...');
  const { data: productos, error } = await supabase
    .from('productos')
    .select('id, nombre');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Found ${productos.length} products. Updating brands...`);
  
  let updatedCount = 0;
  const brandStats = {};

  for (const p of productos) {
    const brand = extraerMarca(p.nombre);
    brandStats[brand] = (brandStats[brand] || 0) + 1;

    const { error: updateError } = await supabase
      .from('productos')
      .update({ marca: brand })
      .eq('id', p.id);

    if (updateError) {
      console.error(`Error updating product ${p.id}:`, updateError.message);
    } else {
      updatedCount++;
    }
  }

  console.log(`\nSuccessfully updated ${updatedCount} products.`);
  console.log('Brand distribution:', brandStats);
}

run().catch(console.error);
