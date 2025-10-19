// web/lib/db.ts
import { sql } from '@vercel/postgres';

export type Bookmark = {
  id: string;
  url: string;
  title: string | null;
  note: string | null;
  source: string | null;
  created_at: string;
};

export async function insertBookmark(input: {
  url: string; title?: string | null; note?: string | null; source?: string | null;
}) {
  const { url, title = null, note = null, source = null } = input;
  const r = await sql<Bookmark>`
    INSERT INTO bookmarks (url, title, note, source)
    VALUES (${url}, ${title}, ${note}, ${source})
    RETURNING *;`;
  return r.rows[0];
}

export async function listBookmarks(limit = 200) {
  const r = await sql<Bookmark>`
    SELECT * FROM bookmarks ORDER BY created_at DESC LIMIT ${limit};`;
  return r.rows;
}

