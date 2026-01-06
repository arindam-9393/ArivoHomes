import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// 1. IMPORT THE LOGO HERE
import logo from '../assets/logo.png'; 

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsMobileMenuOpen(false);
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
                    background: #0f172a; 
                    border-bottom: 1px solid #1e293b;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }

                .nav-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 8px 24px; /* Reduced vertical padding slightly so navbar isn't huge */
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                /* --- UPDATED LOGO CSS START --- */
                .nav-logo {
                    display: flex;
                    align-items: center;
                    text-decoration: none;
                    z-index: 1002;
                }

                .logo-image {
                    height: 90px; /* INCREASED SIZE SIGNIFICANTLY */
                    width: auto;
                    object-fit: contain;
                    
                    /* This turns the black logo white */
                    filter: brightness(0) invert(1);
                    
                    transition: transform 0.2s ease;
                }
                
                .logo-image:hover {
                    transform: scale(1.05);
                }
                /* --- UPDATED LOGO CSS END --- */

                .nav-links {
                    display: flex;
                    align-items: center;
                    gap: 32px;
                }

                .nav-link {
                    position: relative;
                    font-size: 0.95rem;
                    font-weight: 500;
                    color: #cbd5e1;
                    text-decoration: none;
                    padding: 6px 0;
                    transition: color 0.2s ease;
                }

                .nav-link::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: -4px;
                    width: 0%;
                    height: 2px;
                    background: #38bdf8;
                    transition: width 0.25s ease;
                    border-radius: 2px;
                }

                .nav-link:hover { color: #ffffff; }
                .nav-link:hover::after { width: 100%; }

                .nav-link.active { color: #ffffff; font-weight: 600; }
                .nav-link.active::after { width: 100%; }

                .btn-outline {
                    padding: 8px 20px;
                    border-radius: 8px;
                    border: 1px solid #475569;
                    background: transparent;
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: #e2e8f0;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .btn-outline:hover { 
                    border-color: #cbd5e1; 
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                .btn-danger {
                    padding: 8px 20px;
                    border-radius: 8px;
                    border: 1px solid #7f1d1d;
                    background: #450a0a;
                    color: #fca5a5;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .btn-danger:hover { 
                    background: #7f1d1d; 
                    color: white; 
                }

                .divider {
                    width: 1px;
                    height: 24px;
                    background: #334155;
                }

                .hamburger {
                    display: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #ffffff;
                    z-index: 1002;
                    padding: 5px;
                }

                .mobile-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                    z-index: 2000;
                    opacity: 0;
                    animation: fadeIn 0.3s forwards;
                }

                .side-drawer {
                    position: fixed;
                    top: 0;
                    right: 0;
                    width: 75%;
                    max-width: 300px;
                    height: 100vh;
                    background: rgba(15, 23, 42, 0.95);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    box-shadow: -10px 0 30px rgba(0,0,0,0.5);
                    border-left: 1px solid rgba(255,255,255,0.1);
                    z-index: 2001;
                    padding: 80px 24px 24px 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    transform: translateX(100%);
                    animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                .close-btn {
                    position: absolute;
                    top: 24px;
                    right: 24px;
                    font-size: 1.5rem;
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 5px;
                    transition: 0.2s;
                }
                .close-btn:hover { color: white; }

                .side-drawer .nav-link {
                    font-size: 1.1rem;
                    padding: 12px 0;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    width: 100%;
                    display: block;
                    color: #cbd5e1;
                }
                .side-drawer .nav-link:hover { color: white; padding-left: 10px; }

                .side-drawer .btn-outline,
                .side-drawer .btn-danger {
                    width: 100%;
                    padding: 14px;
                    text-align: center;
                    margin-top: 10px;
                }
                
                .side-drawer .divider { display: none; }

                @media (max-width: 900px) {
                    .nav-links { display: none; }
                    .hamburger { display: block; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>

            <nav className="navbar">
                <div className="nav-container">
                    
                    <Link to="/" className="nav-logo" onClick={closeMenu}>
                        <img src={logo} alt="ArivoHomes Logo" className="logo-image" />
                    </Link>

                    <div className="hamburger" onClick={() => setIsMobileMenuOpen(true)}>
                        ☰
                    </div>

                    <div className="nav-links">
                        <NavItems 
                            isActive={isActive} 
                            user={user} 
                            handleListProperty={handleListProperty} 
                            handleLogout={handleLogout} 
                        />
                    </div>
                </div>
            </nav>

            {isMobileMenuOpen && (
                <>
                    <div className="mobile-overlay" onClick={closeMenu} />
                    <div className="side-drawer">
                        <button className="close-btn" onClick={closeMenu}>✕</button>
                        
                        <NavItems 
                            isActive={isActive} 
                            user={user} 
                            handleListProperty={handleListProperty} 
                            handleLogout={handleLogout}
                            isMobile={true} 
                            closeMenu={closeMenu}
                        />
                    </div>
                </>
            )}
        </>
    );
};

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
                    {!isMobile && <div className="divider" />}

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