import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Problems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const q = new URLSearchParams();
      if (category) q.set("category", category);
      if (difficulty) q.set("difficulty", difficulty);
      const res = await fetch(`https://mini-project-2-mwwk.onrender.com/api/problems?${q.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load problems");
      setItems(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); // eslint-disable-next-line
  }, [category, difficulty]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Coding Problems</h1>
        <div className="flex gap-3 mb-4">
          <select value={category} onChange={e => setCategory(e.target.value)} className="bg-gray-800 border border-gray-700 p-2 rounded">
            <option value="">All Categories</option>
            <option value="dsa">DSA</option>
            <option value="fullstack">Full Stack</option>
          </select>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="bg-gray-800 border border-gray-700 p-2 rounded">
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(p => (
              <div key={p._id} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{p.title}</h3>
                  <span className="text-sm bg-gray-700 px-2 py-1 rounded">{p.difficulty}</span>
                </div>
                <div className="text-gray-400">{p.category.toUpperCase()}</div>
                <button className="mt-3 px-3 py-2 bg-teal-600 rounded" onClick={() => navigate(`/problems/${p._id}`)}>Solve</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}






