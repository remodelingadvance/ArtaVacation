import React from 'react';
import { motion } from 'framer-motion';

export default function GlobalLoader() {
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleStop = () => setIsLoading(false);

    window.addEventListener('loadstart', handleStart);
    window.addEventListener('loadend', handleStop);

    return () => {
      window.removeEventListener('loadstart', handleStart);
      window.removeEventListener('loadend', handleStop);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center backdrop-blur"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"
        />
        <p className="text-white text-sm">Loading...</p>
      </div>
    </motion.div>
  );
}