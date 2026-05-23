import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  MapPin,
  Users,
  Bed,
  Wifi,
  Heart,
  Star,
  Share2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { propertyService } from '../api/services/propertyService';
import { wishlistService } from '../api/services/wishlistService';
import { reviewService } from '../api/services/reviewService';
import toast from 'react-hot-toast';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const [propertyRes, similarRes, reviewsRes] = await Promise.all([
        propertyService.getProperty(id),
        propertyService.getSimilarProperties(id),
        reviewService.getPropertyReviews(id),
      ]);

      setProperty(propertyRes.data.property);
      setSimilarProperties(similarRes.data.properties);
      setReviews(reviewsRes.data.reviews);

      // Check if in wishlist
      if (user) {
        try {
          const wishlistRes = await wishlistService.isInWishlist(id);
          setIsInWishlist(wishlistRes.data.isInWishlist);
        } catch (error) {
          // User not logged in or error
        }
      }
    } catch (error) {
      toast.error('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(id);
        toast.success('Removed from wishlist');
      } else {
        await wishlistService.addToWishlist(id);
        toast.success('Added to wishlist');
      }
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleBooking = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${id}`);
  };

  const nextImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading property...</div>;
  }

  if (!property) {
    return <div className="text-center py-20">Property not found</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Image Gallery */}
      <div className="relative h-[500px] bg-gray-300">
        {property.images && property.images.length > 0 ? (
          <>
            <img
              src={property.images[currentImageIndex].url}
              alt={property.title}
              className="w-full h-full object-cover"
            />

            {property.images.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full hover:bg-white shadow-lg"
                >
                  <ChevronLeft size={24} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full hover:bg-white shadow-lg"
                >
                  <ChevronRight size={24} />
                </motion.button>

                {/* Thumbnails */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {property.images.map((_, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-3 h-3 rounded-full transition ${
                        idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-400" />
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{property.title}</h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin size={20} />
                      <span>{property.location.address}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={handleWishlist}
                  className={`p-3 rounded-full transition ${
                    isInWishlist
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Heart size={24} fill={isInWishlist ? 'currentColor' : 'none'} />
                </motion.button>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-500 fill-current" size={20} />
                  <span className="font-semibold">{property.rating}</span>
                  <span className="text-gray-600">({property.totalReviews} reviews)</span>
                </div>
              </div>
            </motion.div>

            {/* Property Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold mb-6">Property Details</h2>

              <div className="grid grid-cols-4 gap-6 mb-8 pb-8 border-b">
                <div className="text-center">
                  <Users size={32} className="mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">{property.guests}</p>
                  <p className="text-gray-600 text-sm">Guests</p>
                </div>
                <div className="text-center">
                  <Bed size={32} className="mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">{property.bedrooms}</p>
                  <p className="text-gray-600 text-sm">Bedrooms</p>
                </div>
                <div className="text-center">
                  <Bed size={32} className="mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">{property.beds}</p>
                  <p className="text-gray-600 text-sm">Beds</p>
                </div>
                <div className="text-center">
                  <Wifi size={32} className="mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">{property.bathrooms}</p>
                  <p className="text-gray-600 text-sm">Bathrooms</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">About This Property</h3>
                <p className="text-gray-700 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                      >
                        <div className="text-2xl">{amenity.icon || '✓'}</div>
                        <span className="font-semibold">{amenity.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* House Rules */}
              {property.houseRules && property.houseRules.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">House Rules</h3>
                  <ul className="space-y-2">
                    {property.houseRules.map((rule, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700">
                        <span className="text-blue-600">•</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>

            {/* Reviews */}
            {reviews && reviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                <h3 className="text-2xl font-bold mb-6">Guest Reviews</h3>
                <div className="space-y-6">
                  {reviews.map((review, idx) => (
                    <motion.div
                      key={review._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="pb-6 border-b last:border-b-0"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold">
                          {review.user?.firstName[0]}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-bold">
                                {review.user?.firstName} {review.user?.lastName}
                              </p>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={
                                      i < review.rating
                                        ? 'text-yellow-500 fill-current'
                                        : 'text-gray-300'
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <h4 className="font-semibold mb-1">{review.title}</h4>
                          <p className="text-gray-700">{review.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="h-fit sticky top-24"
          >
            <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
              <div className="mb-6">
                <h3 className="text-3xl font-bold mb-2">
                  ${property.pricing.basePrice}
                  <span className="text-lg text-gray-600"> /night</span>
                </h3>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBooking}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition mb-4"
              >
                Book Now
              </motion.button>

              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-semibold">{property.checkInTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-semibold">{property.checkOutTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cancellation:</span>
                  <span className="font-semibold capitalize">
                    {property.cancellationPolicy}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Host */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="font-bold mb-4">About the Host</h4>
              <div className="flex items-center gap-3 mb-4">
                {property.owner?.profileImage?.url ? (
                  <img
                    src={property.owner.profileImage.url}
                    alt={property.owner.firstName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold">
                    {property.owner?.firstName[0]}
                  </div>
                )}
                <div>
                  <p className="font-bold">
                    {property.owner?.firstName} {property.owner?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">Host</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full border border-blue-500 text-blue-500 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Message Host
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Similar Properties */}
      {similarProperties && similarProperties.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-100 py-12"
        >
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Similar Properties</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((prop, idx) => (
                <motion.div
                  key={prop._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
                  onClick={() => navigate(`/property/${prop._id}`)}
                >
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-cyan-400" />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{prop.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {prop.location.city}, {prop.location.state}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-blue-600 font-bold">
                        ${prop.pricing.basePrice}/night
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-500 fill-current" size={16} />
                        <span className="font-semibold text-sm">{prop.rating}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}