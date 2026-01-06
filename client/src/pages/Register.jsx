import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../axiosConfig';
import OAuth from '../components/OAuth';

const Register = () => {
    // --- STATE ---
    const [step, setStep] = useState(1);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '', 
    });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // --- HANDLERS ---
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNextStep = () => {
        if (!formData.role) {
            alert("Please select if you are a Tenant or Owner first.");
            return;
        }
        setStep(2); 
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post('/user/register', formData);
            alert(res.data.message); 
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
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
                    animation: popIn 0.5s ease;
                }
                .auth-card h1 { text-align: center; color: #ffffff; margin-bottom: 0.4rem; letter-spacing: 0.5px; }
                .subtitle { text-align: center; color: #94a3b8; font-size: 0.9rem; margin-bottom: 1.8rem; }
                
                .big-role-container { display: flex; flex-direction: column; gap: 15px; margin-bottom: 2rem; }
                .big-role-option {
                    display: flex; align-items: center; gap: 15px;
                    padding: 20px; border-radius: 16px; 
                    border: 1px solid rgba(255,255,255,0.15);
                    background: rgba(255,255,255,0.05);
                    cursor: pointer; transition: all 0.2s ease;
                }
                .big-role-option:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
                .big-role-option.active {
                    background: rgba(56, 189, 248, 0.15);
                    border-color: #38bdf8;
                    box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);
                }
                .big-role-icon { font-size: 2rem; }
                .big-role-text h3 { margin: 0; color: white; font-size: 1.1rem; }
                .big-role-text p { margin: 2px 0 0; color: #94a3b8; font-size: 0.85rem; }

                .role-box {
                    border: 1px solid rgba(255,255,255,0.18); border-radius: 16px; padding: 16px;
                    margin-bottom: 1.8rem; background: rgba(255,255,255,0.06);
                }
                .role-title { font-size: 0.8rem; font-weight: 600; color: #cbd5f5; margin-bottom: 12px; }
                .role-options { display: flex; gap: 12px; }
                .role-option {
                    flex: 1; padding: 14px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.15);
                    background: rgba(255,255,255,0.08); cursor: pointer; transition: all 0.25s ease;
                }
                .role-option h4 { margin: 0; font-size: 0.95rem; color: #ffffff; }
                .role-option.active {
                    border-color: #38bdf8; background: rgba(56, 189, 248, 0.15);
                }

                .input-group { margin-bottom: 1.2rem; }
                .input-group input {
                    width: 100%; padding: 15px 16px; border-radius: 14px; border: none; outline: none;
                    font-size: 0.95rem; background: rgba(255, 255, 255, 0.92); transition: all 0.3s ease;
                }
                .input-group input:focus { transform: scale(1.02); box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.45); }

                /* PRIMARY BUTTON (Create Account) */
                .primary-btn {
                    width: 100%; margin-top: 1rem; padding: 15px; border-radius: 16px; border: none;
                    background: linear-gradient(135deg, #38bdf8, #2563eb); color: white;
                    font-size: 1rem; font-weight: 700; cursor: pointer; letter-spacing: 0.5px;
                    transition: all 0.35s ease; box-shadow: 0 12px 30px rgba(37, 99, 235, 0.5);
                }
                .primary-btn:hover { transform: translateY(-3px) scale(1.01); box-shadow: 0 18px 45px rgba(56, 189, 248, 0.7); }
                .primary-btn:disabled { background: #64748b; cursor: not-allowed; transform: none; box-shadow: none; }

                /* OR DIVIDER */
                .divider { text-align: center; color: #94a3b8; font-size: 0.85rem; margin: 1.2rem 0; position: relative; }
                .divider::before, .divider::after {
                    content: ""; position: absolute; top: 50%; width: 40%; height: 1px; background: rgba(255,255,255,0.1);
                }
                .divider::before { left: 0; }
                .divider::after { right: 0; }

                .back-btn {
                    background: none; border: none; color: #94a3b8; cursor: pointer; 
                    font-size: 0.9rem; margin-bottom: 15px; display: flex; align-items: center; gap: 5px;
                }
                .back-btn:hover { color: white; }

                .footer-text { text-align: center; margin-top: 1.6rem; font-size: 0.9rem; color: #cbd5f5; }
                .footer-text a { color: #38bdf8; font-weight: 600; text-decoration: none; }
                .footer-text a:hover { text-decoration: underline; }
                
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>

            <div className="auth-container">
                <div className="auth-card">
                    
                    {/* --- STEP 1: ROLE SELECTION --- */}
                    {step === 1 && (
                        <>
                            {/* UPDATED TITLE HERE */}
                            <h1>Welcome to Arivo Homes</h1>
                            <p className="subtitle">First, tell us who you are</p>

                            <div className="big-role-container">
                                <div 
                                    className={`big-role-option ${formData.role === 'tenant' ? 'active' : ''}`} 
                                    onClick={() => setFormData({ ...formData, role: 'tenant' })}
                                >
                                    <span className="big-role-icon">🏠</span>
                                    <div className="big-role-text">
                                        <h3>I am a Tenant</h3>
                                        <p>I am looking for a room or flat to rent.</p>
                                    </div>
                                </div>

                                <div 
                                    className={`big-role-option ${formData.role === 'owner' ? 'active' : ''}`} 
                                    onClick={() => setFormData({ ...formData, role: 'owner' })}
                                >
                                    <span className="big-role-icon">🔑</span>
                                    <div className="big-role-text">
                                        <h3>I am an Owner</h3>
                                        <p>I want to list my property for rent.</p>
                                    </div>
                                </div>
                            </div>

                            <button className="primary-btn" onClick={handleNextStep}>
                                {formData.role ? `Continue as ${formData.role === 'owner' ? 'Owner' : 'Tenant'} →` : 'Continue →'}
                            </button>
                        </>
                    )}

                    {/* --- STEP 2: REGISTRATION FORM --- */}
                    {step === 2 && (
                        <>
                            <button className="back-btn" onClick={() => setStep(1)}>&larr; Back to Role</button>
                            <h1>Create Account</h1>
                            <p className="subtitle">Complete your details</p>

                            <div className="role-box">
                                <div className="role-title">Selected Role</div>
                                <div className="role-options">
                                    <div className={`role-option ${formData.role === 'tenant' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, role: 'tenant' })}>
                                        <h4>Tenant</h4>
                                    </div>
                                    <div className={`role-option ${formData.role === 'owner' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, role: 'owner' })}>
                                        <h4>Owner</h4>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={onSubmit}>
                                <div className="input-group">
                                    <input type="text" name="name" placeholder="Full Name" onChange={onChange} required autoFocus />
                                </div>
                                <div className="input-group">
                                    <input type="email" name="email" placeholder="Email Address" onChange={onChange} required />
                                </div>
                                <div className="input-group">
                                    <input type="password" name="password" placeholder="Password" onChange={onChange} required />
                                </div>

                                {/* --- BUTTONS REORDERED HERE --- */}
                                
                                {/* 1. Create Account Button */}
                                <button className="primary-btn" disabled={loading}>
                                    {loading ? "Creating Account... ⏳" : "Create Account"}
                                </button>

                                {/* Divider */}
                                <div className="divider">OR</div>

                                {/* 2. Google Button */}
                                <OAuth role={formData.role} />
                                
                            </form>
                        </>
                    )}

                    <p className="footer-text">Already have an account? <Link to="/login"> Login</Link></p>
                </div>
            </div>
        </>
    );
};

export default Register;