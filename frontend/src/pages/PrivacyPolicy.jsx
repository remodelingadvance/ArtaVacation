import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
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
          Privacy Policy
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="prose prose-lg max-w-none"
        >
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly, such as when you create an
            account, make a booking, or contact us. This includes name, email address,
            phone number, and payment information.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use your information to provide, maintain, and improve our services,
            process transactions, send administrative notifications, and respond to
            inquiries.
          </p>

          <h2>3. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect
            your personal information from unauthorized access, alteration, disclosure,
            or destruction.
          </p>

          <h2>4. Sharing of Information</h2>
          <p>
            We do not sell or rent your personal information. We may share information
            with property owners, payment processors, and service providers necessary
            to deliver our services.
          </p>

          <h2>5. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information.
            Please contact us if you wish to exercise these rights.
          </p>

          <h2>6. Contact Us</h2>
          <p>
            If you have questions about this privacy policy, please contact us at
            support@luxuryvacationrental.com.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}