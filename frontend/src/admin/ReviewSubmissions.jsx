import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaClipboardList } from "react-icons/fa";

export default function ReviewSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch submissions (you can replace the API URL)
  useEffect(() => {
    setLoading(true);
    axios
      .get("https://mini-project-2-mwwk.onrender.com/api/review-submissions", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSubmissions(res.data.submissions || []))
      .catch((err) => {
        console.error("Error fetching submissions:", err);
        setSubmissions([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleReview = (id, status) => {
    axios
      .post(
        `https://mini-project-2-mwwk.onrender.com/api/review/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setSubmissions((prev) =>
          prev.map((s) =>
            s._id === id ? { ...s, status } : s
          )
        );
      })
      .catch((err) => console.error("Error updating review:", err));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white">
        <FaSpinner className="animate-spin text-3xl text-purple-400 mr-3" />
        <p>Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 mt-12 text-white p-6 md:p-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-10 text-purple-400 flex items-center gap-3"
      >
        <FaClipboardList /> Review Submissions
      </motion.h1>

      {submissions.length === 0 ? (
        <div className="text-center text-gray-400 text-lg mt-20">
          No submissions found 💤
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-x-auto bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-800"
        >
          <table className="w-full text-left text-gray-300">
            <thead>
              <tr className="border-b border-gray-700 text-purple-300 uppercase text-sm">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Assignment</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <motion.tr
                  key={submission._id}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                  transition={{ duration: 0.2 }}
                  className="border-b border-gray-800 hover:bg-gray-800/40"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-medium">{submission.studentName}</td>
                  <td className="py-3 px-4">{submission.assignmentTitle}</td>
                  <td className="py-3 px-4">{submission.score ?? "—"}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        submission.status === "Approved"
                          ? "bg-green-600/40 text-green-300"
                          : submission.status === "Rejected"
                          ? "bg-red-600/40 text-red-300"
                          : "bg-yellow-600/40 text-yellow-300"
                      }`}
                    >
                      {submission.status || "Pending"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center flex justify-center gap-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReview(submission._id, "Approved")}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2"
                    >
                      <FaCheckCircle /> Approve
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReview(submission._id, "Rejected")}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2"
                    >
                      <FaTimesCircle /> Reject
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
