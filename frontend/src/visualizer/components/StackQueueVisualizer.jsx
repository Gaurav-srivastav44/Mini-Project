import React, { useState } from "react";
import { motion } from "framer-motion";

export default function StackQueueVisualizer() {
  const [mode, setMode] = useState("stack");
  const [stack, setStack] = useState([]);
  const [queue, setQueue] = useState([]);
  const [value, setValue] = useState("");

  const push = () => {
    if (value) {
      setStack([...stack, parseInt(value)]);
      setValue("");
    }
  };

  const pop = () => {
    if (stack.length > 0) {
      setStack(stack.slice(0, -1));
    }
  };

  const enqueue = () => {
    if (value) {
      setQueue([...queue, parseInt(value)]);
      setValue("");
    }
  };

  const dequeue = () => {
    if (queue.length > 0) {
      setQueue(queue.slice(1));
    }
  };

  const currentArray = mode === "stack" ? stack : queue;

  return (
    <div className="w-full bg-gray-900 rounded-xl p-6 border border-cyan-500/30">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Stack & Queue</h2>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setMode("stack")}
          className={`px-4 py-2 rounded-lg ${mode === "stack" ? "bg-cyan-600" : "bg-gray-700"}`}
        >
          Stack (LIFO)
        </button>
        <button
          onClick={() => setMode("queue")}
          className={`px-4 py-2 rounded-lg ${mode === "queue" ? "bg-cyan-600" : "bg-gray-700"}`}
        >
          Queue (FIFO)
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value"
          className="px-4 py-2 bg-gray-800 rounded-lg border border-cyan-500/30"
        />
        {mode === "stack" ? (
          <>
            <button onClick={push} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg">
              Push
            </button>
            <button onClick={pop} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
              Pop
            </button>
          </>
        ) : (
          <>
            <button onClick={enqueue} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg">
              Enqueue
            </button>
            <button onClick={dequeue} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
              Dequeue
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 min-h-[200px] justify-end">
        {currentArray.length === 0 ? (
          <p className="text-gray-400">Empty</p>
        ) : mode === "stack" ? (
          currentArray.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-cyan-400 text-gray-900 font-bold px-6 py-3 rounded-lg min-w-[80px] text-center"
            >
              {item}
            </motion.div>
          )).reverse()
        ) : (
          <div className="flex gap-2">
            {currentArray.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-cyan-400 text-gray-900 font-bold px-6 py-3 rounded-lg min-w-[80px] text-center"
              >
                {item}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-2">{mode === "stack" ? "Stack" : "Queue"} Operations</h3>
        <p className="text-sm text-gray-400">
          {mode === "stack" 
            ? "Last In First Out (LIFO) - Push adds to top, Pop removes from top"
            : "First In First Out (FIFO) - Enqueue adds to rear, Dequeue removes from front"}
        </p>
      </div>
    </div>
  );
}

