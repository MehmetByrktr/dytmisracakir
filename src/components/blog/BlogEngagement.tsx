'use client';
import { useEffect, useState } from 'react';
import { Eye, Heart } from 'lucide-react';
export default function BlogEngagement({ slug, initialViews = 0, initialLikes = 0 }: { slug: string; initialViews?: number; initialLikes?: number }) {
  const [views, setViews] = useState(initialViews);
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    const likeKey = `misra-liked-${slug}`;
    setLiked(localStorage.getItem(likeKey) === '1');
    const viewKey = `misra-viewed-${slug}`;
    if (sessionStorage.getItem(viewKey)) return;
    sessionStorage.setItem(viewKey, '1');
    fetch(`/api/blog/${encodeURIComponent(slug)}/view`, { method: 'POST' }).then((r) => r.ok ? r.json() : null).then((data) => { if (data?.views != null) setViews(data.views); }).catch(() => undefined);
  }, [slug]);
  async function like() {
    if (liked) return;
    setLiked(true); setLikes((x) => x + 1); localStorage.setItem(`misra-liked-${slug}`, '1');
    try { const response = await fetch(`/api/blog/${encodeURIComponent(slug)}/like`, { method: 'POST' }); const data = response.ok ? await response.json() : null; if (data?.likes != null) setLikes(data.likes); } catch { /* optimistic count remains */ }
  }
  return <div className="flex items-center gap-2 text-xs text-ink-faint"><span className="inline-flex items-center gap-1.5 rounded-full bg-cream-deep px-3 py-2"><Eye className="h-3.5 w-3.5" />{views}</span><button type="button" onClick={like} aria-pressed={liked} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 transition ${liked ? 'bg-clay text-cream' : 'bg-cream-deep text-ink-faint hover:text-clay'}`}><Heart className="h-3.5 w-3.5" fill={liked ? 'currentColor' : 'none'} />{likes}</button></div>;
}
