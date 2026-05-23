import React from 'react';
import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white py-20"
    >
      <div className="max-w-4xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-12"
        >
          Terms & Conditions
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="prose prose-lg max-w-none"
        >
          <h2>1. Acceptance of Terms</h2>
          <p>
            By using our platform, you agree to these terms and conditions. If you do
            not agree, please do not use our services.
          </p>

          <h2>2. User Responsibilities</h2>
          <p>
            Users are responsible for maintaining the confidentiality of their account
            information and for all activities that occur under their account. You
            agree to provide accurate information during registration.
          </p>

          <h2>3. Booking Terms</h2>
          <p>
            All bookings are subject to availability and property owner approval. We
            reserve the right to cancel bookings that violate our policies.
          </p>

          <h2>4. Cancellation Policy</h2>
          <p>
            Each property has its own cancellation policy. Please review the specific
            policy for your selected property. Refunds are processed according to the
            stated policy.
          </p>

          <h2>5. Liability Disclaimer</h2>
          <p>
            We are not liable for any damages, losses, or injuries arising from your
            use of our platform or accommodations. Property owners are responsible for
            maintaining their properties.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            All content on our platform, including text, images, and logos, is owned
            by LuxeStay or its licensors and is protected by copyright laws.
          </p>

          <h2>7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of
            our platform constitutes acceptance of changes.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}