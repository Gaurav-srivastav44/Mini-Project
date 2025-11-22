import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaBolt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCalendar,
} from "react-icons/fa";

export default function AdminDailyChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: "question",
    question: "",
    options: "",
    correctAnswer: "",
    subject: "General",
    activeFrom: "",
    starterCode: "",
    language: "javascript",
    testCases: [{ input: "", expectedOutput: "", isPublic: true }],
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/challenges", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChallenges(res.data || []);
    } catch (err) {
      console.error("Failed to fetch challenges:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const challengeData = {
        type: formData.type,
        question: formData.question,
        subject: formData.subject,
        activeFrom: new Date(formData.activeFrom).toISOString(),
      };

      if (formData.type === "coding") {
        challengeData.starterCode = formData.starterCode;
        challengeData.language = formData.language;
        challengeData.testCases = formData.testCases.filter(
          (tc) => tc.input && tc.expectedOutput
        );
      } else {
        const optionsArray = formData.options
          ? formData.options.split(",").map((opt) => opt.trim()).filter(Boolean)
          : [];
        challengeData.options = optionsArray;
        challengeData.correctAnswer = formData.correctAnswer;
      }

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/challenges/${editingId}`,
          challengeData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post("http://localhost:5000/api/challenges", challengeData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchChallenges();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save challenge");
    }
  };

  const handleEdit = (challenge) => {
    setEditingId(challenge._id);
    const activeFromDate = new Date(challenge.activeFrom);
    const dateStr = activeFromDate.toISOString().split("T")[0];
    setFormData({
      type: challenge.type || "question",
      question: challenge.question,
      options: challenge.options?.join(", ") || "",
      correctAnswer: challenge.correctAnswer || "",
      subject: challenge.subject || "General",
      activeFrom: dateStr,
      starterCode: challenge.starterCode || "",
      language: challenge.language || "javascript",
      testCases: challenge.testCases?.length > 0 
        ? challenge.testCases 
        : [{ input: "", expectedOutput: "", isPublic: true }],
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this challenge?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/challenges/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchChallenges();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete challenge");
    }
  };

  const resetForm = () => {
    setFormData({
      type: "question",
      question: "",
      options: "",
      correctAnswer: "",
      subject: "General",
      activeFrom: "",
      starterCode: "",
      language: "javascript",
      testCases: [{ input: "", expectedOutput: "", isPublic: true }],
    });
    setEditingId(null);
    setShowForm(false);
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { input: "", expectedOutput: "", isPublic: true }],
    });
  };

  const updateTestCase = (index, field, value) => {
    const newTestCases = [...formData.testCases];
    newTestCases[index][field] = value;
    setFormData({ ...formData, testCases: newTestCases });
  };

  const removeTestCase = (index) => {
    const newTestCases = formData.testCases.filter((_, i) => i !== index);
    setFormData({ ...formData, testCases: newTestCases.length > 0 ? newTestCases : [{ input: "", expectedOutput: "", isPublic: true }] });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-950 mt-10 text-white px-6 md:px-12 py-12">
      {/* Header */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400 drop-shadow-lg mb-3 flex items-center gap-3">
            <FaBolt />
            Manage Daily Challenges
          </h1>
          <p className="text-gray-400 text-lg">
            Create and manage daily challenges for students.
          </p>
        </div>
        <motion.button
          onClick={() => setShowForm(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg font-bold flex items-center gap-2 shadow-lg"
        >
          <FaPlus /> Add Challenge
        </motion.button>
      </motion.div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingId ? "Edit Challenge" : "Add New Challenge"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white text-2xl"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-300">Challenge Type</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
                >
                  <option value="question">Question (MCQ/Text Answer)</option>
                  <option value="coding">Coding Problem</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-300">
                  {formData.type === "coding" ? "Problem Description" : "Question"}
                </label>
                <textarea
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
                  rows="3"
                  required
                  placeholder={formData.type === "coding" ? "Enter the coding problem description..." : "Enter the challenge question..."}
                />
              </div>

              {formData.type === "question" && (
                <>
                  <div>
                    <label className="block mb-2 text-gray-300">
                      Options (comma-separated, leave empty for text answer)
                    </label>
                    <input
                      type="text"
                      value={formData.options}
                      onChange={(e) =>
                        setFormData({ ...formData, options: e.target.value })
                      }
                      className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
                      placeholder="Option 1, Option 2, Option 3, Option 4"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate multiple options with commas. Leave empty for free-text answer.
                    </p>
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-300">Correct Answer</label>
                    <input
                      type="text"
                      value={formData.correctAnswer}
                      onChange={(e) =>
                        setFormData({ ...formData, correctAnswer: e.target.value })
                      }
                      className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
                      required
                      placeholder="Enter the correct answer"
                    />
                  </div>
                </>
              )}

              {formData.type === "coding" && (
                <>
                  <div>
                    <label className="block mb-2 text-gray-300">Language</label>
                    <select
                      value={formData.language}
                      onChange={(e) =>
                        setFormData({ ...formData, language: e.target.value })
                      }
                      className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-300">Starter Code</label>
                    <textarea
                      value={formData.starterCode}
                      onChange={(e) =>
                        setFormData({ ...formData, starterCode: e.target.value })
                      }
                      className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none font-mono text-sm"
                      rows="6"
                      placeholder="function solve() {&#10;  // Write your code here&#10;}"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-gray-300">Test Cases</label>
                      <button
                        type="button"
                        onClick={addTestCase}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                      >
                        + Add Test Case
                      </button>
                    </div>
                    {formData.testCases.map((tc, idx) => (
                      <div key={idx} className="mb-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Test Case {idx + 1}</span>
                          {formData.testCases.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTestCase(idx)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div>
                            <label className="text-xs text-gray-400">Input</label>
                            <input
                              type="text"
                              value={tc.input}
                              onChange={(e) => updateTestCase(idx, "input", e.target.value)}
                              className="w-full p-2 bg-gray-900 rounded border border-gray-700 text-sm font-mono"
                              placeholder="Input value"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400">Expected Output</label>
                            <input
                              type="text"
                              value={tc.expectedOutput}
                              onChange={(e) => updateTestCase(idx, "expectedOutput", e.target.value)}
                              className="w-full p-2 bg-gray-900 rounded border border-gray-700 text-sm font-mono"
                              placeholder="Expected output"
                            />
                          </div>
                        </div>
                        <label className="flex items-center gap-2 text-xs text-gray-400">
                          <input
                            type="checkbox"
                            checked={tc.isPublic}
                            onChange={(e) => updateTestCase(idx, "isPublic", e.target.checked)}
                            className="accent-yellow-500"
                          />
                          Public (visible to students)
                        </label>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-gray-300">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
                  >
                    <option value="General">General</option>
                    <option value="DSA">DSA</option>
                    <option value="Aptitude">Aptitude</option>
                    <option value="Programming">Programming</option>
                    <option value="Math">Math</option>
                    <option value="Logic">Logic</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-gray-300 flex items-center gap-2">
                    <FaCalendar /> Active From Date
                  </label>
                  <input
                    type="date"
                    value={formData.activeFrom}
                    onChange={(e) =>
                      setFormData({ ...formData, activeFrom: e.target.value })
                    }
                    className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg font-bold hover:opacity-90 transition"
                >
                  {editingId ? "Update" : "Create"} Challenge
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-700 rounded-lg font-bold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Challenges List */}
      {loading ? (
        <p className="text-center text-gray-400 text-lg">Loading challenges...</p>
      ) : challenges.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          No challenges yet. Add your first challenge!
        </p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {challenges.map((challenge) => {
            const activeDate = new Date(challenge.activeFrom);
            const isToday =
              activeDate.toDateString() === new Date().toDateString();
            const isPast = activeDate < new Date() && !isToday;

            return (
              <motion.div
                key={challenge._id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`bg-gray-900/80 border rounded-2xl p-6 shadow-xl relative ${
                  isToday
                    ? "border-yellow-500/50 bg-yellow-500/10"
                    : isPast
                    ? "border-gray-700"
                    : "border-blue-500/50"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FaBolt
                      className={`text-3xl ${
                        isToday ? "text-yellow-400" : "text-gray-400"
                      }`}
                    />
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isToday
                            ? "bg-yellow-500/20 text-yellow-300"
                            : isPast
                            ? "bg-gray-700 text-gray-400"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {isToday
                          ? "Active Today"
                          : isPast
                          ? "Past"
                          : "Upcoming"}
                      </span>
                      <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-700/40 text-cyan-300">
                        {challenge.subject}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(challenge)}
                      className="p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg transition"
                      title="Edit"
                    >
                      <FaEdit className="text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(challenge._id)}
                      className="p-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg transition"
                      title="Delete"
                    >
                      <FaTrash className="text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    challenge.type === "coding"
                      ? "bg-purple-500/20 text-purple-300"
                      : "bg-blue-500/20 text-blue-300"
                  }`}>
                    {challenge.type === "coding" ? "💻 Coding" : "❓ Question"}
                  </span>
                  {challenge.type === "coding" && (
                    <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-gray-700 text-gray-300">
                      {challenge.language || "javascript"}
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold text-white mb-3 line-clamp-2">
                  {challenge.question}
                </h2>

                {challenge.type === "coding" ? (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-2">
                      Test Cases: {challenge.testCases?.length || 0}
                    </p>
                    {challenge.starterCode && (
                      <p className="text-xs text-gray-500 italic">Has starter code</p>
                    )}
                  </div>
                ) : challenge.options && challenge.options.length > 0 ? (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-2">Options:</p>
                    <div className="flex flex-wrap gap-2">
                      {challenge.options.map((opt, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300"
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                  <div className="text-sm text-gray-400">
                    <FaCalendar className="inline mr-1" />
                    {activeDate.toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Answer: {challenge.correctAnswer}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

