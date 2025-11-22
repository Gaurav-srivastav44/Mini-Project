import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AITest() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state; // data from CreateTest

  const [aiQuestions, setAiQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ============================
  // GENERATE QUESTIONS USING AI
  // ============================
  const generateQuestions = useCallback(async () => {
    if (!state) return;
    setLoading(true);

    try {
      const response = await fetch("https://mini-project-2-mwwk.onrender.com/api/generate-questions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // FIXED 🔥
        },
        body: JSON.stringify({
          subject: state.subject,
          difficulty: state.difficulty,
          numberOfQuestions: state.questions || 5,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        let questionsArray = data.questions;

        if (typeof questionsArray === "string") {
          questionsArray = JSON.parse(data.questions);
        }

        setAiQuestions(questionsArray);
      } else {
        alert("Error generating AI questions: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate AI questions. Check backend.");
    } finally {
      setLoading(false);
    }
  }, [state]);

  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);

  // ============================
  // SAVE AI TEST TO DATABASE
  // ============================
  const handleSaveTest = async () => {
    const token = localStorage.getItem("token");
    setSaving(true);

    try {
      const payload = {
        name: state.name,
        subject: state.subject,
        difficulty: state.difficulty,
        questions: aiQuestions,
      };

      const res = await fetch("https://mini-project-2-mwwk.onrender.com/api/tests/create-ai-test", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`AI Test Saved! Test Code: ${data.code}`);
        navigate("/admin/tests");
      } else {
        alert("Error saving test: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save test.");
    } finally {
      setSaving(false);
    }
  };

  // ============================
  // IF NO TEST DATA IN STATE
  // ============================
  if (!state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-4">AI Test Not Available</h1>
        <p className="text-gray-400">Please create a test first.</p>
      </div>
    );
  }

  // ============================
  // UI STARTS HERE
  // ============================

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-cyan-400 mb-4">🤖 AI Generated Test</h1>

      <p className="text-gray-300 mb-8">
        <b>Subject:</b> {state.subject} • <b>Difficulty:</b> {state.difficulty} •{" "}
        <b>Questions:</b> {state.questions}
      </p>

      {/* Save Button */}
      {aiQuestions.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleSaveTest}
          disabled={saving}
          className="mb-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold shadow-xl"
        >
          {saving ? "Saving..." : "💾 Save AI Test"}
        </motion.button>
      )}

      {/* Display Questions */}
      <div className="w-full max-w-3xl space-y-4">
        {loading && <p className="text-center text-gray-400">Generating questions...</p>}

        {!loading && aiQuestions.length === 0 && (
          <p className="text-center text-gray-400">No questions generated yet.</p>
        )}

        {aiQuestions.map((q, i) => (
          <div key={i} className="bg-gray-800 p-5 rounded-xl shadow-lg">
            <p className="font-semibold mb-2">
              Q{i + 1}: {q.question}
            </p>

            {q.options?.map((opt, idx) => (
              <p key={idx} className="ml-4 text-gray-300">
                {String.fromCharCode(65 + idx)}. {opt}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
