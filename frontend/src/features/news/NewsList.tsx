'use client';

import { useNews } from '@/hooks/useNews';

export default function NewsList() {
  const { data, isLoading, error } = useNews();

  if (isLoading) return <div className="text-gray-500">Loading news...</div>;
  if (error) return <div className="text-red-500">Error loading news</div>;

  const newsItems = data?.data ?? [];

  return (
    <div className="space-y-4">
      {newsItems.length === 0 && (
        <p className="text-gray-500">No news items yet. n8n workflow will populate this.</p>
      )}
      {newsItems.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {item.source} · {item.category && `${item.category} · `}
                {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ''}
              </p>
            </div>
          </div>
          {item.content && (
            <p className="text-gray-700 mt-2 text-sm line-clamp-2">{item.content}</p>
          )}
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm mt-2 inline-block hover:underline"
            >
              Read more →
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
