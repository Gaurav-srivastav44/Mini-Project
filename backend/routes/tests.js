import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/requireAdmin.js";
import Test from "../models/Test.js";
import Result from "../models/Result.js";
import User from "../models/User.js";
import fetch from "node-fetch";

const router = express.Router();

/* ---------------------------------------------------------
   UTILITIES
--------------------------------------------------------- */

function generateCode(length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

async function generateUniqueCode() {
  for (let i = 0; i < 5; i++) {
    const code = generateCode();
    const exists = await Test.findOne({ code }).lean();
    if (!exists) return code;
  }
  return generateCode(8);
}

/* ---------------------------------------------------------
   JUDGE0 UTILS FOR CODING QUESTIONS
--------------------------------------------------------- */

async function judge0Submit({ source_code, language_id, testCases }) {
  const results = [];
  for (const tc of testCases) {
    const resp = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
        },
        body: JSON.stringify({
          source_code,
          language_id,
          stdin: tc.input,
          expected_output: tc.output,
        }),
      }
    );
    const data = await resp.json();
    results.push({
      input: tc.input,
      output: tc.output,
      passed: data.status && data.status.id === 3,
      stdout: data.stdout,
      time: data.time,
      memory: data.memory,
    });
  }
  return results;
}

const JUDGE0_LANGS = { python: 71, javascript: 63, cpp: 53, java: 62 };

/* ---------------------------------------------------------
   XP + BADGES
--------------------------------------------------------- */

async function awardXpAndBadges(userId, percent) {
  try {
    const user = await User.findById(userId);
    if (!user) return;
    let xpGain = 200;
    const badges = new Set(user.badges || []);
    if (percent >= 90) {
      xpGain += 50;
      badges.add("Gold Student");
    }
    user.xp = (user.xp || 0) + xpGain;
    const attempts = await Result.countDocuments({ userId });
    if (attempts >= 20) badges.add("Quiz Master");
    user.badges = Array.from(badges);
    await user.save();
  } catch (_) {}
}

/* ---------------------------------------------------------
   DESCRIPTIVE ANSWER GRADING USING OPENAI
--------------------------------------------------------- */

