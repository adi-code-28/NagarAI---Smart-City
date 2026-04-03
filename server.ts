import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // In-memory store for demo purposes
  let complaints = [
    { id: '1', title: 'Large pothole on NH-48', category: 'road', location: 'Mahipalpur', status: 'in_progress', priority: 'critical', score: 87, time: '2h ago' },
    { id: '2', title: 'Overflowing garbage near market', category: 'garbage', location: 'Lajpat Nagar', status: 'open', priority: 'high', score: 71, time: '5h ago' },
    { id: '3', title: 'Street light not working', category: 'electricity', location: 'Karol Bagh', status: 'resolved', priority: 'medium', score: 45, time: '1d ago' },
  ];

  // API Routes
  app.get("/api/complaints", (req, res) => {
    res.json(complaints);
  });

  app.post("/api/complaints", (req, res) => {
    const newComplaint = {
      ...req.body,
      id: Date.now().toString(),
      time: 'Just now'
    };
    complaints.unshift(newComplaint);
    res.status(201).json(newComplaint);
  });

  app.post("/api/analyze-image", async (req, res) => {
    const { image, mimeType } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `Analyze this city complaint image. Respond ONLY with a JSON object (no markdown, no extra text): 
      {
        "category": "road|garbage|electricity|water|other",
        "damage_type": "specific type of damage",
        "severity": "low|medium|high|critical",
        "urgency_score": 1-10,
        "description": "one sentence description",
        "recommended_action": "what should be done",
        "confidence": 0.0-1.0
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: { data: image, mimeType: mimeType } }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || "{}");
      res.json(result);
    } catch (error) {
      console.error("AI Analysis Error:", error);
      res.status(500).json({ error: "Failed to analyze image" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
