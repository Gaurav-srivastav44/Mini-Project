import React, { useState } from "react";
import { motion } from "framer-motion";

export default function DPVisualizer() {
  const [n, setN] = useState(5);
  const [result, setResult] = useState(null);
  const [memo, setMemo] = useState({});
  const [steps, setSteps] = useState([]);

  const fibonacciDP = (num) => {
    const dp = [0, 1];
    setSteps([{ step: "Initialize dp[0] = 0, dp[1] = 1" }]);
    
    for (let i = 2; i <= num; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
      setSteps(prev => [...prev, { step: `dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}` }]);
    }
    
    setMemo(dp.reduce((acc, val, idx) => ({ ...acc, [idx]: val }), {}));
    return dp[num];
  };

  const coinChange = (amount) => {
    const coins = [1, 3, 4];
    const dp = Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    setSteps([{ step: `Initialize dp array for amount ${amount}` }]);
    
    for (let i = 1; i <= amount; i++) {
      for (const coin of coins) {
        if (coin <= i) {
          dp[i] = Math.min(dp[i], dp[i - coin] + 1);
          setSteps(prev => [...prev, { step: `dp[${i}] = min(dp[${i}], dp[${i-coin}]+1) = ${dp[i]}` }]);
        }
      }
    }
    
    setMemo(dp.reduce((acc, val, idx) => ({ ...acc, [idx]: val }), {}));
    return dp[amount] === Infinity ? -1 : dp[amount];
  };

  const handleFibonacci = () => {
    setSteps([]);
    setMemo({});
    setTimeout(() => {
      const res = fibonacciDP(parseInt(n));
      setResult(res);
    }, 100);
  };

  const handleCoinChange = () => {
    setSteps([]);
    setMemo({});
    setTimeout(() => {
      const res = coinChange(parseInt(n));
      setResult(res);
    }, 100);
  };

  return (
    <div className="w-full bg-gray-900 rounded-xl p-6 border border-cyan-500/30">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Dynamic Programming</h2>
      
      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="number"
          value={n}
          onChange={(e) => setN(e.target.value)}
          min="1"
          max="20"
          className="px-4 py-2 bg-gray-800 rounded-lg border border-cyan-500/30 w-24"
        />
        <button onClick={handleFibonacci} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
          Fibonacci DP
        </button>
        <button onClick={handleCoinChange} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg">
          Coin Change
        </button>
        <button onClick={() => { setSteps([]); setMemo({}); setResult(null); }} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
          Clear
        </button>
      </div>

      {result !== null && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-500 rounded-lg">
          <p className="text-green-400 font-bold text-xl">Result: {result}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-cyan-400">DP Table</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(memo).map(([key, value]) => (
              <div key={key} className="bg-cyan-400/20 border border-cyan-400 rounded px-3 py-1">
                <span className="text-cyan-300 text-xs">dp[{key}]</span>
                <span className="text-white font-bold ml-2">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto">
          <h3 className="font-semibold mb-2 text-cyan-400">Steps</h3>
          <div className="space-y-1">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-300 font-mono"
              >
                {step.step}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-2">Dynamic Programming</h3>
        <p className="text-sm text-gray-400">
          Store results of subproblems to avoid recomputation | Time: O(n) for fib, O(n*m) for coin change
        </p>
      </div>
    </div>
  );
}

