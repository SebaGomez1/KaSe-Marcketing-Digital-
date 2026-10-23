/**
 * KaSe Marketing Digital - Conectores de Red Reales para Motores Autónomos
 * Módulo 1 (Google Indexing API), Módulo 2 (X / Twitter API v2), Módulo 4 (Reddit Outbound Bot)
 */
import { TwitterApi } from 'twitter-api-v2';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// 1. CONECTOR REAL: X / TWITTER API v2 (mod2_social)
// ==========================================
export interface TwitterExecutionResult {
  success: boolean;
  publishedCount: number;
  threadIds?: string[];
  error?: string;
  isSimulatedFallback?: boolean;
}

export function getTwitterClient(): TwitterApi | null {
  const appKey = process.env.TWITTER_API_KEY || process.env.TWITTER_CONSUMER_KEY;
  const appSecret = process.env.TWITTER_API_SECRET || process.env.TWITTER_CONSUMER_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;

  if (appKey && appSecret && accessToken && accessSecret) {
    return new TwitterApi({
      appKey: appKey.trim(),
      appSecret: appSecret.trim(),
      accessToken: accessToken.trim(),
      accessSecret: accessSecret.trim(),
    });
  }
  return null;
}

export async function publicarHiloAutonomo(tweets: string[]): Promise<TwitterExecutionResult> {
  const client = getTwitterClient();

  if (!client) {
    console.warn('[TWITTER API]: Credenciales no configuradas en entorno (TWITTER_API_KEY, TWITTER_ACCESS_TOKEN).');
    return {
      success: false,
      publishedCount: 0,
      isSimulatedFallback: true,
      error: 'Variables de entorno de Twitter API v2 no configuradas en el servidor.',
    };
  }

  try {
    const cleanTweets = tweets.filter(t => t && t.trim().length > 0);
    if (cleanTweets.length === 0) {
      return { success: false, publishedCount: 0, error: 'Lista de tweets vacía' };
    }

    const res = await client.v2.tweetThread(cleanTweets);
    console.log(`[MÓDULO 2 - SOCIAL]: Hilo de ${cleanTweets.length} tweets sindicado con éxito en X (Twitter).`);
    
    return {
      success: true,
      publishedCount: cleanTweets.length,
      threadIds: res.map(t => t.data.id),
      isSimulatedFallback: false,
    };
  } catch (err: any) {
    console.error('[TWITTER API ERROR]:', err);
    return {
      success: false,
      publishedCount: 0,
      error: err.message || 'Error al conectar con Twitter API v2',
      isSimulatedFallback: false,
    };
  }
}

// ==========================================
// 2. CONECTOR REAL: REDDIT OUTBOUND BOT (mod4_outbound)
// ==========================================
export interface RedditExecutionResult {
  success: boolean;
  scannedCount: number;
  matchedCount: number;
  repliesSent: number;
  error?: string;
  isSimulatedFallback?: boolean;
}

export async function getRedditClient() {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const username = process.env.REDDIT_USERNAME;
  const password = process.env.REDDIT_PASSWORD;

  if (clientId && clientSecret && username && password) {
    try {
      const snoowrapModule = await import('snoowrap');
      const SnoowrapClass = (snoowrapModule as any).default || snoowrapModule;
      return new SnoowrapClass({
        userAgent: 'KaSeGrowthBot/2.4 (by /u/' + username + ')',
        clientId: clientId.trim(),
        clientSecret: clientSecret.trim(),
        username: username.trim(),
        password: password.trim(),
      });
    } catch (e) {
      console.error('[REDDIT INIT ERROR]:', e);
      return null;
    }
  }
  return null;
}

