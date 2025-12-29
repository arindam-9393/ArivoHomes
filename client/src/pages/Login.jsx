import { useState } from 'react';
import OAuth from '../components/OAuth';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/user/login', formData);
            localStorage.setItem('user', JSON.stringify(response.data));
            alert('Login Successful!');
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <>
            <style>{`
                * { box-sizing: border-box; font-family: 'Inter', system-ui, sans-serif; }
                body { margin: 0; }
                .auth-container {
                    min-height: 100vh; display: flex; align-items: center; justify-content: center;
                    background: radial-gradient(circle at top, #1e3a8a, #020617);
                }
                .auth-card {
                    width: 100%; max-width: 420px; padding: 2.8rem; border-radius: 22px;
                    background: linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04));
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    box-shadow: 0 0 40px rgba(56, 189, 248, 0.25), inset 0 0 20px rgba(255, 255, 255, 0.05);
                    animation: popIn 0.7s ease;
                }
                .auth-card h1 { text-align: center; color: #fff; margin-bottom: 0.4rem; letter-spacing: 0.5px; }
                .subtitle { text-align: center; color: #94a3b8; font-size: 0.9rem; margin-bottom: 2rem; }
                .input-group { position: relative; margin-bottom: 1.2rem; }
                .input-group input {
                    width: 100%; padding: 15px 46px 15px 16px; border-radius: 14px; border: none; outline: none;
                    font-size: 0.95rem; background: rgba(255, 255, 255, 0.92); transition: all 0.3s ease;
                }
                .input-group input:focus { transform: scale(1.02); box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.45); }
                .toggle-password {
                    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
                    cursor: pointer; font-size: 0.85rem; color: #2563eb; font-weight: 700; user-select: none;
                }
                .primary-btn {
                    width: 100%; margin-top: 1rem; padding: 15px; border-radius: 16px; border: none;
                    background: linear-gradient(135deg, #38bdf8, #2563eb); color: white;
                    font-size: 1rem; font-weight: 700; cursor: pointer; letter-spacing: 0.5px;
                    transition: all 0.35s ease; box-shadow: 0 12px 30px rgba(37, 99, 235, 0.5);
                }
                .primary-btn:hover { transform: translateY(-3px) scale(1.01); box-shadow: 0 18px 45px rgba(56, 189, 248, 0.7); }
                .footer-text { text-align: center; margin-top: 1.6rem; font-size: 0.9rem; color: #cbd5f5; }
                .footer-text a, .forgot-link { color: #38bdf8; font-weight: 600; text-decoration: none; }
                .footer-text a:hover, .forgot-link:hover { text-decoration: underline; }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.9) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>

            <div className="auth-container">
                <div className="auth-card">
                    <h1>Welcome Back</h1>
                    <p className="subtitle">Login to continue 🚀</p>

                    <form onSubmit={onSubmit}>
                        <div className="input-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                onChange={onChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                onChange={onChange}
                                required
                            />
                            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? 'Hide' : 'Show'}
                            </span>
                        </div>

                        {/* --- FORGOT PASSWORD LINK --- */}
                        <div style={{ textAlign: 'right', marginBottom: '15px' }}>
                            <Link to="/forgot-password" className="forgot-link" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                                Forgot Password?
                            </Link>
                        </div>

                        <OAuth />

                        <button className="primary-btn">Login</button>
                    </form>

                    <p className="footer-text">
                        Don’t have an account?
                        <Link to="/register"> Sign up</Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;