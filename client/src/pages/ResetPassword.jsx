import { useState } from 'react';
import API from '../axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const { token } = useParams(); 
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            // FIXED URL: Changed '/api/users' to '/user'
            await API.put(`/user/reset-password/${token}`, { password });
            setMessage("Password Reset Successful! Redirecting...");
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Link expired or invalid.");
        }
    };

    return (
        <div style={{maxWidth:'400px', margin:'50px auto', padding:'30px', background:'white', borderRadius:'10px', boxShadow:'0 4px 10px rgba(0,0,0,0.1)'}}>
            <h2 style={{textAlign:'center', marginBottom:'20px'}}>Reset Password</h2>
            {message && <div style={{color:'green', marginBottom:'10px', textAlign:'center'}}>{message}</div>}
            {error && <div style={{color:'red', marginBottom:'10px', textAlign:'center'}}>{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom:'15px'}}>
                    <label>New Password</label>
                    <input 
                        type="password" 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        style={{width:'100%', padding:'10px', marginTop:'5px', borderRadius:'5px', border:'1px solid #ddd'}}
                    />
                </div>
                <div style={{marginBottom:'15px'}}>
                    <label>Confirm Password</label>
                    <input 
                        type="password" 
                        required 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        style={{width:'100%', padding:'10px', marginTop:'5px', borderRadius:'5px', border:'1px solid #ddd'}}
                    />
                </div>
                <button type="submit" style={{width:'100%', padding:'12px', background:'#2563eb', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', fontWeight:'bold'}}>Update Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;