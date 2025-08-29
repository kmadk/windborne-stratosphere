# StratoSphere - WindBorne Atmospheric Intelligence

Real-time visualization platform for WindBorne's balloon constellation with integrated atmospheric jet stream analysis.

## Overview

This application visualizes WindBorne's global balloon constellation data alongside atmospheric jet streams, demonstrating how high-altitude balloons interact with atmospheric dynamics. The platform fetches 24 hours of live balloon telemetry and renders it with interactive mapping and analysis tools.

## Features

### Data Processing
- Fetches 24 hours of balloon position data from WindBorne API
- Validates and cleans corrupted data points
- Handles missing or malformed JSON gracefully
- Tracks data quality metrics and balloon statistics
- Real-time altitude distribution analysis

### Interactive Visualization
- Global map with 1000+ balloon positions using Leaflet.js
- Time control system for viewing any hour (0-23) with playback
- Color-coded altitude visualization (0-25km range)
- Click-to-select balloons with 24-hour trajectory display
- Live altitude distribution histogram using Chart.js

### Atmospheric Analysis
- Global jet stream visualization with accurate positioning
- Polar jets at 45° latitude (10km altitude, 80-120 knots)
- Subtropical jets at 30° latitude (12km altitude, 60-90 knots)
- Wind direction indicators and speed visualization
- Interactive jet stream information panels

## Technical Implementation

### Architecture
- Serverless API functions deployed on Vercel
- Client-side data processing and visualization
- CORS-compliant API proxying
- Robust error handling with data validation

### Technology Stack
- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Mapping: Leaflet.js
- Charts: Chart.js
- Backend: Node.js serverless functions
- Deployment: Vercel

## Running Locally

```bash
# Install dependencies (if needed)
npm install

# Start development server
node atmospheric-proxy.js

# Open browser
http://localhost:8001
```

## Production Deployment

Deployed on Vercel with automatic CI/CD from GitHub.
See `DEPLOY_GUIDE.md` for deployment instructions.

## Project Structure

```
windborne-stratosphere/
├── api/                      # Vercel serverless functions
│   ├── windborne/[hour].js  # Balloon data proxy
│   └── jetstream.js         # Jet stream data generation
├── index.html               # Main application
├── app-production.js        # Core application logic
├── styles.css              # Application styling
└── vercel.json            # Deployment configuration
```

## API Endpoints

- `/api/windborne/[hour]` - Returns balloon positions for specified hour (00-23)
- `/api/jetstream` - Returns global jet stream data

## Data Format

Balloon data: `[latitude, longitude, altitude]` arrays
Jet stream data: Objects with position, wind speed, direction, and altitude

## License

MIT