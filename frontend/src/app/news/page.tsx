import NewsList from '@/features/news/NewsList';

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Local News</h2>
        <p className="text-gray-500">Aggregated local news and events.</p>
      </div>
      <NewsList />
      
    </div>
  );
}
