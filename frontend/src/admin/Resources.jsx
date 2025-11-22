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
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

const iconMap = {
  FaBook: FaBook,
  FaVideo: FaVideo,
  FaCode: FaCode,
  FaFileAlt: FaFileAlt,
  FaChalkboardTeacher: FaChalkboardTeacher,
  FaBrain: FaBrain,
};

export default function AdminResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    tag: "",
    icon: "FaBook",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/resources", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources(res.data || []);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/resources/${editingId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post("http://localhost:5000/api/resources", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchResources();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save resource");
    }
  };

  const handleEdit = (resource) => {
    setEditingId(resource._id);
    setFormData({
      title: resource.title,
      description: resource.description,
      link: resource.link,
      tag: resource.tag,
      icon: resource.icon || "FaBook",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchResources();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete resource");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      link: "",
      tag: "",
      icon: "FaBook",
    });
    setEditingId(null);
    setShowForm(false);
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
    <div className="min-h-screen bg-gray-950 text-white px-6 md:px-12 py-12">
      {/* Header */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-400 drop-shadow-lg mb-3">
            📚 Manage Resources
          </h1>
          <p className="text-gray-400 text-lg">
            Add, edit, and manage learning resources for students.
          </p>
        </div>
        <motion.button
          onClick={() => setShowForm(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold flex items-center gap-2 shadow-lg"
        >
          <FaPlus /> Add Resource
        </motion.button>
      </motion.div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full border border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingId ? "Edit Resource" : "Add New Resource"}
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
                <label className="block mb-2 text-gray-300">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">Link (URL)</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-gray-300">Tag</label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) =>
                      setFormData({ ...formData, tag: e.target.value })
                    }
                    className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
                    placeholder="e.g., DSA, Frontend"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-300">Icon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="FaBook">Book</option>
                    <option value="FaVideo">Video</option>
                    <option value="FaCode">Code</option>
                    <option value="FaFileAlt">File</option>
                    <option value="FaChalkboardTeacher">Teacher</option>
                    <option value="FaBrain">Brain</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold hover:opacity-90 transition"
                >
                  {editingId ? "Update" : "Create"} Resource
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

      {/* Resources List */}
      {loading ? (
        <p className="text-center text-gray-400 text-lg">Loading resources...</p>
      ) : resources.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          No resources yet. Add your first resource!
        </p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {resources.map((resource) => {
            const IconComponent = iconMap[resource.icon] || FaBook;
            return (
              <motion.div
                key={resource._id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gray-900/80 border border-gray-700/70 rounded-2xl p-6 shadow-xl relative"
              >
                <div className="flex items-start justify-between mb-4">
                  <IconComponent className="text-4xl text-cyan-400" />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(resource)}
                      className="p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg transition"
                      title="Edit"
                    >
                      <FaEdit className="text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(resource._id)}
                      className="p-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg transition"
                      title="Delete"
                    >
                      <FaTrash className="text-red-400" />
                    </button>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-2">
                  {resource.title}
                </h2>
                <p className="text-gray-400 text-sm mb-4">{resource.description}</p>
                <span className="inline-block bg-cyan-700/40 text-cyan-300 text-xs px-3 py-1 rounded-full font-semibold mb-4">
                  {resource.tag}
                </span>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold underline"
                >
                  View Resource →
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

