// web/app/api/share/route.ts
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { insertBookmark } from '@/lib/db';

export const runtime = 'nodejs';        // @vercel/postgres を使うので Node 実行
export const dynamic = 'force-dynamic'; // 毎回実行でOK（キャッシュしない）

const Body = z.object({
  url: z.string().url(),
  title: z.string().optional().nullable(),
  text: z.string().optional().nullable(),   // ← iOSショートカットではここにメモを入れている
  source: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  // Bearer 認証
  const auth = req.headers.get('authorization') ?? '';
  const expected = `Bearer ${process.env.SHARE_API_TOKEN ?? ''}`;
  if (auth !== expected) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 入力バリデーション
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return new Response('Bad Request', { status: 400 });
  }
  const b = parsed.data;

  // 保存
  await insertBookmark({
    url: b.url,
    title: b.title ?? null,
    note: b.text ?? null,           // text -> note 列に保存
    source: b.source ?? 'api',
  });

  // 成功：本文なし
  return new Response(null, { status: 204 });
}
