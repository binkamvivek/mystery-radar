export const runtime = "nodejs";

export default async function handler(req, res) {
  try {
    const { lat, lng, type } = req.query;

    if (!lat || !lng || !type) {
      return res.status(400).json({
        error: "Missing lat, lng, or type"
      });
    }

    const query = `
[out:json][timeout:25];
(
  node["amenity"="${type}"](around:5000,${lat},${lng});
  way["amenity"="${type}"](around:5000,${lat},${lng});
  relation["amenity"="${type}"](around:5000,${lat},${lng});
);
out center;
`;

    const response = await fetch(
      "https://overpass.kumi.systems/api/interpreter",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain"
        },
        body: query
      }
    );

    const data = await response.json();

    // 🔥 NORMALIZE DATA (THIS FIXES YOUR FRONTEND ISSUE)
    const places = (data.elements || []).map((el) => {
      const lat = el.lat || el.center?.lat;
      const lng = el.lon || el.center?.lon;

      return {
        id: el.id,
        name: el.tags?.name || "Unknown Place",
        lat,
        lng,
        type: el.tags?.amenity || type
      };
    }).filter(p => p.lat && p.lng);

    return res.status(200).json({
      count: places.length,
      places
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
}