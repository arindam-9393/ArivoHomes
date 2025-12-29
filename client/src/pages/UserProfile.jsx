import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
    // 1. GET ID FROM URL (e.g., /profile/65a123...)
    const { id } = useParams(); 
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const [profile, setProfile] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!currentUser) { navigate('/login'); return; }

        const fetchProfile = async () => {
            try {
                // 2. CALL BACKEND WITH THAT ID
                const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
                const res = await axios.get(`http://localhost:3000/api/users/${id}`, config);
                
                setProfile(res.data.user);
                setHistory(res.data.history);
                setLoading(false);
            } catch (err) {
                console.error("Fetch Error:", err);
                setError('User not found or Server Error');
                setLoading(false);
            }
        };

        if (id) {
            fetchProfile();
        }
    }, [id, navigate]); // Depend on ID

    if (loading) return <h3 style={{textAlign:'center', marginTop:'50px'}}>Loading Profile...</h3>;
    
    if (error || !profile) return (
        <div style={{textAlign:'center', marginTop:'50px', color:'red'}}>
            <h3>{error || "User not found"}</h3>
            <p>ID Requested: {id}</p>
            <button onClick={() => navigate('/dashboard')}>Go Home</button>
        </div>
    );

    const showHistory = profile.role === 'tenant';

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 15px', border:'1px solid #ccc', background:'white', borderRadius:'6px' }}>&larr; Back</button>
            
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <div style={{ background: '#f8fafc', padding: '30px', textAlign: 'center', borderBottom:'1px solid #eee' }}>
                    <div style={{ width: '80px', height: '80px', background: '#3b82f6', color: 'white', borderRadius: '50%', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto' }}>
                        {profile.name.charAt(0)}
                    </div>
                    <h1 style={{ margin: 0 }}>{profile.name}</h1>
                    <p style={{ color: '#666' }}>{profile.role.toUpperCase()}</p>
                    <div>📞 {profile.phone || 'Hidden'}</div>
                </div>

                <div style={{ padding: '30px' }}>
                    <h3>{showHistory ? "Rental History" : "Private Information"}</h3>
                    
                    {showHistory ? (
                        history.length > 0 ? (
                            history.map(stay => (
                                <div key={stay._id} style={{ background: '#f9fafb', padding: '15px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #eee' }}>
                                    <strong>{stay.property?.title}</strong>
                                    <div>Status: {stay.status === 'Moved Out' ? '🔴 Past Stay' : '🟢 Current'}</div>
                                </div>
                            ))
                        ) : <p>No history found.</p>
                    ) : (
                        <p style={{fontStyle:'italic', color:'#999'}}>History is hidden for owners.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;