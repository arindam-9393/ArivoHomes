import { useState, useEffect } from 'react';
import API from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    
    // 1. Fetch Notifications
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

    // Poll every 10 seconds
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    // 2. Handle Bell Click (Toggle Dropdown)
    const toggleDropdown = async () => {
        setShowDropdown(!showDropdown);
        
        // Mark all as read when opening
        if (!showDropdown && unreadCount > 0) {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await API.put('/notifications/read', {}, config);
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            } catch (error) { console.error(error); }
        }
    };

    // 3. Handle Notification Click (Navigate to Dashboard)
    const handleNotificationClick = (notif) => {
        setShowDropdown(false); // Close dropdown
        navigate('/dashboard'); // <--- GO TO DASHBOARD
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div style={{ position: 'relative', marginRight: '15px' }}>
            
            {/* BELL ICON */}
            <div onClick={toggleDropdown} style={{ position: 'relative', fontSize: '1.5rem', cursor: 'pointer' }}>
                🔔
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute', top: -5, right: -5,
                        background: '#ef4444', color: 'white',
                        fontSize: '0.7rem', fontWeight: 'bold',
                        width: '18px', height: '18px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {unreadCount}
                    </span>
                )}
            </div>

            {/* DROPDOWN */}
            {showDropdown && (
                <div style={{
                    position: 'absolute', top: '40px', right: '-60px', // Adjusted to not go off screen on mobile
                    width: '300px', maxHeight: '400px', overflowY: 'auto',
                    background: 'white', border: '1px solid #e2e8f0',
                    borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 2000
                }}>
                    <div style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', fontWeight: 'bold', color: '#334155', background: '#f8fafc' }}>
                        Notifications
                    </div>
                    
                    {notifications.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No new notifications</div>
                    ) : (
                        notifications.map(notif => (
                            <div 
                                key={notif._id} 
                                onClick={() => handleNotificationClick(notif)} // <--- CLICKABLE
                                style={{
                                    padding: '12px', borderBottom: '1px solid #f1f5f9',
                                    background: notif.isRead ? 'white' : '#eff6ff', // Unread = Blueish tint
                                    cursor: 'pointer', transition: '0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                onMouseLeave={(e) => e.currentTarget.style.background = notif.isRead ? 'white' : '#eff6ff'}
                            >
                                <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: notif.isRead ? '400' : '600' }}>
                                    {notif.message}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                                    {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;