import type { VercelRequest, VercelResponse } from '@vercel/node';
import { detectMercadoPagoToken } from '../../../src/lib/networkEngines.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = detectMercadoPagoToken();
  return res.status(200).json({
    configured: Boolean(token && token.length > 10),
    publicKey: process.env.MERCADOPAGO_PUBLIC_KEY || process.env.VITE_MERCADOPAGO_PUBLIC_KEY || '',
    mode: token?.startsWith('TEST-') ? 'sandbox' : 'production'
  });
}
