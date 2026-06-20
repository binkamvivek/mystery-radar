export default async function handler(req, res) {
  const { lat, lng, type } = req.query;

  if (!lat || !lng || !type) {
    return res.status(400).json({ error: "Missing lat, lng, or type" });
  }

  const query = `
  [out:json][timeout:25];
  (
    node["amenity"="${type}"](around:2000,${lat},${lng});
    way["amenity"="${type}"](around:2000,${lat},${lng});
    relation["amenity"="${type}"](around:2000,${lat},${lng});
  );
  out center;
  `;

  try {
    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: `data=${encodeURIComponent(query)}`
      }
    );

    if (!response.ok) {
      return res.status(500).json({
        error: "Overpass API error",
        status: response.status
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
}