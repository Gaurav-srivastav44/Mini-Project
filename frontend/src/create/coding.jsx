import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LANGS = [
  { label: "Python", value: "python" },
  { label: "JavaScript", value: "javascript" },
  { label: "C++", value: "cpp" },
  { label: "Java", value: "java" },
];

export default function CreateCoding() {
  const location = useLocation();
  const base = location.state || {};
  const navigate = useNavigate();
  const [codingQuestions, setCodingQuestions] = useState([
    {
      title: "",
      description: "",
      language: "python",
      starterCode: "",
      testCases: [
        { input: "", output: "", isPublic: true }
      ],
    },
  ]);
  const [loading, setLoading] = useState(false);

  const updateQ = (idx, field, val) => {
    setCodingQuestions(prev => prev.map((q, i) => i===idx ? { ...q, [field]: val } : q));
  };
  const updateTC = (qi, tci, field, val) => {
    setCodingQuestions(prev => prev.map((q, i) =>
      i===qi
        ? { ...q, testCases: q.testCases.map((tc, j) => j===tci ? { ...tc, [field]: val } : tc) }
        : q
    ));
  };

  const addQ = () => setCodingQuestions(prev => [...prev, { title: "", description: "", language: "python", starterCode: "", testCases: [{ input: "", output: "", isPublic: true }] }]);
  const addTC = (qi) => setCodingQuestions(prev => prev.map((q, i) => i===qi ? { ...q, testCases: [...q.testCases, { input: "", output: "", isPublic: true }] } : q));
  const removeTC = (qi, tci) => setCodingQuestions(prev => prev.map((q, i) => i===qi ? { ...q, testCases: q.testCases.filter((_, j) => j!==tci) } : q));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const body = {
        ...base,
        type: "coding",
        numberOfQuestions: codingQuestions.length,
        questions: codingQuestions,
      };
      const res = await fetch("https://mini-project-2-mwwk.onrender.com/api/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to create coding test");
      alert("Test created!");
      navigate("/admin/tests");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Create Coding Test</h1>
      <form onSubmit={onSubmit} className="max-w-2xl w-full space-y-10">
        {codingQuestions.map((q, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-10">
            <div className="mb-4">
              <label className="block mb-1 font-medium">Title</label>
              <input type="text" value={q.title} onChange={e=>updateQ(i, "title", e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" required />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Description</label>
              <textarea value={q.description} onChange={e=>updateQ(i, "description", e.target.value)} className="w-full p-2 h-24 rounded bg-gray-700 text-white" required />
            </div>
            <div className="mb-4 flex gap-4">
              <label>Language:</label>
              <select value={q.language} onChange={e=>updateQ(i, "language", e.target.value)} className="bg-gray-700 text-white p-2 rounded">
                {LANGS.map(l=>(<option key={l.value} value={l.value}>{l.label}</option>))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Starter Code (optional)</label>
              <textarea value={q.starterCode} onChange={e=>updateQ(i, "starterCode", e.target.value)} className="w-full p-2 h-24 rounded bg-gray-700 text-white" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-medium">Test Cases</label>
                <button type="button" className="text-teal-400" onClick={()=>addTC(i)}>+ Add Test Case</button>
              </div>
              {q.testCases.map((tc, j) => (
                <div key={j} className="flex gap-2 items-center mb-3">
                  <input type="text" placeholder="Input" value={tc.input} onChange={e=>updateTC(i,j,"input",e.target.value)} className="p-2 bg-gray-700 rounded w-1/3" required />
                  <input type="text" placeholder="Output" value={tc.output} onChange={e=>updateTC(i,j,"output",e.target.value)} className="p-2 bg-gray-700 rounded w-1/3" required />
                  <label className="flex gap-1 items-center"><input type="checkbox" checked={tc.isPublic} onChange={e=>updateTC(i,j,"isPublic",e.target.checked)} /> Public</label>
                  <button type="button" onClick={()=>removeTC(i, j)} className="text-red-400 ml-2">Remove</button>
                </div>
              ))}
            </div>
            <button type="button" className="mt-3 px-4 py-2 bg-blue-700 rounded" onClick={addQ}>Add Another Coding Question</button>
          </div>
        ))}
        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-600 mt-6">{loading ? "Submitting..." : "Create Coding Test"}</button>
      </form>
    </div>
  );
}
