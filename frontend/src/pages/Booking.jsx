import React from 'react';
import { motion } from 'framer-motion';

export default function Booking() {
  const [step, setStep] = React.useState(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen max-w-2xl mx-auto px-4 py-20"
    >
      <h1 className="text-4xl font-bold mb-12">Book Your Stay</h1>

      {/* Progress */}
      <div className="flex justify-between mb-12">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex-1 h-2 mx-2 rounded ${
              i <= step ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg p-8">
        {step === 1 && <div>Step 1: Dates & Guests</div>}
        {step === 2 && <div>Step 2: Contact Info</div>}
        {step === 3 && <div>Step 3: Payment</div>}

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={() => setStep(Math.min(3, step + 1))}
            className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  );
}