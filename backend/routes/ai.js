import express from "express";
import fetch from "node-fetch";
import authMiddleware from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

router.post("/generate-questions", authMiddleware, requireAdmin, async (req, res) => {
  const { subject, difficulty, numberOfQuestions } = req.body;

  if (!subject || !difficulty || !numberOfQuestions) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const n = parseInt(numberOfQuestions, 10);
  if (isNaN(n) || n <= 0) {
    return res.status(400).json({ error: "Invalid number of questions" });
  }

  try {
    const messages = [
      {
        role: "system",
        content:
          "You generate exam MCQs ONLY in valid JSON array format. No markdown or explanations.",
      },
      {
        role: "user",
        content: `Generate ${n} ${difficulty} level multiple-choice questions on ${subject}.
Output MUST be a pure JSON array:
[
  {
    "question": "...",
    "options": ["A","B","C","D"],
    "answer": "A"
  }
]`,
      },
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "EvalEra AI Question Generator",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages,
        temperature: 0.6,
      }),
    });

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content?.trim();

    if (!text) {
      console.error("❌ Invalid AI response:", data);
      return res.status(500).json({ error: "No output from AI" });
    }

    // cleanup
    text = text.replace(/```json|```/g, "").trim();

    let questions;
    try {
      questions = JSON.parse(text);
    } catch (err) {
      return res.status(500).json({
        error: "AI returned invalid JSON",
        raw: text,
      });
    }

    // Normalize keys so database accepts them
    questions = questions.map((q) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.answer, // rename field
    }));

    res.json({ questions });
  } catch (err) {
    console.error("🔥 AI Generation Error:", err);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

export default router;