async function openAIDescriptiveGrade({ answers, questions }) {
  const outputs = [];
  for (let i = 0; i < answers.length; ++i) {
    const { answer } = answers[i];
    const prompt = questions[i]?.prompt || "";
    const max = questions[i]?.maxScore || 10;

    let systemPrompt =
      `You are an expert exam grader. Grade only on a 0-${max} scale.`;
    let messages = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Question: ${prompt}\nAnswer: ${answer}\nProvide:\nScore: <marks>/${max}\nFeedback: <short feedback>`
      },
    ];

    try {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages,
          temperature: 0.1,
        }),
      });

      const data = await resp.json();
      let marks = 0;
      let feedback = "";

      if (data?.choices?.[0]?.message?.content) {
        const text = data.choices[0].message.content;
        const match = text.match(/\b([0-9]+(?:\.[0-9]+)?)\s*\/\s*[0-9]+/);
        marks = match ? parseFloat(match[1]) : 0;
        feedback = text.replace(/Score:.*/, "").replace(/Feedback:/, "").trim();
      }

      outputs.push({ index: i, marks, max, feedback });
    } catch (e) {
      outputs.push({
        index: i,
        marks: 0,
        max,
        feedback: "AI grading failed",
      });
    }
  }
  return outputs;
}

/* ---------------------------------------------------------
   ROUTES START HERE
--------------------------------------------------------- */

/* -------------------------------
   1️⃣ CREATE NORMAL TEST (ADMIN)
--------------------------------*/
router.post("/", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { name, subject, difficulty, numberOfQuestions, type, questions } =
      req.body;

    if (!name || !subject || !difficulty || !numberOfQuestions || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const code = await generateUniqueCode();

    const doc = await Test.create({
      name,
      subject,
      difficulty,
      numberOfQuestions,
      type,
      questions: Array.isArray(questions) ? questions : [],
      createdBy: req.user._id,
      code,
      total: numberOfQuestions,
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------------------
   2️⃣ CREATE AI TEST (ADMIN)
--------------------------------*/
router.post("/create-ai-test", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { name, subject, difficulty, questions } = req.body;

    if (!name || !subject || !difficulty || !questions) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const code = await generateUniqueCode();

    const test = await Test.create({
      name,
      subject,
      difficulty,
      type: "ai",
      questions,
      code,
      createdBy: req.user._id,
      total: questions.length,
    });

    return res.status(201).json({
      message: "AI Test created successfully",
      code,
      test,
    });
  } catch (err) {
    console.error("AI Test Save Error:", err);
    return res.status(500).json({ error: "Server error while saving AI test" });
  }
});

/* -------------------------------
   3️⃣ ADMIN — GET ALL TESTS
--------------------------------*/
router.get("/", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const tests = await Test.find({}).sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------------------
   4️⃣ ADMIN — GET MY TESTS
--------------------------------*/
router.get("/mine", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const tests = await Test.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------------------
   5️⃣ ADMIN — GET TEST BY ID
--------------------------------*/
router.get("/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ error: "Not found" });
    res.json(test);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------------------
   6️⃣ ADMIN — GET RESULTS FOR A TEST
--------------------------------*/
router.get("/:id/results", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const results = await Result.find({ testId: req.params.id })
      .sort({ submittedAt: -1 })
      .populate("userId", "username email")
      .lean();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------------------
   7️⃣ USER — JOIN BY CODE
--------------------------------*/
router.get("/public/by-code/:code", authMiddleware, async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const test = await Test.findOne({ code, isActive: true }).lean();

    if (!test) return res.status(404).json({ error: "Invalid code" });

    // Hide correct answers
    let safeQuestions = test.questions;
    if (test.type === "mcq" || test.type === "ai") {
      safeQuestions = test.questions.map((q) => ({
        question: q.question,
        options: q.options,
      }));
    }

    res.json({
      ...test,
      questions: safeQuestions,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------------------
   8️⃣ USER — SUBMIT TEST ANSWERS
--------------------------------*/
router.post("/:id/submit", authMiddleware, async (req, res) => {
  try {
    const { answers, penalty = 0, proctoringLog } = req.body;
    const test = await Test.findById(req.params.id).lean();

    if (!test) return res.status(404).json({ error: "Test not found" });

    let score = 0;
    const total = test.questions.length;

    // MCQ & AI
    if (test.type === "mcq" || test.type === "ai") {
      const map = new Map(answers.map((a) => [a.index, a.answer]));
      test.questions.forEach((q, i) => {
        if (map.get(i) === q.correctAnswer) score++;
      });
    }

    const finalScore = score - penalty;

    const result = await Result.create({
      testId: test._id,
      userId: req.user._id,
      answers,
      score,
      total,
      finalScore,
      penalty,
    });

    res.status(201).json({
      resultId: result._id,
      score,
      total,
      finalScore,
    });
  } catch (err) {
    console.error("Submit Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------------------
   9️⃣ USER — GET MY RESULT
--------------------------------*/
router.get("/:id/my-result", authMiddleware, async (req, res) => {
  try {
    const result = await Result.findOne({
      testId: req.params.id,
      userId: req.user._id,
    });

    if (!result) return res.status(404).json({ error: "No result" });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------------------
   🔟 USER — GET ALL MY RESULTS
--------------------------------*/
router.get("/results/mine", authMiddleware, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user._id })
      .sort({ submittedAt: -1 })
      .lean();

    const testIds = results.map((r) => r.testId);
    const tests = await Test.find({ _id: { $in: testIds } })
      .select("name subject difficulty")
      .lean();

    const map = new Map(tests.map((t) => [String(t._id), t]));

    res.json(
      results.map((r) => ({
        ...r,
        test: map.get(String(r.testId)),
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------------------------------------------------
   EXPORT
--------------------------------------------------------- */
export default router;
