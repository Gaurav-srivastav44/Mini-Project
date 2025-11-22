import React, { useState, useEffect } from "react";
import { FaTasks, FaPlus, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // <-- added

// Assignment card component
const AssignmentCard = ({ title, date, status, submissions }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(200,0,255,0.2)" }}
    className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl transition-all duration-300 cursor-pointer"
  >
    <div className="flex justify-between items-start">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <span
        className={`text-sm font-semibold px-3 py-1 rounded-full ${
          status === "Active" ? "bg-green-600 text-white" : "bg-gray-600 text-gray-300"
        }`}
      >
        {status}
      </span>
    </div>
    <p className="text-gray-400 mb-4">Due: {new Date(date).toLocaleDateString()}</p>
    <div className="flex justify-between items-center text-gray-300 text-sm border-t border-gray-700 pt-4">
      <p>
        Submissions: <span className="font-bold text-lg text-purple-400">{submissions}</span>
      </p>
      <button className="text-sm font-medium text-purple-300 hover:text-purple-400">
        View Details &rarr;
      </button>
    </div>
  </motion.div>
);

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // <-- added

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://mini-project-2-mwwk.onrender.com/api/assignments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(res.data);
      } catch (err) {
        console.error("Failed to fetch assignments:", err);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [token]);

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white">
        <p className="text-lg">Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-10 bg-gray-950 min-h-screen mt-10 text-white">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
          <FaTasks className="text-purple-400 drop-shadow-[0_0_15px_rgba(200,0,255,0.7)]" />
          Assignments Management
        </h1>
        <p className="text-gray-400 mt-2">Create, manage, and track all student assignments.</p>
      </header>

      <section className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-lg">
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(200,0,255,0.7)" }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-bold shadow-xl shadow-purple-500/30 transition-all duration-300 transform"
          onClick={() => navigate("/create-assignment")} // <-- make sure route exists in App.jsx
        >
          <FaPlus />
          New Assignment
        </motion.button>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAssignments.map((assignment, index) => (
          <AssignmentCard key={index} {...assignment} />
        ))}
        {filteredAssignments.length === 0 && (
          <p className="text-gray-500 text-lg col-span-full text-center mt-10">
            No assignments found matching "{searchTerm}".
          </p>
        )}
      </div>

      <footer className="text-center mt-20 text-gray-500 text-sm pt-6 border-t border-gray-700">
        Assignment Hub © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
