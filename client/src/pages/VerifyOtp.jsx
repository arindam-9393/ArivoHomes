import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get the email passed from the Register page
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/user/verify-otp', { email, otp });
            alert(res.data.message);
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || 'Verification failed');
        }
    };

    if(!email) return <div style={{textAlign:'center', marginTop:'50px'}}>Error: No email found. Please register again.</div>;

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', background: 'white', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Enter OTP</h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
                We sent a code to <strong>{email}</strong>
            </p>
            
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    maxLength="6"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{ 
                        width: '100%', padding: '15px', fontSize: '1.2rem', textAlign: 'center', 
                        letterSpacing: '5px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '20px'
                    }}
                    required
                />
                <button type="submit" style={{ width: '100%', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1rem', cursor: 'pointer' }}>
                    Verify Account
                </button>
            </form>
        </div>
    );
};

export default VerifyOtp;