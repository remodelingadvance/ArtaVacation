import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Award, Users, Globe } from 'lucide-react';

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      {/* Hero */}
      <motion.section className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">About LuxeStay</h1>
          <p className="text-xl text-white/90">
            Redefining luxury vacation rentals in Miami since 2020
          </p>
        </div>
      </motion.section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-blue-50 rounded-xl p-12 mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At LuxeStay, our mission is to provide unforgettable luxury vacation
              experiences in Miami. We carefully curate the finest properties and
              connect travelers with their dream accommodations. We believe that every
              guest deserves exceptional service and premium comfort.
            </p>
          </motion.div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {[
              {
                icon: Award,
                title: 'Quality',
                description:
                  'Only the finest properties meet our strict quality standards',
              },
              {
                icon: Users,
                title: 'Service',
                description:
                  'Dedicated 24/7 support for all our guests and property owners',
              },
              {
                icon: CheckCircle,
                title: 'Trust',
                description:
                  'Transparent pricing and verified reviews from real guests',
              },
              {
                icon: Globe,
                title: 'Community',
                description:
                  'Building a community of luxury travelers and hosts',
              },
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-8"
                >
                  <Icon className="text-blue-600 mb-4" size={40} />
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl p-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '500+', label: 'Properties' },
                { number: '10K+', label: 'Happy Guests' },
                { number: '98%', label: 'Satisfaction' },
                { number: '24/7', label: 'Support' },
              ].map((stat, index) => (
                <div key={index}>
                  <p className="text-4xl font-bold mb-2">{stat.number}</p>
                  <p className="text-white/90">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}