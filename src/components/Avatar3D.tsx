'use client';

import React from 'react';

// Simple placeholder component instead of the 3D avatar
export default function Avatar3D() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-cyan-900 to-blue-900 rounded-lg p-4">
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-4">
        <span className="text-4xl">👤</span>
      </div>
      <h3 className="text-xl font-bold text-cyan-300">Cyber Avatar</h3>
      <p className="text-sm text-cyan-200 mt-2">Your digital representation</p>
    </div>
  );
}