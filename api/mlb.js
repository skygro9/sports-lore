export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // The path comes in as a query param e.g. /api/mlb?path=/v1/standings?leagueId=103,104
  const { path } = req.query;

  if (!path) {
    return res.status(400).json({ error: "Missing path parameter" });
  }

  const MLB_BASE = "https://statsapi.mlb.com";

  try {
    const response = await fetch(`${MLB_BASE}${path}`, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "SportsLore/1.0",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "MLB API error" });
    }

    const data = await response.json();

    // Cache for 5 minutes — standings/schedule don't change that fast
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to reach MLB API" });
  }
}
