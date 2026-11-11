import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateCampaignEnginesForPlan, getAllEnginesHealth } from '../../src/lib/networkEngines.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const plan = String(req.query.plan || 'starter');
  const validation = validateCampaignEnginesForPlan(plan);
  const health = getAllEnginesHealth();

  return res.status(200).json({
    valid: true,
    plan,
    ...validation,
    engines: health
  });
}
