import { GET as handleGet, POST as handlePost, BASE_URL } from '../../r/[id]/route';

export const runtime = 'edge';

// URL BASE FIJA Y OFICIAL DE VERCEL
export { BASE_URL };

export const GET = handleGet;
export const POST = handlePost;
