# StratoSphere

Real-time visualization platform for WindBorne's balloon constellation with integrated atmospheric jet stream analysis.

## Overview

StratoSphere visualizes WindBorne's global balloon constellation data alongside atmospheric jet streams, demonstrating how high-altitude balloons interact with atmospheric dynamics. The platform fetches 24 hours of live balloon telemetry and renders it with interactive mapping and analysis tools.

## Features

- Real-time tracking of 1000+ stratospheric balloons
- 24-hour historical data with time-series animation
- Global jet stream visualization (polar and subtropical)
- Interactive balloon trajectory analysis
- Altitude distribution analytics
- Wind speed and direction indicators
- Data quality metrics and error handling

## Technical Architecture

- **Frontend**: Vanilla JavaScript with Leaflet.js for mapping and Chart.js for analytics
- **Backend**: Vercel serverless functions for API proxying and data processing
- **Data Source**: WindBorne constellation API with 24-hour historical data
- **Deployment**: Vercel with automatic CI/CD from GitHub

## Live Demo

https://windborne-stratosphere.vercel.app

## API Endpoints

- `/api/windborne/[hour]` - Returns balloon positions for specified hour (00-23)
- `/api/jetstream` - Returns global jet stream data with wind patterns