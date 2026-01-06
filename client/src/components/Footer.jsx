import { Link, useNavigate } from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope
} from 'react-icons/fa';

const Footer = () => {
  const navigate = useNavigate();

  // --- HANDLER: Check if user is owner before listing ---
  const handleListPropertyClick = (e) => {
    e.preventDefault(); // Stop default link behavior
    
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      alert("Please login as an Owner to list a property.");
      navigate('/login');
    } else if (user.role !== 'owner') {
      alert("Only Owners can list properties. Please login with an Owner account.");
      navigate('/login');
    } else {
      navigate('/add-property');
    }
  };

  return (
    <footer style={{ background: '#0f172a', color: '#cbd5e1', paddingTop: '60px', marginTop: 'auto' }}>
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          paddingBottom: '40px'
        }}
      >

        {/* COLUMN 1: BRAND & ADDRESS */}
        <div>
          <h2 style={{ color: 'white', marginBottom: '20px', fontSize: '1.8rem' }}>
            🏢 ArivoHomes
          </h2>

          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
            <strong style={{ color: 'white' }}>Corporate Office:</strong><br />
            No. 94, Ramai Nagar, Nari Road,<br />
            Nagpur, Maharashtra,<br />
            India - 440026
          </p>

          <div style={{ marginTop: '20px' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <FaPhoneAlt /> +91 8208957682
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaEnvelope /> support@arivohomes.com
            </p>
          </div>
        </div>

        {/* COLUMN 2: COMPANY */}
        <div>
          <h3 style={{ color: 'white', marginBottom: '20px' }}>Company</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link to="/about" className="footer-link">About Us</Link></li>
            <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
            
            {/* UPDATED LINK WITH CLICK HANDLER */}
            <li>
                <a href="/add-property" onClick={handleListPropertyClick} className="footer-link" style={{cursor: 'pointer'}}>
                    List Your Property
                </a>
            </li>
            
            <li><Link to="/faqs" className="footer-link">FAQs</Link></li>
          </ul>
        </div>

        {/* COLUMN 3: LEGAL & SUPPORT */}
        <div>
          <h3 style={{ color: 'white', marginBottom: '20px' }}>Support</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions" className="footer-link">Terms & Conditions</Link></li>
            <li><Link to="/safety-guide" className="footer-link">Safety Guide</Link></li>
            <li><Link to="/contact" className="footer-link">Help & Support</Link></li>
          </ul>
        </div>

        {/* COLUMN 4: SOCIAL & APP */}
        <div>
          <h3 style={{ color: 'white', marginBottom: '20px' }}>Stay in Touch</h3>
          <p style={{ marginBottom: '20px' }}>
            Follow us on social media for exclusive offers and updates.
          </p>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
            <a href="#" className="social-icon"><FaFacebookF /></a>
            <a href="#" className="social-icon"><FaTwitter /></a>
            <a href="https://www.instagram.com/arivohomes/" className="social-icon"><FaInstagram /></a>
            <a href="https://www.linkedin.com/company/arivo-homes/about/?viewAsMember=true" className="social-icon"><FaLinkedinIn /></a>
          </div>

          <h4 style={{ color: 'white', marginBottom: '10px' }}>Download App</h4>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div
              style={{
                background: '#334155',
                padding: '10px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                textAlign: 'center',
                flex: 1,
                opacity: 0.6,
                cursor: 'not-allowed'
              }}
            >
              🍏 App Store (Coming Soon)
            </div>

            <div
              style={{
                background: '#334155',
                padding: '10px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                textAlign: 'center',
                flex: 1,
                opacity: 0.6,
                cursor: 'not-allowed'
              }}
            >
              🤖 Google Play (Coming Soon)
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT BAR */}
      <div style={{ background: '#020617', padding: '20px 0', borderTop: '1px solid #1e293b' }}>
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            fontSize: '0.9rem'
          }}
        >
          <p>© {new Date().getFullYear()} ArivoHomes.com</p>
          <p>Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;