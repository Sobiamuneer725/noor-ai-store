import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/ai-writer", async (req, res) => {
    try {
      const { product, contentType, tone } = req.body;
      if (!product) {
        return res.status(400).json({ error: "Product name is required" });
      }

      const client = getAiClient();
      const prompt = `You are an expert AI marketing copywriter for 'Noor ul Haya', a futuristic e-commerce store specializing in next-generation AI hardware and intelligent lifestyle pods.
      
Write high-converting marketing copy with the following parameters:
- Product Target: ${product}
- Content Format: ${contentType}
- Brand Tone & Voice: ${tone}

Requirements:
- Make it captivating, scannable, and well-formatted with markdown (bolding, bullet points where appropriate).
- Highlight unique AI capabilities, futuristic engineering, and lifestyle benefits.
- Do NOT include any meta-commentary or introductory conversational text like 'Here is your copy:'. Just output the marketing copy directly.`;

      const response = await client.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({ output: response.text || "No content generated." });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: error.message || "Failed to generate AI marketing copy." });
    }
  });

  app.post("/api/ai-summarize-reviews", async (req, res) => {
    try {
      const { productName, reviews } = req.body;
      if (!productName || !reviews || !Array.isArray(reviews)) {
        return res.status(400).json({ error: "Product name and reviews array are required" });
      }

      if (reviews.length === 0) {
        return res.json({ summary: "No community reviews available yet to summarize." });
      }

      const client = getAiClient();
      const reviewsText = reviews.map((r: any) => `- ${r.userName} (${r.rating} stars): "${r.comment}"`).join("\n");
      const prompt = `You are the AI Quality & Customer Intelligence Analyst at Noor ul Haya.
Analyze the following customer reviews for "${productName}" and generate a concise, highly scannable bulleted summary.

Customer Reviews:
${reviewsText}

Requirements:
- Structure the response with 3 concise sections: **🌟 What Customers Love**, **⚠️ Constructive Feedback / Considerations**, and **💡 Overall AI Verdict**.
- Use bullet points and bold formatting.
- Keep the tone helpful, objective, and professional. Do not include introductory text like 'Here is the summary'.`;

      const response = await client.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({ summary: response.text || "No summary generated." });
    } catch (error: any) {
      console.error("Gemini API summarize error:", error);
      res.status(500).json({ error: error.message || "Failed to summarize reviews." });
    }
  });

  app.post("/api/ai-concierge", async (req, res) => {
    try {
      const { message, history = [], catalog = [] } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const client = getAiClient();
      const catalogSummary = catalog.map((p: any) => 
        `ID: ${p.id} | Name: "${p.name}" | Price: $${p.price} | Category: ${p.category} | Tagline: ${p.tagline} | InStock: ${p.inStock}`
      ).join("\n");

      const prompt = `You are Noor, the futuristic AI Shopping Concierge & Neural Hardware Advisor for Noor ul Haya.
You assist customers in selecting the right AI hardware rigs, smart neural pods, and intelligent software interfaces from our catalog.

Here is our live store catalog:
${catalogSummary}

Customer Message: "${message}"

Guidelines:
- Be warm, helpful, futuristic, and concise (under 250 words).
- When recommending products from our catalog, use their EXACT product name (e.g. "Noor AI Neural Pods Pro" or "Noor AI Vision Glasses Gen 3").
- Explain specifically why the recommended item fits their workflow or request.
- Format your response clearly with markdown bullet points if multiple items are discussed.`;

      const response = await client.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      const replyText = response.text || "I am currently calibrating my neural pathways. How else may I assist you today?";
      
      // Extract matching product IDs based on name occurrence in reply
      const recommendedIds: string[] = [];
      catalog.forEach((p: any) => {
        if (replyText.toLowerCase().includes(p.name.toLowerCase())) {
          recommendedIds.push(p.id);
        }
      });

      res.json({ reply: replyText, recommendedIds });
    } catch (error: any) {
      console.error("Gemini AI Concierge error:", error);
      res.status(500).json({ error: error.message || "Failed to process AI concierge request." });
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
