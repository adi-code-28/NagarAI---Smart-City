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

  app.get("/api/queue-status", (req, res) => {
    const { location } = req.query;
    
    // Simulate real-world data based on location type
    const locationData: Record<string, { base: number, variance: number, serviceRate: number }> = {
      'AIIMS Delhi': { base: 45, variance: 15, serviceRate: 12 },
      'Safdarjung Hospital': { base: 38, variance: 12, serviceRate: 10 },
      'Passport Seva Kendra': { base: 25, variance: 8, serviceRate: 8 },
      'RTO Janakpuri': { base: 20, variance: 10, serviceRate: 6 },
      'New Delhi Railway Station': { base: 50, variance: 20, serviceRate: 15 },
      'ISBT Kashmiri Gate': { base: 40, variance: 15, serviceRate: 12 },
      'Delhi High Court': { base: 15, variance: 5, serviceRate: 5 },
      'Supreme Court of India': { base: 12, variance: 4, serviceRate: 4 },
      'Delhi University (North)': { base: 10, variance: 5, serviceRate: 3 },
      'Sarojini Nagar Market (Parking)': { base: 30, variance: 15, serviceRate: 8 },
      'Lajpat Nagar Market (Parking)': { base: 28, variance: 12, serviceRate: 7 },
      'Connaught Place (Palika Parking)': { base: 35, variance: 10, serviceRate: 9 },
      'Police Headquarters': { base: 8, variance: 3, serviceRate: 4 },
      'Delhi Jal Board': { base: 18, variance: 7, serviceRate: 5 },
      'DTC Headquarters': { base: 14, variance: 6, serviceRate: 4 },
      'Ambedkar University': { base: 6, variance: 3, serviceRate: 2 },
      'JNU Campus': { base: 5, variance: 2, serviceRate: 2 },
      'IIT Delhi': { base: 4, variance: 2, serviceRate: 2 },
      'National Museum': { base: 12, variance: 5, serviceRate: 4 },
    };

    const data = locationData[location as string] || { base: 15, variance: 5, serviceRate: 5 };
    const currentCount = Math.floor(data.base + (Math.random() * data.variance * 2 - data.variance));
    
    res.json({
      location,
      count: Math.max(1, currentCount),
      waitTime: Math.max(5, Math.floor(currentCount * (20 / data.serviceRate))),
      load: Math.min(100, Math.floor((currentCount / (data.base + data.variance)) * 100)),
      status: currentCount > data.base + data.variance * 0.5 ? 'critical' : currentCount > data.base ? 'high' : 'normal'
    });
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
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      
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
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ 
        error: "Failed to analyze image", 
        details: errorMessage,
        suggestion: "Please check your API key and network connection."
      });
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
