import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

export default function AITest() {
  const location = useLocation();
  const state = location.state; // data from CreateTest
  const [aiQuestions, setAiQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateQuestions = useCallback(async () => {
    if (!state) return;
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: state.subject,
          difficulty: state.difficulty,
          numberOfQuestions: state.questions || 5,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // If backend returns JSON string, parse it
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

  if (!state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold m-4">AI Test Not Available</h1>
        <p className="text-center text-gray-300">
          AI-based test creation is currently not working. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold m-4">AI Generated Test</h1>
      <p className="mb-6">
        Subject: {state.subject}, Difficulty: {state.difficulty}, Number of Questions: {state.questions}
      </p>

      <div className="w-full max-w-3xl space-y-4">
        {loading && <p>Generating questions...</p>}
        {!loading && aiQuestions.length === 0 && <p>No questions generated yet.</p>}
        {aiQuestions.map((q, i) => (
          <div key={i} className="bg-gray-800 p-4 rounded-lg shadow-md">
            <p className="font-semibold">Q{i + 1}: {q.question}</p>
            {q.options &&
              q.options.map((opt, idx) => (
                <p key={idx} className="ml-4">
                  {String.fromCharCode(65 + idx)}. {opt}
                </p>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
