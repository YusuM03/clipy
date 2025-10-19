// web/lib/db.ts
import { sql } from '@vercel/postgres';

export type Bookmark = {
  id: string;
  url: string;
  title: string | null;
  note: string | null;
  source: string | null;
  created_at: string; // or Date
};

/** 保存用：/api/share から呼ばれる */
export async function insertBookmark(input: {
  url: string;
  title?: string | null;
  note?: string | null;
  source?: string | null;
}) {
  await sql`
    INSERT INTO bookmarks (url, title, note, source)
    VALUES (${input.url}, ${input.title ?? null}, ${input.note ?? null}, ${input.source ?? null})
  `;
}

/** 一覧取得：トップページから呼ばれる */
export async function listBookmarks(limit = 100): Promise<Bookmark[]> {
  const { rows } = await sql<Bookmark>`
    SELECT id, url, title, note, source, created_at
    FROM bookmarks
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows;
}
