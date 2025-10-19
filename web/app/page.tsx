// web/app/page.tsx
import { listBookmarks } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const rows = await listBookmarks(200);
  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
      <p className="text-sm text-gray-500">
        iOSの共有シート → ショートカット → <code>/api/share</code> にPOSTで保存されます。
      </p>
      <ul className="space-y-3">
        {rows.map(b => (
          <li key={b.id} className="rounded-xl border p-4">
            <a href={b.url} target="_blank" className="font-medium underline">{b.title ?? b.url}</a>
            <div className="text-xs text-gray-500">
              {new Date(b.created_at).toLocaleString()} ・ {b.source ?? 'web'}
            </div>
            {b.note ? <p className="text-sm mt-1">{b.note}</p> : null}
          </li>
        ))}
        {rows.length === 0 && <li className="text-sm text-gray-500">まだ保存がありません。</li>}
      </ul>
    </main>
  );
}
