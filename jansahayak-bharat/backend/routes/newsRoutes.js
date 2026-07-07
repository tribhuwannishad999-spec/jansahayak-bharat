import express from "express";
import Parser from "rss-parser";

const router = express.Router();
const parser = new Parser();

router.get("/", async (req, res) => {
  try {
    const location = req.query.location || "छत्तीसगढ़";

    const rssUrl =
      `https://news.google.com/rss/search?q=${encodeURIComponent(location)}&hl=hi&gl=IN&ceid=IN:hi`;

    const feed = await parser.parseURL(rssUrl);

    const news = feed.items.slice(0, 10).map(item => ({
      title: item.title,
      link: item.link,
      source: item.source?.title || "Google News",
      pubDate: item.pubDate
    }));

    res.json(news);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "News fetch failed"
    });
  }
});

export default router;
