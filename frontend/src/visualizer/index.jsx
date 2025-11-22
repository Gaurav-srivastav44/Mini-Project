import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaBars,
  FaCode,
  FaChartBar,
  FaSitemap,
  FaProjectDiagram,
  FaTree,
  FaRoute,
  FaListAlt,
  FaBrain,
} from "react-icons/fa";

import SortingVisualizer from "./components/SortingVisualizer";
import LinkedListVisualizer from "./components/LinkedListVisualizer";
import StackQueueVisualizer from "./components/StackQueueVisualizer";
import TreeVisualizer from "./components/TreeVisualizer";
import GraphVisualizer from "./components/GraphVisualizer";
import PathfindingVisualizer from "./components/PathfindingVisualizer";
import RecursionVisualizer from "./components/RecursionVisualizer";
import DPVisualizer from "./components/DPVisualizer";

const visualizers = [
  { id: "sorting", name: "Sorting", icon: <FaChartBar /> },
  { id: "linkedlist", name: "Linked List", icon: <FaListAlt /> },
  { id: "stackqueue", name: "Stack & Queue", icon: <FaBars /> },
  { id: "tree", name: "Tree (BST)", icon: <FaTree /> },
  { id: "graph", name: "Graph (BFS/DFS)", icon: <FaProjectDiagram /> },
  { id: "path", name: "Pathfinding", icon: <FaRoute /> },
  { id: "recursion", name: "Recursion Tree", icon: <FaBrain /> },
  { id: "dp", name: "Dynamic Programming", icon: <FaCode /> },
];

export default function VisualizerHub() {
  const [selected, setSelected] = useState("");

  const renderVisualizer = () => {
    switch (selected) {
      case "sorting": return <SortingVisualizer />;
      case "linkedlist": return <LinkedListVisualizer />;
      case "stackqueue": return <StackQueueVisualizer />;
      case "tree": return <TreeVisualizer />;
      case "graph": return <GraphVisualizer />;
      case "path": return <PathfindingVisualizer />;
      case "recursion": return <RecursionVisualizer />;
      case "dp": return <DPVisualizer />;
      default:
        return (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-3xl text-cyan-300 mt-20"
          >
            Select a visualizer to begin 🚀
          </motion.h2>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-12 px-6">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold text-cyan-400 drop-shadow-[0_0_25px_#00eaff] mb-12"
      >
        ⚡ DSA Visualizer Hub
      </motion.h1>

      {/* Visualizer Menu */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl w-full mb-10">
        {visualizers.map(v => (
          <motion.div
            key={v.id}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelected(v.id)}
            className={`cursor-pointer p-6 rounded-2xl bg-gray-900/70 border 
            border-cyan-400/20 shadow-[0_0_20px_#00eaff40] hover:shadow-[0_0_35px_#00eaff] 
            transition-all text-center ${
              selected === v.id ? "shadow-[0_0_45px_#00eaff]" : ""
            }`}
          >
            <div className="text-4xl text-cyan-400 mx-auto mb-3">{v.icon}</div>
            <p className="font-semibold">{v.name}</p>
          </motion.div>
        ))}
      </div>

      {/* Render Selected Visualizer */}
      <div className="w-full max-w-6xl">{renderVisualizer()}</div>
    </div>
  );
}

