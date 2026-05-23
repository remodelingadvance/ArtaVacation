import React from 'react';
import { motion } from 'framer-motion';

export default function Login() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-lg p-3"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-lg p-3"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}