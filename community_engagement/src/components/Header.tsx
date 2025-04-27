import React from 'react';
import { Newspaper, BarChart2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <Newspaper className="h-8 w-8" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              CivicPulse
              <span className="text-sm ml-2 font-normal opacity-75">Austin</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-1 bg-blue-800 bg-opacity-50 rounded-full px-4 py-1">
            <BarChart2 className="h-4 w-4 text-blue-300" />
            <p className="text-sm font-medium">
              Connecting Austin residents with local issues
            </p>
          </div>
        </div>
        
        <p className="mt-4 max-w-2xl text-blue-100 text-sm">
          Stay informed about Austin's civic issues and make your voice heard. News is updated hourly to keep you in the loop.
        </p>
      </div>
    </header>
  );
};

export default Header;