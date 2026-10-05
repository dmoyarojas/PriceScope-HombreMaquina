/* ================================================================
   PriceScope — supabase_schema.sql
   Corre este script en el SQL Editor de Supabase:
   https://supabase.com/dashboard/project/kplsiiopyyekkkphmaoj/sql/new
================================================================ */

-- ── Tabla: usuarios ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id              BIGSERIAL PRIMARY KEY,
  nombre          VARCHAR(100)  NOT NULL,
  correo          VARCHAR(150)  NOT NULL UNIQUE,
  contrasena      VARCHAR(255)  NOT NULL,
  fecha_registro  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Tabla: productos ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS productos (
  id              VARCHAR(100)   PRIMARY KEY,
  nombre          VARCHAR(300)   NOT NULL,
  marca           VARCHAR(100),
  modelo          VARCHAR(100),
  categoria       VARCHAR(100),
  descripcion     TEXT,
  imagen          TEXT,
  precio_actual   NUMERIC(10,2),
  precio_anterior NUMERIC(10,2),
  url_producto    TEXT,
  fuente          VARCHAR(50)    DEFAULT 'Manual',  -- 'LaCuracao', 'PlazaVea', 'Manual'
  detalle_id      VARCHAR(100),
  activo          BOOLEAN        NOT NULL DEFAULT TRUE,
  fecha_actualizacion TIMESTAMPTZ DEFAULT NOW()
);

-- Si la tabla ya existe, agrega las columnas:
ALTER TABLE productos ADD COLUMN IF NOT EXISTS fuente VARCHAR(50) DEFAULT 'Manual';
ALTER TABLE productos ADD COLUMN IF NOT EXISTS agotado BOOLEAN DEFAULT FALSE;

-- ── Tabla: alertas ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alertas (
  id                 BIGSERIAL PRIMARY KEY,
  usuario_id         BIGINT        NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  producto_nombre    VARCHAR(300)  NOT NULL,
  producto_marca     VARCHAR(100),
  producto_modelo    VARCHAR(100),
  pulgadas           VARCHAR(20),
  precio_objetivo    NUMERIC(10,2) NOT NULL,
  precio_min         NUMERIC(10,2),
  precio_max         NUMERIC(10,2),
  precio_actual      NUMERIC(10,2),
  precio_disparado   NUMERIC(10,2),
  fuentes            VARCHAR(200)  DEFAULT 'MercadoLibre,eBay,Amazon',
  detalle_id         VARCHAR(100),
  activa             BOOLEAN       NOT NULL DEFAULT TRUE,
  disparada          BOOLEAN       NOT NULL DEFAULT FALSE,
  notificacion_vista BOOLEAN       NOT NULL DEFAULT FALSE,
  fecha_creacion     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  fecha_disparo      TIMESTAMPTZ
);

-- ── Tabla: historial_precios ──────────────────────────────────
CREATE TABLE IF NOT EXISTS historial_precios (
  id              BIGSERIAL PRIMARY KEY,
  producto_nombre VARCHAR(300)   NOT NULL,
  precio          NUMERIC(10,2)  NOT NULL,
  fuente          VARCHAR(100),
  url_producto    TEXT,
  fecha           TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ── Índices útiles ────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_alertas_usuario    ON alertas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_alertas_activa     ON alertas(activa, disparada);
CREATE INDEX IF NOT EXISTS idx_historial_nombre   ON historial_precios(producto_nombre);
CREATE INDEX IF NOT EXISTS idx_historial_fecha    ON historial_precios(fecha);

-- ── Función RPC para historial agrupado ───────────────────────
-- Se usa desde historial.js vía supabase.rpc('get_historial_precios', {...})
CREATE OR REPLACE FUNCTION get_historial_precios(p_nombre TEXT)
RETURNS TABLE (
  fecha           TEXT,
  precio_minimo   NUMERIC,
  precio_maximo   NUMERIC,
  precio_promedio NUMERIC,
  fuente          VARCHAR
) LANGUAGE sql AS $$
  SELECT
    TO_CHAR(DATE_TRUNC('day', h.fecha), 'YYYY-MM-DD HH24:MI') AS fecha,
    MIN(h.precio)   AS precio_minimo,
    MAX(h.precio)   AS precio_maximo,
    AVG(h.precio)   AS precio_promedio,
    h.fuente
  FROM historial_precios h
  WHERE h.producto_nombre ILIKE '%' || p_nombre || '%'
  GROUP BY DATE_TRUNC('day', h.fecha), h.fuente
  ORDER BY DATE_TRUNC('day', h.fecha) ASC
  LIMIT 60;
$$;

CREATE OR REPLACE FUNCTION get_historial_stats(p_nombre TEXT)
RETURNS TABLE (
  minimo          NUMERIC,
  maximo          NUMERIC,
  promedio        NUMERIC,
  total_registros BIGINT,
  precio_actual   NUMERIC
) LANGUAGE sql AS $$
  SELECT
    MIN(precio)   AS minimo,
    MAX(precio)   AS maximo,
    AVG(precio)   AS promedio,
    COUNT(*)      AS total_registros,
    (SELECT precio FROM historial_precios
     WHERE producto_nombre ILIKE '%' || p_nombre || '%'
     ORDER BY fecha DESC LIMIT 1) AS precio_actual
  FROM historial_precios
  WHERE producto_nombre ILIKE '%' || p_nombre || '%';
$$;

-- ── Deshabilitar RLS (Row Level Security) para acceso desde backend ──
-- El backend usa la service key, que salta RLS.
-- Si prefieres habilitar RLS con políticas, coméntalo.
ALTER TABLE usuarios         DISABLE ROW LEVEL SECURITY;
ALTER TABLE productos        DISABLE ROW LEVEL SECURITY;
ALTER TABLE alertas          DISABLE ROW LEVEL SECURITY;
ALTER TABLE historial_precios DISABLE ROW LEVEL SECURITY;
