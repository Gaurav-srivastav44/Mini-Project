import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCopy, FaSync } from "react-icons/fa";

export default function AdminTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const fetchMine = async () => {
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get("https://mini-project-2-mwwk.onrender.com/api/tests/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTests(res.data || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      alert("Code copied: " + code);
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Created Tests</h1>
          <button
            onClick={fetchMine}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            <FaSync /> Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-gray-300">Loading...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : tests.length === 0 ? (
          <p className="text-gray-400">No tests yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tests.map((t) => (
              <div key={t._id} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{t.name}</h2>
                  <span className="text-sm px-2 py-1 rounded bg-gray-700">{t.type}</span>
                </div>
                <p className="text-gray-300 mt-1">{t.subject} • {t.difficulty}</p>
                <p className="text-gray-400 mt-1">Questions: {t.numberOfQuestions}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-sm">Code</span>
                    <div className="font-mono tracking-wider text-lg">{t.code}</div>
                  </div>
                  <button
                    onClick={() => copyCode(t.code)}
                    className="flex items-center gap-2 px-3 py-2 bg-teal-600 rounded-lg hover:bg-teal-500"
                  >
                    <FaCopy /> Copy
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-3">Created {new Date(t.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}






