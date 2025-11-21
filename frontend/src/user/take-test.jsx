import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

const JUDGE0_LANGS = {
  python: 71, javascript: 63, cpp: 53, java: 62,
};

export default function TakeTest() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [test, setTest] = useState(location.state?.test || null);
  const [userCodes, setUserCodes] = useState({}); // { [index]: { code, language } }
  const [outputs, setOutputs] = useState({}); // result per question for 'Run' action
  const [answers, setAnswers] = useState({}); // for mcq, etc
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    if (test) return; // already have from state
    const fetchTest = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/tests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const t = res.data;
        let safeQuestions = t.questions;
        if (t.type === "mcq" || t.type === "ai") {
          safeQuestions = (t.questions || []).map(q => ({ question: q.question, options: q.options }));
        }
        setTest({ ...t, questions: safeQuestions });
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load test");
      } finally { setLoading(false); }
    };
    fetchTest();
  }, [id]);

  const total = useMemo(() => test?.questions?.length || 0, [test]);

  // MCQ/descriptive
  const onSelect = (idx, value) => setAnswers(prev => ({ ...prev, [idx]: value }));

  // Coding: run code on public test cases directly using Judge0 API
  const runCode = async (idx) => {
    const question = test.questions[idx];
    const userCode = userCodes[idx]?.code || "";
    const langKey = userCodes[idx]?.language || question.language;
    if (!userCode || !langKey) { alert("Write code first"); return; }
    setOutputs(prev => ({ ...prev, [idx]: { loading: true } }));
    const testCases = question.testCases.filter(tc => tc.isPublic);
    const resArr = [];
    for (const tc of testCases) {
      const resp = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": "<YOUR_JUDGE0_API_KEY>",
        },
        body: JSON.stringify({
          source_code: userCode,
          language_id: JUDGE0_LANGS[langKey],
          stdin: tc.input,
          expected_output: tc.output,
        }),
      });
      const data = await resp.json();
      resArr.push({
        input: tc.input,
        expected: tc.output,
        output: data.stdout,
        passed: data.status && data.status.id === 3,
      });
    }
    setOutputs(prev => ({ ...prev, [idx]: { loading: false, resArr } }));
  };

  const onCodingChange = (idx, field, val) => setUserCodes(prev => ({ ...prev, [idx]: { ...prev[idx], [field]: val } }));

  const BOILERPLATE = {
    python: "def solve():\n    # Write your code here\n    pass\n\nif __name__ == '__main__':\n    solve()\n",
    javascript: "function solve(){\n  // Write your code here\n}\nsolve();\n",
    cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n  ios::sync_with_stdio(false); cin.tie(nullptr);\n  // Write your code here\n  return 0;\n}\n",
    java: "import java.io.*;\nimport java.util.*;\npublic class Main {\n  public static void main(String[] args) throws Exception {\n    // Write your code here\n  }\n}\n",
  };

  // Submit (coding): answers = [{index, code, language}]
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!test) return;
    try {
      setSubmitting(true);
      let payload;
      const penalty = 0;
      const proctoringLog = [];
      if (test.type === "coding") {
        payload = { answers: Object.entries(userCodes).map(([k, v]) => ({ index: Number(k), code: v.code, language: v.language })), penalty, proctoringLog };
      } else {
        payload = { answers: Object.entries(answers).map(([k, v]) => ({ index: Number(k), answer: v })), penalty, proctoringLog };
      }
      const res = await axios.post(`http://localhost:5000/api/tests/${test._id}/submit`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;
  if (!test) return null;

  // Coding Test UI
  if (test.type === "coding") {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 pt-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{test.name}</h1>
          <p className="text-gray-300 mb-8">{test.subject} • {test.difficulty} • {total} coding questions</p>
          {result ? (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mt-10">
              <h2 className="text-xl font-bold mb-3">Your Score</h2>
              <p className="text-lg">Raw: {result.score} / {result.total}</p>
              {typeof result.penalty === 'number' && (
                <p className="text-lg text-yellow-300">Penalty: -{result.penalty}</p>
              )}
              {typeof result.finalScore === 'number' && (
                <p className="text-lg font-semibold text-teal-300">Final: {result.finalScore} / {result.total}</p>
              )}
              {result.codingDetail && result.codingDetail.map((r, i) => (
                <div key={i} className="mb-6">
                  <div className="mb-2 font-bold">Q{r.index+1}</div>
                  {r.results && r.results.map((tc, j) => (
                    <div key={j} className={`mb-1 py-1 px-2 rounded ${tc.passed ? 'bg-green-800 text-green-200' : 'bg-red-900 text-red-300'}`}>
                      <span className="font-mono">Input: {tc.input}</span>
                      <span className="ml-4 font-mono">Expected: {tc.output}</span>
                      <span className="ml-4 font-mono">Output: {tc.stdout || '-'}</span>
                      <span className="ml-4">{tc.passed ? '✅ Pass' : '❌ Fail'}</span>
                    </div>
                  ))}
                  <span className="text-sm">{r.passed} / {r.totalCases} cases passed</span>
                </div>
              ))}
              <button className="mt-6 px-4 py-2 bg-teal-600 rounded-lg" onClick={()=>navigate("/userdashboard")}>Back to Dashboard</button>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
            {test.questions.map((q, idx) => (
              <div key={idx} className="bg-gray-800 mb-8 rounded-xl p-6 border border-gray-700">
                <div className="font-bold text-lg mb-2">Q{idx+1}. {q.title}</div>
                <div className="text-gray-300 mb-3 whitespace-pre-line">{q.description}</div>
                <div className="mb-4">
                  <label>Language:
                    <select value={userCodes[idx]?.language||q.language} onChange={e=>onCodingChange(idx, "language", e.target.value)} className="bg-gray-700 ml-2 p-1 rounded">
                      {Object.keys(JUDGE0_LANGS).map(l=>(<option key={l} value={l}>{l}</option>))}
                    </select>
                  </label>
                </div>
                <textarea
                  value={userCodes[idx]?.code ?? (q.starterCode || BOILERPLATE[userCodes[idx]?.language || q.language] || "")}
                  onChange={e=>onCodingChange(idx, "code", e.target.value)}
                  className="w-full h-72 p-3 font-mono text-green-200 bg-black rounded mb-3"
                  spellCheck={false}
                />
                <div className="mb-2 font-medium">Public Test Cases:</div>
                <div className="space-y-2 mb-3">
                  {q.testCases.filter(tc => tc.isPublic).map((tc,j) => (
                    <div key={j} className="bg-gray-900 px-2 py-1 rounded"><b>Input:</b> <span className="font-mono">{tc.input}</span> <b>→ Output:</b> <span className="font-mono">{tc.output}</span></div>
                  ))}
                </div>
                <button type="button" className="px-4 py-2 bg-blue-600 rounded-lg mr-2" onClick={()=>runCode(idx)} disabled={outputs[idx]?.loading}>Run Code</button>
                {outputs[idx]?.resArr && (
                  <div className="mt-2">
                  <b>Result:</b>
                    {outputs[idx].resArr.map((r, z) => (
                      <div key={z} className={`text-sm ${r.passed ? 'text-green-300' : 'text-red-300'}`}>{r.passed ? '✅ Pass' : '❌'} Input: <span className="font-mono">{r.input}</span> → Output: <span className="font-mono">{r.output?.trim()}</span></div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-600 mt-6">{submitting ? "Submitting..." : "Submit Test"}</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">{test.name}</h1>
        <p className="text-gray-300">{test.subject} • {test.difficulty} • {total} questions</p>

        {result ? (
          <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-2">Your Result</h2>
            <p className="text-lg">Raw: {result.score} / {result.total}</p>
            {typeof result.penalty === 'number' && (
              <p className="text-lg text-yellow-300">Penalty: -{result.penalty}</p>
            )}
            {typeof result.finalScore === 'number' && (
              <p className="text-lg font-semibold text-teal-300">Final: {result.finalScore} / {result.total}</p>
            )}
            <button className="mt-6 px-4 py-2 bg-teal-600 rounded-lg" onClick={() => navigate("/userdashboard")}>Back to Dashboard</button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-6">
            {test.questions.map((q, idx) => (
              <div key={idx} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="font-semibold mb-3">Q{idx + 1}. {q.question}</div>
                {Array.isArray(q.options) && (
                  <div className="space-y-2">
                    {q.options.map((opt, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name={`q_${idx}`}
                          value={opt}
                          checked={answers[idx] === opt}
                          onChange={() => onSelect(idx, opt)}
                          className="accent-teal-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={submitting}
              className={`px-5 py-3 rounded-lg ${submitting ? "bg-gray-600" : "bg-teal-600 hover:bg-teal-500"}`}
            >
              {submitting ? "Submitting..." : "Submit Test"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}






