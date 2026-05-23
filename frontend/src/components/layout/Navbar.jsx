import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Heart, User } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            LuxeStay
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">
            <Link to="/explore" className="hover:text-blue-500 transition">
              Explore
            </Link>
            <Link to="/about" className="hover:text-blue-500 transition">
              About
            </Link>
            <Link to="/contact" className="hover:text-blue-500 transition">
              Contact
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex gap-4 items-center">
            <Heart className="cursor-pointer hover:text-red-500 transition" />
            <User className="cursor-pointer hover:text-blue-500 transition" />
            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4 border-t border-white/20"
          >
            <Link to="/explore" className="block py-2 hover:text-blue-500">
              Explore
            </Link>
            <Link to="/about" className="block py-2 hover:text-blue-500">
              About
            </Link>
            <Link to="/contact" className="block py-2 hover:text-blue-500">
              Contact
            </Link>
          </motion.div>
        )}
      </div>
    </nav>
  );
}