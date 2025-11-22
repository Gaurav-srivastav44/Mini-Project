import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaBars,
  FaTimes,
  FaBrain,
  FaClipboardList,
  FaTrophy,
  FaBookOpen,
  FaBolt,
  FaChartPie,
  FaHome,
  FaFileAlt,
  FaDownload,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function UserDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null); // ⭐ NEW ADDED
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ⭐ FETCH USER DETAILS
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const res = await axios.get("https://mini-project-2-mwwk.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data?.user || null);
      } catch (err) {
        console.error("Failed to load user info", err);
      }
    };

    fetchUser();
  }, [token]);

  // ⭐ FETCH TEST RESULTS
  useEffect(() => {
    const fetchResults = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("https://mini-project-2-mwwk.onrender.com/api/tests/results/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(res.data || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load results");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [token]);

  // ⭐ FETCH ASSIGNMENTS
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!token) {
        setAssignmentsLoading(false);
        return;
      }

      try {
        const res = await axios.get("https://mini-project-2-mwwk.onrender.com/api/assignments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(res.data || []);
      } catch (err) {
        console.error("Failed to load assignments:", err);
        setAssignments([]);
      } finally {
        setAssignmentsLoading(false);
      }
    };
    fetchAssignments();
  }, [token]);

  const testsAttempted = results.length;

  const averageScore = useMemo(() => {
    if (!results.length) return 0;
    const sum = results.reduce((acc, r) => acc + (r.score / (r.total || 1)), 0);
    return Math.round((sum / results.length) * 100);
  }, [results]);

  const menuItems = [
    { title: "HOME", icon: <FaHome />, link: "/" },
    { title: "Mock Tests", icon: <FaClipboardList />, link: "/mock-tests" },
    { title: "Visualizer", icon: <FaBrain />, link: "/visualizer" },
    { title: "Leaderboard", icon: <FaTrophy />, link: "/leaderboard" },
    { title: "Analytics", icon: <FaChartPie />, link: "/analytics" },
    { title: "Challenges", icon: <FaBolt />, link: "/daily-challenges" },
    { title: "Resources", icon: <FaBookOpen />, link: "/resources" },
  ];

  const features = [
    {
      title: "Mock Tests",
      desc: "Take topic-wise and full-length mock tests to evaluate performance.",
      icon: <FaClipboardList className="text-white text-4xl drop-shadow-md" />,
      link: "/mock-tests",
    },
    {
      title: "Concept Visualizer",
      desc: "Understand complex concepts visually with AI-powered explanations.",
      icon: <FaBrain className="text-white text-4xl drop-shadow-md" />,
      link: "/visualizer",
    },
    {
      title: "Leaderboard",
      desc: "See where you stand among peers with real-time rankings.",
      icon: <FaTrophy className="text-white text-4xl drop-shadow-md" />,
      link: "/leaderboard",
    },
    {
      title: "Performance Analytics",
      desc: "Get detailed insights of your strengths and weaknesses.",
      icon: <FaChartPie className="text-white text-4xl drop-shadow-md" />,
      link: "/analytics",
    },
    {
      title: "Daily Challenges",
      desc: "Boost your skills with daily coding & aptitude tasks.",
      icon: <FaBolt className="text-white text-4xl drop-shadow-md" />,
      link: "/daily-challenges",
    },
    {
      title: "Resources Library",
      desc: "Access curated study material, notes, and videos.",
      icon: <FaBookOpen className="text-white text-4xl drop-shadow-md" />,
      link: "/resources",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-screen w-64
        bg-gradient-to-b from-cyan-700 to-blue-800 
        shadow-[0_0_25px_rgba(0,200,255,0.3)] z-50 flex flex-col justify-between
        transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300`}
      >
        <div>
          <div className="flex items-center justify-between px-6 py-5 border-b border-cyan-400/30">
            <h1 className="text-2xl font-extrabold tracking-wide text-white">
              Eval<span className="text-cyan-300">Era</span>
            </h1>
            <button
              className="md:hidden text-white text-2xl"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          <nav className="flex flex-col gap-2 mt-6 px-4">
            {menuItems.map((item, idx) => (
              <motion.button
                key={idx}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
                onClick={() => navigate(item.link)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-200"
              >
                <span className="text-xl">{item.icon}</span>
                {item.title}
              </motion.button>
            ))}
          </nav>
        </div>

        <div className="px-6 py-4 text-gray-300 text-sm border-t border-cyan-400/30">
          © {new Date().getFullYear()} EvalEra
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden text-cyan-400 text-3xl mb-4"
        >
          <FaBars />
        </button>

        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 mt-4"
        >
          <div className="flex items-center gap-4">
            <FaUserCircle className="text-6xl text-cyan-400" />
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Welcome Back,{" "}
                <span className="text-cyan-300">
                  {user?.name || "User"}
                </span>{" "}
                👋
              </h1>
              <p className="text-gray-400 text-sm md:text-base mt-1">
                Track your progress and continue learning smarter.
              </p>
            </div>
          </div>

          {/* Profile Button */}
          <div>
            <motion.button
              onClick={() => navigate("/profile")}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(0, 255, 255, 0.7)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-lg shadow-xl"
            >
              View Profile
            </motion.button>
          </div>
        </motion.header>

        {/* Stats Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-16"
        >
          {[{title:"Tests Attempted",value:testsAttempted,color:"text-cyan-400"},
            {title:"Average Score",value:`${averageScore}%`,color:"text-yellow-400"}]
            .map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-7 border border-gray-700 shadow-xl"
            >
              <h2 className="text-sm font-semibold text-gray-400 mb-2">
                {stat.title}
              </h2>
              <p className={`text-5xl font-extrabold ${stat.color}`}>
                {stat.value}
              </p>
            </motion.div>
          ))}

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-teal-600 rounded-xl p-7 flex flex-col items-center justify-center"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Test Yourself?
            </h2>

            <motion.button
              onClick={() => navigate("/jointest")}
              whileHover={{ scale: 1.05 }}
              className="w-full max-w-xs px-8 py-3 bg-white/90 text-teal-700 font-bold rounded-lg"
            >
              JOIN A TEST
            </motion.button>
          </motion.div>
        </motion.section>

        {/* Features */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            Student Tools
          </h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {features.map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl p-6 cursor-pointer shadow-lg"
                onClick={() => navigate(item.link)}
              >
                <div className="flex flex-col gap-3">
                  <div className="mb-2">{item.icon}</div>
                  <h3 className="text-2xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-200">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Assignments Section */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">
              Assignments
            </h2>
            <motion.button
              onClick={() => navigate("/my-assignments")}
              whileHover={{ scale: 1.05 }}
              className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold"
            >
              View All →
            </motion.button>
          </div>

          {assignmentsLoading ? (
            <p className="text-gray-400">Loading assignments...</p>
          ) : assignments.length === 0 ? (
            <p className="text-gray-400">No assignments available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments.slice(0, 6).map((assignment) => (
                <motion.div
                  key={assignment._id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-6 shadow-lg border border-purple-500/30"
                >
                  <div className="flex items-start justify-between mb-4">
                    <FaFileAlt className="text-3xl text-white" />
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        assignment.status === "Active"
                          ? "bg-green-500/80 text-white"
                          : "bg-gray-500/80 text-white"
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {assignment.title}
                  </h3>
                  <p className="text-gray-200 text-sm mb-4">
                    Due: {new Date(assignment.date).toLocaleDateString()}
                  </p>
                  {assignment.file && (
                    <a
                      href={`https://mini-project-2-mwwk.onrender.com/uploads/${assignment.file}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-semibold transition"
                    >
                      <FaDownload />
                      Download
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Results */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Recent Results
          </h2>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : results.length === 0 ? (
            <p className="text-gray-400">No results yet. Join a test to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-900/60 border border-gray-700 rounded-xl">
                <thead>
                  <tr className="text-left text-gray-300">
                    <th className="px-4 py-3">Test</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Submitted</th>
                  </tr>
                </thead>

                <tbody>
                  {results.slice(0, 10).map((r) => (
                    <tr key={r._id} className="border-t border-gray-800">
                      <td className="px-4 py-3">{r.test?.name || r.testId}</td>
                      <td className="px-4 py-3">{r.test?.subject || "-"}</td>
                      <td className="px-4 py-3">
                        {r.score} / {r.total} (
                        {Math.round((r.score / (r.total || 1)) * 100)}%)
                      </td>
                      <td className="px-4 py-3">
                        {new Date(r.submittedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center mt-20 text-gray-500 text-sm border-t border-gray-700 pt-6">
          © {new Date().getFullYear()} EvalEra |
          <span className="text-cyan-400 font-semibold">
            {" "}
            Empowering AI Learning with Gaurav Srivastav
          </span>{" "}
          🚀
        </footer>
      </div>
    </div>
  );
}
