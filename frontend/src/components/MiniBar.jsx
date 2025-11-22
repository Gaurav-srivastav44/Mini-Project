import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaPowerOff } from "react-icons/fa";
import BackButton from "./BackButton";

export default function MiniBar() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/auth/login");
  };

  return (
    <div className="fixed top-0 left-0 w-full flex justify-between items-center py-2 px-4 z-30 backdrop-blur-md bg-gray-800/90 border-b border-cyan-500/20">
      <div className="flex items-center gap-4">
        <BackButton />
        <Link to="/" className="text-cyan-300 font-bold hover:text-cyan-400 transition">Home</Link>
      </div>
      
      <div className="flex gap-4 items-center">
        {isLoggedIn ? (
          <>
            {/* Profile Icon */}
            <button
              onClick={() => navigate("/profile")}
              className="text-cyan-300 hover:text-white transition text-2xl"
              title="Profile"
            >
              <FaUserCircle />
            </button>

            {/* Username */}
            <span className="text-cyan-300 font-semibold text-sm">
              {username}
              {role && <span className="text-gray-400 text-xs"> ({role})</span>}
            </span>

            {/* Logout Icon */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-red-400 hover:text-red-600 transition text-xl"
            >
              <FaPowerOff />
            </button>
          </>
        ) : (
          <Link to="/auth/login" className="px-4 py-1 rounded bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm hover:scale-105 transition">Login</Link>
        )}
      </div>
    </div>
  );
}



