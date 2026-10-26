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

-- ====================================================================
-- FUNCIÓN RPC ATÓMICA NATIVA: increment_clicks
-- Evita race conditions, bloqueos y congelamiento del contador
-- ====================================================================
CREATE OR REPLACE FUNCTION public.increment_clicks(
    target_campaign_id TEXT,
    client_ip TEXT DEFAULT '185.12.***.***',
    client_referrer TEXT DEFAULT 'Enlace Puente KaSe'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_destination TEXT := '/';
    current_count INT := 0;
    is_uuid BOOLEAN := FALSE;
    camp_uuid UUID;
BEGIN
    -- Validar si el ID es UUID válido
    BEGIN
        camp_uuid := target_campaign_id::uuid;
        is_uuid := TRUE;
    EXCEPTION WHEN OTHERS THEN
        is_uuid := FALSE;
    END;

    -- 1. Intentar resolver tabla campanas (UUID) e incrementar contador de clics en metricas_clicks
    IF is_uuid THEN
        SELECT url_destino INTO target_destination FROM public.campanas WHERE id = camp_uuid;

        -- Actualizar contador en metricas_clicks (telemetría de tráfico separada)
        INSERT INTO public.metricas_clicks (campana_id, clics_contador, fecha_actualizacion)
        VALUES (camp_uuid, 1, NOW())
        ON CONFLICT (campana_id)
        DO UPDATE SET
            clics_contador = public.metricas_clicks.clics_contador + 1,
            fecha_actualizacion = NOW()
        RETURNING clics_contador INTO current_count;
    END IF;

    -- 2. Si no es UUID o no se encontró en campanas, registrar clic en tabla campaigns (sin alterar current_registrations)
    IF target_destination = '/' OR target_destination IS NULL THEN
        SELECT target_url INTO target_destination FROM public.campaigns WHERE id = target_campaign_id;

        UPDATE public.campaigns
        SET clicks_count = COALESCE(clicks_count, 0) + 1,
            updated_at = NOW()
        WHERE id = target_campaign_id
        RETURNING target_url, clicks_count INTO target_destination, current_count;
    END IF;

    -- 3. Registrar conversión de manera atómica
    INSERT INTO public.conversions (id, campaign_id, campana_id, timestamp, method, referrer, ip_masked)
    VALUES (
        'conv_rpc_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 6),
        target_campaign_id,
        target_campaign_id,
        NOW(),
        'organic_click',
        client_referrer,
        client_ip
    );

    RETURN jsonb_build_object(
        'success', TRUE,
        'clics_contador', COALESCE(current_count, 1),
        'destination_url', COALESCE(target_destination, '/')
    );
END;
$$;

-- ====================================================================
-- TABLAS DE PRODUCCIÓN ADICIONALES (SIN FS / SERVERLESS READY)
-- ====================================================================

-- 4. TABLA: users (Usuarios del SaaS y PLG)
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'client',
    acquisition_source VARCHAR(100) DEFAULT 'direct_organic',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 5. TABLA: campaigns (Estructura extendida para compatibilidad directa con Node/Vercel)
CREATE TABLE IF NOT EXISTS public.campaigns (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100),
    creator_email VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    target_url TEXT NOT NULL,
    niche VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(100) DEFAULT 'user_registrations',
    target_unit_label VARCHAR(100) DEFAULT 'registros',
    min_plan_price NUMERIC(10, 2),
    max_plan_price NUMERIC(10, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    target_registrations INT NOT NULL DEFAULT 2000,
    current_registrations INT DEFAULT 0,
    plan VARCHAR(50) NOT NULL DEFAULT 'growth',
    status VARCHAR(50) DEFAULT 'active',
    webhook_secret VARCHAR(255) NOT NULL,
    pixel_token VARCHAR(255),
    pixel_verified BOOLEAN DEFAULT FALSE,
    interaction_preferences TEXT,
    communication_tone_instructions TEXT,
    geo_targeting JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paused_at TIMESTAMP WITH TIME ZONE,
    billing JSONB
);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_creator_email ON public.campaigns(creator_email);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);

-- 6. TABLA: campaign_modules (Estado de los 8 motores autónomos)
CREATE TABLE IF NOT EXISTS public.campaign_modules (
    id BIGSERIAL PRIMARY KEY,
    campaign_id VARCHAR(100) REFERENCES public.campaigns(id) ON DELETE CASCADE,
    module_key VARCHAR(50) NOT NULL,
    active BOOLEAN DEFAULT FALSE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    items_processed INT DEFAULT 0,
    last_execution VARCHAR(100),
    status_text TEXT,
    UNIQUE(campaign_id, module_key)
);
CREATE INDEX IF NOT EXISTS idx_campaign_modules_campaign_id ON public.campaign_modules(campaign_id);

-- 7. TABLA: conversions (Eventos logrados por el Enlace Puente y Motores)
CREATE TABLE IF NOT EXISTS public.conversions (
    id VARCHAR(100) PRIMARY KEY,
    campaign_id VARCHAR(100),
    campana_id VARCHAR(100),
    user_id VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    method VARCHAR(50),
    user_tag VARCHAR(255),
    ip_masked VARCHAR(50),
    referrer TEXT
);
CREATE INDEX IF NOT EXISTS idx_conversions_campaign_id ON public.conversions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_conversions_timestamp ON public.conversions(timestamp DESC);

-- 8. TABLA: system_audit_logs (Bitácora de errores del sistema sin fs)
CREATE TABLE IF NOT EXISTS public.system_audit_logs (
    id VARCHAR(100) PRIMARY KEY,
    campaign_id VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    level VARCHAR(20) DEFAULT 'INFO',
    module VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.system_audit_logs(timestamp DESC);

-- 9. TABLA: payment_transactions (Registro de cobros de Mercado Pago Uruguay)
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id VARCHAR(100) PRIMARY KEY,
    campaign_id VARCHAR(100),
    campaign_name VARCHAR(255),
    client_email VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'approved',
    payment_method VARCHAR(50) DEFAULT 'mercadopago_uy',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    mp_payment_id VARCHAR(100),
    mp_preference_id VARCHAR(100)
);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_campaign_id ON public.payment_transactions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_timestamp ON public.payment_transactions(timestamp DESC);

-- 10. TABLA: global_config (Configuración del sistema en base de datos)
CREATE TABLE IF NOT EXISTS public.global_config (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    config JSONB,
    internal_campaign_name VARCHAR(255),
    internal_campaign_goal INT,
    internal_campaign_current INT,
    auto_pause_internal_engines BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'active',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    mercado_pago_access_token TEXT,
    mercado_pago_public_key TEXT,
    test_plan_enabled BOOLEAN DEFAULT TRUE,
    test_plan_used BOOLEAN DEFAULT FALSE,
    installed_local_pixel TEXT,
    installed_local_campaign_id VARCHAR(50)
);

-- Inserción por defecto de configuración y usuario super admin
INSERT INTO public.global_config (id, internal_campaign_name, internal_campaign_goal, internal_campaign_current)
VALUES (1, 'Auto-Promoción y Escalamiento de KaSe Marketing', 5000, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, name, email, role, acquisition_source)
VALUES ('kathy_super_admin', 'Kathy Seba', 'kathyseba2020@gmail.com', 'super_admin', 'direct_organic')
ON CONFLICT (email) DO UPDATE SET role = 'super_admin';
