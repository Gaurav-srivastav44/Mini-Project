import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TestResults() {
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/tests/${id}/results`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load results");
        setRows(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Test Results</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 border border-gray-700 rounded-xl">
              <thead>
                <tr className="text-left">
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Raw</th>
                  <th className="px-3 py-2">Penalty</th>
                  <th className="px-3 py-2">Final</th>
                  <th className="px-3 py-2">Submitted</th>
                  <th className="px-3 py-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r._id} className="border-t border-gray-700">
                    <td className="px-3 py-2">{r.userId?.username || r.userId}</td>
                    <td className="px-3 py-2">{r.userId?.email || '-'}</td>
                    <td className="px-3 py-2">{r.score} / {r.total}</td>
                    <td className="px-3 py-2 text-yellow-300">{r.penalty || 0}</td>
                    <td className="px-3 py-2 text-teal-300">{r.finalScore ?? r.score} / {r.total}</td>
                    <td className="px-3 py-2">{new Date(r.submittedAt).toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <button className="px-3 py-1 bg-gray-700 rounded" onClick={()=> setExpanded(expanded===r._id? null : r._id)}>
                        {expanded===r._id? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.map(r => expanded===r._id && (
              <div key={r._id} className="mt-4 bg-gray-800 p-4 rounded-xl border border-gray-700">
                <h3 className="font-bold mb-2">Proctoring Log</h3>
                <ul className="text-xs text-gray-300 list-disc list-inside">
                  {(r.proctoringLog || []).map((e,i)=>(
                    <li key={i}>{new Date(e.ts).toLocaleString()} — {e.msg}</li>
                  ))}
                </ul>
                {r.codingDetail && (
                  <div className="mt-4">
                    <h3 className="font-bold mb-2">Coding Detail</h3>
                    {r.codingDetail.map((cd,i)=> (
                      <div key={i} className="mb-2">
                        <div className="font-semibold">Q{cd.index+1}</div>
                        {(cd.results||[]).map((tc,j)=> (
                          <div key={j} className={`text-sm ${tc.passed?'text-green-300':'text-red-300'}`}>{tc.passed? 'Pass':'Fail'} — Input: {tc.input} → Expected: {tc.output}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                {r.descriptiveFeedback && (
                  <div className="mt-4">
                    <h3 className="font-bold mb-2">Descriptive Feedback</h3>
                    {r.descriptiveFeedback.map((d,i)=> (
                      <div key={i} className="text-sm text-gray-300">Q{i+1}: {d.marks}/{d.max} — {d.feedback}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



