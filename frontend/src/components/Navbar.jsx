import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaPowerOff } from "react-icons/fa";
import Logo from "../assets/logo.png";

export default function Navbar() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("username");
    const userRole = localStorage.getItem("role");

    setUsername(name);
    setRole(userRole);

    // Sync changes across tabs
    const handleStorage = () => {
      setUsername(localStorage.getItem("username"));
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const isLoggedIn = Boolean(username);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    setUsername("");
    setRole("");

    navigate("/auth/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center py-1 px-10 z-30 backdrop-blur-md bg-gray-800 border-b border-cyan-500/20">
      
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 h-12">
        <img 
          src={Logo} 
          alt="EvalEra Logo" 
          className="h-16 w-auto drop-shadow-[0_0_16px_rgba(0,255,255,0.4)] hover:scale-105 transition-all duration-300"
        />
      </Link>

      {/* Menu */}
      <ul className="hidden md:flex gap-8 items-center text-white">
        <li><Link to="/" className="hover:text-cyan-400 transition">Home</Link></li>
        <li><Link to="/mock-tests" className="hover:text-cyan-400 transition">Mock Tests</Link></li>
        <li><Link to="/visualizer" className="hover:text-cyan-400 transition">DSA Visualizer</Link></li>
        <li><Link to="/userdashboard" className="hover:text-cyan-400 transition">Dashboard</Link></li>
        <li><Link to="/contact" className="hover:text-cyan-400 transition">Contact</Link></li>
      </ul>

      {/* User Section */}
      <div className="flex gap-5 items-center">
        {isLoggedIn ? (
          <>
            {/* Profile Icon */}
            <button
              onClick={() => navigate("/profile")}
              className="text-cyan-300 hover:text-white transition text-3xl"
              title="Profile"
            >
              <FaUserCircle />
            </button>

            {/* Username */}
            <span className="text-cyan-300 font-bold text-lg mr-2">
              {username}
              {role && <span className="text-gray-400 text-base"> ({role})</span>}
            </span>

            {/* Logout Icon */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-red-400 hover:text-red-600 transition text-2xl"
            >
              <FaPowerOff />
            </button>
          </>
        ) : (
          <Link
            to="/auth/login"
            className="px-6 py-2 text-lg font-semibold rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,255,255,0.6)] hover:scale-105 transition-all"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
