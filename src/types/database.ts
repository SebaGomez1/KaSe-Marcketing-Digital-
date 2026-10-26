/**
 * Supabase Relational Database Types for KaSe Marketing Digital
 * Tablas: campanas, usuarios_registrados, metricas_clicks
 */

export interface EstadoMotores {
  mod1_seo?: boolean;
  mod2_social?: boolean;
  mod3_directories?: boolean;
  mod4_outbound?: boolean;
  mod5_newsletter?: boolean;
  [key: string]: boolean | undefined;
}

export interface CampanaRow {
  id: string; // UUID
  user_id: string; // UUID rel auth.users
  nombre: string;
  nicho: string | null;
  url_destino: string;
  meta_usuarios: number;
  estado_motores: EstadoMotores;
  created_at?: string;
  updated_at?: string;
}

export interface UsuarioRegistradoRow {
  id: string; // UUID
  campana_id: string; // UUID rel campanas
  email: string;
  fecha_registro: string;
  ip: string | null;
}

export interface MetricaClickRow {
  id: number; // BIGINT
  campana_id: string; // UUID rel campanas
  clics_contador: number;
  fecha_actualizacion: string;
}

export interface Database {
  public: {
    Tables: {
      campanas: {
        Row: CampanaRow;
        Insert: Omit<CampanaRow, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<CampanaRow>;
      };
      usuarios_registrados: {
        Row: UsuarioRegistradoRow;
        Insert: Omit<UsuarioRegistradoRow, 'id' | 'fecha_registro'> & {
          id?: string;
          fecha_registro?: string;
        };
        Update: Partial<UsuarioRegistradoRow>;
      };
      metricas_clicks: {
        Row: MetricaClickRow;
        Insert: Omit<MetricaClickRow, 'id' | 'fecha_actualizacion'> & {
          id?: number;
          fecha_actualizacion?: string;
        };
        Update: Partial<MetricaClickRow>;
      };
    };
  };
}
