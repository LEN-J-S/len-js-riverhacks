import React from 'react';
import { Home, TrendingUp, Shield, Bus } from 'lucide-react';

interface CategoryFilterProps {
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    { id: null, name: 'All', icon: TrendingUp },
    { id: 'housing', name: 'Housing', icon: Home },
    { id: 'safety', name: 'Safety', icon: Shield },
    { id: 'transit', name: 'Transit', icon: Bus },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.id || 'all'}
          onClick={() => setActiveCategory(category.id)}
          className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
            activeCategory === category.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <category.icon className="h-4 w-4 mr-1" />
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;