import { Campaign } from '../types/growth.js';

export const INITIAL_PRODUCTION_CAMPAIGNS: Campaign[] = [];

export const FAKE_MOCK_CAMPAIGN_IDS: string[] = [];

export const isFakeCampaign = (_camp?: string | Partial<Campaign> | null): boolean => false;
