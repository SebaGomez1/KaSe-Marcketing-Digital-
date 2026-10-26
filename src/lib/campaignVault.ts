/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BLINDAJE DE PERSISTENCIA INDESTRUCTIBLE PARA CAMPAÑAS KaSe
 * Garantiza que ninguna campaña creada por un usuario se borre, desaparezca o se pierda
 * ante recargas, cierres de sesión, cold-starts de Vercel o reinicios del servidor.
 */

import { Campaign } from '../types/growth';
import { FAKE_MOCK_CAMPAIGN_IDS, isFakeCampaign } from './initialCampaigns';

const VAULT_MASTER_KEY = 'kase_vault_campaigns_master';
const VAULT_CACHE_KEY = 'kase_cached_campaigns';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Purga de forma estricta del localStorage únicamente aquellas campañas cuyo ID
 * coincida de forma exacta con la lista FAKE_MOCK_CAMPAIGN_IDS.
 * Elimina cualquier lógica de mapeo destructiva y asegura la inmutabilidad de los datos
 * de producción reales: currentRegistrations, clicksCount y recentConversions.
 */
export function purgeFakeCampaignsFromStorage(): void {
  if (!isBrowser()) return;
  try {
    const keysToCheck = [
      VAULT_MASTER_KEY,
      VAULT_CACHE_KEY,
      'kase_active_campaign_id',
    ];

    // Revisar todas las claves del localStorage que comiencen con kase_ o camp_
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && (k.startsWith('kase_') || k.startsWith('camp_'))) {
        keysToCheck.push(k);
      }
    }

    const uniqueKeys = Array.from(new Set(keysToCheck));

    for (const key of uniqueKeys) {
      try {
        const val = window.localStorage.getItem(key);
        if (!val) continue;

        if (key === 'kase_active_campaign_id') {
          if (FAKE_MOCK_CAMPAIGN_IDS.includes(val)) {
            window.localStorage.removeItem(key);
          }
          continue;
        }

        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) {
          // Filtrar de forma estricta solo aquellas campañas cuyo ID coincida con FAKE_MOCK_CAMPAIGN_IDS
          const cleaned = parsed.filter((c: any) => {
            const id = typeof c === 'string' ? c : c?.id;
            return !id || !FAKE_MOCK_CAMPAIGN_IDS.includes(id);
          });
          // Se preserva intacto el array limpio sin alterar contadores de producción
          window.localStorage.setItem(key, JSON.stringify(cleaned));
        } else if (parsed && typeof parsed === 'object') {
          const id = parsed.id || '';
          if (FAKE_MOCK_CAMPAIGN_IDS.includes(id)) {
            window.localStorage.removeItem(key);
          }
          // Las campañas reales se mantienen inmutables con sus contadores y conversiones
        }
      } catch {
        // Clave no es JSON, omitir
      }
    }
  } catch (e) {
    console.warn('[Vault Purge Error]:', e);
  }
}

/**
 * Guarda una campaña de forma blindada en múltiples capas de almacenamiento local
 */
export function saveCampaignToVault(campaign: Campaign): void {
  if (!isBrowser() || !campaign || !campaign.id || isFakeCampaign(campaign)) return;

  try {
    // 1. Guardar en Master Vault
    const masterRaw = window.localStorage.getItem(VAULT_MASTER_KEY);
    let masterList: Campaign[] = [];
    if (masterRaw) {
      try {
        masterList = JSON.parse(masterRaw);
      } catch {}
    }
    if (!Array.isArray(masterList)) masterList = [];

    const existingMasterIdx = masterList.findIndex((c) => c.id === campaign.id);
    if (existingMasterIdx >= 0) {
      masterList[existingMasterIdx] = { ...masterList[existingMasterIdx], ...campaign };
    } else {
      masterList.unshift(campaign);
    }
    masterList = masterList.filter((c) => !isFakeCampaign(c));
    window.localStorage.setItem(VAULT_MASTER_KEY, JSON.stringify(masterList));

    // 2. Guardar en User Vault específico si tiene email
    const email = (campaign.creatorEmail || campaign.userId || '').toLowerCase().trim();
    if (email && email.includes('@')) {
      const userKey = `kase_user_campaigns_${email}`;
      const userRaw = window.localStorage.getItem(userKey);
      let userList: Campaign[] = [];
      if (userRaw) {
        try {
          userList = JSON.parse(userRaw);
        } catch {}
      }
      if (!Array.isArray(userList)) userList = [];
      const userIdx = userList.findIndex((c) => c.id === campaign.id);
      if (userIdx >= 0) {
        userList[userIdx] = { ...userList[userIdx], ...campaign };
      } else {
        userList.unshift(campaign);
      }
      userList = userList.filter((c) => !isFakeCampaign(c));
      window.localStorage.setItem(userKey, JSON.stringify(userList));
    }

    // 3. Actualizar Active Cache
    const cacheRaw = window.localStorage.getItem(VAULT_CACHE_KEY);
    let cacheList: Campaign[] = [];
    if (cacheRaw) {
      try {
        cacheList = JSON.parse(cacheRaw);
      } catch {}
    }
    if (!Array.isArray(cacheList)) cacheList = [];
    const cacheIdx = cacheList.findIndex((c) => c.id === campaign.id);
    if (cacheIdx >= 0) {
      cacheList[cacheIdx] = { ...cacheList[cacheIdx], ...campaign };
    } else {
      cacheList.unshift(campaign);
    }
    cacheList = cacheList.filter((c) => !isFakeCampaign(c));
    window.localStorage.setItem(VAULT_CACHE_KEY, JSON.stringify(cacheList));

    // 4. Intentar sincronización en background con el backend para re-asegurar persistencia en base de datos
    syncCampaignToBackend(campaign).catch(() => {});
  } catch (err) {
    console.error('[Error saving campaign to vault]:', err);
  }
}