export async function ejecutarEscuchaActivaReddit(
  nicheKeywords: string[],
  subredditName: string = 'startups',
  replyTemplate?: string
): Promise<RedditExecutionResult> {
  const reddit = await getRedditClient();

  if (!reddit) {
    console.warn('[REDDIT BOT]: Credenciales no configuradas (REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD).');
    return {
      success: false,
      scannedCount: 0,
      matchedCount: 0,
      repliesSent: 0,
      isSimulatedFallback: true,
      error: 'Variables de entorno de Reddit API no configuradas en el servidor.',
    };
  }

  try {
    const cleanSub = subredditName.replace(/^r\//, '').trim();
    const posts = await reddit.getSubreddit(cleanSub).getNew({ limit: 15 });
    let matchedCount = 0;
    let repliesSent = 0;

    for (const post of posts) {
      const textToSearch = `${post.title} ${post.selftext || ''}`.toLowerCase();
      const matches = nicheKeywords.some(kw => textToSearch.includes(kw.toLowerCase()));

      if (matches) {
        matchedCount++;
        // If a response template is provided and we haven't answered yet
        if (replyTemplate && repliesSent < 2) {
          try {
            await (post as any).reply(replyTemplate);
            repliesSent++;
            console.log(`[REDDIT BOT]: Respuesta de valor publicada en post "${post.title.substring(0, 40)}..."`);
          } catch (replyErr) {
            console.warn('[REDDIT BOT REPLY WARNING]:', replyErr);
          }
        }
      }
    }

    return {
      success: true,
      scannedCount: posts.length,
      matchedCount,
      repliesSent,
      isSimulatedFallback: false,
    };
  } catch (err: any) {
    console.error('[REDDIT API ERROR]:', err);
    return {
      success: false,
      scannedCount: 0,
      matchedCount: 0,
      repliesSent: 0,
      error: err.message || 'Error al conectar con Reddit API',
      isSimulatedFallback: false,
    };
  }
}

// ==========================================
// 3. CONECTOR REAL: GOOGLE SEARCH INDEXING API (mod1_seo)
// ==========================================
export interface GoogleIndexingResult {
  success: boolean;
  urlNotified: string;
  notifyTime?: string;
  error?: string;
  isSimulatedFallback?: boolean;
}

export async function forzarIndexacionGoogleAPI(urlTarget: string): Promise<GoogleIndexingResult> {
  // Check for service account credentials (file path or environment variable JSON string)
  let authClient: any = null;
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, '..', '..', 'service_account.json');

  try {
    if (serviceAccountJson) {
      const credentials = JSON.parse(serviceAccountJson);
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/indexing'],
      });
      authClient = await auth.getClient();
    } else if (fs.existsSync(serviceAccountPath)) {
      const auth = new google.auth.GoogleAuth({
        keyFile: serviceAccountPath,
        scopes: ['https://www.googleapis.com/auth/indexing'],
      });
      authClient = await auth.getClient();
    }
  } catch (authErr) {
    console.warn('[GOOGLE INDEXING AUTH ERROR]:', authErr);
  }

  if (!authClient) {
    console.warn('[GOOGLE INDEXING API]: Cuenta de servicio de Google Search Console no configurada (GOOGLE_SERVICE_ACCOUNT_JSON o service_account.json).');
    return {
      success: false,
      urlNotified: urlTarget,
      isSimulatedFallback: true,
      error: 'Credenciales de Google Service Account ausentes en el servidor.',
    };
  }

  try {
    const indexing = google.indexing('v3');
    google.options({ auth: authClient });

    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url: urlTarget,
        type: 'URL_UPDATED',
      },
    });

    console.log(`[MÓDULO 1 - SEO]: URL enviada a Google Indexing API: ${urlTarget}`);
    return {
      success: true,
      urlNotified: urlTarget,
      notifyTime: response.data.urlNotificationMetadata?.latestUpdate?.notifyTime || new Date().toISOString(),
      isSimulatedFallback: false,
    };
  } catch (err: any) {
    console.error('[GOOGLE INDEXING API ERROR]:', err);
    return {
      success: false,
      urlNotified: urlTarget,
      error: err.message || 'Error al conectar con Google Search Indexing API',
      isSimulatedFallback: false,
    };
  }
}

// ==========================================
// 4. DIAGNÓSTICO DEL ESTADO DE CONECTORES
// ==========================================
export function getNetworkEnginesStatus() {
  const hasTwitter = !!(
    (process.env.TWITTER_API_KEY || process.env.TWITTER_CONSUMER_KEY) &&
    (process.env.TWITTER_ACCESS_TOKEN)
  );

  const hasReddit = !!(
    process.env.REDDIT_CLIENT_ID &&
    process.env.REDDIT_CLIENT_SECRET &&
    process.env.REDDIT_USERNAME &&
    process.env.REDDIT_PASSWORD
  );

  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, '..', '..', 'service_account.json');
  const hasGoogle = !!(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || fs.existsSync(serviceAccountPath));

  return {
    twitter: {
      configured: hasTwitter,
      channel: 'X / Twitter API v2 (Thread syndication)',
      envVars: ['TWITTER_API_KEY', 'TWITTER_API_SECRET', 'TWITTER_ACCESS_TOKEN', 'TWITTER_ACCESS_SECRET'],
    },
    reddit: {
      configured: hasReddit,
      channel: 'Reddit API via Snoowrap (Keyword scanner & outreach)',
      envVars: ['REDDIT_CLIENT_ID', 'REDDIT_CLIENT_SECRET', 'REDDIT_USERNAME', 'REDDIT_PASSWORD'],
    },
    googleIndexing: {
      configured: hasGoogle,
      channel: 'Google Search Indexing API v3 (Fast URL indexation)',
      envVars: ['GOOGLE_SERVICE_ACCOUNT_JSON o service_account.json'],
    },
  };
}
