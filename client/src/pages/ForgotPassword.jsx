import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // FIXED URL: Changed '/api/users' to '/user' to match your Login setup
            await axios.post('https://arivohomes.onrender.com/user/forgot-password', { email });
            setMessage("Email Sent! Check your inbox.");
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Try again.");
            setMessage('');
        }
        setLoading(false);
    };

    return (
        <div style={{maxWidth:'400px', margin:'50px auto', padding:'30px', background:'white', borderRadius:'10px', boxShadow:'0 4px 10px rgba(0,0,0,0.1)'}}>
            <h2 style={{textAlign:'center', marginBottom:'20px'}}>Forgot Password</h2>
            {message && <div style={{color:'green', marginBottom:'10px', textAlign:'center', fontWeight:'bold'}}>{message}</div>}
            {error && <div style={{color:'red', marginBottom:'10px', textAlign:'center'}}>{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom:'15px'}}>
                    <label>Enter your email</label>
                    <input 
                        type="email" 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        style={{width:'100%', padding:'10px', marginTop:'5px', borderRadius:'5px', border:'1px solid #ddd'}}
                        placeholder="e.g. user@gmail.com"
                    />
                </div>
                <button type="submit" disabled={loading} style={{width:'100%', padding:'12px', background: loading ? '#ccc' : '#2563eb', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', fontWeight:'bold'}}>
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
            </form>
            <div style={{marginTop:'15px', textAlign:'center'}}>
                <Link to="/login" style={{color:'#2563eb', textDecoration:'none'}}>Back to Login</Link>
            </div>
        </div>
    );
};

export default ForgotPassword;