import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Bed, Users, ChevronRight } from 'lucide-react';
import { propertyService } from '../api/services/propertyService';
import toast from 'react-hot-toast';

export default function Condos() {
  const navigate = useNavigate();
  const [condos, setCondos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    fetchCondos();
  }, [page, sortBy]);

  const fetchCondos = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getPropertiesByType('condo', {
        page,
        limit: 12,
        sort: sortBy,
      });

      setCondos(response.data.properties);
      setTotal(response.data.total);
    } catch (error) {
      toast.error('Failed to fetch condos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-12"
    >
      {/* Hero */}
      <motion.section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-20 px-4 mb-12">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-4"
          >
            Luxury Condos in Miami
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90"
          >
            Discover premium condo living with stunning amenities and prime locations
          </motion.p>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4">
        {/* Controls */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">All Condos ({total})</h2>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="border rounded-lg p-2"
          >
            <option value="latest">Latest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading condos...</div>
        ) : condos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <h3 className="text-2xl font-bold mb-2">No condos found</h3>
            <p className="text-gray-600 mb-6">
              Check back soon for new luxury condos
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/explore')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Explore Other Properties
            </motion.button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {condos.map((condo, index) => (
                <motion.div
                  key={condo._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition"
                  onClick={() => navigate(`/property/${condo._id}`)}
                >
                  <div className="relative h-64 bg-gradient-to-br from-blue-400 to-cyan-400 overflow-hidden group">
                    {condo.images?.[0]?.url && (
                      <img
                        src={condo.images[0].url}
                        alt={condo.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    )}

                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-bold text-blue-600">
                      Condo
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{condo.title}</h3>

                    <div className="flex items-center gap-2 text-gray-600 mb-4 text-sm">
                      <MapPin size={16} />
                      <span>{condo.location.city}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b">
                      <div className="text-center">
                        <p className="font-bold text-lg">{condo.guests}</p>
                        <p className="text-xs text-gray-500">Guests</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-lg">{condo.bedrooms}</p>
                        <p className="text-xs text-gray-500">Beds</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-lg">{condo.bathrooms}</p>
                        <p className="text-xs text-gray-500">Baths</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          ${condo.pricing.basePrice}
                        </p>
                        <p className="text-xs text-gray-600">per night</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Star className="text-yellow-500 fill-current" size={18} />
                        <span className="font-bold">{condo.rating}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Showing {(page - 1) * 12 + 1} to {Math.min(page * 12, total)} of{' '}
                {total} condos
              </p>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setPage(page + 1)}
                  disabled={page * 12 >= total}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </motion.button>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}