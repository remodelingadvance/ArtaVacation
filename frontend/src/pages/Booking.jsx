import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import { bookingService } from '../api/services/bookingService';
import { paymentService } from '../api/services/paymentService';
import { propertyService } from '../api/services/propertyService';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BookingForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState(null);
  const [step, setStep] = useState(1);
  const [pricing, setPricing] = useState(null);
  const [booking, setBooking] = useState(null);

  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    notes: '',
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await propertyService.getProperty(id);
        setProperty(response.data.property);
      } catch (error) {
        toast.error('Failed to load property');
      }
    };

    fetchProperty();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkAvailability = async () => {
    try {
      if (!formData.checkInDate || !formData.checkOutDate) {
        toast.error('Please select check-in and check-out dates');
        return;
      }

      setLoading(true);
      const response = await bookingService.checkAvailability({
        propertyId: id,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        guests: formData.numberOfGuests,
      });

      if (response.data.isAvailable) {
        setPricing(response.data.pricing);
        setStep(2);
      } else {
        toast.error('Property not available for selected dates');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error checking availability');
    } finally {
      setLoading(false);
    }
  };

  const createBookingAndPayment = async () => {
    try {
      setLoading(true);

      // Create booking
      const bookingResponse = await bookingService.createBooking({
        propertyId: id,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfGuests: parseInt(formData.numberOfGuests),
        contactInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        notes: formData.notes,
      });

      setBooking(bookingResponse.data.booking);

      // Create payment intent
      const paymentIntentResponse = await paymentService.createPaymentIntent({
        bookingId: bookingResponse.data.booking._id,
        amount: pricing.totalPrice,
      });

      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating booking');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      setLoading(true);

      const cardElement = elements.getElement(CardElement);

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        booking.paymentIntentId,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment in backend
        const response = await paymentService.confirmPayment({
          paymentIntentId: paymentIntent.id,
          bookingId: booking._id,
        });

        toast.success('Booking confirmed! Check your email for details.');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!property) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <motion.div
                  animate={{
                    backgroundColor: s <= step ? '#0088ff' : '#e0e0e0',
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                >
                  {s}
                </motion.div>
                {s < 3 && <div className="w-20 h-1 mx-2 bg-gray-300" />}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            <span className={step >= 1 ? 'text-blue-600 font-semibold' : ''}>Dates & Guests</span>
            <span className={step >= 2 ? 'text-blue-600 font-semibold' : ''}>Contact Info</span>
            <span className={step >= 3 ? 'text-blue-600 font-semibold' : ''}>Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              {/* Step 1: Dates and Guests */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Select Your Dates</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Check-in Date</label>
                      <input
                        type="date"
                        name="checkInDate"
                        value={formData.checkInDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Check-out Date</label>
                      <input
                        type="date"
                        name="checkOutDate"
                        value={formData.checkOutDate}
                        onChange={handleInputChange}
                        min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Number of Guests</label>
                      <select
                        name="numberOfGuests"
                        value={formData.numberOfGuests}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Array.from({ length: property.guests }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={checkAvailability}
                      disabled={loading}
                      className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
                    >
                      {loading ? 'Checking...' : 'Check Availability'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Special Requests (Optional)</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Any special requests or requirements..."
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
                      >
                        Back
                      </button>
                      <button
                        onClick={createBookingAndPayment}
                        disabled={loading}
                        className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Continue to Payment'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && booking && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
                  <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Card Information</label>
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#424770',
                              '::placeholder': {
                                color: '#aab7c4',
                              },
                            },
                            invalid: {
                              color: '#9e2146',
                            },
                          },
                        }}
                        className="border rounded-lg p-3"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!stripe || loading}
                      className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50"
                    >
                      {loading ? 'Processing Payment...' : `Pay $${pricing.totalPrice.toFixed(2)}`}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <motion.div className="bg-white rounded-lg shadow-lg p-6 sticky top-24 h-fit">
              <h3 className="text-xl font-bold mb-4">{property.title}</h3>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold">{property.location.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-semibold capitalize">{property.propertyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-semibold">★ {property.rating}</span>
                </div>
              </div>

              {pricing && (
                <div className="space-y-3">
                  <h4 className="font-bold text-lg mb-4">Pricing Summary</h4>
                  <div className="flex justify-between text-sm">
                    <span>Base Price x {pricing.numberOfNights} nights</span>
                    <span>${pricing.basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cleaning Fee</span>
                    <span>${pricing.cleaningFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service Fee</span>
                    <span>${pricing.serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">${pricing.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Booking() {
  return (
    <Elements stripe={stripePromise}>
      <BookingForm />
    </Elements>
  );
}