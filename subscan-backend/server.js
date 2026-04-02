const express = require("express");
const cors    = require("cors");
const multer  = require("multer");
const fs      = require("fs");
const path    = require("path");
const Groq    = require("groq-sdk");
require("dotenv").config();

const app    = express();
const upload = multer({ dest: "uploads/" });
const groq   = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "SubScan running with GROQ ✅" });
});

app.post("/api/scan", upload.single("file"), async (req, res) => {
  const filePath = req.file?.path;
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const ext = path.extname(req.file.originalname).toLowerCase();
    let text   = "";

    if (ext === ".csv") {
      text = fs.readFileSync(filePath, "utf8");
    } else if (ext === ".pdf") {
      const pdfParse = require("pdf-parse");
      const buf      = fs.readFileSync(filePath);
      const parsed   = await pdfParse(buf);
      text = parsed.text;
    } else {
      return res.status(400).json({ error: "Only PDF or CSV files allowed!" });
    }

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ error: "File is empty or unreadable." });
    }

    console.log("Sending to Groq AI...");

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: `You are a financial analyst. Find all recurring subscriptions in these bank transactions.

Return ONLY valid JSON — no extra text, no markdown:
{
  "subscriptions": [
    {
      "name": "Netflix",
      "amount": 15.99,
      "category": "Streaming",
      "frequency": "Monthly",
      "annual": 191.88,
      "status": "active"
    }
  ],
  "total_monthly": 45.97,
  "total_annual": 551.64
}

Categories: Streaming, SaaS, Fitness, News, Gaming, Food, Music, Other
Also detect the currency symbol from transactions ($ USD, € EUR, £ GBP, ₹ INR, ¥ JPY, etc).
Add "currency" field to each subscription and to the main response as "currency".

Transactions:
${text.slice(0, 6000)}`
      }],
      temperature: 0.1,
      max_tokens: 2000,
    });

    console.log("Groq response received!");
    const raw   = completion.choices[0].message.content;
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Could not analyze file. Try again.");

    const json = JSON.parse(match[0]);
    res.json(json);

  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
});

app.listen(3001, () => console.log("✅ SubScan Backend running with GROQ → http://localhost:3001"));