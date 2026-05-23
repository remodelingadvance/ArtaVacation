import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import GlobalLoader from './components/common/GlobalLoader';
import Home from './pages/Home';
import Explore from './pages/Explore';
import PropertyDetails from './pages/PropertyDetails';
import Booking from './pages/Booking';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  useEffect(() => {
    // Apply theme
    applyTheme();
  }, []);

  const applyTheme = () => {
    const theme = localStorage.getItem('theme') || 'Miami Summer';
    // Apply theme CSS variables
  };

  return (
    <Provider store={store}>
      <Router>
        <GlobalLoader />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <Footer />
        <Toaster position="top-right" />
      </Router>
    </Provider>
  );
}

export default App;
