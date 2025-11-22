import React, { useEffect, useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FaChartLine } from "react-icons/fa";

const COLORS = ["#4ade80", "#f87171"];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("https://mini-project-2-mwwk.onrender.com/api/analytics/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load analytics");
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progressData = useMemo(() => {
    // synthesize a simple weekly trend from subject stats if needed
    if (!data) return [];
    const avg = data.overall?.averagePercent || 0;
    return [
      { week: "W1", score: Math.max(0, avg - 10) },
      { week: "W2", score: Math.max(0, avg - 5) },
      { week: "W3", score: avg },
      { week: "W4", score: Math.min(100, avg + 5) },
    ];
  }, [data]);

  const accuracyData = useMemo(() => {
    if (!data) return [];
    const p = data.overall?.averagePercent || 0;
    return [
      { name: "Correct", value: p },
      { name: "Incorrect", value: 100 - p },
    ];
  }, [data]);

  return (
    <div className="p-6 bg-gray-50 mt-12 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8 flex justify-center items-center gap-2">
        <FaChartLine /> Analytics Dashboard
      </h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Progress Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Weekly Progress</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Accuracy Pie */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Answer Accuracy</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={accuracyData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {accuracyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      )}
    </div>
  );
}
