import CampaignList from '@/features/campaigns/CampaignList';

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Campaigns</h2>
        <p className="text-gray-500">AI-generated marketing campaigns and promotions.</p>
      </div>
      <CampaignList />
    </div>
  );
}
