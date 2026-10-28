/**
 * Supabase Relational Database Types for KaSe Marketing Digital
 * Unified English Tables: campaigns, conversions, campaign_modules
 */

export interface CampaignRow {
  id: string;
  user_id: string | null;
  creator_email?: string | null;
  name: string;
  target_url: string;
  niche: string;
  description?: string;
  campaign_type?: string;
  target_unit_label?: string;
  min_plan_price?: number;
  max_plan_price?: number;
  currency?: string;
  target_registrations: number;
  current_registrations: number;
  clicks_count?: number;
  plan: string;
  status: string;
  webhook_secret: string;
  pixel_token?: string;
  pixel_verified?: boolean;
  interaction_preferences?: string;
  communication_tone_instructions?: string;
  geo_targeting?: any;
  created_at?: string;
  updated_at?: string;
  paused_at?: string;
  billing?: any;
}

export interface ConversionRow {
  id: string;
  campaign_id: string;
  user_id?: string | null;
  timestamp: string;
  method?: string;
  user_tag?: string;
  ip_masked?: string;
  referrer?: string;
}

export interface CampaignModuleRow {
  id: number;
  campaign_id: string;
  module_key: string;
  active: boolean;
  name: string;
  category: string;
  items_processed: number;
  last_execution?: string;
  status_text?: string;
}

export interface CampaignSyncLogRow {
  id: string;
  campaign_id: string;
  user_id?: string | null;
  timestamp: string;
  trigger_type: string;
  engine_id: string;
  engine_name: string;
  status: string;
  status_code: number;
  latency_ms: number;
  action_executed: string;
  data_updated?: any;
  error_message?: string | null;
}

export interface Database {
  public: {
    Tables: {
      campaigns: {
        Row: CampaignRow;
        Insert: Partial<CampaignRow> & { id: string; name: string; target_url: string };
        Update: Partial<CampaignRow>;
      };
      conversions: {
        Row: ConversionRow;
        Insert: ConversionRow;
        Update: Partial<ConversionRow>;
      };
      campaign_modules: {
        Row: CampaignModuleRow;
        Insert: Omit<CampaignModuleRow, 'id'> & { id?: number };
        Update: Partial<CampaignModuleRow>;
      };
      campaign_sync_logs: {
        Row: CampaignSyncLogRow;
        Insert: CampaignSyncLogRow;
        Update: Partial<CampaignSyncLogRow>;
      };
    };
  };
}

