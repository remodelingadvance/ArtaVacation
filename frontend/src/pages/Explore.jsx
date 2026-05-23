import React from 'react';
import { motion } from 'framer-motion';

export default function Explore() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen max-w-7xl mx-auto px-4 py-20"
    >
      <h1 className="text-4xl font-bold mb-12">Explore Properties</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="md:col-span-1 bg-white rounded-lg p-6 h-fit">
          <h3 className="font-bold mb-4">Filters</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Property Type</label>
              <select className="w-full border rounded p-2">
                <option>All</option>
                <option>Apartment</option>
                <option>Villa</option>
                <option>Condo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Price Range</label>
              <input type="range" className="w-full" min="0" max="10000" />
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer"
            >
              <div className="h-48 bg-gradient-to-br from-blue-400 to-cyan-400" />
              <div className="p-4">
                <h3 className="font-bold mb-2">Property {i}</h3>
                <p className="text-gray-600 text-sm mb-3">Miami Beach</p>
                <p className="text-blue-600 font-bold">$450/night</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}