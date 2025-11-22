import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/requireAdmin.js";
import Challenge from "../models/Challenge.js";
import Attempt from "../models/Attempt.js";

const router = express.Router();

// Create challenge (admin)
router.post("/", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { type, question, options = [], correctAnswer, subject, activeFrom, starterCode, language, testCases = [] } = req.body;
    if (!question || !activeFrom) return res.status(400).json({ error: "Missing required fields" });
    
    const challengeData = {
      type: type || "question",
      question,
      options,
      subject,
      activeFrom,
    };

    if (type === "coding") {
      challengeData.starterCode = starterCode || "";
      challengeData.language = language || "javascript";
      challengeData.testCases = testCases;
    } else {
      if (!correctAnswer) return res.status(400).json({ error: "Correct answer is required for question type" });
      challengeData.correctAnswer = correctAnswer;
    }

    const doc = await Challenge.create(challengeData);
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get today's challenge (auth)
router.get("/today", authMiddleware, async (req, res) => {
  try {
    const start = new Date(); start.setHours(0,0,0,0);
    const end = new Date(); end.setHours(23,59,59,999);
    const ch = await Challenge.findOne({ activeFrom: { $gte: start, $lte: end } }).lean();
    if (!ch) return res.status(404).json({ error: "No challenge for today" });
    // Do not send correct answer
    const { correctAnswer, ...safe } = ch;
    res.json(safe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Submit attempt (auth)
router.post("/:id/attempt", authMiddleware, async (req, res) => {
  try {
    const { answer, code, language } = req.body;
    const ch = await Challenge.findById(req.params.id).lean();
    if (!ch) return res.status(404).json({ error: "Challenge not found" });
    
    let correct = false;
    let submissionData = { challengeId: ch._id, userId: req.user._id };

    if (ch.type === "coding") {
      // For coding challenges, store the code submission
      submissionData.code = code || "";
      submissionData.language = language || ch.language;
      // Note: Actual code evaluation would require a code execution service
      // For now, we just store the submission
      correct = false; // Would need to evaluate against test cases
    } else {
      // For question challenges, check answer
      submissionData.answer = answer;
      correct = typeof answer === "string" && answer === ch.correctAnswer;
    }

    const attempt = await Attempt.create({ ...submissionData, correct });
    res.status(201).json({ correct, attemptId: attempt._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all challenges (admin)
router.get("/", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const challenges = await Challenge.find({}).sort({ activeFrom: -1 });
    res.json(challenges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single challenge (admin)
router.get("/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });
    res.json(challenge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update challenge (admin)
router.put("/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { type, question, options, correctAnswer, subject, activeFrom, starterCode, language, testCases } = req.body;
    
    const updateData = {
      type: type || "question",
      question,
      options: options || [],
      subject,
      activeFrom,
    };

    if (type === "coding") {
      updateData.starterCode = starterCode || "";
      updateData.language = language || "javascript";
      updateData.testCases = testCases || [];
      updateData.correctAnswer = ""; // Not needed for coding
    } else {
      updateData.correctAnswer = correctAnswer;
      updateData.starterCode = "";
      updateData.language = "javascript";
      updateData.testCases = [];
    }

    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });
    res.json(challenge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete challenge (admin)
router.delete("/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });
    res.json({ message: "Challenge deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;






