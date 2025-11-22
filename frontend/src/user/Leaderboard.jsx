import React, { useEffect, useState } from "react";
import { FaMedal, FaTrophy } from "react-icons/fa";
import axios from "axios";

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await axios.get("https://mini-project-2-mwwk.onrender.com/api/leaderboard/xp", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRows(res.data || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center m-8 flex justify-center items-center gap-2 text-yellow-600">
        <FaTrophy className="text-yellow-500 text-4xl" /> Leaderboard
      </h1>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <p className="p-4">Loading...</p>
        ) : error ? (
          <p className="p-4 text-red-500">{error}</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-yellow-100">
                <th className="p-3 text-lg">Rank</th>
                <th className="p-3 text-lg">Name</th>
                <th className="p-3 text-lg">XP</th>
                <th className="p-3 text-lg">Badges</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((user, index) => (
                <tr key={user.userId} className="hover:bg-yellow-50 border-b last:border-none">
                  <td className="p-3 font-semibold flex items-center gap-2">
                    {index === 0 && <FaMedal className="text-yellow-500" />}
                    {index === 1 && <FaMedal className="text-gray-400" />}
                    {index === 2 && <FaMedal className="text-orange-500" />}
                    {user.rank}
                  </td>
                  <td className="p-3">{user.username}</td>
                  <td className="p-3 font-bold text-yellow-700">{user.xp}</td>
                  <td className="p-3">{(user.badges||[]).join(', ') || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
