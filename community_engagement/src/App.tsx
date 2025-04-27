import React, { useState } from 'react';
import Header from './components/Header';
import NewsSection from './components/NewsSection';
import SuggestionsSection from './components/SuggestionsSection';
import ComplaintsSection from './components/ComplaintsSection';
import PollSection from './components/PollSection';
import TrendingTopics from './components/TrendingTopics';
import Footer from './components/Footer';

function App() {
  const [activeTab, setActiveTab] = useState<'news' | 'suggestions' | 'complaints'>('news');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200">
                <nav className="flex" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('news')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 ${
                      activeTab === 'news'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Latest Austin News
                  </button>
                  <button
                    onClick={() => setActiveTab('suggestions')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 ${
                      activeTab === 'suggestions'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Suggestions
                  </button>
                  <button
                    onClick={() => setActiveTab('complaints')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 ${
                      activeTab === 'complaints'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Complaints
                  </button>
                </nav>
              </div>
              <div className="p-6">
                {activeTab === 'news' ? (
                  <NewsSection activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
                ) : activeTab === 'suggestions' ? (
                  <SuggestionsSection />
                ) : (
                  <ComplaintsSection />
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <PollSection />
            <TrendingTopics setActiveCategory={setActiveCategory} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;