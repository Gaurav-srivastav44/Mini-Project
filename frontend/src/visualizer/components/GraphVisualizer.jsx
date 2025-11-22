import React, { useState } from "react";
import { motion } from "framer-motion";

export default function GraphVisualizer() {
  const [nodes, setNodes] = useState([{ id: 0, x: 100, y: 100 }, { id: 1, x: 200, y: 150 }]);
  const [edges, setEdges] = useState([{ from: 0, to: 1 }]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [traversal, setTraversal] = useState([]);
  const [mode, setMode] = useState("add");

  const addNode = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setNodes([...nodes, { id: nodes.length, x, y }]);
  };

  const addEdge = (nodeId) => {
    if (selectedNode === null) {
      setSelectedNode(nodeId);
    } else if (selectedNode !== nodeId) {
      setEdges([...edges, { from: selectedNode, to: nodeId }]);
      setSelectedNode(null);
    }
  };

  const bfs = () => {
    if (nodes.length === 0) return;
    const visited = new Set();
    const queue = [0];
    const result = [];
    visited.add(0);

    while (queue.length > 0) {
      const node = queue.shift();
      result.push(node);
      edges.forEach(edge => {
        if (edge.from === node && !visited.has(edge.to)) {
          visited.add(edge.to);
          queue.push(edge.to);
        }
      });
    }
    setTraversal(result);
  };

  const dfs = () => {
    if (nodes.length === 0) return;
    const visited = new Set();
    const result = [];
    
    const dfsHelper = (node) => {
      visited.add(node);
      result.push(node);
      edges.forEach(edge => {
        if (edge.from === node && !visited.has(edge.to)) {
          dfsHelper(edge.to);
        }
      });
    };
    
    dfsHelper(0);
    setTraversal(result);
  };

  return (
    <div className="w-full bg-gray-900 rounded-xl p-6 border border-cyan-500/30">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Graph (BFS/DFS)</h2>
      
      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          onClick={() => setMode("add")}
          className={`px-4 py-2 rounded-lg ${mode === "add" ? "bg-cyan-600" : "bg-gray-700"}`}
        >
          Add Node
        </button>
        <button
          onClick={() => setMode("edge")}
          className={`px-4 py-2 rounded-lg ${mode === "edge" ? "bg-cyan-600" : "bg-gray-700"}`}
        >
          Add Edge
        </button>
        <button onClick={bfs} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
          BFS
        </button>
        <button onClick={dfs} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg">
          DFS
        </button>
        <button onClick={() => { setNodes([]); setEdges([]); setTraversal([]); }} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
          Clear
        </button>
      </div>

      <div
        className="bg-gray-800 rounded-lg p-6 mb-4 min-h-[400px] relative cursor-crosshair"
        onClick={mode === "add" ? addNode : undefined}
      >
        <svg width="100%" height="400" className="absolute inset-0">
          {edges.map((edge, idx) => {
            const fromNode = nodes[edge.from];
            const toNode = nodes[edge.to];
            if (!fromNode || !toNode) return null;
            return (
              <line
                key={idx}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="#00eaff"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            );
          })}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#00eaff" />
            </marker>
          </defs>
        </svg>
        {nodes.map((node, idx) => (
          <motion.div
            key={node.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute w-12 h-12 rounded-full bg-cyan-400 border-2 border-cyan-300 flex items-center justify-center font-bold text-gray-900 cursor-pointer ${
              traversal.includes(idx) ? "bg-green-400" : ""
            }`}
            style={{ left: node.x - 24, top: node.y - 24 }}
            onClick={() => mode === "edge" && addEdge(idx)}
          >
            {idx}
          </motion.div>
        ))}
      </div>

      {traversal.length > 0 && (
        <div className="p-4 bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-2">Traversal Order:</h3>
          <div className="flex gap-2 flex-wrap">
            {traversal.map((node, idx) => (
              <span key={idx} className="bg-green-400 text-gray-900 px-3 py-1 rounded font-bold">
                {node}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-2">Graph Algorithms</h3>
        <p className="text-sm text-gray-400">
          BFS: Level-order traversal using queue | DFS: Depth-first using recursion/stack
        </p>
      </div>
    </div>
  );
}

