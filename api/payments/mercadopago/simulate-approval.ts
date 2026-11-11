import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isSupabaseConfigured, pgPool, mapCampaignToRow } from '../../../src/lib/db.js';
import { executeParallelSyncForCampaign } from '../../../src/lib/engineSynchronizer.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    const campaignData = body.campaign || body;
    const campaignId = campaignData?.id || body.campaignId;

    if (!campaignId) {
      return res.status(400).json({ success: false, error: 'Missing campaignId' });
    }

    const updatedCampaign = {
      ...campaignData,
      id: campaignId,
      status: 'active',
      paymentStatus: 'approved',
      approvedAt: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const row = mapCampaignToRow(updatedCampaign);
      await supabase.from('campaigns').upsert(row, { onConflict: 'id' });
    } else if (pgPool) {
      const client = await pgPool.connect();
      try {
        await client.query(
          "UPDATE campaigns SET status = 'active' WHERE id = $1",
          [campaignId]
        );
      } finally {
        client.release();
      }
    }

    try {
      await executeParallelSyncForCampaign(updatedCampaign, 'initial_activation');
    } catch {}

    return res.status(200).json({
      success: true,
      approved: true,
      campaignId,
      campaign: updatedCampaign
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Error processing checkout approval'
    });
  }
}
