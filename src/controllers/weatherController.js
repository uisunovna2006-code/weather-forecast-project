const axios = require("axios");

async function getWeatherByCity(req, res) {
  const city = (req.query.city || "").trim();
  if (!city) return res.status(400).json({ message: "Query param 'city' is required" });

  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) return res.status(500).json({ message: "OPENWEATHER_API_KEY is missing in .env" });

  // Current weather + metric
  const url = "https://api.openweathermap.org/data/2.5/weather";
  const { data } = await axios.get(url, {
    params: { q: city, appid: key, units: "metric" }
  });

  const result = {
    city: data.name,
    country: data.sys?.country,
    tempC: data.main?.temp,
    feelsLikeC: data.main?.feels_like,
    humidity: data.main?.humidity,
    windSpeed: data.wind?.speed,
    description: data.weather?.[0]?.description
  };

  return res.json({ weather: result });
}

module.exports = { getWeatherByCity };
