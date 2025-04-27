export interface NewsItem {
  title: string;
  link: string;
  snippet: string;
  source: string;
  published: string;
  category: string;
}

export interface Poll {
  id: number;
  question: string;
  options: string[];
  category: string;
}

export interface VoteResults {
  yes: number;
  no: number;
  unsure: number;
}

export interface PollData {
  poll: Poll;
  results: VoteResults;
  total_votes: number;
}

export interface TrendingTopic {
  topic: string;
  volume: number;
}

export interface Suggestion {
  id: number;
  title: string;
  description: string;
  category: string;
  votes: number;
  createdAt: string;
  status: 'pending' | 'approved' | 'implemented' | 'rejected';
}

export interface NewSuggestion {
  title: string;
  description: string;
  category: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Complaint {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  location?: Location;
  votes: number;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
}

export interface NewComplaint {
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  location?: Location;
}