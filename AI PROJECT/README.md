# MarketAI Suite — AI-Powered Marketing Intelligence

An intelligent AI-powered sales and marketing platform that generates campaigns, creates personalized pitches, and scores leads.

## Features

- **Campaign Generator** - Create data-driven marketing campaigns tailored to your audience
- **Sales Pitch Creator** - Craft personalized sales pitches that convert 
- **Lead Scorer** - Identify and prioritize high-value leads using AI scoring

## Project Structure

```
.
├── backend/
│   ├── main.py          # Flask API server
│   ├── ai.py            # AI logic and insights
│   └── requirements.txt  # Backend dependencies
├── frontend/
│   ├── index.html       # Web UI
│   ├── script.js        # Interactive functionality
│   └── style.css        # Styling
├── cli.py               # Command-line interface
└── README.md            # This file
```

## Quick Start (Windows)

### 1. Install Dependencies

```powershell
# Install backend dependencies
pip install -r backend/requirements.txt

# Install CLI dependencies (optional)
pip install -r requirements.txt
```

### 2. Run the Backend Server

```powershell
python backend/main.py
```

The server will start at `http://localhost:8000`

### 3. Access the Application

**Web UI** - Open your browser and go to: `http://localhost:8000`

**CLI Interface** (optional) - In another terminal:
```powershell
python cli.py
```

## Environment Variables (Optional)

To enable real AI responses from OpenAI:

```powershell
$env:OPENAI_API_KEY = 'sk-your-api-key'
$env:OPENAI_MODEL = 'gpt-4o-mini'  # defaults to gpt-4o-mini
```

Without these set, the app uses built-in heuristics for testing.

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/analyze` - Process leads (campaign, pitch, scoring)
- `GET /` - Serve frontend

## Technologies Used

- **Backend**: Flask, Python
- **Frontend**: HTML5, CSS3, JavaScript, Chart.js
- **API**: RESTful HTTP/HTTPS
- **Charts**: Chart.js for visualizations

## Next Steps

- Add authentication
- Integrate CRM connectors (Salesforce, HubSpot)
- Add batch import (CSV, Excel)
- Enhanced AI prompts
- Data persistence (database)
- Admin dashboard
