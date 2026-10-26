-- ====================================================================
-- KASE MARKETING DIGITAL: ESTRUCTURA RELACIONAL DEFINITIVA EN SUPABASE
-- Tablas unificadas en inglés: campaigns, conversions, campaign_modules
-- ====================================================================

-- Habilitar extensión pgcrypto para generación de UUIDs si es necesario
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABLA: users (Usuarios del SaaS y PLG)
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'client',
    acquisition_source VARCHAR(100) DEFAULT 'direct_organic',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 2. TABLA: campaigns (Estructura principal unificada en inglés)
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
    clicks_count INT DEFAULT 0,
    plan VARCHAR(50) NOT NULL DEFAULT 'growth',
    status VARCHAR(50) DEFAULT 'active',
    webhook_secret VARCHAR(255) NOT NULL,
    pixel_token VARCHAR(255),
    pixel_verified BOOLEAN DEFAULT FALSE,
    interaction_preferences TEXT,
    communication_tone_instructions TEXT,
    geo_targeting JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paused_at TIMESTAMP WITH TIME ZONE,
    billing JSONB
);

-- Índices optimizados para consultas del core
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_creator_email ON public.campaigns(creator_email);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);

-- 3. TABLA: campaign_modules (Estado de los 8 motores autónomos)
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

-- 4. TABLA: conversions (Eventos logrados por el Enlace Puente y Motores)
CREATE TABLE IF NOT EXISTS public.conversions (
    id VARCHAR(100) PRIMARY KEY,
    campaign_id VARCHAR(100) REFERENCES public.campaigns(id) ON DELETE CASCADE,
    user_id VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    method VARCHAR(50) DEFAULT 'organic_click',
    user_tag VARCHAR(255),
    ip_masked VARCHAR(50),
    referrer TEXT
);
CREATE INDEX IF NOT EXISTS idx_conversions_campaign_id ON public.conversions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_conversions_user_id ON public.conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversions_timestamp ON public.conversions(timestamp DESC);

-- 5. TABLA: system_audit_logs (Bitácora de errores del sistema sin fs)
CREATE TABLE IF NOT EXISTS public.system_audit_logs (
    id VARCHAR(100) PRIMARY KEY,
    campaign_id VARCHAR(100),
    user_id VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    level VARCHAR(20) DEFAULT 'INFO',
    module VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_campaign_id ON public.system_audit_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.system_audit_logs(timestamp DESC);

-- 6. TABLA: payment_transactions (Registro de cobros de Mercado Pago)
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

-- 7. TABLA: global_config (Configuración del sistema en base de datos)
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

-- Inserción inicial de configuración global y usuario administrador
INSERT INTO public.global_config (id, internal_campaign_name, internal_campaign_goal, internal_campaign_current)
VALUES (1, 'Auto-Promoción y Escalamiento de KaSe Marketing', 5000, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, name, email, role, acquisition_source)
VALUES ('kathy_super_admin', 'Kathy Seba', 'kathyseba2020@gmail.com', 'super_admin', 'direct_organic')
ON CONFLICT (email) DO UPDATE SET role = 'super_admin';

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) - TABLAS UNIFICADAS
-- ====================================================================

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para 'campaigns'
DROP POLICY IF EXISTS "Permitir lectura publica de campanas activas" ON public.campaigns;
CREATE POLICY "Permitir lectura publica de campanas activas"
ON public.campaigns FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir gestion de campanas" ON public.campaigns;
CREATE POLICY "Permitir gestion de campanas"
ON public.campaigns FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Políticas para 'conversions'
DROP POLICY IF EXISTS "Permitir lectura de conversiones" ON public.conversions;
CREATE POLICY "Permitir lectura de conversiones"
ON public.conversions FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir insercion de conversiones" ON public.conversions;
CREATE POLICY "Permitir insercion de conversiones"
ON public.conversions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Políticas para 'campaign_modules'
DROP POLICY IF EXISTS "Permitir acceso a modulos" ON public.campaign_modules;
CREATE POLICY "Permitir acceso a modulos"
ON public.campaign_modules FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Políticas para 'system_audit_logs'
DROP POLICY IF EXISTS "Permitir acceso a bitacora" ON public.system_audit_logs;
CREATE POLICY "Permitir acceso a bitacora"
ON public.system_audit_logs FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- ====================================================================
-- FUNCIÓN RPC ATÓMICA NATIVA: increment_clicks (SOBRE 'campaigns' Y 'conversions')
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
BEGIN
    -- 1. Actualizar contador atómico de clics en la tabla unificada 'campaigns'
    UPDATE public.campaigns
    SET clicks_count = COALESCE(clicks_count, 0) + 1,
        updated_at = NOW()
    WHERE id = target_campaign_id
    RETURNING target_url, clicks_count INTO target_destination, current_count;

    -- Si la fila no retornó por coincidencia de formato, consultar fallback
    IF target_destination IS NULL THEN
        SELECT target_url, COALESCE(clicks_count, 0) INTO target_destination, current_count
        FROM public.campaigns
        WHERE id = target_campaign_id;
    END IF;

    -- 2. Registrar evento de conversión de clic de forma atómica en tabla 'conversions'
    INSERT INTO public.conversions (id, campaign_id, timestamp, method, referrer, ip_masked)
    VALUES (
        'conv_rpc_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 6),
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
