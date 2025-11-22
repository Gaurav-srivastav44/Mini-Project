import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaBook,
  FaVideo,
  FaCode,
  FaFileAlt,
  FaChalkboardTeacher,
  FaBrain,
  FaArrowRight,
} from "react-icons/fa";

export default function Resources() {
  const token = localStorage.getItem("token");

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const iconMap = {
    FaBook: FaBook,
    FaVideo: FaVideo,
    FaCode: FaCode,
    FaFileAlt: FaFileAlt,
    FaChalkboardTeacher: FaChalkboardTeacher,
    FaBrain: FaBrain,
  };

  const iconColors = {
    FaBook: "text-blue-400",
    FaVideo: "text-red-400",
    FaCode: "text-cyan-400",
    FaFileAlt: "text-yellow-400",
    FaChalkboardTeacher: "text-teal-400",
    FaBrain: "text-pink-400",
  };

  const defaultResources = [
    {
      _id: "default-1",
      title: "Data Structures & Algorithms",
      description:
        "Handpicked notes, visualizations, and practice sheets for mastering DSA.",
      link: "https://www.geeksforgeeks.org/data-structures/",
      tag: "DSA",
      icon: "FaCode",
    },
    {
      _id: "default-2",
      title: "React Mastery Notes",
      description:
        "Understand React concepts with project-based tutorials and cheat sheets.",
      link: "https://react.dev/learn",
      tag: "Frontend",
      icon: "FaBook",
    },
    {
      _id: "default-3",
      title: "Aptitude & Reasoning",
      description:
        "Aptitude shortcuts, formulas, and problem sets for placement preparation.",
      link: "https://www.indiabix.com/aptitude/questions-and-answers/",
      tag: "Aptitude",
      icon: "FaFileAlt",
    },
    {
      _id: "default-4",
      title: "System Design Basics",
      description:
        "Learn scalable system architecture with diagrams, patterns, and examples.",
      link: "https://github.com/donnemartin/system-design-primer",
      tag: "Backend",
      icon: "FaChalkboardTeacher",
    },
    {
      _id: "default-5",
      title: "Machine Learning Fundamentals",
      description:
        "Start ML from scratch: supervised learning, regression, classification, etc.",
      link: "https://www.kaggle.com/learn/intro-to-machine-learning",
      tag: "AI/ML",
      icon: "FaBrain",
    },
    {
      _id: "default-6",
      title: "YouTube Learning Playlists",
      description:
        "Watch curated playlists for coding, projects, and CS fundamentals.",
      link: "https://www.youtube.com/@freecodecamp",
      tag: "Videos",
      icon: "FaVideo",
    },
  ];

  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get("https://mini-project-2-mwwk.onrender.com/api/resources", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setResources([...defaultResources, ...(res.data || [])]);
      } catch (err) {
        console.error("Failed to fetch resources:", err);
        setResources(defaultResources);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchResources();
    else {
      setResources(defaultResources);
      setLoading(false);
    }
  }, [token]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // ✅ NO BRACKET ISSUES — RETURN IS INSIDE FUNCTION
  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 md:px-12 py-12">
      {/* Header */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-400 drop-shadow-lg mb-3">
          📚 Resources Library
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Explore curated notes, tutorials, and learning materials — everything
          you need to level up your knowledge.
        </p>
      </motion.div>

      {/* Resource Cards */}
      {loading ? (
        <p className="text-center text-gray-400 text-lg">Loading resources...</p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {resources.map((res) => {
            const IconComponent = iconMap[res.icon] || FaBook;
            const iconColor = iconColors[res.icon] || "text-cyan-400";

            return (
              <motion.div
                key={res._id}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(0, 255, 255, 0.3)",
                }}
                className="bg-gray-900/80 border border-gray-700/70 rounded-2xl p-7 flex flex-col justify-between shadow-xl transition-all duration-300"
              >
                <div>
                  <div className={`mb-4 ${iconColor}`}>
                    <IconComponent className="text-4xl" />
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2">
                    {res.title}
                  </h2>

                  <p className="text-gray-400 text-sm mb-4">
                    {res.description}
                  </p>

                  <span className="inline-block bg-cyan-700/40 text-cyan-300 text-xs px-3 py-1 rounded-full font-semibold">
                    {res.tag}
                  </span>
                </div>

                <motion.a
                  href={res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 5 }}
                  className="mt-6 flex items-center gap-2 text-cyan-400 font-semibold hover:underline"
                >
                  Explore <FaArrowRight />
                </motion.a>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Footer */}
      <div className="text-center mt-16 text-gray-500 text-sm border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} EvalEra — Curated by{" "}
        <span className="text-cyan-400 font-semibold">AI Learning Engine</span> 🚀
      </div>
    </div>
  );
}
