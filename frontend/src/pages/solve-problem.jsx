import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SolveProblem() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const run = async () => {
      const res = await fetch(`https://mini-project-2-mwwk.onrender.com/api/problems/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok) {
        setProblem(json);
        setLanguage(json.language || "javascript");
        setCode(json.starterCode || "");
      }
      setLoading(false);
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submit = async () => {
    setMsg("");
    const res = await fetch(`https://mini-project-2-mwwk.onrender.com/api/problems/${id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ code, language }),
    });
    const json = await res.json();
    if (res.ok) setMsg("Submitted!"); else setMsg(json.error || "Submit failed");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">Loading...</div>;
  if (!problem) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h1 className="text-2xl font-bold">{problem.title}</h1>
          <div className="text-gray-400">{problem.category.toUpperCase()} • {problem.difficulty}</div>
          <p className="mt-4 whitespace-pre-wrap text-gray-200">{problem.description}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <select value={language} onChange={e => setLanguage(e.target.value)} className="bg-gray-700 border border-gray-600 p-2 rounded">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
            <button onClick={() => setCode(problem.starterCode || "")} className="px-3 py-2 bg-gray-700 rounded">Reset</button>
          </div>
          <textarea value={code} onChange={e => setCode(e.target.value)} className="w-full h-80 bg-black text-green-200 font-mono text-sm p-3 rounded" spellCheck={false} />
          <button onClick={submit} className="mt-3 px-4 py-2 bg-teal-600 rounded">Submit</button>
          {msg && <div className="mt-2 text-sm text-teal-300">{msg}</div>}
        </div>
      </div>
    </div>
  );
}






