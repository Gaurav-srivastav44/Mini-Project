import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Assignments from "./assignments";

import {
  FaClipboardList,
  FaTrophy,
  FaChartPie,
  FaFileAlt,
  FaBookOpen,
  FaTasks,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaHome,
  FaBolt,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    testsCreated: 0,
    assignmentsGiven: 0,
    submissionsReviewed: 0,
  });
  const [myTests, setMyTests] = useState([]);
  const [myAssignments, setMyAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch profile and stats
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data.user;
        setProfile(user);
        const s = res.data.stats || {};
        setStats({
          testsCreated: s.testsCreated || 0,
          assignmentsGiven: s.assignmentsGiven || 0,
          submissionsReviewed: s.submissionsReviewed || 0,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        setProfile(null);
      })
      .finally(() => setLoading(false));

    // Fetch my tests list for preview
    axios
      .get("http://localhost:5000/api/tests/mine", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMyTests(res.data || []))
      .catch(() => setMyTests([]));

    axios
      .get("http://localhost:5000/api/assignments/mine", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMyAssignments(res.data || []))
      .catch(() => setMyAssignments([]));
  }, [token]);

  const menuItems = [
    { title: "HOME", icon: <FaHome />, link: "/" },
    { title: "Create Mock Tests", icon: <FaFileAlt />, link: "/create-test" },
    { title: "Assignments", icon: <FaTasks />, link: "/assignments" },
    { title: "Review Submissions", icon: <FaClipboardList />, link: "/review-submissions" },
    { title: "Leaderboard", icon: <FaTrophy />, link: "/leaderboard" },
    { title: "Resources", icon: <FaBookOpen />, link: "/admin/resources" },
    { title: "Daily Challenges", icon: <FaBolt />, link: "/admin/challenges" },
  ];

  const features = [
    {
      title: "Create Mock Tests",
      desc: "Design topic-wise or full-length tests and quizzes for your students.",
      icon: <FaFileAlt className="text-white text-4xl drop-shadow-md" />,
      link: "/create-test",
    },
    {
      title: "Assignments",
      desc: "Assign homework or practice tasks to track student progress.",
      icon: <FaTasks className="text-white text-4xl drop-shadow-md" />,
      link: "/assignments",
    },
    {
      title: "Review Submissions",
      desc: "Evaluate student submissions and provide feedback.",
      icon: <FaClipboardList className="text-white text-4xl drop-shadow-md" />,
      link: "/review-submissions",
    },
    {
      title: "Leaderboard",
      desc: "Track student rankings and engagement in real-time.",
      icon: <FaTrophy className="text-white text-4xl drop-shadow-md" />,
      link: "/leaderboard",
    },
    
    {
      title: "Resources",
      desc: "Provide learning materials, notes, or reference videos to students.",
      icon: <FaBookOpen className="text-white text-4xl drop-shadow-md" />,
      link: "/admin/resources",
    },
    {
      title: "Daily Challenges",
      desc: "Create and manage daily challenges to keep students engaged.",
      icon: <FaBolt className="text-white text-4xl drop-shadow-md" />,
      link: "/admin/challenges",
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

  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white">
        <p className="text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-screen md:h-auto md:min-h-screen w-64
        bg-gradient-to-b from-indigo-700 to-purple-800 
        shadow-[0_0_25px_rgba(200,0,255,0.3)] z-50 flex flex-col justify-between
        transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300`}
      >
        <div>
          <div className="flex items-center justify-between px-6 py-5 border-b border-purple-400/30">
            <h1 className="text-2xl font-extrabold tracking-wide text-white">
              Eval<span className="text-purple-300">Era</span>
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
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                onClick={() => navigate(item.link)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-left text-white font-medium hover:bg-white/10 transition-all duration-200"
              >
                <span className="text-xl">{item.icon}</span>
                {item.title}
              </motion.button>
            ))}
          </nav>
        </div>

        <div className="px-6 py-4 text-gray-300 text-sm border-t border-purple-400/30">
          © {new Date().getFullYear()} EvalEra
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden text-purple-400 text-3xl mb-4"
        >
          <FaBars />
        </button>

        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 mt-4 md:mt-8"
        >
          <div className="flex items-center gap-4">
            <FaUserCircle className="text-6xl text-purple-400 drop-shadow-[0_0_30px_rgba(200,0,255,0.8)]" />
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Welcome, <span className="text-purple-300">{profile?.username}</span> 👋
              </h1>
              <p className="text-gray-400 text-sm md:text-base mt-1">
                Create tests, assign tasks, and track student performance.
              </p>
            </div>
          </div>
          <motion.button
            onClick={() => navigate("/profile")}
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(200,0,255,0.7)" }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 md:mt-0 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-bold
                     text-lg shadow-xl shadow-purple-500/30 transition-all duration-300 transform hover:brightness-110"
          >
            View Profile
          </motion.button>
          
        </motion.header>

        {/* Stats Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
        >
          {[
            { title: "Tests Created", value: stats.testsCreated, color: "text-cyan-400" },
            { title: "Assignments Given", value: stats.assignmentsGiven, color: "text-yellow-400" },
            { title: "Submissions Reviewed", value: stats.submissionsReviewed, color: "text-green-400" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(200,0,255,0.15)" }}
              className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl transition-all duration-300"
            >
              <h2 className="text-lg font-medium text-gray-300 mb-3 uppercase tracking-wider">
                {stat.title}
              </h2>
              <p className={`text-5xl md:text-6xl font-extrabold ${stat.color} drop-shadow-md`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.section>

        {/* Features Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8 border-b-2 border-purple-500/50 pb-2 inline-block">
            Teacher Tools
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
                whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(200,0,255,0.8)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 cursor-pointer
                           shadow-lg hover:shadow-[0_0_45px_rgba(200,0,255,0.9)] transition-all duration-300
                           flex flex-col justify-between h-full transform-gpu"
                onClick={() => navigate(item.link)}
              >
                <div className="flex flex-col gap-3">
                  <div className="mb-2">{item.icon}</div>
                  <h3 className="text-2xl font-bold text-white drop-shadow-sm">{item.title}</h3>
                  <p className="text-gray-200 text-base">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* My Tests Preview */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-white">My Created Tests</h2>
            <button
              onClick={() => navigate("/admin/tests")}
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500"
            >
              View All
            </button>
          </div>
          {myTests.length === 0 ? (
            <p className="text-gray-400">No tests yet. Create one to get started.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myTests.slice(0, 4).map((t) => (
                <div key={t._id} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{t.name}</h3>
                    <span className="text-sm px-2 py-1 rounded bg-gray-700">{t.type}</span>
                  </div>
                  <p className="text-gray-300 mt-1">{t.subject} • {t.difficulty}</p>
                  <p className="text-gray-400 mt-1">Questions: {t.numberOfQuestions}</p>
                  <div className="mt-2 text-sm text-gray-400">Code: <span className="font-mono">{t.code}</span></div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* My Assignments Preview */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-white">My Assignments</h2>
            <button
              onClick={() => navigate("/assignments")}
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500"
            >
              Manage
            </button>
          </div>
          {myAssignments.length === 0 ? (
            <p className="text-gray-400">No assignments yet. Create one to get started.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myAssignments.slice(0, 4).map((a) => (
                <div key={a._id} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{a.title}</h3>
                    <span className={`text-sm px-2 py-1 rounded ${a.status === "Active" ? "bg-green-600" : "bg-gray-600"}`}>
                      {a.status}
                    </span>
                  </div>
                  <p className="text-gray-300 mt-1">Due: {new Date(a.date).toLocaleDateString()}</p>
                  {a.file && (
                    <a
                      className="text-sm text-purple-300 hover:text-purple-200 underline"
                      href={`http://localhost:5000/uploads/${a.file}`}
                      target="_blank" rel="noreferrer"
                    >
                      View File
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center mt-20 text-gray-500 text-sm md:text-base border-t border-gray-700 pt-6">
          © {new Date().getFullYear()} EvalEra |{" "}
          <span className="font-semibold text-purple-400">
            Empowering AI-Powered Learning
          </span>{" "}
          🚀
        </footer>
      </div>
    </div>
  );
}
