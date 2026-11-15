import { supabase, isSupabaseConfigured, pgPool, mapRowToCampaign } from '../../src/lib/db.js';
import { executeParallelSyncForCampaign } from '../../src/lib/engineSynchronizer.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const targetCampaignId: string | undefined = req.body?.campaignId;
  const incomingTrigger = req.body?.triggerType;
  const triggerType: 'cron_15m' | 'initial_activation' | 'manual_sync' =
    incomingTrigger === 'initial_activation' || incomingTrigger === 'manual_sync'
      ? incomingTrigger
      : 'cron_15m';

  try {
    let allCamps: any[] = [];

    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('campaigns').select('*');
      if (data) {
        allCamps = data.map((r: any) => mapRowToCampaign(r, [], [], []));
      }
    } else if (pgPool) {
      const client = await pgPool.connect();
      try {
        const result = await client.query('SELECT * FROM campaigns');
        allCamps = result.rows.map((r: any) => mapRowToCampaign(r, [], [], []));
      } finally {
        client.release();
      }
    }

    const candidateCamps = allCamps.filter((c) => {
      if (!c || c.status === 'paused_quota_reached' || c.status === 'configuring') return false;
      if (targetCampaignId) return c.id === targetCampaignId;
      return c.currentRegistrations < c.targetRegistrations;
    });

    const results = [];
    for (const camp of candidateCamps) {
      const syncRes: any = await executeParallelSyncForCampaign(camp, triggerType);
      results.push({
        id: camp.id,
        name: camp.name,
        triggerType,
        current: camp.currentRegistrations,
        added: syncRes?.totalItemsDelta ?? syncRes?.itemsProcessedDelta ?? 0,
      });
    }

    return res.status(200).json({
      success: true,
      triggerType,
      processedCount: candidateCamps.length,
      results,
    });
  } catch (err: any) {
    return res.status(200).json({
      success: false,
      error: err?.message || 'Daemon cycle skipped',
    });
  }
}
