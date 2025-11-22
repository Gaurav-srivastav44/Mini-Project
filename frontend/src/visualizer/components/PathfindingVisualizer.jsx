import React, { useState } from "react";
import { motion } from "framer-motion";

const GRID_SIZE = 20;
const CELL_SIZE = 25;

export default function PathfindingVisualizer() {
  const [grid, setGrid] = useState(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0)));
  const [start, setStart] = useState([0, 0]);
  const [end, setEnd] = useState([GRID_SIZE - 1, GRID_SIZE - 1]);
  const [path, setPath] = useState([]);
  const [mode, setMode] = useState("wall");

  const toggleCell = (row, col) => {
    if (mode === "start") {
      setStart([row, col]);
    } else if (mode === "end") {
      setEnd([row, col]);
    } else if (mode === "wall") {
      const newGrid = [...grid];
      newGrid[row][col] = newGrid[row][col] === 1 ? 0 : 1;
      setGrid(newGrid);
    }
  };

  const dijkstra = () => {
    const visited = new Set();
    const queue = [[start[0], start[1], 0, []]];
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    while (queue.length > 0) {
      queue.sort((a, b) => a[2] - b[2]);
      const [r, c, dist, path] = queue.shift();
      const key = `${r},${c}`;

      if (visited.has(key)) continue;
      visited.add(key);

      if (r === end[0] && c === end[1]) {
        setPath([...path, [r, c]]);
        return;
      }

      directions.forEach(([dr, dc]) => {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && grid[nr][nc] === 0) {
          queue.push([nr, nc, dist + 1, [...path, [r, c]]]);
        }
      });
    }
  };

  return (
    <div className="w-full bg-gray-900 rounded-xl p-6 border border-cyan-500/30">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Pathfinding (Dijkstra)</h2>
      
      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          onClick={() => setMode("wall")}
          className={`px-4 py-2 rounded-lg ${mode === "wall" ? "bg-cyan-600" : "bg-gray-700"}`}
        >
          Add Wall
        </button>
        <button
          onClick={() => setMode("start")}
          className={`px-4 py-2 rounded-lg ${mode === "start" ? "bg-green-600" : "bg-gray-700"}`}
        >
          Set Start
        </button>
        <button
          onClick={() => setMode("end")}
          className={`px-4 py-2 rounded-lg ${mode === "end" ? "bg-red-600" : "bg-gray-700"}`}
        >
          Set End
        </button>
        <button onClick={dijkstra} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
          Find Path
        </button>
        <button onClick={() => { setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0))); setPath([]); }} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg">
          Clear
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 overflow-auto">
        <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)` }}>
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isStart = r === start[0] && c === start[1];
              const isEnd = r === end[0] && c === end[1];
              const isPath = path.some(([pr, pc]) => pr === r && pc === c);
              const isWall = cell === 1;

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => toggleCell(r, c)}
                  className={`w-6 h-6 rounded cursor-pointer transition-colors ${
                    isStart ? "bg-green-500" :
                    isEnd ? "bg-red-500" :
                    isPath ? "bg-yellow-400" :
                    isWall ? "bg-gray-600" :
                    "bg-gray-700 hover:bg-gray-600"
                  }`}
                />
              );
            })
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-2">Dijkstra's Algorithm</h3>
        <p className="text-sm text-gray-400">
          Finds shortest path using priority queue. Time: O(V log V + E)
        </p>
      </div>
    </div>
  );
}

