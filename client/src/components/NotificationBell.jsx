import { useState, useEffect } from 'react';
import API from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const navigate = useNavigate();

    // 1. Handle Window Resize for Mobile Responsiveness
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 2. Fetch Notifications
    const fetchNotifications = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) return;
            
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await API.get('/notifications', config);
            setNotifications(data);
        } catch (error) {
            console.error("Notif Error:", error);
        }
    };

    // Polling logic
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 15000); // Check every 15s
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // 3. Toggle Dropdown & Mark Read
    const toggleDropdown = async () => {
        const nextState = !showDropdown;
        setShowDropdown(nextState);
        
        if (nextState && unreadCount > 0) {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await API.put('/notifications/read', {}, config);
                // Optimistic update
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            } catch (error) { console.error(error); }
        }
    };

    const handleNotificationClick = (notif) => {
        setShowDropdown(false);
        navigate('/dashboard'); 
    };

    // --- RESPONSIVE STYLES ---
    const isMobile = windowWidth < 600;

    const dropdownStyle = {
        position: isMobile ? 'fixed' : 'absolute',
        top: isMobile ? '70px' : '45px',
        right: isMobile ? '15px' : '-10px',
        left: isMobile ? '15px' : 'auto',
        width: isMobile ? 'auto' : '350px',
        maxHeight: '480px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2), 0 8px 10px -6px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0',
        zIndex: 10000,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            
            {/* BELL ICON */}
            <div 
                onClick={toggleDropdown} 
                style={{ 
                    position: 'relative', 
                    fontSize: '1.4rem', 
                    cursor: 'pointer',
                    padding: '5px',
                    transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                🔔
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute', top: '2px', right: '2px',
                        background: '#ef4444', color: 'white',
                        fontSize: '0.65rem', fontWeight: 'bold',
                        minWidth: '18px', height: '18px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </div>

            {/* DROPDOWN MENU */}
            {showDropdown && (
                <>
                    {/* Backdrop for mobile to close when clicking outside */}
                    {isMobile && <div 
                        onClick={() => setShowDropdown(false)} 
                        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.1)', zIndex: 9999 }} 
                    />}
                    
                    <div style={dropdownStyle}>
                        {/* Header */}
                        <div style={{ 
                            padding: '15px', 
                            borderBottom: '1px solid #f1f5f9', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            background: '#fff'
                        }}>
                            <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1rem' }}>Notifications</h4>
                            {unreadCount > 0 && <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: '600' }}>{unreadCount} New</span>}
                        </div>

                        {/* List Container */}
                        <div style={{ overflowY: 'auto', flex: 1, background: '#fff' }}>
                            {notifications.length === 0 ? (
                                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                                    <p style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>📦</p>
                                    <p style={{ fontSize: '0.9rem' }}>No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map(notif => (
                                    <div 
                                        key={notif._id} 
                                        onClick={() => handleNotificationClick(notif)}
                                        style={{
                                            padding: '15px', 
                                            borderBottom: '1px solid #f8fafc',
                                            background: notif.isRead ? 'white' : '#f0f7ff',
                                            cursor: 'pointer', 
                                            transition: 'background 0.2s',
                                            display: 'flex',
                                            gap: '12px',
                                            alignItems: 'flex-start'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = notif.isRead ? 'white' : '#f0f7ff'}
                                    >
                                        {/* Blue Dot for Unread */}
                                        {!notif.isRead && <div style={{ minWidth: '8px', height: '8px', background: '#2563eb', borderRadius: '50%', marginTop: '6px' }} />}
                                        
                                        <div style={{ flex: 1 }}>
                                            <div style={{ 
                                                fontSize: '0.88rem', 
                                                color: '#334155', 
                                                fontWeight: notif.isRead ? '400' : '600',
                                                lineHeight: '1.4'
                                            }}>
                                                {notif.message}
                                            </div>
                                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>
                                                {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div 
                            onClick={() => { setShowDropdown(false); navigate('/dashboard'); }}
                            style={{ 
                                padding: '12px', 
                                textAlign: 'center', 
                                borderTop: '1px solid #f1f5f9', 
                                fontSize: '0.85rem', 
                                color: '#2563eb', 
                                fontWeight: '700', 
                                cursor: 'pointer',
                                background: '#f8fafc'
                            }}
                        >
                            View Dashboard
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;