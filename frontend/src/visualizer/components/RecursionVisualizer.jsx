import React, { useState } from "react";
import { motion } from "framer-motion";

export default function RecursionVisualizer() {
  const [n, setN] = useState(5);
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);

  const factorial = (num, depth = 0) => {
    setSteps(prev => [...prev, { depth, call: `factorial(${num})`, result: num <= 1 ? 1 : "..." }]);
    if (num <= 1) return 1;
    const res = num * factorial(num - 1, depth + 1);
    setSteps(prev => [...prev, { depth, call: `factorial(${num})`, result: res }]);
    return res;
  };

  const fibonacci = (num, depth = 0) => {
    setSteps(prev => [...prev, { depth, call: `fib(${num})`, result: num <= 1 ? num : "..." }]);
    if (num <= 1) return num;
    const res = fibonacci(num - 1, depth + 1) + fibonacci(num - 2, depth + 1);
    setSteps(prev => [...prev, { depth, call: `fib(${num})`, result: res }]);
    return res;
  };

  const handleFactorial = () => {
    setSteps([]);
    setResult(null);
    setTimeout(() => {
      const res = factorial(parseInt(n));
      setResult(res);
    }, 100);
  };

  const handleFibonacci = () => {
    setSteps([]);
    setResult(null);
    setTimeout(() => {
      const res = fibonacci(parseInt(n));
      setResult(res);
    }, 100);
  };

  return (
    <div className="w-full bg-gray-900 rounded-xl p-6 border border-cyan-500/30">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Recursion Tree</h2>
      
      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="number"
          value={n}
          onChange={(e) => setN(e.target.value)}
          min="1"
          max="10"
          className="px-4 py-2 bg-gray-800 rounded-lg border border-cyan-500/30 w-24"
        />
        <button onClick={handleFactorial} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
          Factorial
        </button>
        <button onClick={handleFibonacci} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg">
          Fibonacci
        </button>
        <button onClick={() => { setSteps([]); setResult(null); }} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
          Clear
        </button>
      </div>

      {result !== null && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-500 rounded-lg">
          <p className="text-green-400 font-bold text-xl">Result: {result}</p>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-6 max-h-96 overflow-y-auto">
        {steps.length === 0 ? (
          <p className="text-gray-400">Click a function to visualize recursion</p>
        ) : (
          <div className="space-y-2">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4"
                style={{ paddingLeft: `${step.depth * 20}px` }}
              >
                <div className="text-cyan-400 font-mono text-sm">{step.call}</div>
                <div className="text-gray-300">→</div>
                <div className="text-yellow-400 font-bold">{step.result}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-2">Recursion Concepts</h3>
        <p className="text-sm text-gray-400">
          Base case stops recursion | Each call creates a new stack frame | Time: O(2^n) for fib, O(n) for factorial
        </p>
      </div>
    </div>
  );
}

