import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
  type: { type: String, enum: ["question", "coding"], default: "question" },
  question: { type: String, required: true },
  options: { type: [String], default: [] },
  correctAnswer: { type: String, default: "" },
  subject: { type: String, default: "General" },
  activeFrom: { type: Date, required: true },
  // Coding problem fields
  starterCode: { type: String, default: "" },
  language: { type: String, enum: ["javascript", "python"], default: "javascript" },
  testCases: [{
    input: { type: String, default: "" },
    expectedOutput: { type: String, default: "" },
    isPublic: { type: Boolean, default: true },
  }],
});

export default mongoose.model("Challenge", challengeSchema);






