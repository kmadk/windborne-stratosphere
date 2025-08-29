# StratoSphere

Real-time visualization platform combining WindBorne's balloon constellation with atmospheric weather data to analyze stratospheric navigation patterns.

## Overview

StratoSphere integrates two live data sources to provide insights into high-altitude balloon navigation:
1. **WindBorne API**: Real-time positions of 1000+ stratospheric balloons (24-hour history)
2. **NOAA GFS Model**: Atmospheric jet stream data showing wind patterns at balloon altitudes

The platform demonstrates how stratospheric balloons leverage jet streams for efficient global navigation, with some balloons achieving speeds over 200 mph when riding these atmospheric highways.

## Key Insights

- **Jet Stream Navigation**: Identifies which balloons are positioned to ride jet streams for faster travel
- **Altitude Optimization**: Shows correlation between balloon altitude and wind speed opportunities
- **Global Coverage**: Visualizes how balloon constellation provides worldwide atmospheric monitoring
- **Dynamic Routing**: 24-hour animation reveals how balloons adjust altitude to catch favorable winds

## Features

- Real-time tracking of 1000+ stratospheric balloons
- Live atmospheric jet stream visualization from weather models
- Interactive balloon trajectory analysis over 24 hours
- Altitude distribution analytics with wind correlation
- Data quality metrics and error handling for corrupted telemetry
- Balloon-jet stream interaction analysis

## Why Atmospheric Data?

WindBorne's balloons don't just drift - they actively navigate by changing altitude to catch different wind layers. By combining balloon telemetry with atmospheric wind data, this platform demonstrates:
- How balloons exploit jet streams for rapid transit
- Optimal altitude bands for different latitudes
- The relationship between atmospheric dynamics and balloon trajectories

## Technical Architecture

- **Frontend**: Vanilla JavaScript with Leaflet.js for mapping and Chart.js for analytics
- **Backend**: Vercel serverless functions for API proxying and data processing
- **Data Sources**: 
  - WindBorne constellation API (24-hour historical data)
  - NOAA atmospheric models (250mb pressure level winds)
- **Deployment**: Vercel with automatic CI/CD from GitHub

## Live Demo

https://windborne-stratosphere.vercel.app

## API Endpoints

- `/api/windborne/[hour]` - Returns balloon positions for specified hour (00-23)
- `/api/weather` - Returns atmospheric jet stream data with wind patterns