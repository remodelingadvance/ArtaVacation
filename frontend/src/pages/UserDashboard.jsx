import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { User, Heart, FileText, LogOut, Settings } from 'lucide-react';
import { userService } from '../api/services/userService';
import { bookingService } from '../api/services/bookingService';
import { wishlistService } from '../api/services/wishlistService';
import { logoutUser } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function UserDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserData();
  }, [user, activeTab]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      if (activeTab === 'bookings') {
        const response = await bookingService.getUserBookings();
        setBookings(response.data.bookings);
      } else if (activeTab === 'wishlist') {
        const response = await wishlistService.getWishlist();
        setWishlist(response.data.wishlist);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-12"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          <div className="flex justify-between items-start">
            <div className="flex gap-6">
              {user?.profileImage?.url ? (
                <img
                  src={user.profileImage.url}
                  alt={user.firstName}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold">
                  {user?.firstName[0]}{user?.lastName[0]}
                </div>
              )}

              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Welcome, {user?.firstName}!
                </h1>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-gray-600">{user?.phone}</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
            >
              <LogOut size={20} />
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {[
            { id: 'bookings', label: 'My Bookings', icon: FileText },
            { id: 'wishlist', label: 'Wishlist', icon: Heart },
            { id: 'profile', label: 'Profile Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : (
          <>
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {bookings.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">No Bookings Yet</h3>
                    <p className="text-gray-600 mb-6">
                      You haven't made any bookings. Start exploring our properties!
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => navigate('/explore')}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
                    >
                      Explore Properties
                    </motion.button>
                  </div>
                ) : (
                  bookings.map((booking, index) => (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg shadow-lg p-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                          <h3 className="font-semibold text-gray-600 text-sm mb-1">
                            Booking Reference
                          </h3>
                          <p className="text-xl font-bold text-blue-600">
                            {booking.bookingReference}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-600 text-sm mb-1">
                            Property
                          </h3>
                          <p className="font-semibold">{booking.property?.title}</p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-600 text-sm mb-1">
                            Check-in
                          </h3>
                          <p className="font-semibold">
                            {new Date(booking.checkInDate).toLocaleDateString()}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-600 text-sm mb-1">
                            Total Amount
                          </h3>
                          <p className="text-2xl font-bold text-green-600">
                            ${booking.pricing.totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => navigate(`/booking/${booking.property?._id}`)}
                          className="text-blue-500 hover:underline font-semibold"
                        >
                          View Details
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {wishlist.length === 0 ? (
                  <div className="col-span-full bg-white rounded-lg shadow p-12 text-center">
                    <Heart size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">No Saved Properties</h3>
                    <p className="text-gray-600 mb-6">
                      Start adding properties to your wishlist!
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => navigate('/explore')}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
                    >
                      Explore Properties
                    </motion.button>
                  </div>
                ) : (
                  wishlist.map((property, index) => (
                    <motion.div
                      key={property._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
                      onClick={() => navigate(`/property/${property._id}`)}
                    >
                      <div className="h-48 bg-gradient-to-br from-blue-400 to-cyan-400" />
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2">{property.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {property.location.city}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-blue-600 font-bold">
                            ${property.pricing.basePrice}/night
                          </p>
                          <span className="text-yellow-500">★ {property.rating}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg p-8 max-w-2xl"
              >
                <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">First Name</label>
                      <input
                        type="text"
                        defaultValue={user?.firstName}
                        className="w-full border rounded-lg p-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Last Name</label>
                      <input
                        type="text"
                        defaultValue={user?.lastName}
                        className="w-full border rounded-lg p-3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="w-full border rounded-lg p-3"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue={user?.phone}
                      className="w-full border rounded-lg p-3"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}