/**
 * Guarda un conjunto completo de campañas asegurando no sobreescribir ni perder ninguna existente
 */
export function saveAllCampaignsToVault(campaigns: Campaign[]): void {
  if (!Array.isArray(campaigns)) return;
  for (const c of campaigns) {
    saveCampaignToVault(c);
  }
}

/**
 * Recupera todas las campañas de un usuario desde todas las capas del baúl local
 * Escanea de forma forense las claves históricas para recuperar campañas que parezcan desaparecidas
 */
export function getVaultCampaigns(userEmail?: string, userId?: string, isSuperAdmin?: boolean): Campaign[] {
  if (!isBrowser()) return [];

  const foundMap = new Map<string, Campaign>();
  const cleanEmail = (userEmail || '').toLowerCase().trim();
  const cleanUserId = (userId || '').trim();

  // Helper para evaluar si la campaña pertenece al usuario
  const belongsToUser = (c: Campaign): boolean => {
    if (!c || !c.id || isFakeCampaign(c)) return false;
    if (isSuperAdmin) return true; // Super admin ve todas las campañas reales
    const cEmail = (c.creatorEmail || '').toLowerCase().trim();
    const cUser = (c.userId || '').trim();

    if (cleanEmail && (cEmail === cleanEmail || cUser.toLowerCase() === cleanEmail)) return true;
    if (cleanUserId && (cUser === cleanUserId || cEmail === cleanUserId)) return true;
    // Si la campaña no tiene creador asignado pero se creó en este mismo navegador
    if (!cEmail && !cUser) return true;
    return false;
  };

  const addIfValid = (c: any) => {
    if (!c || typeof c !== 'object' || !c.id || isFakeCampaign(c)) return;
    if (belongsToUser(c)) {
      const existing = foundMap.get(c.id);
      if (!existing) {
        foundMap.set(c.id, c);
      } else {
        // Preservar la versión con mayor progreso de conversiones o logs más recientes
        const existingConvs = existing.currentRegistrations || 0;
        const newConvs = c.currentRegistrations || 0;
        if (newConvs >= existingConvs) {
          foundMap.set(c.id, { ...existing, ...c });
        }
      }
    }
  };

  try {
    // 1. Clave de usuario específica
    if (cleanEmail) {
      const userKey = `kase_user_campaigns_${cleanEmail}`;
      const raw = window.localStorage.getItem(userKey);
      if (raw) {
        try {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) arr.forEach(addIfValid);
        } catch {}
      }
      // Clave heredada anterior
      const legacyKey = `kase_campaigns_${cleanEmail}`;
      const legacyRaw = window.localStorage.getItem(legacyKey);
      if (legacyRaw) {
        try {
          const arr = JSON.parse(legacyRaw);
          if (Array.isArray(arr)) arr.forEach(addIfValid);
        } catch {}
      }
    }

    // 2. Master Vault
    const masterRaw = window.localStorage.getItem(VAULT_MASTER_KEY);
    if (masterRaw) {
      try {
        const arr = JSON.parse(masterRaw);
        if (Array.isArray(arr)) arr.forEach(addIfValid);
      } catch {}
    }

    // 3. Cache activo
    const cacheRaw = window.localStorage.getItem(VAULT_CACHE_KEY);
    if (cacheRaw) {
      try {
        const arr = JSON.parse(cacheRaw);
        if (Array.isArray(arr)) arr.forEach(addIfValid);
      } catch {}
    }

    // 4. Escaneo exhaustivo de todas las claves de localStorage para recuperar campañas que "desaparecieron"
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k) continue;
      if (k.startsWith('kase_') || k.startsWith('camp_') || k.includes('campaign')) {
        try {
          const itemVal = window.localStorage.getItem(k);
          if (!itemVal) continue;
          const parsed = JSON.parse(itemVal);
          if (Array.isArray(parsed)) {
            parsed.forEach(addIfValid);
          } else if (parsed && typeof parsed === 'object' && parsed.id && parsed.targetUrl) {
            addIfValid(parsed);
          }
        } catch {}
      }
    }
  } catch (err) {
    console.error('[Error recovering vault campaigns]:', err);
  }

  return Array.from(foundMap.values());
}

/**
 * Fusión inteligente entre datos del servidor y baúl local
 * Regla de oro: NINGUNA campaña del baúl local se borra porque el servidor devuelva vacío o falle
 */
export function mergeCampaigns(serverCampaigns: Campaign[], localVault: Campaign[]): Campaign[] {
  const map = new Map<string, Campaign>();

  // 1. Agregar campañas de baúl local primero (base asegurada)
  for (const c of localVault) {
    if (c && c.id && !isFakeCampaign(c)) {
      map.set(c.id, c);
    }
  }

  // 2. Superponer/actualizar con datos del servidor (el servidor es la autoridad de datos reales)
  for (const s of serverCampaigns) {
    if (!s || !s.id || isFakeCampaign(s)) continue;
    map.set(s.id, s);
  }

  return Array.from(map.values());
}

/**
 * Sincroniza una campaña local con el servidor para que se respalde en PostgreSQL / Supabase
 */
export async function syncCampaignToBackend(campaign: Campaign): Promise<boolean> {
  if (!campaign || !campaign.id || isFakeCampaign(campaign)) return false;
  try {
    const res = await fetch('/api/campaigns/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaign }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
