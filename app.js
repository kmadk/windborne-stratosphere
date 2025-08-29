// Step 2: Enhanced WindBorne Data Fetcher with Map Visualization
class BalloonDataFetcher {
  constructor() {
    this.balloonData = [];
    this.currentHour = 0;
    this.map = null;
    this.balloonMarkers = [];
    this.altitudeChart = null;
    this.isPlaying = false;
    this.selectedBalloon = null;
    this.jetStreamLayer = null;
    this.jetStreamData = null;

    this.logMessage("Initializing StratoSphere...");
  }

  logMessage(message, type = "info") {
    const logDiv = document.getElementById("debug-log");
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement("div");
    logEntry.textContent = `[${timestamp}] ${message}`;
    logEntry.style.color = type === "error" ? "#ff6b6b" : "#888";
    logDiv.appendChild(logEntry);
    logDiv.scrollTop = logDiv.scrollHeight;

    console.log(`[${type.toUpperCase()}]`, message);
  }

  updateStatus(message) {
    document.getElementById("status").textContent = message;
  }

  async fetchBalloonData(hour = 0) {
    const hourStr = String(hour).padStart(2, "0");
    // Use proxy server to avoid CORS issues
    const url = `http://localhost:8001/api/windborne/${hourStr}`;

    this.logMessage(`Fetching hour ${hourStr} data...`);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format");
      }

      this.logMessage(
        `Retrieved ${data.length} balloon positions for hour ${hourStr}`
      );

