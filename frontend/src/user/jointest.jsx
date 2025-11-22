import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaKey, FaSpinner } from "react-icons/fa"; // Changed FaSearch to FaSpinner for loading

export default function JoinTest() {
  const [testCode, setTestCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("You must be logged in to join a test.");
      navigate("/login"); // Direct user to login if no token is found
      return;
    }
    if (!testCode.trim()) {
      setError("Please enter a test code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `https://mini-project-2-mwwk.onrender.com/api/tests/public/by-code/${encodeURIComponent(testCode)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // You can route to a dedicated test-taking page; for now, show details
      navigate(`/take-test/${res.data._id}`, { state: { test: res.data } });
    } catch (err) {
      setError(
        err.response?.data?.error || "Connection error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-12"> {/* Deeper background color */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 w-full max-w-sm border border-gray-700/50 shadow-2xl shadow-teal-900/30" // Enhanced card styling
      >
        {/* Title */}
        <h1 className="text-4xl font-black text-center text-white mb-2 tracking-wide">
          <span className="text-teal-400">Join</span> Test
        </h1>
        <p className="text-center text-gray-400 text-base mb-8">
          Enter the unique code to begin your assessment.
        </p>

        {/* Form */}
        <form onSubmit={handleJoin} className="flex flex-col gap-6">
          <div className="relative">
            <FaKey className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={testCode}
              onChange={(e) => setTestCode(e.target.value.toUpperCase())}
              placeholder="TEST-CODE-XYZ"
              maxLength={15} // Added max length for better UX
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-700 border border-gray-600 text-white
                focus:outline-none focus:ring-4 focus:ring-teal-500/50 focus:border-teal-400 placeholder-gray-500 uppercase 
                font-mono tracking-wider text-lg transition-all duration-300 shadow-inner shadow-black/20" // Monospaced font for code
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="text-red-400 text-sm text-center bg-red-900/30 py-3 rounded-xl border border-red-500/40 font-medium"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(45, 212, 191, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !testCode.trim()}
            className={`flex items-center justify-center gap-2 
              ${loading || !testCode.trim() ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400'}
              text-white font-extrabold py-4 rounded-xl text-lg uppercase tracking-wider
              shadow-lg shadow-teal-900/40 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-teal-500/60`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Joining...
              </>
            ) : (
              <>
                <FaKey /> JOIN TEST
              </>
            )}
          </motion.button>
        </form>

        <p
          onClick={() => navigate("/userdashboard")}
          className="text-center text-gray-500 mt-8 text-sm hover:text-teal-400 cursor-pointer transition-colors duration-200"
        >
          ← Back to Dashboard
        </p>
      </motion.div>
    </div>
  );
}