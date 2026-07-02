// Real integration: Google Gemini API (https://aistudio.google.com/app/apikey)
// Powers: AI सरकारी सहायक (Q&A), AI शिकायत लेखक (complaint drafting), AI योजना खोज
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

function getModel() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY सेट नहीं है");
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

const SYSTEM_CONTEXT = `आप "जनसहायक भारत" के AI सहायक हैं। आप भारत के ग्रामीण नागरिकों को सरल हिंदी में
सरकारी योजनाओं, दस्तावेज़ों, शिकायत प्रक्रिया और नौकरियों के बारे में सटीक और उपयोगी जानकारी देते हैं।
जवाब छोटे, स्पष्ट और आसान भाषा में दें। अगर आपको निश्चित जानकारी नहीं है, तो नजदीकी CSC केंद्र या
संबंधित सरकारी विभाग से संपर्क करने की सलाह दें। कभी भी गलत जानकारी न बनाएं।`;

// POST /api/ai/ask — general Q&A assistant
router.post("/ask", verifyToken, async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "प्रश्न आवश्यक है" });

    const model = getModel();
    const result = await model.generateContent(
      `${SYSTEM_CONTEXT}\n\nनागरिक का प्रश्न: ${question}`
    );
    res.json({ answer: result.response.text() });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message || "AI सहायक अभी उपलब्ध नहीं है" });
  }
});

// POST /api/ai/complaint-writer — turns rough notes into a formal complaint
router.post("/complaint-writer", verifyToken, async (req, res) => {
  try {
    const { category, notes } = req.body;
    if (!notes) return res.status(400).json({ error: "विवरण आवश्यक है" });

    const model = getModel();
    const prompt = `${SYSTEM_CONTEXT}\n\nनिम्नलिखित सामान्य जानकारी को एक औपचारिक, विनम्र और स्पष्ट
शिकायत के रूप में हिंदी में फिर से लिखें। श्रेणी: ${category || "सामान्य"}।
नागरिक के शब्दों में जानकारी: "${notes}"
केवल शिकायत का पाठ दें, कोई अतिरिक्त टिप्पणी नहीं।`;
    const result = await model.generateContent(prompt);
    res.json({ complaint: result.response.text() });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message || "AI सहायक अभी उपलब्ध नहीं है" });
  }
});

// POST /api/ai/scheme-finder — recommends schemes based on a citizen's situation
router.post("/scheme-finder", verifyToken, async (req, res) => {
  try {
    const { profile } = req.body; // e.g. "किसान, 45 वर्ष, 2 एकड़ जमीन, छत्तीसगढ़"
    if (!profile) return res.status(400).json({ error: "जानकारी आवश्यक है" });

    const model = getModel();
    const prompt = `${SYSTEM_CONTEXT}\n\nनागरिक की स्थिति: "${profile}"
इस जानकारी के आधार पर, कौन सी 3-5 भारत सरकार की योजनाएँ सबसे उपयुक्त हो सकती हैं,
इसकी एक संक्षिप्त सूची बताएं। हर योजना का नाम और एक पंक्ति में कारण बताएं।`;
    const result = await model.generateContent(prompt);
    res.json({ suggestions: result.response.text() });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message || "AI सहायक अभी उपलब्ध नहीं है" });
  }
});

export default router;