      return this.processBalloonData(data, hour);
    } catch (error) {
      this.logMessage(
        `Failed to fetch hour ${hourStr}: ${error.message}`,
        "error"
      );
      return null;
    }
  }

  processBalloonData(rawData, hour) {
    const validBalloons = [];
    let invalidCount = 0;

    rawData.forEach((point, index) => {
      if (!Array.isArray(point) || point.length !== 3) {
        invalidCount++;
        return;
      }

      const [lat, lon, alt] = point;

      if (isNaN(lat) || isNaN(lon) || isNaN(alt)) {
        invalidCount++;
        return;
      }

      if (Math.abs(lat) > 90 || Math.abs(lon) > 180) {
        invalidCount++;
        return;
      }

      validBalloons.push({
        id: `balloon_${index}`,
        lat: lat,
        lon: lon,
        altitude: alt * 1000, // Convert km to meters
        altitudeKm: alt,
        hour: hour,
        timestamp: new Date(Date.now() - hour * 3600000),
      });
    });

    if (invalidCount > 0) {
      this.logMessage(`Filtered out ${invalidCount} invalid data points`);
    }

    return validBalloons;
  }

  async fetchAllHours() {
    this.updateStatus("Fetching 24 hours of balloon data...");
    const allData = [];

    for (let hour = 0; hour < 24; hour++) {
      const hourData = await this.fetchBalloonData(hour);
      if (hourData) {
        allData.push({
          hour: hour,
          balloons: hourData,
        });
      }

      // Update progress
      this.updateStatus(`Loading: ${Math.round(((hour + 1) / 24) * 100)}%`);
    }

    this.balloonData = allData;
    this.updateStatus("Data loaded successfully!");

    // Initialize map after data is loaded
    this.initializeMap();

    // Initialize controls
    this.initializeControls();

    // Update UI
    this.updateBalloonStats();

    // Display initial hour
    this.displayHour(0);

    return allData;
  }

  initializeMap() {
    // Initialize Leaflet map
    this.map = L.map("map", {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 10,
      worldCopyJump: true,
    });

    // Add dark tile layer
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: "© OpenStreetMap contributors © CARTO",
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(this.map);

    this.logMessage("Map initialized");

    // Load jet stream data
    this.loadJetStreamData();
  }

  async loadJetStreamData() {
    this.logMessage("Loading jet stream data...");
    try {
      const response = await fetch("http://localhost:8001/api/jetstream");
      const data = await response.json();
      this.jetStreamData = data;
      this.displayJetStreams();
      this.logMessage(`Loaded ${data.jetStreams.length} jet stream points`);
      document.getElementById("jet-stream-status").textContent = "✓ Visible";
      document.getElementById("jet-stream-status").style.color = "#00ff66";
    } catch (error) {
      this.logMessage(
        `Failed to load jet stream data: ${error.message}`,
        "error"
      );
    }
  }

  displayJetStreams() {
    if (!this.jetStreamData || !this.map) return;

    // Group jet stream points by type for continuous lines
    const jetStreamLines = {};

    this.jetStreamData.jetStreams.forEach((point) => {
      if (!jetStreamLines[point.type]) {
        jetStreamLines[point.type] = [];
      }
      jetStreamLines[point.type].push([point.lat, point.lon]);
    });

    // Draw jet stream lines
    Object.keys(jetStreamLines).forEach((type) => {
      const color = type.includes("polar") ? "#ff00ff" : "#00ffff";
      const opacity = type.includes("polar") ? 0.8 : 0.6;

      // Create polyline for jet stream
      const jetLine = L.polyline(jetStreamLines[type], {
        color: color,
        weight: 3,
        opacity: opacity,
        dashArray: "10, 5",
        className: "jet-stream-line",
      }).addTo(this.map);

      // Add popup with jet stream info
      jetLine.bindPopup(`
        <strong>${type.replace("_", " ").toUpperCase()}</strong><br>
        Altitude: ~${
          this.jetStreamData.jetStreams.find((p) => p.type === type).altitude /
          1000
        } km<br>
        Wind Speed: ${Math.round(
          this.jetStreamData.jetStreams.find((p) => p.type === type).windSpeed
        )} knots
      `);
    });

    // Add wind arrows at intervals
    this.jetStreamData.jetStreams.forEach((point, index) => {
      // Only show every 5th arrow to avoid clutter
      if (index % 5 !== 0) return;

      // Create a small arrow marker to show wind direction
      const arrowIcon = L.divIcon({
        html: `<div style="transform: rotate(${
          point.windDirection
        }deg); color: ${
          point.type.includes("polar") ? "#ff00ff" : "#00ffff"
        }; font-size: 20px;">→</div>`,
        className: "wind-arrow",
        iconSize: [20, 20],
      });

      L.marker([point.lat, point.lon], {
        icon: arrowIcon,
        interactive: false,
        opacity: 0.7,
      }).addTo(this.map);
    });

    this.logMessage("Jet streams displayed on map");
  }

  initializeControls() {
    // Time slider control
    const timeSlider = document.getElementById("time-slider");
    timeSlider.addEventListener("input", (e) => {
      this.currentHour = parseInt(e.target.value);
      this.displayHour(this.currentHour);
    });

    // Play/pause button
    const playButton = document.getElementById("play-pause");
    playButton.addEventListener("click", () => {
      this.toggleAnimation();
    });

    // Initialize altitude chart
    this.initializeAltitudeChart();
  }

  initializeAltitudeChart() {
    const ctx = document.getElementById("altitude-chart").getContext("2d");
    this.altitudeChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            label: "Balloon Count by Altitude",
            data: [],
            backgroundColor: "rgba(0, 212, 255, 0.5)",
            borderColor: "rgba(0, 212, 255, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: "#888",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
          x: {
            ticks: {
              color: "#888",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
        },
      },
    });
  }

  displayHour(hour) {
    if (!this.balloonData[hour]) return;

    const hourData = this.balloonData[hour];

    // Clear existing markers
    this.balloonMarkers.forEach((marker) => {
      this.map.removeLayer(marker);
    });
    this.balloonMarkers = [];

    // Add new balloon markers
    hourData.balloons.forEach((balloon) => {
      const marker = this.createBalloonMarker(balloon);
      this.balloonMarkers.push(marker);
    });

    // Update UI
    document.getElementById("current-hour").textContent = hour;
    document.getElementById(
      "time-display"
    ).textContent = `Hour: ${hour} (${hourData.balloons.length} balloons)`;

    // Update altitude chart
    this.updateAltitudeChart(hourData.balloons);

    // Update stats
    this.updateHourlyStats(hourData.balloons);
  }

  createBalloonMarker(balloon) {
    // Color based on altitude
    const color = this.getAltitudeColor(balloon.altitudeKm);

    const marker = L.circleMarker([balloon.lat, balloon.lon], {
      radius: 5,
      fillColor: color,
      color: "#fff",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    }).addTo(this.map);

    // Add popup with balloon info
    marker.bindPopup(`
            <strong>Balloon ${balloon.id}</strong><br>
            Latitude: ${balloon.lat.toFixed(4)}°<br>
            Longitude: ${balloon.lon.toFixed(4)}°<br>
            Altitude: ${balloon.altitudeKm.toFixed(2)} km<br>
            Time: Hour ${balloon.hour}
        `);

    // Click handler for selection
    marker.on("click", () => {
      this.selectBalloon(balloon);
    });

    return marker;
  }

  getAltitudeColor(altitudeKm) {
    // Color gradient based on altitude
    if (altitudeKm < 5) return "#0066ff";
    if (altitudeKm < 10) return "#00aaff";
    if (altitudeKm < 15) return "#00ddff";
    if (altitudeKm < 20) return "#00ffdd";
    return "#00ff66";
  }

  selectBalloon(balloon) {
    this.selectedBalloon = balloon;

    const selectedDiv = document.getElementById("selected-balloon");
    selectedDiv.innerHTML = `
            <div class="balloon-details">
                <p><strong>ID:</strong> ${balloon.id}</p>
                <p><strong>Position:</strong> ${balloon.lat.toFixed(
                  4
                )}°, ${balloon.lon.toFixed(4)}°</p>
                <p><strong>Altitude:</strong> ${balloon.altitudeKm.toFixed(
                  2
                )} km</p>
                <p><strong>Timestamp:</strong> ${balloon.timestamp.toLocaleString()}</p>
            </div>
        `;

    // Calculate trajectory if we have multiple hours
    this.showBalloonTrajectory(balloon.id);
  }

  showBalloonTrajectory(balloonId) {
    const trajectory = [];
    const index = parseInt(balloonId.split("_")[1]);

    this.balloonData.forEach((hourData) => {
      if (hourData.balloons[index]) {
        trajectory.push({
          lat: hourData.balloons[index].lat,
          lon: hourData.balloons[index].lon,
          hour: hourData.hour,
        });
      }
    });

    if (trajectory.length > 1) {
      // Draw trajectory line
      const latlngs = trajectory.map((point) => [point.lat, point.lon]);
      const polyline = L.polyline(latlngs, {
        color: "#ff00ff",
        weight: 2,
        opacity: 0.7,
        dashArray: "5, 10",
      }).addTo(this.map);

      // Store for cleanup
      setTimeout(() => {
        this.map.removeLayer(polyline);
      }, 5000);

      this.logMessage(
        `Showing trajectory for ${balloonId}: ${trajectory.length} points`
      );
    }
  }

  updateAltitudeChart(balloons) {
    // Create altitude bins
    const bins = {
      "0-5km": 0,
      "5-10km": 0,
      "10-15km": 0,
      "15-20km": 0,
      "20km+": 0,
    };

    balloons.forEach((balloon) => {
      const alt = balloon.altitudeKm;
      if (alt < 5) bins["0-5km"]++;
      else if (alt < 10) bins["5-10km"]++;
      else if (alt < 15) bins["10-15km"]++;
      else if (alt < 20) bins["15-20km"]++;
      else bins["20km+"]++;
    });

    // Update chart
    this.altitudeChart.data.labels = Object.keys(bins);
    this.altitudeChart.data.datasets[0].data = Object.values(bins);
    this.altitudeChart.update();
  }

  updateHourlyStats(balloons) {
    const altitudes = balloons.map((b) => b.altitudeKm);
    const avgAltitude = (
      altitudes.reduce((a, b) => a + b, 0) / altitudes.length
    ).toFixed(1);

    document.getElementById("balloon-count").textContent = balloons.length;
    document.getElementById("avg-altitude").textContent = `${avgAltitude} km`;
  }

  toggleAnimation() {
    this.isPlaying = !this.isPlaying;
    const playButton = document.getElementById("play-pause");
    playButton.textContent = this.isPlaying ? "⏸" : "▶";

    if (this.isPlaying) {
      this.animate();
    }
  }

  animate() {
    if (!this.isPlaying) return;

    this.currentHour = (this.currentHour + 1) % 24;
    document.getElementById("time-slider").value = this.currentHour;
    this.displayHour(this.currentHour);

    setTimeout(() => this.animate(), 1000); // Update every second
  }

  updateBalloonStats() {
    if (this.balloonData.length === 0) return;

    const currentHour = this.balloonData[0];
    const balloonCount = currentHour.balloons.length;

    document.getElementById("balloon-count").textContent = balloonCount;

    // Calculate data quality
    const totalExpected = 24;
    const totalReceived = this.balloonData.length;
    const quality = Math.round((totalReceived / totalExpected) * 100);

    document.getElementById("data-quality").textContent = `${quality}%`;

    // Log statistics
    this.logMessage(`Total balloons: ${balloonCount}`);
    this.logMessage(
      `Data completeness: ${totalReceived}/${totalExpected} hours`
    );
  }
}

// Initialize the application
let dataFetcher;

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Starting StratoSphere application...");

  dataFetcher = new BalloonDataFetcher();

  // Start fetching data
  try {
    await dataFetcher.fetchAllHours();

    // Log sample data for verification
    if (dataFetcher.balloonData.length > 0) {
      const sampleBalloon = dataFetcher.balloonData[0].balloons[0];
      console.log("Sample balloon data:", sampleBalloon);
    }
  } catch (error) {
    console.error("Failed to initialize:", error);
    dataFetcher.logMessage(`Initialization failed: ${error.message}`, "error");
  }
});
