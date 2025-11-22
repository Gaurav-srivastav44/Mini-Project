import React, { useState } from "react";
import axios from "axios";
import { FaUpload, FaFileAlt } from "react-icons/fa";

export default function CreateAssignment() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Active");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please upload a PDF or Word document");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date);
    formData.append("status", status);
    formData.append("file", file);

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/assignments", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("✅ Assignment uploaded successfully!");
      setTitle("");
      setDate("");
      setFile(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center pt-20 px-4">
      {/* Page Header */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-400 drop-shadow-xl mb-3 text-center">
        📤 Upload Assignment
      </h1>
      <p className="text-gray-400 text-lg max-w-xl text-center mb-10">
        Upload assignments with title, due date, and files. Students will be able to download and submit their work.
      </p>

      {/* Glassmorphism Card */}
      <div className="bg-gray-900/60 backdrop-blur-xl border border-cyan-500/20 shadow-2xl rounded-3xl p-8 w-full max-w-xl text-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block mb-2 text-gray-300 font-medium">Assignment Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-800/60 border border-gray-700 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition"
              placeholder="Enter assignment title"
              required
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block mb-2 text-gray-300 font-medium">Due Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-800/60 border border-gray-700 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block mb-2 text-gray-300 font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-800/60 border border-gray-700 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition"
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* File Upload Box */}
          <div>
            <label className="block mb-2 text-gray-300 font-medium">Upload File</label>

            <label
              className="w-full p-6 rounded-2xl bg-gray-800/50 border-2 border-dashed border-cyan-500/40 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 hover:bg-gray-800/70 transition"
            >
              <FaUpload className="text-cyan-400 text-3xl mb-3" />
              <span className="text-gray-300">
                {file ? (
                  <span className="flex items-center gap-2">
                    <FaFileAlt className="text-yellow-400" /> {file.name}
                  </span>
                ) : (
                  "Click to upload PDF or DOCX"
                )}
              </span>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 shadow-xl font-bold text-lg transition flex items-center justify-center gap-3"
            disabled={loading}
          >
            <FaUpload />
            {loading ? "Uploading..." : "Upload Assignment"}
          </button>

          {/* Message */}
          {message && (
            <p className="mt-2 text-center text-cyan-300 font-medium">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
