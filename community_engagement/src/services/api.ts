import axios from 'axios';
import { NewSuggestion, NewComplaint } from '../types';

const API_URL = import.meta.env.DEV 
  ? 'http://localhost:5000'  // Development
  : 'http://localhost:5000'; // Production

const SERP_API_KEY = '77125125b1f50c0f9f1e6a0f4f29402dde164393ad58e511d336e9c0070b129d';

// Create axios instance with default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'X-API-KEY': SERP_API_KEY
  }
});

export const fetchNews = async (category: string | null) => {
  const url = category 
    ? `/api/news?category=${category}`
    : `/api/news`;
    
  const response = await api.get(url);
  return response.data;
};

export const fetchPoll = async () => {
  const response = await api.get(`/api/poll`);
  return response.data;
};

export const submitVote = async ({ vote }: { vote: string }) => {
  const response = await api.post(`/api/vote`, { vote });
  return response.data;
};

export const fetchTrending = async () => {
  const response = await api.get(`/api/trending`);
  return response.data;
};

export const fetchSuggestions = async () => {
  const response = await api.get(`/api/suggestions`);
  return response.data;
};

export const createSuggestion = async (suggestion: NewSuggestion) => {
  const response = await api.post(`/api/suggestions`, suggestion);
  return response.data;
};

export const voteSuggestion = async (id: number) => {
  const response = await api.post(`/api/suggestions/${id}/vote`);
  return response.data;
};

export const fetchComplaints = async () => {
  const response = await api.get('/api/complaints');
  return response.data;
};

export const createComplaint = async (complaint: NewComplaint) => {
  const response = await api.post('/api/complaints', complaint);
  return response.data;
};

export const voteComplaint = async (id: number) => {
  const response = await api.post(`/api/complaints/${id}/vote`);
  return response.data;
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getDirections = async (latitude: number, longitude: number) => {
  const response = await api.get(`/api/directions?lat=${latitude}&lng=${longitude}`);
  return response.data;
};