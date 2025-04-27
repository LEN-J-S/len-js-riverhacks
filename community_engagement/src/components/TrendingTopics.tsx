import React from 'react';
import { useQuery } from 'react-query';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { fetchTrending } from '../services/api';

interface TrendingTopicsProps {
  setActiveCategory: (category: string | null) => void;
}

const TrendingTopics: React.FC<TrendingTopicsProps> = ({ setActiveCategory }) => {
  const { data, isLoading, isError } = useQuery('trending', fetchTrending, {
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
  });

  const handleTopicClick = (topic: string) => {
    // Determine which category the topic belongs to
    const topicLower = topic.toLowerCase();
    if (topicLower.includes('housing') || topicLower.includes('rent')) {
      setActiveCategory('housing');
    } else if (
      topicLower.includes('safety') || 
      topicLower.includes('crime') || 
      topicLower.includes('flood')
    ) {
      setActiveCategory('safety');
    } else if (
      topicLower.includes('transit') || 
      topicLower.includes('capmetro') || 
      topicLower.includes('traffic')
    ) {
      setActiveCategory('transit');
    } else {
      setActiveCategory(null);
    }
  };

  if (isLoading) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Trending in Austin</h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Trending in Austin</h2>
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
          <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
          <p className="text-red-700 text-sm">Failed to load trending topics.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Trending in Austin</h2>
      </div>
      
      <div className="space-y-3">
        {data.trending.map((item: any, index: number) => (
          <button
            key={index}
            onClick={() => handleTopicClick(item.topic)}
            className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition duration-200"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-800">{item.topic}</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {item.volume.toLocaleString()} searches
              </span>
            </div>
          </button>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 mt-4">
        Data refreshed hourly from Google Trends
      </p>
    </section>
  );
};

export default TrendingTopics;