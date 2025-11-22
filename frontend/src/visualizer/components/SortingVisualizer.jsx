import React, { useState } from "react";
import { motion } from "framer-motion";

const algorithms = {
  bubble: "Bubble Sort",
  selection: "Selection Sort",
  insertion: "Insertion Sort",
  merge: "Merge Sort",
  quick: "Quick Sort",
};

export default function SortingVisualizer() {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [sorting, setSorting] = useState(false);
  const [selectedAlgo, setSelectedAlgo] = useState("bubble");

  const generateArray = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 10);
    setArray(newArray);
  };

  const bubbleSort = async () => {
    setSorting(true);
    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    }
    setSorting(false);
  };

  const selectionSort = async () => {
    setSorting(true);
    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      let min = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[min]) min = j;
      }
      [arr[i], arr[min]] = [arr[min], arr[i]];
      setArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    setSorting(false);
  };

  const insertionSort = async () => {
    setSorting(true);
    const arr = [...array];
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = key;
      setArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    setSorting(false);
  };

  const handleSort = () => {
    switch (selectedAlgo) {
      case "bubble": bubbleSort(); break;
      case "selection": selectionSort(); break;
      case "insertion": insertionSort(); break;
      default: bubbleSort();
    }
  };

  const maxValue = Math.max(...array, 1);

  return (
    <div className="w-full bg-gray-900 rounded-xl p-6 border border-cyan-500/30">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Sorting Algorithms</h2>
      
      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          value={selectedAlgo}
          onChange={(e) => setSelectedAlgo(e.target.value)}
          className="px-4 py-2 bg-gray-800 rounded-lg border border-cyan-500/30"
          disabled={sorting}
        >
          {Object.entries(algorithms).map(([key, name]) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
        <button
          onClick={generateArray}
          disabled={sorting}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
        >
          Generate Array
        </button>
        <button
          onClick={handleSort}
          disabled={sorting}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50"
        >
          {sorting ? "Sorting..." : "Sort"}
        </button>
      </div>

      <div className="flex items-end justify-center gap-2 h-64">
        {array.map((value, index) => (
          <motion.div
            key={index}
            layout
            className="bg-cyan-400 rounded-t border border-cyan-300 min-w-[40px] flex items-end justify-center text-gray-900 font-bold"
            style={{ height: `${(value / maxValue) * 100}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {value}
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-2">Algorithm: {algorithms[selectedAlgo]}</h3>
        <p className="text-sm text-gray-400">
          {selectedAlgo === "bubble" && "Compare adjacent elements and swap if needed. Time: O(n²)"}
          {selectedAlgo === "selection" && "Find minimum and place at beginning. Time: O(n²)"}
          {selectedAlgo === "insertion" && "Build sorted array one element at a time. Time: O(n²)"}
        </p>
      </div>
    </div>
  );
}

