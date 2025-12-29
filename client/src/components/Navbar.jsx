import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
    
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsMobileMenuOpen(false); // Close menu on logout
        navigate('/login');
    };

    const handleListProperty = () => {
        setIsMobileMenuOpen(false);
        if (user) {
            navigate('/add-property');
        } else {
            navigate('/login');
        }
    };

    // Helper to close menu when a link is clicked
    const closeMenu = () => setIsMobileMenuOpen(false);

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <style>{`
                * {
                    box-sizing: border-box;
                    font-family: 'Inter', system-ui, sans-serif;
                }

                .navbar {
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    background: #ffffff;
                    border-bottom: 1px solid #e5e7eb;
                }

                .nav-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 16px 24px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .nav-logo {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #0f172a;
                    text-decoration: none;
                    letter-spacing: -0.02em;
                    z-index: 1001; /* Ensure logo stays above mobile menu */
                }

                /* --- DESKTOP LINKS --- */
                .nav-links {
                    display: flex;
                    align-items: center;
                    gap: 28px;
                }

                .nav-link {
                    position: relative;
                    font-size: 0.95rem;
                    font-weight: 500;
                    color: #475569;
                    text-decoration: none;
                    padding: 6px 0;
                    transition: color 0.25s ease;
                }

                .nav-link::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: -6px;
                    width: 0%;
                    height: 2px;
                    background: #2563eb;
                    transition: width 0.25s ease;
                }

                .nav-link:hover { color: #0f172a; }
                .nav-link:hover::after { width: 100%; }

                .nav-link.active { color: #0f172a; font-weight: 600; }
                .nav-link.active::after { width: 100%; }

                /* --- BUTTONS --- */
                .btn-outline {
                    padding: 8px 18px;
                    border-radius: 999px;
                    border: 1px solid #cbd5e1;
                    background: transparent;
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: #0f172a;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .btn-outline:hover { background: #f8fafc; }

                .btn-danger {
                    padding: 8px 18px;
                    border-radius: 999px;
                    border: 1px solid #fecaca;
                    background: #ffffff;
                    color: #b91c1c;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .btn-danger:hover { background: #fee2e2; }

                .divider {
                    width: 1px;
                    height: 20px;
                    background: #e5e7eb;
                }

                /* --- MOBILE HAMBURGER & DRAWER --- */
                .hamburger {
                    display: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #0f172a;
                    z-index: 1001;
                }

                /* HIDE DESKTOP LINKS ON MOBILE */
                @media (max-width: 900px) {
                    .nav-links { display: none; } /* Hide normal menu */
                    .hamburger { display: block; } /* Show hamburger */
                    
                    /* The Slide-Down Menu */
                    .mobile-menu {
                        position: absolute;
                        top: 100%; /* Right below navbar */
                        left: 0;
                        width: 100%;
                        background: white;
                        border-bottom: 1px solid #e5e7eb;
                        padding: 20px;
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                        animation: slideDown 0.3s ease-out;
                    }

                    .mobile-menu .nav-link {
                        font-size: 1.1rem;
                        padding: 10px 0;
                        border-bottom: 1px solid #f1f5f9;
                        width: 100%;
                    }
                    
                    .mobile-menu .divider { display: none; }
                    
                    .mobile-menu .btn-outline, 
                    .mobile-menu .btn-danger {
                        width: 100%;
                        text-align: center;
                        padding: 12px;
                    }
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <nav className="navbar">
                <div className="nav-container">
                    <Link to="/" className="nav-logo" onClick={closeMenu}>
                        ArivoHomes
                    </Link>

                    {/* 1. HAMBURGER ICON (Visible only on Mobile) */}
                    <div 
                        className="hamburger" 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? '✕' : '☰'}
                    </div>

                    {/* 2. DESKTOP MENU (Hidden on Mobile via CSS) */}
                    <div className="nav-links">
                        <NavItems 
                            isActive={isActive} 
                            user={user} 
                            handleListProperty={handleListProperty} 
                            handleLogout={handleLogout} 
                        />
                    </div>

                    {/* 3. MOBILE MENU DRAWER (Visible only when Open) */}
                    {isMobileMenuOpen && (
                        <div className="mobile-menu">
                            <NavItems 
                                isActive={isActive} 
                                user={user} 
                                handleListProperty={handleListProperty} 
                                handleLogout={handleLogout}
                                isMobile={true} 
                                closeMenu={closeMenu}
                            />
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
};

// --- REUSABLE COMPONENT FOR LINKS (Avoids duplicating code) ---
const NavItems = ({ isActive, user, handleListProperty, handleLogout, isMobile, closeMenu }) => {
    return (
        <>
            <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={closeMenu}
            >
                Home
            </Link>

            <Link 
                to="/properties" 
                className={`nav-link ${isActive('/properties') ? 'active' : ''}`}
                onClick={closeMenu}
            >
                Properties
            </Link>

            {(!user || user.role === 'owner') && (
                <button onClick={handleListProperty} className="btn-outline">
                    List Property
                </button>
            )}

            {user ? (
                <>
                    <Link 
                        to="/dashboard" 
                        className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        Dashboard
                    </Link>

                    <Link 
                        to="/profile" 
                        className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        {user.name.split(' ')[0]}
                    </Link>

                    <button onClick={handleLogout} className="btn-danger">
                        Logout
                    </button>
                </>
            ) : (
                <>
                    {!isMobile && <div className="divider" />} {/* Hide divider on mobile */}

                    <Link 
                        to="/login" 
                        className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        Login
                    </Link>

                    <Link 
                        to="/register" 
                        className={`nav-link ${isActive('/register') ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        Register
                    </Link>
                </>
            )}
        </>
    );
};

export default Navbar;