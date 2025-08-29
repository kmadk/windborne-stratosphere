// Vercel serverless function for WindBorne balloon data
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { hour } = req.query;
  const hourStr = String(hour).padStart(2, "0");
  const apiUrl = `https://a.windbornesystems.com/treasure/${hourStr}.json`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching hour ${hourStr}:`, error);
    res.status(500).json({
      error: "Failed to fetch balloon data",
      details: error.message,
    });
  }
}
