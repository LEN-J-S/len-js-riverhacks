import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { LightbulbIcon, ThumbsUp, AlertCircle } from 'lucide-react';
import { fetchSuggestions, createSuggestion, voteSuggestion } from '../services/api';
import { Suggestion, NewSuggestion } from '../types';

const SuggestionsSection: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newSuggestion, setNewSuggestion] = useState<NewSuggestion>({
    title: '',
    description: '',
    category: 'housing'
  });

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery('suggestions', fetchSuggestions);

  const createMutation = useMutation(createSuggestion, {
    onSuccess: () => {
      queryClient.invalidateQueries('suggestions');
      setIsFormOpen(false);
      setNewSuggestion({ title: '', description: '', category: 'housing' });
    }
  });

  const voteMutation = useMutation(voteSuggestion, {
    onSuccess: () => {
      queryClient.invalidateQueries('suggestions');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newSuggestion);
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
        <p className="text-red-700">Failed to load suggestions.</p>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <LightbulbIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Community Suggestions</h2>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          {isFormOpen ? 'Cancel' : 'New Suggestion'}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newSuggestion.title}
                onChange={(e) => setNewSuggestion({ ...newSuggestion, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newSuggestion.description}
                onChange={(e) => setNewSuggestion({ ...newSuggestion, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={newSuggestion.category}
                onChange={(e) => setNewSuggestion({ ...newSuggestion, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="housing">Housing</option>
                <option value="transit">Transit</option>
                <option value="safety">Safety</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={createMutation.isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              {createMutation.isLoading ? 'Submitting...' : 'Submit Suggestion'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {data?.suggestions.map((suggestion: Suggestion) => (
          <div
            key={suggestion.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{suggestion.title}</h3>
                <p className="text-gray-600 mt-1">{suggestion.description}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="text-sm text-gray-500">
                    Posted {new Date(suggestion.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    suggestion.category === 'housing' ? 'bg-green-100 text-green-800' :
                    suggestion.category === 'transit' ? 'bg-purple-100 text-purple-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {suggestion.category}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    suggestion.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    suggestion.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                    suggestion.status === 'implemented' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {suggestion.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => voteMutation.mutate(suggestion.id)}
                disabled={voteMutation.isLoading}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{suggestion.votes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SuggestionsSection;