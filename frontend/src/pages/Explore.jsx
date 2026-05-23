import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Users, Star, ChevronRight, X } from 'lucide-react';
import { propertyService } from '../api/services/propertyService';
import toast from 'react-hot-toast';

export default function Explore() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    propertyType: [],
    minPrice: 0,
    maxPrice: 10000,
    bedrooms: 0,
    bathrooms: 0,
    guests: 0,
    location: searchParams.get('location') || '',
    amenities: [],
    waterfront: false,
    luxuryLevel: [],
  });

  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, [page, filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 12,
        search: filters.search,
        propertyType: filters.propertyType.join(','),
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        bedrooms: filters.bedrooms,
        bathrooms: filters.bathrooms,
        guests: filters.guests,
        location: filters.location,
        amenities: filters.amenities.join(','),
        waterfront: filters.waterfront,
        luxuryLevel: filters.luxuryLevel.join(','),
      });

      const response = await propertyService.getAllProperties(
        Object.fromEntries(params)
      );

      setProperties(response.data.properties);
      setTotal(response.data.total);
    } catch (error) {
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    if (filterName === 'propertyType') {
      setFilters((prev) => ({
        ...prev,
        propertyType: prev.propertyType.includes(value)
          ? prev.propertyType.filter((t) => t !== value)
          : [...prev.propertyType, value],
      }));
    } else if (filterName === 'luxuryLevel') {
      setFilters((prev) => ({
        ...prev,
        luxuryLevel: prev.luxuryLevel.includes(value)
          ? prev.luxuryLevel.filter((t) => t !== value)
          : [...prev.luxuryLevel, value],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [filterName]: value,
      }));
    }
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      propertyType: [],
      minPrice: 0,
      maxPrice: 10000,
      bedrooms: 0,
      bathrooms: 0,
      guests: 0,
      location: '',
      amenities: [],
      waterfront: false,
      luxuryLevel: [],
    });
    setPage(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-12"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Explore Properties</h1>
          <p className="text-gray-600">
            Found {total} properties in {filters.location || 'Miami'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Search</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Property name..."
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Location</label>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    placeholder="City or area..."
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Property Type
                  </label>
                  <div className="space-y-2">
                    {['apartment', 'villa', 'condo', 'beachHouse', 'penthouse'].map(
                      (type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.propertyType.includes(type)}
                            onChange={() => handleFilterChange('propertyType', type)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm capitalize">{type}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-600">
                        Min: ${filters.minPrice}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        value={filters.minPrice}
                        onChange={(e) =>
                          handleFilterChange('minPrice', Number(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">
                        Max: ${filters.maxPrice}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        value={filters.maxPrice}
                        onChange={(e) =>
                          handleFilterChange('maxPrice', Number(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Bedrooms</label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) =>
                      handleFilterChange('bedrooms', Number(e.target.value))
                    }
                    className="w-full border rounded-lg p-2 text-sm"
                  >
                    <option value="0">Any</option>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n}+
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Bathrooms</label>
                  <select
                    value={filters.bathrooms}
                    onChange={(e) =>
                      handleFilterChange('bathrooms', Number(e.target.value))
                    }
                    className="w-full border rounded-lg p-2 text-sm"
                  >
                    <option value="0">Any</option>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}+
                      </option>
                    ))}
                  </select>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Guests</label>
                  <select
                    value={filters.guests}
                    onChange={(e) =>
                      handleFilterChange('guests', Number(e.target.value))
                    }
                    className="w-full border rounded-lg p-2 text-sm"
                  >
                    <option value="0">Any</option>
                    {[1, 2, 4, 6, 8, 10].map((n) => (
                      <option key={n} value={n}>
                        {n}+ guests
                      </option>
                    ))}
                  </select>
                </div>

                {/* Luxury Level */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Luxury Level
                  </label>
                  <div className="space-y-2">
                    {['standard', 'premium', 'luxury', 'ultra-luxury'].map((level) => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.luxuryLevel.includes(level)}
                          onChange={() => handleFilterChange('luxuryLevel', level)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm capitalize">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Waterfront */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="waterfront"
                    checked={filters.waterfront}
                    onChange={(e) =>
                      handleFilterChange('waterfront', e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  <label htmlFor="waterfront" className="text-sm font-semibold cursor-pointer">
                    Waterfront Only
                  </label>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Properties Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            {loading ? (
              <div className="text-center py-20">Loading properties...</div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <h3 className="text-2xl font-bold mb-2">No properties found</h3>
                <p className="text-gray-600">
                  Try adjusting your filters to find more properties
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {properties.map((property, index) => (
                    <motion.div
                      key={property._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition"
                      onClick={() => navigate(`/property/${property._id}`)}
                    >
                      {/* Image */}
                      <div className="relative h-56 bg-gradient-to-br from-blue-400 to-cyan-400 overflow-hidden group">
                        {property.images?.[0]?.url && (
                          <img
                            src={property.images[0].url}
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold mb-2 truncate">
                          {property.title}
                        </h3>

                        <div className="flex items-center gap-2 text-gray-600 mb-4 text-sm">
                          <MapPin size={16} />
                          <span>{property.location.city}, {property.location.state}</span>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-600">
                              <Users size={16} />
                              <span className="text-sm font-semibold">
                                {property.guests}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">Guests</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-600">
                              <Bed size={16} />
                              <span className="text-sm font-semibold">
                                {property.bedrooms}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">Beds</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-gray-600">
                              <Bath size={16} />
                              <span className="text-sm font-semibold">
                                {property.bathrooms}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">Baths</p>
                          </div>
                        </div>

                        {/* Price & Rating */}
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-2xl font-bold text-blue-600">
                              ${property.pricing.basePrice}
                            </p>
                            <p className="text-xs text-gray-600">per night</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="text-yellow-500 fill-current" size={18} />
                              <span className="font-bold text-sm">
                                {property.rating}
                              </span>
                            </div>
                            <ChevronRight className="text-gray-400" size={20} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">
                    Showing {(page - 1) * 12 + 1} to{' '}
                    {Math.min(page * 12, total)} of {total} properties
                  </p>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                    >
                      Previous
                    </motion.button>

                    <div className="flex items-center gap-2">
                      {Array.from(
                        { length: Math.ceil(total / 12) },
                        (_, i) => i + 1
                      )
                        .slice(
                          Math.max(0, page - 2),
                          Math.min(Math.ceil(total / 12), page + 1)
                        )
                        .map((p) => (
                          <motion.button
                            key={p}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setPage(p)}
                            className={`w-10 h-10 rounded-lg transition ${
                              page === p
                                ? 'bg-blue-500 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {p}
                          </motion.button>
                        ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setPage(page + 1)}
                      disabled={page * 12 >= total}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                    >
                      Next
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}