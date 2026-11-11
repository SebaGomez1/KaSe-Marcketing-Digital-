import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, isSupabaseConfigured, pgPool, mapRowToCampaign } from '../../src/lib/db.js';
import { executeParallelSyncForCampaign } from '../../src/lib/engineSynchronizer.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    const candidateCamps = allCamps.filter(
      (c) => c && c.currentRegistrations < c.targetRegistrations && c.status !== 'paused_quota_reached' && c.status !== 'configuring'
    );

    const results = [];
    for (const camp of candidateCamps) {
      const syncRes = await executeParallelSyncForCampaign(camp, 'periodic_15m');
      results.push({ id: camp.id, name: camp.name, current: camp.currentRegistrations, added: syncRes?.itemsProcessedDelta || 0 });
    }

    return res.status(200).json({ success: true, processedCount: candidateCamps.length, results });
  } catch (err: any) {
    return res.status(200).json({ success: false, error: err?.message || 'Daemon cycle skipped' });
  }
}
