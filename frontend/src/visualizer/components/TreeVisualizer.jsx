import React, { useState } from "react";
import { motion } from "framer-motion";

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export default function TreeVisualizer() {
  const [root, setRoot] = useState(null);
  const [value, setValue] = useState("");
  const [traversal, setTraversal] = useState([]);

  const insert = (node, value) => {
    if (!node) return new TreeNode(value);
    if (value < node.value) node.left = insert(node.left, value);
    else if (value > node.value) node.right = insert(node.right, value);
    return node;
  };

  const handleInsert = () => {
    if (value) {
      setRoot(insert(root, parseInt(value)));
      setValue("");
    }
  };

  const inorder = (node, result = []) => {
    if (node) {
      inorder(node.left, result);
      result.push(node.value);
      inorder(node.right, result);
    }
    return result;
  };

  const preorder = (node, result = []) => {
    if (node) {
      result.push(node.value);
      preorder(node.left, result);
      preorder(node.right, result);
    }
    return result;
  };

  const postorder = (node, result = []) => {
    if (node) {
      postorder(node.left, result);
      postorder(node.right, result);
      result.push(node.value);
    }
    return result;
  };

  const renderNode = (node, x = 0, y = 0, level = 0) => {
    if (!node) return null;
    const spacing = 200 / (level + 1);
    return (
      <g key={`${node.value}-${x}-${y}`}>
        <circle cx={x} cy={y} r="20" fill="#00eaff" stroke="#00aaff" strokeWidth="2" />
        <text x={x} y={y + 5} textAnchor="middle" fill="#000" fontSize="12" fontWeight="bold">
          {node.value}
        </text>
        {node.left && (
          <>
            <line x1={x} y1={y + 20} x2={x - spacing} y2={y + 60} stroke="#00eaff" strokeWidth="2" />
            {renderNode(node.left, x - spacing, y + 60, level + 1)}
          </>
        )}
        {node.right && (
          <>
            <line x1={x} y1={y + 20} x2={x + spacing} y2={y + 60} stroke="#00eaff" strokeWidth="2" />
            {renderNode(node.right, x + spacing, y + 60, level + 1)}
          </>
        )}
      </g>
    );
  };

  return (
    <div className="w-full bg-gray-900 rounded-xl p-6 border border-cyan-500/30">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Binary Search Tree</h2>
      
      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value"
          className="px-4 py-2 bg-gray-800 rounded-lg border border-cyan-500/30"
        />
        <button onClick={handleInsert} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg">
          Insert
        </button>
        <button onClick={() => setTraversal(inorder(root))} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
          Inorder
        </button>
        <button onClick={() => setTraversal(preorder(root))} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg">
          Preorder
        </button>
        <button onClick={() => setTraversal(postorder(root))} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg">
          Postorder
        </button>
        <button onClick={() => setRoot(null)} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
          Clear
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-4 min-h-[300px] flex items-center justify-center">
        {root ? (
          <svg width="600" height="400" className="overflow-visible">
            {renderNode(root, 300, 30, 0)}
          </svg>
        ) : (
          <p className="text-gray-400">Tree is empty. Insert values to visualize.</p>
        )}
      </div>

      {traversal.length > 0 && (
        <div className="p-4 bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-2">Traversal Result:</h3>
          <div className="flex gap-2 flex-wrap">
            {traversal.map((val, idx) => (
              <span key={idx} className="bg-cyan-400 text-gray-900 px-3 py-1 rounded font-bold">
                {val}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-2">BST Properties</h3>
        <p className="text-sm text-gray-400">
          Left child &lt; Parent &lt; Right child | Insert/Delete: O(log n) average, O(n) worst
        </p>
      </div>
    </div>
  );
}

