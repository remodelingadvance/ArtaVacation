import React from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="h-[600px] bg-gradient-to-b from-blue-600 to-cyan-500 relative flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">Discover Luxury in Miami</h1>
          <p className="text-xl mb-8">Book your perfect vacation getaway</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:scale-105 transition">
            Explore Properties
          </button>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold mb-12">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg"
            >
              <div className="h-48 bg-gradient-to-br from-blue-400 to-cyan-400" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Luxury Villa {i}</h3>
                <p className="text-gray-600 mb-4">4 Beds • 3 Baths • $450/night</p>
                <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}