import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Main Pages
import Home from './pages/Home';
import AllProperties from './pages/AllProperties';
import PropertyDetails from './pages/PropertyDetails';

// Auth & User Pages
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyOtp from './pages/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Dashboard & Profile
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

// Owner Pages
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';

// Legal & Support Pages (NEW – Professional)
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import AboutUs from './pages/AboutUs';
import FAQs from './pages/FAQs';
import SafetyGuide from './pages/SafetyGuide';
import ContactUs from './pages/ContactUs';

// Styles
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />

        <div style={{ flex: 1 }}>
          <Routes>

            {/* ---------- PUBLIC ROUTES ---------- */}
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<AllProperties />} />
            <Route path="/property/:id" element={<PropertyDetails />} />

            {/* ---------- AUTH ROUTES ---------- */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* ---------- USER ROUTES ---------- */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />

            {/* ---------- OWNER ROUTES ---------- */}
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/edit-property/:id" element={<EditProperty />} />

            {/* ---------- COMPANY & SUPPORT ROUTES ---------- */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/safety-guide" element={<SafetyGuide />} />

          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
