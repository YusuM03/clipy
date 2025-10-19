import { listBookmarks } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const rows = await listBookmarks(200);

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Saved Links</h1>

      <ul className="space-y-4">
        {rows.map((row) => (
          <li key={row.id} className="rounded-2xl border border-zinc-700 p-4 space-y-1">
            {/* ★常にリンクを描画。テキストは title が無ければ url */}
            <a
              href={row.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 underline break-all"
            >
              {row.title ?? row.url}
            </a>

            {row.note && <p className="text-lg">{row.note}</p>}

            <p className="text-sm text-zinc-400">
              {new Date(row.created_at).toLocaleString()} ・ {row.source ?? 'unknown'}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
