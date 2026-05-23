import React from 'react';
import { motion } from 'framer-motion';

export default function PropertyDetails() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen max-w-6xl mx-auto px-4 py-20"
    >
      <h1 className="text-4xl font-bold mb-8">Luxury Villa Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          <div className="bg-gradient-to-br from-blue-400 to-cyan-400 h-96 rounded-lg mb-8" />
          <div className="bg-white p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">About This Property</h2>
            <p className="text-gray-600">Description here...</p>
          </div>
        </div>

        {/* Booking Card */}
        <div className="md:col-span-1 sticky top-24 h-fit">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-4">$450 <span className="text-sm text-gray-600">/night</span></h3>
            <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition mb-4">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}