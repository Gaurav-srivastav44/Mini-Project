import React, { useState } from "react";
import { motion } from "framer-motion";

export default function LinkedListVisualizer() {
  const [list, setList] = useState([10, 20, 30, 40]);
  const [value, setValue] = useState("");
  const [index, setIndex] = useState(0);

  const insertAtHead = () => {
    if (value) {
      setList([parseInt(value), ...list]);
      setValue("");
    }
  };

  const insertAtTail = () => {
    if (value) {
      setList([...list, parseInt(value)]);
      setValue("");
    }
  };

  const insertAtIndex = () => {
    if (value && index >= 0 && index <= list.length) {
      const newList = [...list];
      newList.splice(index, 0, parseInt(value));
      setList(newList);
      setValue("");
    }
  };

  const deleteByValue = () => {
    if (value) {
      setList(list.filter(item => item !== parseInt(value)));
      setValue("");
    }
  };

  const deleteAtIndex = () => {
    if (index >= 0 && index < list.length) {
      const newList = [...list];
      newList.splice(index, 1);
      setList(newList);
    }
  };

  return (
    <div className="w-full bg-gray-900 rounded-xl p-6 border border-cyan-500/30">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Linked List Operations</h2>
      
      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value"
          className="px-4 py-2 bg-gray-800 rounded-lg border border-cyan-500/30"
        />
        <input
          type="number"
          value={index}
          onChange={(e) => setIndex(parseInt(e.target.value) || 0)}
          placeholder="Index"
          className="px-4 py-2 bg-gray-800 rounded-lg border border-cyan-500/30 w-24"
        />
        <button onClick={insertAtHead} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
          Insert Head
        </button>
        <button onClick={insertAtTail} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg">
          Insert Tail
        </button>
        <button onClick={insertAtIndex} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg">
          Insert At Index
        </button>
        <button onClick={deleteByValue} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
          Delete Value
        </button>
        <button onClick={deleteAtIndex} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg">
          Delete At Index
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 flex-wrap">
        {list.length === 0 ? (
          <p className="text-gray-400">List is empty</p>
        ) : (
          list.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2"
            >
              <div className="bg-cyan-400 text-gray-900 font-bold px-4 py-3 rounded-lg min-w-[60px] text-center">
                {item}
              </div>
              {idx < list.length - 1 && (
                <div className="text-cyan-400 text-2xl">→</div>
              )}
            </motion.div>
          ))
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-2">Linked List Info</h3>
        <p className="text-sm text-gray-400">
          Size: {list.length} | Operations: O(1) for head/tail, O(n) for index-based
        </p>
      </div>
    </div>
  );
}

