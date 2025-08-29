// Enhanced proxy server with jet stream data from OpenWeatherMap
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const PORT = 8001;

// OpenWeatherMap API key - using free tier
// You should get your own at: https://openweathermap.org/api
const OPENWEATHER_API_KEY = "demo"; // We'll use demo endpoints for now

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Proxy WindBorne API requests
  if (req.url.startsWith("/api/windborne/")) {
    const hour = req.url.replace("/api/windborne/", "");
    const apiUrl = `https://a.windbornesystems.com/treasure/${hour}.json`;

    console.log(`Proxying WindBorne request to: ${apiUrl}`);

    https
      .get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
          data += chunk;
        });

        apiRes.on("end", () => {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(data);
        });
      })
      .on("error", (err) => {
        console.error("API request error:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      });

    return;
  }

  // Handle jet stream data requests
  if (req.url.startsWith("/api/jetstream")) {
    console.log("Generating jet stream data...");

    // For demo purposes, we'll generate realistic jet stream data
    // In production, you'd fetch from a real weather API
    const jetStreamData = generateJetStreamData();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(jetStreamData));
    return;
  }

  // Serve static files
  let filePath = "." + req.url;
  if (filePath === "./") {
    filePath = "./index.html";
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
  };

  const contentType = mimeTypes[extname] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("404 Not Found", "utf-8");
      } else {
        res.writeHead(500);
        res.end("Sorry, there was an error: " + error.code + " ..\n");
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

// Generate realistic jet stream data
function generateJetStreamData() {
  // Jet streams typically occur at 30-40° latitude in both hemispheres
  // Northern Hemisphere Polar Jet
  const northPolarJet = [];
  for (let lon = -180; lon <= 180; lon += 5) {
    // Add some meandering to make it realistic
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

  // Northern Hemisphere Subtropical Jet
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
    timestamp: new Date().toISOString(),
    jetStreams: [
      ...northPolarJet,
      ...northSubtropicalJet,
      ...southPolarJet,
      ...southSubtropicalJet,
    ],
    metadata: {
      source: "Simulated data based on typical jet stream patterns",
      units: {
        windSpeed: "knots",
        windDirection: "degrees",
        altitude: "meters",
      },
    },
  };
}

server.listen(PORT, () => {
  console.log(`Enhanced proxy server running at http://localhost:${PORT}/`);
  console.log("API endpoints available:");
  console.log("  - /api/windborne/{hour} - Balloon data");
  console.log("  - /api/jetstream - Jet stream wind data");
});
