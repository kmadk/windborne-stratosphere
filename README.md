# StratoSphere - WindBorne Atmospheric Intelligence

## Current Progress: Step 3 - Jet Stream Integration

### How to Run

1. Start the server: `node atmospheric-proxy.js`
2. Open browser: http://localhost:8001
3. Watch as it loads balloon data AND jet streams
4. Interact with the map and atmospheric features

### Features Implemented

#### Step 1: ✅ Basic Data Fetching

- Fetches 24 hours of balloon position data
- Validates and cleans corrupted data
- Shows balloon count and data quality metrics
- Displays altitude statistics

#### Step 2: ✅ Interactive Map Visualization

- **Leaflet Map**: Interactive world map with balloon positions
- **Time Control**: Slider to view any hour (0-23) and play animation
- **Altitude Visualization**: Color-coded markers based on altitude
- **Balloon Selection**: Click any balloon to see details
- **Trajectory Display**: Shows 24-hour path when balloon is selected
- **Altitude Chart**: Live histogram of altitude distribution
- **Auto-play**: Animation through 24 hours of data

#### Step 3: ✅ Jet Stream Visualization

- **Live Jet Streams**: Real-time visualization of global jet streams
- **Polar Jets**: Northern and Southern hemisphere polar jet streams (purple)
- **Subtropical Jets**: Northern and Southern subtropical jets (cyan)
- **Wind Indicators**: Directional arrows showing wind flow
- **Interactive Info**: Click jet streams to see wind speed and altitude
- **Atmospheric Integration**: Shows how balloons interact with jet streams

### Interactive Features

- 🗺️ Pan and zoom the map
- ⏯️ Play/pause time animation
- 🎯 Click balloons for detailed information
- 📊 Real-time altitude distribution chart
- 🌈 Color-coded altitude visualization
- 💨 Jet stream visualization with wind speeds
- 🌪️ Wind direction indicators
- 🌍 Global atmospheric patterns

### Files

- `index.html` - Enhanced HTML with map and controls
- `styles.css` - Dark theme with atmospheric styling
- `app.js` - Full interactive visualization logic

### Next Steps

- Step 3: Integrate atmospheric data (NASA, NOAA)
- Step 4: Add wind patterns and jet stream visualization
- Step 5: Scientific analysis features (gravity waves, stratospheric dynamics)
- Step 6: 3D visualization and atmospheric layers
