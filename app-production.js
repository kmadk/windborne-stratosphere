// Production version with dynamic API URLs
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

    // Detect if running locally or in production
    this.apiBase =
      window.location.hostname === "localhost" ? "http://localhost:8001" : "";
  }

  updateStatus(message) {
    document.getElementById("status").textContent = message;
  }

  async fetchBalloonData(hour = 0) {
    const hourStr = String(hour).padStart(2, "0");
    const url = `${this.apiBase}/api/windborne/${hourStr}`;



    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();

      // Validate and clean data
      const validData = data.filter((point) => {
        return (
          Array.isArray(point) &&
          point.length === 3 &&
          !point.some((v) => isNaN(v)) &&
          point[0] >= -90 &&
          point[0] <= 90 &&
          point[1] >= -180 &&
          point[1] <= 180 &&
          point[2] >= 0 &&
          point[2] <= 30
        );
      });

      // Store with balloon IDs for tracking
      const processedData = validData.map((point, index) => ({
        id: `balloon-${index}`,
        lat: point[0],
        lon: point[1],
        altitude: point[2],
        hour: hour,
      }));


      return processedData;
    } catch (error) {
      console.error(`Failed to fetch hour ${hourStr}: ${error.message}`);
      return [];
    }
  }

  async loadAllData() {
    this.updateStatus("Loading 24 hours of balloon data...");
    this.balloonData = [];

    // Fetch all 24 hours of data
    const promises = [];
    for (let hour = 0; hour < 24; hour++) {
      promises.push(this.fetchBalloonData(hour));
    }

    const allHourData = await Promise.all(promises);

    // Organize data by balloon ID across all hours
    const balloonTracks = {};
    allHourData.forEach((hourData, hour) => {
      hourData.forEach((balloon) => {
        if (!balloonTracks[balloon.id]) {
          balloonTracks[balloon.id] = [];
        }
        balloonTracks[balloon.id][hour] = balloon;
      });
    });

    this.balloonData = allHourData;
    this.balloonTracks = balloonTracks;

    // Calculate statistics
    const totalPoints = allHourData.reduce((sum, hour) => sum + hour.length, 0);
    const avgPerHour = Math.round(totalPoints / 24);
    const dataQuality = Math.round(
      (totalPoints / (24 * allHourData[0].length)) * 100
    );



    this.updateStatus("Latest flight data visualized!");
    this.updateBalloonDisplay(0);
  }

  initializeMap() {
    // Initialize Leaflet map with zoom limits
    this.map = L.map("map", {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 10,
      maxBounds: [
        [-90, -180],
        [90, 180],
      ],
      maxBoundsViscosity: 1.0,
    });

    // Add dark theme tiles
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: "© CARTO",
        subdomains: "abcd",
        maxZoom: 10,
        noWrap: true,
      }
    ).addTo(this.map);



    // Load jet stream data
    this.loadJetStreamData();
  }

  async loadJetStreamData() {

    try {
      // Fetch real weather data including jet streams
      const response = await fetch(`${this.apiBase}/api/weather`);
      const data = await response.json();
      this.jetStreamData = data;
      this.displayJetStreams();

      // Analyze balloon-jet stream interactions
      this.analyzeAtmosphericInteractions();


      document.getElementById("jet-stream-status").textContent = "✓ Live";
      document.getElementById("jet-stream-status").style.color = "#00ff66";
    } catch (error) {
      console.error(`Failed to load weather data: ${error.message}`);
      document.getElementById("jet-stream-status").textContent = "⚠ Simulated";
      document.getElementById("jet-stream-status").style.color = "#ffaa00";
    }
  }

  analyzeAtmosphericInteractions() {
    if (!this.balloonData || !this.jetStreamData) return;

    const currentBalloons = this.balloonData[this.currentHour] || [];
    let balloonsInJetStream = 0;

    currentBalloons.forEach((balloon) => {
      // Check if balloon is near jet stream altitude (8-15km)
      if (balloon.altitude >= 8 && balloon.altitude <= 15) {
        // Check latitude bands for jet streams
        const nearPolarJet = Math.abs(Math.abs(balloon.lat) - 45) < 10;
        const nearSubtropicalJet = Math.abs(Math.abs(balloon.lat) - 30) < 10;

        if (nearPolarJet || nearSubtropicalJet) {
          balloonsInJetStream++;
        }
      }
    });

    if (balloonsInJetStream > 0) {

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

    // Add wind direction arrows
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
  }

  updateBalloonDisplay(hour) {
    // Clear existing markers
    this.balloonMarkers.forEach((marker) => this.map.removeLayer(marker));
    this.balloonMarkers = [];

    const hourData = this.balloonData[hour] || [];
    document.getElementById("balloon-count").textContent = hourData.length;
    document.getElementById("current-hour").textContent = hour;

    // Update atmospheric interactions analysis
    this.currentHour = hour;
    this.analyzeAtmosphericInteractions();

    // Calculate average altitude
    if (hourData.length > 0) {
      const avgAlt =
        hourData.reduce((sum, b) => sum + b.altitude, 0) / hourData.length;
      document.getElementById("avg-altitude").textContent = `${avgAlt.toFixed(
        1
      )} km`;
    }

    // Calculate data quality
    const expectedBalloons = this.balloonData[0]?.length || 1000;
    const quality = Math.round((hourData.length / expectedBalloons) * 100);
    document.getElementById("data-quality").textContent = `${quality}%`;

    // Update altitude chart
    this.updateAltitudeChart(hourData);

    // Add markers for each balloon
    hourData.forEach((balloon) => {
      const color = this.getAltitudeColor(balloon.altitude);
      const marker = L.circleMarker([balloon.lat, balloon.lon], {
        radius: 4,
        fillColor: color,
        color: "#fff",
        weight: 0.5,
        fillOpacity: 0.8,
      }).addTo(this.map);

      marker.bindPopup(`
        <strong>Balloon ${balloon.id}</strong><br>
        Lat: ${balloon.lat.toFixed(3)}°<br>
        Lon: ${balloon.lon.toFixed(3)}°<br>
        Altitude: ${balloon.altitude.toFixed(1)} km<br>
        Hour: ${hour}
      `);

      marker.on("click", () => this.selectBalloon(balloon.id));
      this.balloonMarkers.push(marker);
    });
  }

  getAltitudeColor(altitude) {
    // Color gradient based on altitude
    // 0-5km: blue, 5-10km: cyan, 10-15km: green, 15-20km: yellow, 20+km: red
    if (altitude < 5) return "#0066ff";
    if (altitude < 10) return "#00ccff";
    if (altitude < 15) return "#00ff66";
    if (altitude < 20) return "#ffff00";
    return "#ff3333";
  }

  selectBalloon(balloonId) {
    this.selectedBalloon = balloonId;

    // Clear existing trajectory
    if (this.trajectoryLine) {
      this.map.removeLayer(this.trajectoryLine);
    }

    // Get balloon track
    const track = this.balloonTracks[balloonId];
    if (!track) return;

    // Create trajectory points
    const trajectoryPoints = [];
    track.forEach((position) => {
      if (position) {
        trajectoryPoints.push([position.lat, position.lon]);
      }
    });

    // Draw trajectory
    if (trajectoryPoints.length > 1) {
      this.trajectoryLine = L.polyline(trajectoryPoints, {
        color: "#ff00ff",
        weight: 2,
        opacity: 0.7,
        dashArray: "5, 5",
      }).addTo(this.map);
    }

    // Update selected balloon info
    const currentBalloon = track[this.currentHour];
    if (currentBalloon) {
      document.getElementById(
        "selected-balloon"
      ).innerHTML = `<strong>${balloonId}</strong><br>
        Current Position: ${currentBalloon.lat.toFixed(
          3
        )}°, ${currentBalloon.lon.toFixed(3)}°<br>
        Altitude: ${currentBalloon.altitude.toFixed(1)} km`;
    }
  }

  updateAltitudeChart(hourData) {
    // Create altitude distribution
    const bins = [0, 5, 10, 15, 20, 25];
    const distribution = Array(bins.length - 1).fill(0);

    hourData.forEach((balloon) => {
      for (let i = 0; i < bins.length - 1; i++) {
        if (balloon.altitude >= bins[i] && balloon.altitude < bins[i + 1]) {
          distribution[i]++;
          break;
        }
      }
    });

    // Update chart display
    const ctx = document.getElementById("altitude-chart").getContext("2d");

    if (this.altitudeChart) {
      this.altitudeChart.destroy();
    }

    this.altitudeChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["0-5km", "5-10km", "10-15km", "15-20km", "20km+"],
        datasets: [
          {
            label: "Balloons",
            data: distribution,
            backgroundColor: "#00d4ff",
            borderColor: "#0099ff",
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
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "#888",
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#888",
            },
          },
        },
      },
    });
  }

  setupTimeControl() {
    const slider = document.getElementById("time-slider");
    const playButton = document.getElementById("play-pause");

    slider.addEventListener("input", (e) => {
      this.currentHour = parseInt(e.target.value);
      document.getElementById("hour-display").textContent = this.currentHour;
      this.updateBalloonDisplay(this.currentHour);
    });

    playButton.addEventListener("click", () => {
      this.isPlaying = !this.isPlaying;
      playButton.textContent = this.isPlaying ? "⏸" : "▶";

      if (this.isPlaying) {
        this.animate();
      }
    });
  }

  animate() {
    if (!this.isPlaying) return;

    this.currentHour = (this.currentHour + 1) % 24;
    document.getElementById("time-slider").value = this.currentHour;
    document.getElementById("hour-display").textContent = this.currentHour;
    this.updateBalloonDisplay(this.currentHour);

    setTimeout(() => this.animate(), 1000); // Update every second
  }

  async initialize() {
    this.initializeMap();
    this.setupTimeControl();
    await this.loadAllData();
  }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  const app = new BalloonDataFetcher();
  app.initialize();
});
