import { useState, useEffect, useRef } from 'react';
import API from '../axiosConfig'; // Keep this for your Backend calls
import axios from 'axios';        // 👈 ADD THIS: Fresh axios for Cloudinary
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    // 1. Get current user from storage
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    // 2. Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        photo: ''
    });

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // 3. Load Data on Mount
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        setFormData({
            name: user.name || '',
            phone: user.phone || '',
            photo: user.photo || ''
        });
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 4. Handle Image Selection & Upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            // A. Get Signature from Backend (Keep using API here because we need auth)
            const { data: signData } = await API.get('/user/sign-upload', {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            // B. Prepare Cloudinary Payload
            const uploadData = new FormData();
            uploadData.append("file", file);
            uploadData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY); 
            uploadData.append("timestamp", signData.timestamp);
            uploadData.append("signature", signData.signature);
            uploadData.append("folder", "user_profiles");

            // C. Upload to Cloudinary
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dtrpcnpkm'; 
            
            // 🚨 THE FIX IS HERE: Use 'axios' instead of 'API' 👇
            // Standard axios doesn't send cookies by default, so Cloudinary will accept it.
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, 
                uploadData
            );

            // D. Update Local State (Preview)
            setFormData(prev => ({ ...prev, photo: res.data.secure_url }));

        } catch (error) {
            console.error("Upload error:", error);
            alert("Image upload failed. Check console for details.");
        } finally {
            setUploading(false);
        }
    };

    // 5. Save All Changes
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Keep using API here (We need to send cookies/token to YOUR backend)
            const { data: updatedUser } = await API.put(
                '/user/profile',
                {
                    name: formData.name,
                    phone: formData.phone,
                    photo: formData.photo
                },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            // Update Local Storage & Redirect
            localStorage.setItem('user', JSON.stringify(updatedUser));
            alert("Profile Updated Successfully!");
            navigate('/profile'); 

        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1e293b' }}>Edit Profile</h2>

            <form onSubmit={handleSubmit}>
                
                {/* --- PHOTO SECTION --- */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
                    <div 
                        style={{ 
                            width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', 
                            marginBottom: '15px', border: '4px solid #f1f5f9', position: 'relative',
                            background: '#eee'
                        }}
                    >
                        {formData.photo ? (
                             <img 
                             src={formData.photo} 
                             alt="Profile" 
                             style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        ) : (
                            <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', color:'#ccc'}}>
                                {formData.name?.charAt(0) || "U"}
                            </div>
                        )}
                        
                        {uploading && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>
                                Uploading...
                            </div>
                        )}
                    </div>
                    
                    <button 
                        type="button" 
                        onClick={() => fileInputRef.current.click()}
                        style={{ background: '#e2e8f0', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', color: '#475569', fontWeight: '600' }}
                    >
                        Change Photo
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        onChange={handleImageUpload}
                        accept="image/*"
                    />
                </div>

                {/* --- INPUTS --- */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Full Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                    />
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Phone Number</label>
                    <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        placeholder="+91 98765..."
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                    />
                </div>

                {/* --- BUTTONS --- */}
                <button 
                    type="submit" 
                    disabled={loading || uploading}
                    style={{ width: '100%', padding: '14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>

                <button 
                    type="button" 
                    onClick={() => navigate('/profile')}
                    style={{ width: '100%', marginTop: '15px', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                >
                    Cancel
                </button>

            </form>
        </div>
    );
};

export default EditProfile;