/* ================================================================
   PriceScope — db.js
   Conexión a Supabase (PostgreSQL en la nube)
   Interfaz: db.query(sql, params) → [rows]   (igual que mysql2)
================================================================ */
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL        = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Faltan SUPABASE_URL o SUPABASE_SERVICE_KEY en .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

/* ── Verificar conexión al iniciar ── */
supabase
  .from('usuarios')
  .select('id', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error('❌ Error conectando a Supabase:', error.message);
    } else {
      console.log('✅ Conectado a Supabase correctamente');
    }
  });

module.exports = supabase;
