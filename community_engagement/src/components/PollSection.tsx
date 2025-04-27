import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Square as VoteSquare, CheckCircle, AlertCircle } from 'lucide-react';
import VoteResultsChart from './VoteResultsChart';
import { fetchPoll, submitVote } from '../services/api';

const PollSection: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: pollData,
    isLoading,
    isError,
  } = useQuery('poll', fetchPoll, {
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
  });

  const mutation = useMutation(submitVote, {
    onSuccess: (data) => {
      queryClient.setQueryData('poll', (oldData: any) => ({
        ...oldData,
        results: data.results,
        total_votes: data.total_votes,
      }));
      setHasVoted(true);
    },
  });

  const handleVote = () => {
    if (selectedOption) {
      mutation.mutate({ vote: selectedOption });
    }
  };

  if (isLoading) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Austin Civic Poll</h2>
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Austin Civic Poll</h2>
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
          <p className="text-red-700">Failed to load poll. Please try again later.</p>
        </div>
      </section>
    );
  }

  const { poll, results, total_votes } = pollData;

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-4">
        <VoteSquare className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Austin Civic Poll</h2>
      </div>
      
      <div className={`border border-gray-200 rounded-lg p-5 ${hasVoted ? 'bg-blue-50' : ''}`}>
        <h3 className="text-lg font-bold text-gray-800 mb-4">{poll.question}</h3>
        
        {!hasVoted ? (
          <>
            <div className="space-y-3 mb-6">
              {poll.options.map((option: string) => (
                <button
                  key={option}
                  onClick={() => setSelectedOption(option)}
                  className={`w-full text-left px-4 py-3 rounded-md border transition duration-200 ${
                    selectedOption === option
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`h-4 w-4 rounded-full mr-3 border ${
                      selectedOption === option 
                        ? 'border-blue-600 bg-blue-600' 
                        : 'border-gray-400'
                    }`}>
                      {selectedOption === option && (
                        <div className="h-2 w-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <span className="font-medium capitalize">{option}</span>
                  </div>
                </button>
              ))}
            </div>
            
            <button
              onClick={handleVote}
              disabled={!selectedOption || mutation.isLoading}
              className={`w-full py-2 rounded-md font-medium transition duration-200 ${
                !selectedOption
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {mutation.isLoading ? 'Submitting...' : 'Submit Vote'}
            </button>
          </>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center mb-4 bg-green-100 text-green-800 px-3 py-1 rounded-full">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Vote recorded</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Thank you for voting! You selected: <span className="font-medium capitalize">{selectedOption}</span>
            </p>
            
            <VoteResultsChart results={results} totalVotes={total_votes} />
            
            <p className="text-xs text-gray-500 mt-4">Total votes: {total_votes}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PollSection;