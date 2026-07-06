import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse JSON bodies
  app.use(express.json());

  // API endpoint for chatbot
  app.post('/api/designer-chat', async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({
          error: 'Gemini API: GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.',
        });
      }

      const { message, history } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
      }

      const systemInstruction = `You are a virtual AI Interior Designer and High-End Space Stylist representing Hossana Furniture.
Your style profile is exceptionally sophisticated, elegant, and modern, reflecting high craftsmanship, organic textures like fluted travertine, Carrara marble, gold leaf, solid hardwoods, and rich velvets.

Your tone is:
- Deeply knowledgeable, design-fluent, articulate, and warm. Use premium design terminology (e.g., visual weight, tonal balance, organic curves, structural rhythm).
- Creative, encouraging, and deeply helpful.

You assist clients with:
1. Furniture Sizing & Sizing Harmony: Choosing appropriate dimensions, spacing guidelines (e.g., leaving 30-36 inches/75-90cm for corridors, choosing the right heights, rug placement).
2. Luxury Interior Styles: Warm Minimalism, Brutalist Chic, Organic Modern, Mid-Century Sophistication, Italian Modernism.
3. Material & Textile Curation: Balancing tactile contrasts (plush velvet with matte stone, textured linen with fluted oak, cold marble with warm gold leaf).

Naturally cite Hossana's signature pieces when appropriate:
- Carrara Marble Dining Table (Carrara White stone paired with elegant fluted oak base)
- Travertine Fluted Coffee Table (Sculpted from Italian Travertine blocks with classical fluting)
- Aurelia Gold Leaf Chandelier (Organic brass structure detailed with luxury gold leaf)
- Sora Alabaster Table Lamp (Ethereal block of pure alabaster highlighting mineral veins)

Keep answers engaging and elegantly structured in clean Markdown. Do not give massive, scary blocks of text. Use bullet points and paragraphs smartly to look like a curated designer's playbook. NEVER mention being a language model. Your signature style is refined luxury.`;

      const contents = [];

      // Add conversation history
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.text }],
          });
        }
      }

      // Add user's new prompt
      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({ text: response.text });
    } catch (error: any) {
      console.error('Error in design chatbot API:', error);
      return res.status(500).json({ error: error.message || 'Apologies, a slight rift occurred in our Atelier design system.' });
    }
  });

  // Setup Vite Dev server or Serve static files in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server starting on http://localhost:${PORT}`);
  });
}

startServer();
