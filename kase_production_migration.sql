-- ARCHIVO DE MIGRACIÓN: kase_production_migration.sql
-- Objetivo: Migrar de archivos locales JSON a persistencia masiva en PostgreSQL/Supabase
-- Fecha de aplicación: Octubre 2026
-- Ejecutar este script directamente en el editor SQL de la base de datos externa (Supabase / Cloud SQL / Neon / PostgreSQL).

-- 1. ENUMS Y TIPOS DE DATOS CONFIGURADOS
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'campaign_status_type') THEN
        CREATE TYPE campaign_status_type AS ENUM ('active', 'paused_quota_reached', 'paused_manual', 'configuring');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'campaign_category_type') THEN
        CREATE TYPE campaign_category_type AS ENUM ('base', 'advanced');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'campaign_type_enum') THEN
        CREATE TYPE campaign_type_enum AS ENUM ('user_registrations', 'plan_sales', 'social_followers', 'likes_engagement', 'comments_reviews', 'youtube_growth');
    END IF;
END $$;

-- 2. TABLA DE USUARIOS (PLG FLOW Y CONTROL DE ACCESO)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'client' CHECK (role IN ('super_admin', 'client')),
    acquisition_source VARCHAR(100) DEFAULT 'direct_organic',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexación de correos para búsquedas rápidas durante autenticación
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 3. TABLA DE CAMPAÑAS (ESTRUCTURA PRINCIPAL)
CREATE TABLE IF NOT EXISTS campaigns (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    target_url TEXT NOT NULL,
    niche VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type campaign_type_enum NOT NULL DEFAULT 'user_registrations',
    target_unit_label VARCHAR(100) NOT NULL,
    min_plan_price NUMERIC(10, 2),
    max_plan_price NUMERIC(10, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    target_registrations INT NOT NULL,
    current_registrations INT DEFAULT 0,
    plan VARCHAR(50) NOT NULL CHECK (plan IN ('starter', 'growth', 'enterprise')),
    status campaign_status_type DEFAULT 'configuring',
    webhook_secret VARCHAR(255) NOT NULL,
    pixel_token VARCHAR(255) NOT NULL,
    pixel_verified BOOLEAN DEFAULT FALSE,
    interaction_preferences TEXT,
    communication_tone_instructions TEXT,
    geo_targeting JSONB, -- Contiene estructura dinámica de país, región, ciudad y radio
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    paused_at TIMESTAMP WITH TIME ZONE,
    billing JSONB -- Almacena información de pasarela de pago Mercado Pago Uruguay
);

-- Indexación de campañas para optimización de consultas del motor
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);

-- 4. TABLA DE MÓDULOS DE CAPTACIÓN (ESTADO DE LOS 8 MOTORES)
CREATE TABLE IF NOT EXISTS campaign_modules (
    id BIGSERIAL PRIMARY KEY,
    campaign_id VARCHAR(50) REFERENCES campaigns(id) ON DELETE CASCADE,
    module_key VARCHAR(50) NOT NULL, -- mod1_seo, mod2_social, etc.
    active BOOLEAN DEFAULT FALSE,
    name VARCHAR(255) NOT NULL,
    category campaign_category_type NOT NULL,
    items_processed INT DEFAULT 0,
    last_execution VARCHAR(100),
    status_text TEXT,
    UNIQUE(campaign_id, module_key)
);

-- 5. TABLA DE CONVERSIONES Y EVENTOS LOGRADOS
CREATE TABLE IF NOT EXISTS conversions (
    id VARCHAR(50) PRIMARY KEY,
    campaign_id VARCHAR(50) REFERENCES campaigns(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    method VARCHAR(50) CHECK (method IN ('webhook', 'pixel', 'simulator')),
    user_tag VARCHAR(255),
    ip_masked VARCHAR(50),
    referrer TEXT
);

-- Indexación de conversiones por campaña y tiempo
CREATE INDEX IF NOT EXISTS idx_conversions_campaign_id ON conversions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_conversions_timestamp ON conversions(timestamp DESC);

-- 6. TABLA DE AUDITORÍA Y BITÁCORA DEL CORE
CREATE TABLE IF NOT EXISTS system_audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    campaign_id VARCHAR(50) REFERENCES campaigns(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    level VARCHAR(20) CHECK (level IN ('INFO', 'SUCCESS', 'WARNING', 'ALERT')),
    module VARCHAR(100) NOT NULL,
    message TEXT NOT NULL
);

-- Indexación de bitácora
CREATE INDEX IF NOT EXISTS idx_audit_logs_campaign_id ON system_audit_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON system_audit_logs(timestamp DESC);

-- 7. TABLA DE CONFIGURACIÓN GLOBAL KASE Y PREFERENCIAS DEL SISTEMA
CREATE TABLE IF NOT EXISTS global_config (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Garantiza fila única
    global_pixel_code TEXT,
    internal_campaign_name VARCHAR(255),
    internal_campaign_goal INT,
    internal_campaign_current INT,
    auto_pause_internal_engines BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'active',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    mercado_pago_access_token TEXT, -- Se almacenará cifrado por el backend
    mercado_pago_public_key TEXT,
    test_plan_enabled BOOLEAN DEFAULT TRUE,
    test_plan_used BOOLEAN DEFAULT FALSE,
    installed_local_pixel TEXT,
    installed_local_campaign_id VARCHAR(50)
);

-- Inserción por defecto de la fila de configuración master
INSERT INTO global_config (id, internal_campaign_name, internal_campaign_goal, internal_campaign_current)
VALUES (1, 'Auto-Promoción y Escalamiento de KaSe Marketing', 5000, 1840)
ON CONFLICT (id) DO UPDATE SET
    internal_campaign_name = EXCLUDED.internal_campaign_name,
    internal_campaign_goal = EXCLUDED.internal_campaign_goal,
    internal_campaign_current = EXCLUDED.internal_campaign_current;

-- Inserción por defecto del usuario Super Admin de Kathy Seba
INSERT INTO users (id, name, email, role, acquisition_source)
VALUES ('kathy_super_admin', 'Kathy Seba', 'kathyseba2020@gmail.com', 'super_admin', 'direct_organic')
ON CONFLICT (email) DO UPDATE SET role = 'super_admin';
