import React from 'react';
import { useQuery } from 'react-query';
import { RefreshCw, AlertCircle } from 'lucide-react';
import NewsCard from './NewsCard';
import CategoryFilter from './CategoryFilter';
import { fetchNews } from '../services/api';
import { NewsItem } from '../types';

interface NewsSectionProps {
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
}

const NewsSection: React.FC<NewsSectionProps> = ({ activeCategory, setActiveCategory }) => {
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching
  } = useQuery(['news', activeCategory], () => fetchNews(activeCategory), {
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
  });

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
        <p className="text-red-700">Failed to load news. Please try again.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <CategoryFilter
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition duration-200"
          disabled={isFetching}
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      <div className="space-y-6">
        {data?.news.map((newsItem: NewsItem, index: number) => (
          <NewsCard key={index} news={newsItem} />
        ))}
        {data?.news.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No news found for this category. Try another category or check back later.
          </p>
        )}
      </div>
    </div>
  );
}

export default NewsSection