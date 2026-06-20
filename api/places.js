export default async function handler(req, res) {

    const {
        lat,
        lng,
        type
    } = req.query;

    const query = `
    [out:json];

    node
    ["amenity"="${type}"]
    (around:2000,${lat},${lng});

    out;
    `;

    const response =
        await fetch(
            "https://overpass-api.de/api/interpreter",
            {
                method: "POST",
                body: query
            }
        );

    const data =
        await response.json();

    res.status(200).json(data);
}