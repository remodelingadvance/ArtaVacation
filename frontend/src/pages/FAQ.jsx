import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [expanded, setExpanded] = useState(0);

  const faqs = [
    {
      question: 'How do I book a property?',
      answer:
        'Simply browse our properties, select your dates, click "Book Now", and complete the secure payment process. You will receive confirmation and check-in instructions via email.',
    },
    {
      question: 'What is your cancellation policy?',
      answer:
        'Our cancellation policies vary by property. Most offer flexible, moderate, or strict options. You can review the specific policy for each property during booking.',
    },
    {
      question: 'Are your properties verified?',
      answer:
        'Yes, all our properties are personally verified by our team and feature verified guest reviews to ensure quality and authenticity.',
    },
    {
      question: 'How does payment work?',
      answer:
        'We use secure Stripe payment processing. You only pay when your booking is confirmed. Your payment includes the nightly rate, cleaning fees, and service fees.',
    },
    {
      question: 'What if I need to contact the property owner?',
      answer:
        'You can message the property owner through our platform. Our 24/7 support team is also available to assist you with any concerns.',
    },
    {
      question: 'Do you offer corporate or group rates?',
      answer:
        'Yes, we offer special rates for corporate bookings and large groups. Please contact our support team for details.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-20"
    >
      {/* Hero */}
      <motion.section className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white py-16 px-4 mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-white/90">
            Find answers to common questions about our services
          </p>
        </div>
      </motion.section>

      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <motion.button
                onClick={() => setExpanded(expanded === index ? -1 : index)}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition"
              >
                <h3 className="text-lg font-bold text-left">{faq.question}</h3>
                <motion.div
                  animate={{ rotate: expanded === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="text-blue-600" size={24} />
                </motion.div>
              </motion.button>

              <motion.div
                initial={{ height: 0 }}
                animate={{ height: expanded === index ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}