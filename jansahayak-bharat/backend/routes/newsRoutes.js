// Real integration: NewsAPI.org (free dev tier). For production India-only govt news,
// swap the /everything query below for a curated set of gov press-release RSS feeds
// (e.g. pib.gov.in) if you hit NewsAPI's free-tier rate/plan limits.
import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (!process.env.NEWS_API_KEY) {
      return res.status(500).json({ error: "NEWS_API_KEY सेट नहीं है" });
    }
    const query = req.query.q || "India government scheme OR sarkari yojana OR bharat sarkar";
    const { data } = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: query,
        language: "hi",
        sortBy: "publishedAt",
        pageSize: 15,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    res.json(
      (data.articles || []).map((a) => ({
        title: a.title,
        source: a.source?.name,
        url: a.url,
        publishedAt: a.publishedAt,
        image: a.urlToImage,
      }))
    );
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(502).json({ error: "समाचार लाने में त्रुटि" });
  }
});

export default router;
