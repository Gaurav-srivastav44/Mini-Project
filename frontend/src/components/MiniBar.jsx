import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MiniBar() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  return (
    <div className="fixed top-0 left-0 w-full flex justify-between items-center py-2 px-4 z-30 backdrop-blur-md bg-gray-800/90 border-b border-cyan-500/20">
      <Link to="/" className="text-cyan-300 font-bold">Home</Link>
      {isLoggedIn ? (
        <button
          onClick={() => { localStorage.clear(); navigate("/login"); }}
          className="px-4 py-1 rounded bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm"
        >Logout</button>
      ) : (
        <Link to="/auth/login" className="px-4 py-1 rounded bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm">Login</Link>
      )}
    </div>
  );
}



