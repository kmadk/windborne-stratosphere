// Vercel serverless function for real weather data from Open-Meteo
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    // Fetch real atmospheric data from Open-Meteo
    const jetStreamData = await fetchOpenMeteoWindData();
    res.status(200).json(jetStreamData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    // Fallback to generated data if API is unavailable
    const fallbackData = generateFallbackData();
    res.status(200).json(fallbackData);
  }
}

async function fetchOpenMeteoWindData() {
  // Open-Meteo provides free weather data including upper atmosphere winds
  // We'll fetch wind data at 250hPa (jet stream level, ~10km altitude)
  
  const jetStreamPoints = [];
  
  // Sample points along typical jet stream paths
  const sampleLatitudes = [
    { lat: 45, type: 'polar_jet_north' },      // Northern polar jet
    { lat: 30, type: 'subtropical_jet_north' }, // Northern subtropical
    { lat: -30, type: 'subtropical_jet_south' }, // Southern subtropical  
    { lat: -50, type: 'polar_jet_south' }       // Southern polar jet
  ];
  
  // Fetch data for multiple longitudes to create jet stream bands
  const promises = [];
  
  for (const latBand of sampleLatitudes) {
    // Sample every 10 degrees of longitude
    for (let lon = -180; lon <= 180; lon += 10) {
      promises.push(fetchWindAtPoint(latBand.lat, lon, latBand.type));
    }
  }
  
  const results = await Promise.all(promises);
  const validResults = results.filter(r => r !== null);
  
  return {
    jetStreams: validResults,
    metadata: {
      generated: new Date().toISOString(),
      dataSource: "Open-Meteo Global Weather API",
      description: "Real-time atmospheric wind data at 250hPa pressure level (jet stream altitude)",
      apiUrl: "https://open-meteo.com/",
      units: {
        windSpeed: "knots",
        windDirection: "degrees",
        altitude: "meters"
      }
    }
  };
}

async function fetchWindAtPoint(lat, lon, type) {
  try {
    // Open-Meteo API - free, no key required
    // Fetching wind at 250hPa pressure level (jet stream altitude)
    const url = `https://api.open-meteo.com/v1/forecast?` +
      `latitude=${lat}&longitude=${lon}` +
      `&current=wind_speed_10m,wind_direction_10m` +
      `&hourly=wind_speed_250hPa,wind_direction_250hPa,wind_speed_500hPa,wind_direction_500hPa` +
      `&forecast_days=1` +
      `&timezone=UTC`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch data for ${lat},${lon}`);
      return null;
    }
    
    const data = await response.json();
    
    // Get current hour's data (or first available)
    const currentHour = new Date().getUTCHours();
    
    // Get wind data at 250hPa (jet stream level)
    const windSpeed250 = data.hourly?.wind_speed_250hPa?.[currentHour] || 
                         data.hourly?.wind_speed_250hPa?.[0];
    const windDir250 = data.hourly?.wind_direction_250hPa?.[currentHour] || 
                       data.hourly?.wind_direction_250hPa?.[0];
    
    if (windSpeed250 === undefined || windDir250 === undefined) {
      // If 250hPa data not available, use 500hPa as fallback
      const windSpeed500 = data.hourly?.wind_speed_500hPa?.[currentHour] || 
                           data.hourly?.wind_speed_500hPa?.[0];
      const windDir500 = data.hourly?.wind_direction_500hPa?.[currentHour] || 
                         data.hourly?.wind_direction_500hPa?.[0];
      
      if (windSpeed500 && windDir500) {
        return {
          lat: lat,
          lon: lon,
          windSpeed: windSpeed500 * 0.539957, // Convert km/h to knots
          windDirection: windDir500,
          altitude: 5500, // 500hPa is around 5.5km
          type: type,
          source: 'Open-Meteo (500hPa)',
          pressure: '500hPa'
        };
      }
      
      return null;
    }
    
    // Convert wind speed from km/h to knots (1 km/h = 0.539957 knots)
    const windSpeedKnots = windSpeed250 * 0.539957;
    
    return {
      lat: lat,
      lon: lon,
      windSpeed: windSpeedKnots,
      windDirection: windDir250,
      altitude: type.includes('polar') ? 10000 : 12000, // Jet stream altitude
      type: type,
      source: 'Open-Meteo (250hPa)',
      pressure: '250hPa',
      timestamp: data.current?.time || new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`Error fetching wind data for ${lat},${lon}:`, error);
    return null;
  }
}

function generateFallbackData() {
  // Fallback with simulated but realistic jet stream patterns
  const jetStreams = [];
  
  const bands = [
    { lat: 45, type: 'polar_jet_north', altitude: 10000, speedRange: [80, 120] },
    { lat: 30, type: 'subtropical_jet_north', altitude: 12000, speedRange: [60, 90] },
    { lat: -30, type: 'subtropical_jet_south', altitude: 12000, speedRange: [50, 80] },
    { lat: -50, type: 'polar_jet_south', altitude: 10000, speedRange: [90, 140] }
  ];
  
  bands.forEach(band => {
    for (let lon = -180; lon <= 180; lon += 5) {
      const latVariation = Math.sin((lon * Math.PI) / 60) * 8;
      jetStreams.push({
        lat: band.lat + latVariation,
        lon: lon,
        windSpeed: band.speedRange[0] + Math.random() * (band.speedRange[1] - band.speedRange[0]),
        windDirection: 270 + Math.sin((lon * Math.PI) / 90) * 30,
        altitude: band.altitude,
        type: band.type,
        source: 'simulated (API unavailable)'
      });
    }
  });
  
  return {
    jetStreams,
    metadata: {
      generated: new Date().toISOString(),
      dataSource: "Simulated (Open-Meteo unavailable)",
      units: {
        windSpeed: "knots",
        windDirection: "degrees",
        altitude: "meters"
      }
    }
  };
}