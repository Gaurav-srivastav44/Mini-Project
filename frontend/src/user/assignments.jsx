import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await axios.get("https://mini-project-2-mwwk.onrender.com/api/assignments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!selected || !file) return;
    try {
      const form = new FormData();
      form.append("file", file);
      await axios.post(`https://mini-project-2-mwwk.onrender.com/api/assignments/${selected}/submit`, form, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      alert("Submitted!");
      setSelected(null); setFile(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-400 bg-gray-900">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Assignments</h1>
        <div className="space-y-4">
          {assignments.map(a => (
            <div key={a._id} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-semibold">{a.title}</div>
                  <div className="text-gray-400">Due: {new Date(a.date).toLocaleDateString()}</div>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded ${a.status === 'Active' ? 'bg-green-600' : 'bg-gray-600'}`}>{a.status}</span>
                </div>
              </div>
              {a.file && (
                <a className="text-sm text-teal-300 underline" href={`https://mini-project-2-mwwk.onrender.com/uploads/${a.file}`} target="_blank" rel="noreferrer">Download</a>
              )}
              <form onSubmit={submit} className="mt-4 flex items-center gap-3">
                <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="text-sm" />
                <button onClick={() => setSelected(a._id)} type="submit" className="px-4 py-2 bg-teal-600 rounded-lg">Upload</button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}






