// Real integration: OpenWeatherMap (https://openweathermap.org/api)
import express from "express";
import axios from "axios";

const router = express.Router();

// GET /api/weather?lat=&lon=  OR  /api/weather?district=
router.get("/", async (req, res) => {
  try {
    const { lat, lon, district } = req.query;
    if (!process.env.OPENWEATHER_API_KEY) {
      return res.status(500).json({ error: "OPENWEATHER_API_KEY सेट नहीं है" });
    }

    const params = {
      appid: process.env.OPENWEATHER_API_KEY,
      units: "metric",
      lang: "hi",
    };
    if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    } else if (district) {
      params.q = `${district},IN`;
    } else {
      return res.status(400).json({ error: "lat/lon या district आवश्यक है" });
    }

    const { data } = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      { params }
    );

    res.json({
      location: data.name,
      temp: data.main?.temp,
      feelsLike: data.main?.feels_like,
      humidity: data.main?.humidity,
      description: data.weather?.[0]?.description,
      icon: data.weather?.[0]?.icon,
      windSpeed: data.wind?.speed,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(502).json({ error: "मौसम जानकारी लाने में त्रुटि" });
  }
});

export default router;
