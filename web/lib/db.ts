// web/lib/db.ts
import { sql } from '@vercel/postgres';

export type Bookmark = {
  id: string;
  url: string;          // ← これが必要
  title: string | null;
  note: string | null;
  source: string | null;
  created_at: string;   // or Date
};

export async function listBookmarks(limit = 100): Promise<Bookmark[]> {
  const { rows } = await sql<Bookmark>`
    SELECT
      id,
      url,               -- ← ここを必ず選ぶ
      title,
      note,
      source,
      created_at
    FROM bookmarks
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows;
}
