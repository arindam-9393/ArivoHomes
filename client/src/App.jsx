import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VerifyOtp from './pages/VerifyOtp';
import EditProfile from './pages/EditProfile';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Main Pages
import Home from './pages/Home';
import AllProperties from './pages/AllProperties';
import PropertyDetails from './pages/PropertyDetails';

// User & Auth Pages
import Register from './pages/Register';
import Login from './pages/Login';

// --- PASSWORD RESET PAGES ---
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// --- DASHBOARD IMPORT ---
import Dashboard from './pages/Dashboard/Dashboard'; // Pointing to the file inside the folder

import Profile from './pages/Profile'; 

// Owner Actions
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';

// Footer & Support Pages
import Contact from './pages/Contact';
import About from './pages/About';
import Privacy from './pages/Privacy';

// Styles
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop /> 
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        
        <div className="container" style={{ flex: 1 }}>
          <Routes>
            <Route path="/edit-profile" element={<EditProfile />} />
            {/* ... other routes ... */}
            <Route path="/verify-otp" element={<VerifyOtp />} />
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<AllProperties />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            
            {/* --- PASSWORD RESET ROUTES --- */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            
            {/* USER ROUTES */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} /> 
            
            {/* OWNER ROUTES */}
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/edit-property/:id" element={<EditProperty />} />
            
            {/* SUPPORT ROUTES */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Privacy />} />
            <Route path="/careers" element={<About />} />
            <Route path="/safety" element={<Privacy />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;