// Simple proxy server to handle CORS for WindBorne API
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const PORT = 8001;

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

  // Proxy API requests
  if (req.url.startsWith("/api/windborne/")) {
    const hour = req.url.replace("/api/windborne/", "");
    const apiUrl = `https://a.windbornesystems.com/treasure/${hour}.json`;

    console.log(`Proxying request to: ${apiUrl}`);

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

server.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}/`);
  console.log("API endpoints available at: /api/windborne/{hour}");
});
