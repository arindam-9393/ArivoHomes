import { Link } from 'react-router-dom';
// If you didn't install react-icons, remove these imports and the <Fa...> components below
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer style={{ background: '#0f172a', color: '#cbd5e1', paddingTop: '60px', marginTop: 'auto' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', paddingBottom: '40px' }}>
                
                {/* COLUMN 1: BRAND & ADDRESS */}
                <div>
                    <h2 style={{ color: 'white', marginBottom: '20px', fontSize: '1.8rem' }}>🏢 ArivoHomes</h2>
                    <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
                        <strong style={{ color: 'white' }}>Corporate Office:</strong><br />
                        No. 1190, Tech Park, Sector 62,<br />
                        Noida, Uttar Pradesh,<br />
                        India - 201301
                    </p>
                    <div style={{ marginTop: '20px' }}>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <FaPhoneAlt /> +91 88845 18010
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
                        <li style={{ marginBottom: '10px' }}><Link to="/about" className="footer-link">About Us</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link to="/careers" className="footer-link">Careers</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link to="/blog" className="footer-link">Blog</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link to="/contact" className="footer-link">Contact Us</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link to="/add-property" className="footer-link">List Your Property</Link></li>
                    </ul>
                </div>

                {/* COLUMN 3: LEGAL & SUPPORT */}
                <div>
                    <h3 style={{ color: 'white', marginBottom: '20px' }}>Support</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '10px' }}><Link to="/help" className="footer-link">FAQs</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link to="/terms" className="footer-link">Terms & Conditions</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link to="/sitemap" className="footer-link">Sitemap</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link to="/safety" className="footer-link">Safety Guide</Link></li>
                    </ul>
                </div>

                {/* COLUMN 4: SOCIAL & APP */}
                <div>
                    <h3 style={{ color: 'white', marginBottom: '20px' }}>Stay in Touch</h3>
                    <p style={{ marginBottom: '20px' }}>Follow us on social media for exclusive offers and updates.</p>
                    
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                        <a href="#" className="social-icon"><FaFacebookF /></a>
                        <a href="#" className="social-icon"><FaTwitter /></a>
                        <a href="#" className="social-icon"><FaInstagram /></a>
                        <a href="#" className="social-icon"><FaLinkedinIn /></a>
                    </div>

                    <h4 style={{ color: 'white', marginBottom: '10px' }}>Download App</h4>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {/* Placeholders for App Store buttons */}
                        <div style={{ background: '#334155', padding: '10px', borderRadius: '5px', fontSize: '0.8rem', cursor: 'pointer', textAlign:'center', flex:1 }}>
                            🍏 App Store
                        </div>
                        <div style={{ background: '#334155', padding: '10px', borderRadius: '5px', fontSize: '0.8rem', cursor: 'pointer', textAlign:'center', flex:1 }}>
                            🤖 Google Play
                        </div>
                    </div>
                </div>
            </div>

            {/* COPYRIGHT BAR */}
            <div style={{ background: '#020617', padding: '20px 0', borderTop: '1px solid #1e293b' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.9rem' }}>
                    <p>&copy; {new Date().getFullYear()} ArivoHomes Technologies Pvt Ltd.</p>
                    <p>Made with ❤️ in India</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;