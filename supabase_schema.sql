-- ====================================================================
-- KASE MARKETING DIGITAL: ESTRUCTURA RELACIONAL DEFINITIVA EN SUPABASE
-- Motores Autónomos: SEO, Social, Directorios, Outbound y Newsletter
-- ====================================================================

-- Habilitar extensión pgcrypto para generación de UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABLA: campanas
CREATE TABLE IF NOT EXISTS public.campanas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    nicho VARCHAR(255),
    url_destino TEXT NOT NULL,
    meta_usuarios INT NOT NULL DEFAULT 2000,
    estado_motores JSONB NOT NULL DEFAULT '{
        "mod1_seo": true,
        "mod2_social": true,
        "mod3_directories": true,
        "mod4_outbound": false,
        "mod5_newsletter": false
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLA: usuarios_registrados
CREATE TABLE IF NOT EXISTS public.usuarios_registrados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campana_id UUID NOT NULL REFERENCES public.campanas(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip VARCHAR(50),
    CONSTRAINT uq_campana_usuario_email UNIQUE (campana_id, email)
);

-- 3. TABLA: metricas_clicks
CREATE TABLE IF NOT EXISTS public.metricas_clicks (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    campana_id UUID NOT NULL UNIQUE REFERENCES public.campanas(id) ON DELETE CASCADE,
    clics_contador INT NOT NULL DEFAULT 0,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ÍNDICES DE ALTO RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_campanas_user_id ON public.campanas(user_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_registrados_campana_id ON public.usuarios_registrados(campana_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_registrados_ip ON public.usuarios_registrados(ip);
CREATE INDEX IF NOT EXISTS idx_metricas_clicks_campana_id ON public.metricas_clicks(campana_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) - AISLAMIENTO POR auth.uid() = user_id
-- ====================================================================

ALTER TABLE public.campanas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios_registrados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metricas_clicks ENABLE ROW LEVEL SECURITY;

-- Políticas para 'campanas': Solo el propietario puede leer sus filas
DROP POLICY IF EXISTS "Usuarios leen sus propias campanas" ON public.campanas;
CREATE POLICY "Usuarios leen sus propias campanas"
ON public.campanas FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios insertan sus propias campanas" ON public.campanas;
CREATE POLICY "Usuarios insertan sus propias campanas"
ON public.campanas FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios actualizan sus propias campanas" ON public.campanas;
CREATE POLICY "Usuarios actualizan sus propias campanas"
ON public.campanas FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios eliminan sus propias campanas" ON public.campanas;
CREATE POLICY "Usuarios eliminan sus propias campanas"
ON public.campanas FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Políticas para 'usuarios_registrados': Propietario lee registros de sus campañas
DROP POLICY IF EXISTS "Usuarios leen registros de sus campanas" ON public.usuarios_registrados;
CREATE POLICY "Usuarios leen registros de sus campanas"
ON public.usuarios_registrados FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.campanas c
        WHERE c.id = public.usuarios_registrados.campana_id
          AND c.user_id = auth.uid()
    )
);

-- Inserción de registros captados desde el Enlace Puente / Webhook
DROP POLICY IF EXISTS "Permitir insercion de usuarios registrados" ON public.usuarios_registrados;
CREATE POLICY "Permitir insercion de usuarios registrados"
ON public.usuarios_registrados FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Políticas para 'metricas_clicks': Propietario lee métricas de sus campañas
DROP POLICY IF EXISTS "Usuarios leen metricas de sus campanas" ON public.metricas_clicks;
CREATE POLICY "Usuarios leen metricas de sus campanas"
ON public.metricas_clicks FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.campanas c
        WHERE c.id = public.metricas_clicks.campana_id
          AND c.user_id = auth.uid()
    )
);

-- Actualización y gestión de contador de clics por el Enrutador Puente
DROP POLICY IF EXISTS "Permitir incremento de clics en metricas" ON public.metricas_clicks;
CREATE POLICY "Permitir incremento de clics en metricas"
ON public.metricas_clicks FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);
