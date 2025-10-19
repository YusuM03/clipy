// web/app/api/share/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { insertBookmark } from '@/lib/db';

const Body = z.object({
  url: z.string().url(),
  title: z.string().max(300).optional(),
  text: z.string().max(2000).optional(),
  source: z.string().max(50).optional(),
});

export async function POST(req: NextRequest) {
  const expected = process.env.SHARE_API_TOKEN;
  const auth = req.headers.get('authorization');
  if (!expected || !auth || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Bad JSON' }, { status: 400 });
  }

  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Bad Request', detail: parsed.error.flatten() }, { status: 400 });
  }

  const { url, title, text, source } = parsed.data;
  await insertBookmark({ url, title: title ?? null, note: text ?? null, source: source ?? 'ios-share' });

  return new NextResponse(null, { status: 204 });
}
