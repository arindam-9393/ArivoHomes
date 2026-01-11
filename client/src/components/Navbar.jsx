import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import logo from '../assets/logo.png'; 

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    // --- FIX STARTS HERE ---
    useEffect(() => {
        const checkUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                // CRITICAL FIX: If no user found, explicitly clear the state
                setUser(null);
            }
        };

        // Run check immediately
        checkUser();

        // Optional: Listen for a custom event if you want truly instant updates 
        // without route changes (useful for modals)
        window.addEventListener('storage', checkUser);
        
        return () => {
            window.removeEventListener('storage', checkUser);
        };
    }, [location]); // Re-runs whenever URL changes (e.g. redirect after logout)
    // --- FIX ENDS HERE ---

    const handleListProperty = () => {
        if (user) {
            navigate('/add-property');
        } else {
            navigate('/login');
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <style>{`
                /* --- RESET & BASICS --- */
                * { box-sizing: border-box; font-family: 'Inter', system-ui, sans-serif; }
                
                /* --- TOP NAVBAR --- */
                .navbar { 
                    position: sticky; top: 0; z-index: 1000; 
                    background: #0f172a; 
                    border-bottom: 1px solid #1e293b; 
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); 
                    height: 80px; 
                }
                .nav-container { 
                    max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 100%;
                    display: flex; align-items: center; justify-content: space-between; 
                }

                .nav-logo { display: flex; align-items: center; text-decoration: none; height: 100%; }
                .logo-image { 
                    height: 70px; width: auto; object-fit: contain; 
                    filter: brightness(0) invert(1); transition: transform 0.2s;
                }
                .logo-image:hover { transform: scale(1.05); }

                /* --- DESKTOP MENU --- */
                .desktop-menu { display: flex; align-items: center; gap: 32px; }
                .nav-link { 
                    position: relative; font-size: 1rem; font-weight: 500; 
                    color: #cbd5e1; text-decoration: none; padding: 6px 0; 
                    transition: color 0.2s ease; 
                }
                .nav-link:hover, .nav-link.active { color: #ffffff; }
                .nav-link.active { font-weight: 600; }
                .nav-link.active::after { 
                    content: ''; position: absolute; left: 0; bottom: -4px; 
                    width: 100%; height: 2px; background: #38bdf8; border-radius: 2px; 
                }

                .btn-outline { 
                    padding: 10px 24px; border-radius: 50px; border: 1px solid #475569; 
                    background: transparent; color: #e2e8f0; cursor: pointer; font-weight: 600;
                    transition: all 0.2s ease; font-size: 0.9rem;
                }
                .btn-outline:hover { border-color: #38bdf8; color: #38bdf8; background: rgba(56, 189, 248, 0.1); }
                
                /* Profile Icon (Desktop) */
                .profile-icon-desktop {
                    width: 40px; height: 40px; border-radius: 50%;
                    background: linear-gradient(135deg, #38bdf8, #2563eb);
                    color: white; display: flex; align-items: center; justify-content: center;
                    font-weight: bold; cursor: pointer; border: 2px solid rgba(255,255,255,0.1);
                    transition: transform 0.2s;
                }
                .profile-icon-desktop:hover { transform: scale(1.1); border-color: #38bdf8; }

                /* --- MOBILE BOTTOM BAR --- */
                .bottom-nav {
                    display: none; 
                    position: fixed; bottom: 0; left: 0; width: 100%;
                    height: 70px;
                    background: #0f172a;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    z-index: 1000;
                    justify-content: space-around;
                    align-items: center;
                    padding-bottom: env(safe-area-inset-bottom);
                    box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
                }

                .bottom-tab {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    text-decoration: none; color: #64748b; font-size: 0.75rem; gap: 5px;
                    width: 100%; height: 100%; cursor: pointer;
                }
                .bottom-tab.active { color: #38bdf8; }
                .bottom-tab svg { width: 24px; height: 24px; stroke-width: 2px; }

                .fab-container { position: relative; top: -25px; cursor: pointer; }
                .fab {
                    width: 55px; height: 55px; border-radius: 50%;
                    background: linear-gradient(135deg, #38bdf8, #2563eb);
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
                    border: 5px solid #0f172a;
                    color: white; font-size: 1.8rem; font-weight: bold;
                    transition: transform 0.2s;
                }
                .fab:active { transform: scale(0.95); }

                @media (max-width: 768px) {
                    .desktop-menu { display: none; } 
                    .bottom-nav { display: flex; }    
                    .nav-container { padding: 0 15px; height: 60px; }
                    .logo-image { height: 45px; } 
                }
            `}</style>

            <nav className="navbar">
                <div className="nav-container">
                    <Link to="/" className="nav-logo">
                        <img src={logo} alt="ArivoHomes" className="logo-image" />
                    </Link>

                    {/* --- DESKTOP MENU --- */}
                    <div className="desktop-menu">
                        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
                        <Link to="/properties" className={`nav-link ${isActive('/properties') ? 'active' : ''}`}>Properties</Link>
                        
                        {/* List Property (Guests or Owners) */}
                        {(!user || user.role === 'owner') && (
                            <button onClick={handleListProperty} className="btn-outline">
                                List Property
                            </button>
                        )}

                        {user ? (
                            <>
                                {/* --- DASHBOARD LINK RESTORED HERE --- */}
                                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
                                
                                <NotificationBell />
                                
                                {/* Profile Icon -> Goes to /profile */}
                                <div onClick={() => navigate('/profile')} className="profile-icon-desktop" title="Profile">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={{width: '1px', height: '24px', background: '#334155'}}></div>
                                <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>Login</Link>
                                <Link to="/register" className={`nav-link ${isActive('/register') ? 'active' : ''}`}>Register</Link>
                            </>
                        )}
                    </div>

                    {/* MOBILE ONLY: Notification Bell */}
                    <div className="mobile-only" style={{ display: window.innerWidth <= 768 ? 'block' : 'none' }}>
                        {user && <NotificationBell />}
                    </div>
                </div>
            </nav>

            {/* --- BOTTOM APP BAR (MOBILE ONLY) --- */}
            <div className="bottom-nav">
                <Link to="/" className={`bottom-tab ${isActive('/') ? 'active' : ''}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    <span>Home</span>
                </Link>

                <Link to="/properties" className={`bottom-tab ${isActive('/properties') ? 'active' : ''}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <span>Search</span>
                </Link>

                {/* CENTER BUTTON (Hidden for Tenants) */}
                {(!user || user.role === 'owner') ? (
                    <div onClick={handleListProperty} className="fab-container">
                        <div className="fab">
                            {user ? '+' : '➜'} 
                        </div>
                    </div>
                ) : (
                    <Link to="/dashboard" className={`bottom-tab ${isActive('/dashboard') ? 'active' : ''}`}>
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                       <span>Dash</span>
                   </Link>
                )}

                {/* DASHBOARD TAB (Only if NOT in center slot) */}
                {(!user || user.role === 'owner') && user && (
                      <Link to="/dashboard" className={`bottom-tab ${isActive('/dashboard') ? 'active' : ''}`}>
                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                         <span>Dash</span>
                     </Link>
                )}
                
                {/* GUEST LOGIN TAB */}
                {!user && (
                    <Link to="/login" className={`bottom-tab ${isActive('/login') ? 'active' : ''}`}>
                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                        <span>Login</span>
                    </Link>
                )}

                {/* PROFILE TAB (Goes to /profile) */}
                {user ? (
                    <Link to="/profile" className={`bottom-tab ${isActive('/profile') ? 'active' : ''}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <span>Profile</span>
                    </Link>
                ) : (
                    <Link to="/register" className={`bottom-tab ${isActive('/register') ? 'active' : ''}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                        <span>Join</span>
                    </Link>
                )}
            </div>
        </>
    );
};

export default Navbar;