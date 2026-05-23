import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, MapPin, Users, Bed, Star, Heart, Zap } from 'lucide-react';
import { propertyService } from '../api/services/propertyService';
import toast from 'react-hot-toast';

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchForm, setSearchForm] = useState({
    location: 'Miami',
    guests: 2,
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const response = await propertyService.getFeaturedProperties();
      setFeatured(response.data.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      location: searchForm.location,
      guests: searchForm.guests,
      ...(searchForm.startDate && { startDate: searchForm.startDate }),
      ...(searchForm.endDate && { endDate: searchForm.endDate }),
    });
    navigate(`/explore?${params.toString()}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[700px] bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl font-bold text-white mb-6 max-w-4xl"
          >
            Discover Luxury in Paradise
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl text-white/90 mb-12 max-w-2xl"
          >
            Experience the finest vacation rentals in Miami Beach
          </motion.p>

          {/* Search Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onSubmit={handleSearch}
            className="w-full max-w-5xl bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={searchForm.location}
                  onChange={handleInputChange}
                  placeholder="City or Address"
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Guests
                </label>
                <select
                  name="guests"
                  value={searchForm.guests}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Check-in
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={searchForm.startDate}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Check-out
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={searchForm.endDate}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition"
                >
                  Search
                </motion.button>
              </div>
            </div>
          </motion.form>
        </div>
      </motion.section>

      {/* Featured Properties */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold mb-4">Featured Properties</h2>
            <p className="text-xl text-gray-600">
              Handpicked luxury properties perfect for your Miami getaway
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20">Loading properties...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((property, index) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer group"
                  onClick={() => navigate(`/property/${property._id}`)}
                >
                  {/* Image */}
                  <div className="relative h-60 bg-gradient-to-br from-blue-400 to-cyan-400 overflow-hidden">
                    {property.images?.[0]?.url && (
                      <img
                        src={property.images[0].url}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    )}

                    {/* Badge */}
                    <div className="absolute top-4 right-4">
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        className="bg-white/80 p-2 rounded-full hover:bg-white"
                      >
                        <Heart className="text-red-500" size={20} />
                      </motion.button>
                    </div>

                    {property.isFeatured && (
                      <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <Zap size={14} />
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">
                      {property.title}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin size={16} />
                      <span className="text-sm">
                        {property.location.city}, {property.location.state}
                      </span>
                    </div>

                    {/* Property Features */}
                    <div className="flex gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>{property.guests} guests</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bed size={16} />
                        <span>{property.bedrooms} beds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={16} />
                        <span>{property.rating}</span>
                      </div>
                    </div>

                    {/* Price & Button */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          ${property.pricing.basePrice}
                        </p>
                        <p className="text-sm text-gray-600">per night</p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/property/${property._id}`);
                        }}
                        className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600"
                      >
                        <ChevronRight size={20} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600">
              Experience the difference with our premium services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '✨',
                title: 'Premium Selection',
                description: 'Carefully curated luxury properties in prime Miami locations',
              },
              {
                icon: '🛡️',
                title: 'Secure Booking',
                description: 'Safe and secure payment processing with buyer protection',
              },
              {
                icon: '🎯',
                title: '24/7 Support',
                description: 'Dedicated customer support available round the clock',
              },
              {
                icon: '💎',
                title: 'Best Price',
                description: 'Competitive rates with no hidden charges or surprises',
              },
              {
                icon: '📱',
                title: 'Easy Management',
                description: 'Manage bookings easily from your mobile or desktop',
              },
              {
                icon: '🌟',
                title: 'Verified Reviews',
                description: 'Authentic reviews from verified guests and travelers',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold mb-4">Guest Testimonials</h2>
            <p className="text-xl text-gray-600">
              What our guests are saying about their experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                text: 'Amazing experience! The property was exactly as described and the host was very responsive.',
                rating: 5,
              },
              {
                name: 'Michael Chen',
                text: 'Best vacation rental I have ever used. Great location, beautiful property, and excellent service.',
                rating: 5,
              },
              {
                name: 'Emma Williams',
                text: 'Highly recommend! Perfect spot for our family vacation. Will definitely book again.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-lg"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="text-yellow-500 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <p className="font-bold text-gray-900">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-gradient-to-r from-blue-600 to-cyan-600"
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-5xl font-bold mb-6">Ready for Your Dream Vacation?</h2>
          <p className="text-xl mb-8">
            Book your luxury Miami getaway today and experience paradise
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/explore')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition inline-flex items-center gap-2"
          >
            Explore Properties
            <ChevronRight size={24} />
          </motion.button>
        </div>
      </motion.section>
    </motion.div>
  );
}