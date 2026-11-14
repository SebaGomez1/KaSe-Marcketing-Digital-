import { Campaign } from '../types/growth.js';

export const INITIAL_PRODUCTION_CAMPAIGNS: Campaign[] = [];

export const isFakeCampaign = (_camp?: string | Partial<Campaign> | null): boolean => false;

