// Vercel serverless function for jet stream data
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Generate realistic jet stream data
  const jetStreamData = generateJetStreamData();
  res.status(200).json(jetStreamData);
}

function generateJetStreamData() {
  // Northern Hemisphere Polar Jet (strongest, around 45° latitude)
  const northPolarJet = [];
  for (let lon = -180; lon <= 180; lon += 5) {
    const latVariation = Math.sin((lon * Math.PI) / 60) * 10;
    northPolarJet.push({
      lat: 45 + latVariation,
      lon: lon,
      windSpeed: 80 + Math.random() * 40, // 80-120 knots
      windDirection: 270 + Math.sin((lon * Math.PI) / 90) * 30, // Generally westerly
      altitude: 10000, // ~10km altitude
      type: "polar_jet",
    });
  }

  // Northern Hemisphere Subtropical Jet (around 30° latitude)
  const northSubtropicalJet = [];
  for (let lon = -180; lon <= 180; lon += 5) {
    const latVariation = Math.sin((lon * Math.PI) / 80) * 5;
    northSubtropicalJet.push({
      lat: 30 + latVariation,
      lon: lon,
      windSpeed: 60 + Math.random() * 30, // 60-90 knots
      windDirection: 270 + Math.sin((lon * Math.PI) / 120) * 20,
      altitude: 12000, // ~12km altitude
      type: "subtropical_jet",
    });
  }

  // Southern Hemisphere Polar Jet
  const southPolarJet = [];
  for (let lon = -180; lon <= 180; lon += 5) {
    const latVariation = Math.sin((lon * Math.PI) / 70) * 8;
    southPolarJet.push({
      lat: -50 + latVariation,
      lon: lon,
      windSpeed: 90 + Math.random() * 50, // 90-140 knots
      windDirection: 270 + Math.sin((lon * Math.PI) / 100) * 25,
      altitude: 10000,
      type: "polar_jet",
    });
  }

  // Southern Hemisphere Subtropical Jet
  const southSubtropicalJet = [];
  for (let lon = -180; lon <= 180; lon += 5) {
    const latVariation = Math.sin((lon * Math.PI) / 90) * 4;
    southSubtropicalJet.push({
      lat: -30 + latVariation,
      lon: lon,
      windSpeed: 50 + Math.random() * 30, // 50-80 knots
      windDirection: 270 + Math.sin((lon * Math.PI) / 110) * 20,
      altitude: 12000,
      type: "subtropical_jet",
    });
  }

  return {
    jetStreams: [
      ...northPolarJet,
      ...northSubtropicalJet,
      ...southPolarJet,
      ...southSubtropicalJet,
    ],
    metadata: {
      generated: new Date().toISOString(),
      dataSource: "Simulated atmospheric model",
      units: {
        windSpeed: "knots",
        windDirection: "degrees",
        altitude: "meters",
      },
    },
  };
}
