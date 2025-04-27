import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import axios from 'axios';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 5000;

const SERP_API_KEY = '77125125b1f50c0f9f1e6a0f4f29402dde164393ad58e511d336e9c0070b129d';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
app.use('/uploads', express.static('uploads'));

// In-memory storage
const votes = { yes: 0, no: 0, unsure: 0 };
const suggestions = [];
const complaints = [];
let nextSuggestionId = 1;
let nextComplaintId = 1;

// Mock news data
const MOCK_NEWS = [
  {
    title: "Austin City Council approves $2.8M for homeless services",
    link: "https://www.kvue.com/article/news/local/homeless/austin-homeless-strategy-budget/269-a7071a72-8f5e-4f3c-9fb5-5ccf317a3b5f",
    snippet: "The Austin City Council has approved additional funding for homeless services amid increasing concerns from residents.",
    source: "KVUE",
    published: "2 hours ago",
    category: "housing"
  },
  {
    title: "CapMetro announces delays on MetroRail due to maintenance",
    link: "https://www.kxan.com/traffic/capmetro-announces-delays-on-metrorail-due-to-maintenance/",
    snippet: "CapMetro has announced temporary delays on the MetroRail Red Line due to scheduled maintenance work.",
    source: "KXAN",
    published: "5 hours ago",
    category: "transit"
  },
  {
    title: "Austin Police Department launches new community safety initiative",
    link: "https://www.statesman.com/story/news/local/2023/03/12/austin-police-department-announces-new-safety-initiative/70428052007/",
    snippet: "APD announced a new community safety initiative aimed at reducing crime rates in targeted areas of the city.",
    source: "Austin American-Statesman",
    published: "1 day ago",
    category: "safety"
  },
  {
    title: "New affordable housing complex breaks ground in East Austin",
    link: "https://www.kut.org/austin/2023-03-11/new-affordable-housing-project-east-austin",
    snippet: "Construction has begun on a new affordable housing complex that will provide 135 units for low-income residents.",
    source: "KUT",
    published: "2 days ago",
    category: "housing"
  },
  {
    title: "Austin experiences flash flooding after heavy rainfall",
    link: "https://www.fox7austin.com/news/central-texas-flash-flooding-heavy-rainfall",
    snippet: "Several neighborhoods in Austin experienced flash flooding following unexpected heavy rainfall yesterday.",
    source: "FOX 7 Austin",
    published: "12 hours ago",
    category: "safety"
  },
  {
    title: "City approves expansion of bike lanes in downtown Austin",
    link: "https://www.austinmonitor.com/stories/2023/03/city-approves-expansion-of-bike-lanes-in-downtown-austin/",
    snippet: "The Austin Transportation Department has approved plans to expand bike lanes throughout the downtown area.",
    source: "Austin Monitor",
    published: "3 days ago",
    category: "transit"
  }
];

// API Routes
app.get('/api/news', (req, res) => {
  const { category } = req.query;
  
  const filtered_news = category
    ? MOCK_NEWS.filter(article => article.category === category)
    : MOCK_NEWS;
  
  res.json({
    news: filtered_news,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/poll', (req, res) => {
  res.json({
    poll: {
      id: 1,
      question: "Do you support the expansion of CapMetro rail services to more areas of Austin?",
      options: ["yes", "no", "unsure"],
      category: "transit"
    },
    results: votes,
    total_votes: Object.values(votes).reduce((a, b) => a + b, 0)
  });
});

app.post('/api/vote', (req, res) => {
  const { vote } = req.body;
  
  if (!["yes", "no", "unsure"].includes(vote)) {
    return res.status(400).json({ error: "Invalid vote option" });
  }
  
  votes[vote]++;
  
  res.json({
    message: "Vote recorded successfully",
    results: votes,
    total_votes: Object.values(votes).reduce((a, b) => a + b, 0)
  });
});

app.get('/api/trending', (req, res) => {
  const trending = [
    { topic: "Austin flood", volume: 21500 },
    { topic: "CapMetro delays", volume: 15200 },
    { topic: "Austin housing prices", volume: 12800 },
    { topic: "Austin crime rate", volume: 11300 },
    { topic: "SXSW 2024", volume: 9800 }
  ];
  
  res.json({
    trending,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/suggestions', (req, res) => {
  res.json({
    suggestions: suggestions.sort((a, b) => b.votes - a.votes),
    timestamp: new Date().toISOString()
  });
});

app.post('/api/suggestions', (req, res) => {
  const { title, description, category } = req.body;
  
  if (!title || !description || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newSuggestion = {
    id: nextSuggestionId++,
    title,
    description,
    category,
    votes: 0,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };

  suggestions.push(newSuggestion);
  res.status(201).json(newSuggestion);
});

app.post('/api/suggestions/:id/vote', (req, res) => {
  const { id } = req.params;
  const suggestion = suggestions.find(s => s.id === parseInt(id));
  
  if (!suggestion) {
    return res.status(404).json({ error: "Suggestion not found" });
  }

  suggestion.votes++;
  res.json(suggestion);
});

// Complaints routes
app.get('/api/complaints', (req, res) => {
  res.json({
    complaints: complaints.sort((a, b) => b.votes - a.votes),
    timestamp: new Date().toISOString()
  });
});

app.post('/api/complaints', (req, res) => {
  const { title, description, category, imageUrl, location } = req.body;
  
  if (!title || !description || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newComplaint = {
    id: nextComplaintId++,
    title,
    description,
    category,
    imageUrl,
    location,
    votes: 0,
    status: 'open',
    createdAt: new Date().toISOString()
  };

  complaints.push(newComplaint);
  res.status(201).json(newComplaint);
});

app.post('/api/complaints/:id/vote', (req, res) => {
  const { id } = req.params;
  const complaint = complaints.find(c => c.id === parseInt(id));
  
  if (!complaint) {
    return res.status(404).json({ error: "Complaint not found" });
  }

  complaint.votes++;
  res.json(complaint);
});

// File upload route
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// Google Maps Directions route
app.get('/api/directions', async (req, res) => {
  const { lat, lng } = req.query;
  
  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing latitude or longitude" });
  }

  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google_maps_directions',
        origin: 'current location',
        destination: `${lat},${lng}`,
        api_key: SERP_API_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching directions:', error);
    res.status(500).json({ error: "Failed to fetch directions" });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});