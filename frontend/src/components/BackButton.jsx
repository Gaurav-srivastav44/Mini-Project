import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    // If there's history, go back, otherwise go to home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 px-4 py-2 text-cyan-300 hover:text-white transition text-sm font-semibold rounded-lg hover:bg-gray-700/50"
      title="Go back"
    >
      <FaArrowLeft />
      Back
    </button>
  );
}

