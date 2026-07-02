// REAL Government API: data.gov.in Open Government Data Platform — Agmarknet daily
// mandi (market) prices. Register free at https://data.gov.in and request an API key.
// Resource: "Current Daily Price of Various Commodities from Various Markets (Mandi)"
import express from "express";
import axios from "axios";

const router = express.Router();

// GET /api/mandi?state=&district=&commodity=
router.get("/", async (req, res) => {
  try {
    if (!process.env.DATA_GOV_IN_API_KEY) {
      return res.status(500).json({ error: "DATA_GOV_IN_API_KEY सेट नहीं है" });
    }
    const resourceId = process.env.DATA_GOV_IN_MANDI_RESOURCE_ID;
    const { state, district, commodity } = req.query;

    const filters = {};
    if (state) filters["filters[state]"] = state;
    if (district) filters["filters[district]"] = district;
    if (commodity) filters["filters[commodity]"] = commodity;

    const { data } = await axios.get(
      `https://api.data.gov.in/resource/${resourceId}`,
      {
        params: {
          "api-key": process.env.DATA_GOV_IN_API_KEY,
          format: "json",
          limit: 50,
          ...filters,
        },
      }
    );

    res.json(data.records || []);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(502).json({ error: "मंडी भाव लाने में त्रुटि" });
  }
});

export default router;
