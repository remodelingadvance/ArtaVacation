import React from 'react';
import { motion } from 'framer-motion';

export default function UserDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen max-w-6xl mx-auto px-4 py-20"
    >
      <h1 className="text-4xl font-bold mb-8">My Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="font-semibold text-gray-600 mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold">5</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="font-semibold text-gray-600 mb-2">Saved Properties</h3>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="font-semibold text-gray-600 mb-2">Total Spent</h3>
          <p className="text-3xl font-bold">$5,450</p>
        </div>
      </div>
    </motion.div>
  );
}