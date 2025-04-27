# CivicPulse - Austin News & Polling Dashboard

CivicPulse is a web application that aggregates trending Austin civic news and allows residents to vote on these issues. The application combines real-time news feeds with interactive polling to foster civic engagement.

## Features

- **Latest News**: Displays the latest news headlines related to topics such as safety, transit, housing focused on Austin, Texas.
- **Polling**: Allows residents to vote on civic issues based on the latest news articles.
- **Trending Topics**: Shows what topics are currently trending in Austin.
- **Category Filtering**: Filter news by different categories (housing, safety, transit).
- **Responsive Design**: Works well on all device sizes.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.6 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/civic-pulse.git
cd civic-pulse
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
pip install -r requirements.txt
```

### Running the application

1. Start the backend server
```bash
npm run server
```

2. In a new terminal, start the frontend development server
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Development

### Frontend

The frontend is built with React and uses:
- Tailwind CSS for styling
- React Query for data fetching
- Chart.js for data visualization
- Lucide React for icons

### Backend

The backend is built with Flask and provides the following API endpoints:
- `/api/news` - Returns the latest news articles
- `/api/poll` - Returns the current poll and results
- `/api/vote` - Accepts and processes user votes
- `/api/trending` - Returns trending topics in Austin

## License

This project is licensed under the MIT License - see the LICENSE file for details.