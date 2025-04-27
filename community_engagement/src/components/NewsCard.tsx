import React from 'react';
import { ExternalLink, Clock } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'transit':
        return 'bg-purple-100 text-purple-800';
      case 'housing':
        return 'bg-green-100 text-green-800';
      case 'safety':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg hover:shadow-md transition duration-300 overflow-hidden group">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(news.category)}`}>
            {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
          </span>
          <span className="text-xs text-gray-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {news.published}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 mb-2">{news.title}</h3>
        <p className="text-gray-600 mb-4">{news.snippet}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-500">Source: {news.source}</span>
          <a
            href={news.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition group-hover:underline"
          >
            Read more
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;