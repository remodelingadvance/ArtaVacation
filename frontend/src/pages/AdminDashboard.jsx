import React from 'react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen max-w-7xl mx-auto px-4 py-20"
    >
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['Properties', 'Bookings', 'Users', 'Revenue'].map((item, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-semibold text-gray-600 mb-2">{item}</h3>
            <p className="text-3xl font-bold">{Math.floor(Math.random() * 1000)}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}