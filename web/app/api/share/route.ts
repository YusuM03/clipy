import { NextRequest } from 'next/server';
import { z } from 'zod';
import { insertBookmark } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Body = z.object({
  url: z.string().url(),
  title: z.string().optional().nullable(),
  text: z.string().optional().nullable(),   // iOSのメモ → note 列へ
  source: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  const expected = `Bearer ${process.env.SHARE_API_TOKEN ?? ''}`;
  if (auth !== expected) {
    return new Response('Unauthorized', { status: 401 });
  }

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return new Response('Bad Request', { status: 400 });
  const b = parsed.data;

  await insertBookmark({
    url: b.url,
    title: b.title ?? null,
    note: b.text ?? null,
    source: b.source ?? 'api',
  });

  return new Response(null, { status: 204 });
}
