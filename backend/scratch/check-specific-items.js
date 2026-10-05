require('dotenv').config();
const supabase = require('../db');

async function verify() {
  console.log('--- SPECIFIC PRODUCTS VERIFICATION ---');
  
  // 1. TVs (55", 75", 115" of Samsung, LG, Sony)
  const tvBrands = ['Samsung', 'LG', 'Sony'];
  const tvSizes = ['55', '75', '115'];
  
  console.log('\n[TVs Check]');
  for (const brand of tvBrands) {
    for (const size of tvSizes) {
      const { data, count, error } = await supabase
        .from('productos')
        .select('id, nombre, precio_actual, fuente', { count: 'exact' })
        .eq('categoria', 'Televisores')
        .eq('marca', brand)
        .ilike('nombre', `%${size}%`);
        
      if (error) {
        console.error(`Error checking TV ${brand} ${size}:`, error.message);
        continue;
      }
      
      console.log(`- TV ${brand} ${size}": found ${count} items.`);
      if (count > 0) {
        data.slice(0, 2).forEach(p => console.log(`  * [${p.fuente}] ${p.nombre} (S/ ${p.precio_actual})`));
      }
    }
  }

  // 2. Cellphones (128GB, 256GB of Samsung, Xiaomi, Apple, Motorola)
  const celBrands = ['Samsung', 'Xiaomi', 'Apple', 'Motorola'];
  const celStorages = ['128', '256'];
  
  console.log('\n[Cellphones Check]');
  for (const brand of celBrands) {
    for (const storage of celStorages) {
      const { data, count, error } = await supabase
        .from('productos')
        .select('id, nombre, precio_actual, fuente', { count: 'exact' })
        .eq('categoria', 'Smartphones')
        .eq('marca', brand)
        .ilike('nombre', `%${storage}%`);
        
      if (error) {
        console.error(`Error checking Cellphone ${brand} ${storage}GB:`, error.message);
        continue;
      }
      
      console.log(`- Cellphone ${brand} ${storage}GB: found ${count} items.`);
      if (count > 0) {
        data.slice(0, 2).forEach(p => console.log(`  * [${p.fuente}] ${p.nombre} (S/ ${p.precio_actual})`));
      }
    }
  }

  // 3. Hardware (Disks, GPUs, RAM)
  console.log('\n[Hardware Check]');
  
  // RAM
  const { count: ramCount, data: ramData } = await supabase
    .from('productos')
    .select('nombre, precio_actual, fuente', { count: 'exact' })
    .eq('categoria', 'Hardware PC')
    .or('nombre.ilike.%ram%,nombre.ilike.%ddr%,nombre.ilike.%memoria%');
  console.log(`- RAM: found ${ramCount} items.`);
  if (ramCount > 0) {
    ramData.slice(0, 2).forEach(p => console.log(`  * [${p.fuente}] ${p.nombre} (S/ ${p.precio_actual})`));
  }

  // Tarjetas Gráficas
  const { count: gpuCount, data: gpuData } = await supabase
    .from('productos')
    .select('nombre, precio_actual, fuente', { count: 'exact' })
    .eq('categoria', 'Hardware PC')
    .or('nombre.ilike.%rtx%,nombre.ilike.%gtx%,nombre.ilike.%radeon%,nombre.ilike.%grafica%,nombre.ilike.%rx %');
  console.log(`- Graphics Cards: found ${gpuCount} items.`);
  if (gpuCount > 0) {
    gpuData.slice(0, 2).forEach(p => console.log(`  * [${p.fuente}] ${p.nombre} (S/ ${p.precio_actual})`));
  }

  // Discos Internos/Externos
  const { count: diskCount, data: diskData } = await supabase
    .from('productos')
    .select('nombre, precio_actual, fuente', { count: 'exact' })
    .eq('categoria', 'Hardware PC')
    .or('nombre.ilike.%disco%,nombre.ilike.%ssd%,nombre.ilike.%hdd%,nombre.ilike.%externo%,nombre.ilike.%interno%');
  console.log(`- Disks (Internal/External): found ${diskCount} items.`);
  if (diskCount > 0) {
    diskData.slice(0, 2).forEach(p => console.log(`  * [${p.fuente}] ${p.nombre} (S/ ${p.precio_actual})`));
  }
}

verify().catch(console.error);
