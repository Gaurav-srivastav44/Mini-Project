import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DailyChallenges() {
  const [challenge, setChallenge] = useState(null);
  const [answer, setAnswer] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await axios.get("https://mini-project-2-mwwk.onrender.com/api/challenges/today", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChallenge(res.data);
        if (res.data.type === "coding") {
          setCode(res.data.starterCode || "");
        }
      } catch (err) {
        setError(err.response?.data?.error || "No challenge available today.");
      } finally {
        setLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!challenge) return;
    try {
      const payload = challenge.type === "coding" 
        ? { code, language: challenge.language || "javascript" }
        : { answer };
      
      const res = await axios.post(
        `https://mini-project-2-mwwk.onrender.com/api/challenges/${challenge._id}/attempt`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 mt-10 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Daily Challenge</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : challenge ? (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="mb-4">
              <span className="px-3 py-1 bg-cyan-700/40 text-cyan-300 text-xs rounded-full font-semibold mr-2">
                {challenge.type === "coding" ? "Coding Problem" : challenge.subject || "General"}
              </span>
              {challenge.type === "coding" && (
                <span className="px-3 py-1 bg-purple-700/40 text-purple-300 text-xs rounded-full font-semibold">
                  {challenge.language || "javascript"}
                </span>
              )}
            </div>
            
            <div className="text-lg font-semibold mb-4 whitespace-pre-wrap">{challenge.question}</div>

            {challenge.type === "coding" ? (
              <div className="space-y-4">
                {challenge.testCases && challenge.testCases.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Test Cases:</h3>
                    <div className="space-y-2">
                      {challenge.testCases.filter(tc => tc.isPublic).map((tc, idx) => (
                        <div key={idx} className="bg-gray-900 p-3 rounded text-sm">
                          <div><span className="text-gray-400">Input:</span> <span className="font-mono text-cyan-300">{tc.input}</span></div>
                          <div><span className="text-gray-400">Expected Output:</span> <span className="font-mono text-green-300">{tc.expectedOutput}</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Your Code:</label>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-64 p-3 bg-black text-green-200 font-mono text-sm rounded border border-gray-700"
                    spellCheck={false}
                    placeholder="Write your code here..."
                  />
                  <button
                    type="button"
                    onClick={() => setCode(challenge.starterCode || "")}
                    className="mt-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                  >
                    Reset to Starter Code
                  </button>
                </div>
              </div>
            ) : (
              <>
                {Array.isArray(challenge.options) && challenge.options.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {challenge.options.map((opt, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="opt"
                          value={opt}
                          checked={answer === opt}
                          onChange={() => setAnswer(opt)}
                          className="accent-teal-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 mb-4"
                    placeholder="Your answer"
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                  />
                )}
              </>
            )}
            
            <button 
              onClick={submit} 
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg transition"
            >
              Submit
            </button>
            {result && (
              <p className={`mt-4 ${result.correct ? "text-green-400" : "text-red-400"}`}>
                {result.correct ? "✓ Correct!" : "✗ Incorrect. Try again!"}
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}






