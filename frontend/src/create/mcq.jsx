import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function CreateMCQ() {
  const navigate = useNavigate();
  const location = useLocation();
  const testData = location.state; // Get form data from previous page

  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === "question" || field === "correctAnswer") {
      newQuestions[index][field] = value;
    } else {
      newQuestions[index].options[field] = value;
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in as admin.");
      navigate("/login");
      return;
    }
    try {
      const payload = {
        name: testData?.name,
        subject: testData?.subject,
        difficulty: testData?.difficulty,
        numberOfQuestions: Number(testData?.questions || questions.length),
        type: "mcq",
        questions: questions.map(q => ({ question: q.question, options: q.options, correctAnswer: q.correctAnswer })),
      };
      const res = await axios.post("https://mini-project-2-mwwk.onrender.com/api/tests", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Test created. Code: ${res.data?.code}`);
      navigate("/admin/tests");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to create test");
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" } }),
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900 text-white">
      <motion.div
        className="bg-gray-800/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-5xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-bold text-center mb-6">
          Create MCQ Test: {testData?.name || ""}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {questions.map((q, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={fieldVariants}
              className="bg-gray-700 p-6 rounded-xl"
            >
              <label className="block mb-2 font-semibold">Question {index + 1}</label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                placeholder="Enter question"
                className="w-full p-3 rounded-lg bg-gray-600 text-white focus:ring-2 focus:ring-cyan-400 outline-none mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    value={opt}
                    onChange={(e) => handleQuestionChange(index, i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="w-full p-3 rounded-lg bg-gray-600 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
                  />
                ))}
              </div>

              <label className="block mt-4 font-semibold">Correct Answer</label>
              <select
                value={q.correctAnswer}
                onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-600 text-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
              >
                <option value="">-- Select Correct Option --</option>
                {q.options.map((opt, i) => (
                  <option key={i} value={opt}>
                    Option {i + 1}
                  </option>
                ))}
              </select>
            </motion.div>
          ))}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={addQuestion}
              className="px-6 py-2 bg-blue-600 rounded-xl font-semibold hover:bg-blue-500 transition"
            >
              Add Question
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-cyan-500 rounded-xl font-semibold hover:bg-cyan-400 transition"
            >
              Create Test
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
