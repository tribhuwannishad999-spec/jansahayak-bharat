import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const url =
      "https://agmarknet.gov.in/SearchCmmMkt.aspx";

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const $ = cheerio.load(data);

    const mandi = [];

    $("table tr").each((i, row) => {
      const cols = $(row).find("td");

      if (cols.length >= 6) {
        mandi.push({
          commodity: $(cols[0]).text().trim(),
          market: $(cols[1]).text().trim(),
          state: $(cols[2]).text().trim(),
          minPrice: $(cols[3]).text().trim(),
          maxPrice: $(cols[4]).text().trim(),
          modalPrice: $(cols[5]).text().trim()
        });
      }
    });

    res.json(mandi.slice(0, 30));

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Mandi data load failed"
    });
  }
});

export default router;
