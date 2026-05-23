import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import GlobalLoader from './components/common/GlobalLoader';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import Condos from './pages/Condos';
import PropertyDetails from './pages/PropertyDetails';
import Booking from './pages/Booking';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <GlobalLoader />
          <Navbar />
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/condos" element={<Condos />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/booking/:id" element={<Booking />} />

            {/* Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* User Pages */}
            <Route path="/dashboard" element={<UserDashboard />} />

            {/* Info Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
          <Footer />
          <Toaster position="top-right" />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;