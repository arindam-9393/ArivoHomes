import { useState } from 'react';
import API from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';

const AddProperty = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    // --- STATE MANAGEMENT ---
    const [formData, setFormData] = useState({
        title: '', location: '', price: '', category: 'Apartment',
        description: '', tenantPreference: 'All', parking: 'None', 
        amenities: [], furnishingStatus: 'Unfurnished', furnishingItems: [],
        mainImage: '', galleryImages: []
    });

    // --- NEW: TAG STATE ---
    const [tags, setTags] = useState([]); // Stores the actual tags
    const [tagInput, setTagInput] = useState(''); // Stores the current typing

    // --- FILE STATES ---
    const [mainFile, setMainFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]); 
    
    // --- UI STATES ---
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [customItem, setCustomItem] = useState(''); 

    // Constants
    const amenityOptions = ["Power Backup", "Lift", "Security", "Gym", "Swimming Pool", "Garden", "CCTV", "Club House"];
    const furnishingOptions = ["Lights", "Fans", "AC", "TV", "Bed", "Wardrobe", "Geyser", "Sofa", "Washing Machine", "Fridge", "Dining Table", "Modular Kitchen", "Chimney"];

    // --- HANDLERS ---
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // --- ✨ NEW TAG HANDLERS (THE CRAZY PART) ---
    const handleTagKeyDown = (e) => {
        // If user hits Enter or Comma
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = tagInput.trim().replace(',', ''); // Remove comma if typed
            
            if (val && !tags.includes(val)) {
                setTags([...tags, val]); // Add to array
                setTagInput(''); // Clear input
            }
        }
        // User Quality of Life: Backspace removes last tag if input is empty
        if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
            setTags(tags.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    // --- CHECKBOX & LIST HANDLERS ---
    const handleCheckbox = (e, field) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const list = prev[field] || [];
            if (checked) return { ...prev, [field]: [...list, value] };
            return { ...prev, [field]: list.filter(item => item !== value) };
        });
    };

    const addCustomItem = (e) => {
        e.preventDefault();
        if (customItem.trim()) {
            setFormData(prev => ({ ...prev, furnishingItems: [...prev.furnishingItems, customItem.trim()] }));
            setCustomItem('');
        }
    };

    const removeFurnishingItem = (item) => {
        setFormData(prev => ({ ...prev, furnishingItems: prev.furnishingItems.filter(i => i !== item) }));
    };

    const handleGalleryChange = (e) => {
        if (e.target.files && e.target.files.length > 0) setGalleryFiles(prev => [...prev, ...Array.from(e.target.files)]);
    };

    const removeGalleryImage = (index) => {
        setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    };

    // --- COMPRESSED UPLOAD LOGIC ---
    const storeImage = async (file) => {
        return new Promise(async (resolve, reject) => {
            try {
                const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
                const compressedFile = await imageCompression(file, options);
                
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data: signData } = await API.get('/property/upload-signature', config);

                const data = new FormData();
                data.append("file", compressedFile);
                data.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
                data.append("timestamp", signData.timestamp);
                data.append("signature", signData.signature);
                data.append("folder", "arivo_homes");

                const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dtrpcnpkm'}/image/upload`, { method: "POST", body: data });
                const uploadedImage = await res.json();
                resolve(uploadedImage.secure_url);
            } catch (error) { reject(error); }
        });
    };

    const handleImageUpload = async () => {
        if (!mainFile && galleryFiles.length === 0) { alert("Please select images first."); return; }
        try {
            setUploading(true);
            let mainUrl = formData.mainImage;
            if (mainFile) mainUrl = await storeImage(mainFile);

            const promises = galleryFiles.map(file => storeImage(file));
            const galleryUrls = await Promise.all(promises);

            setFormData(prev => ({ ...prev, mainImage: mainUrl, galleryImages: [...prev.galleryImages, ...galleryUrls] }));
            setUploading(false);
            setMainFile(null);
            setGalleryFiles([]);
            alert("Images uploaded successfully! ✅");
        } catch (err) {
            setUploading(false);
            alert("Upload failed. Try again.");
        }
    };

    // --- SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.mainImage) { alert("Please upload a Main Image first."); return; }

        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const payload = { 
                ...formData,
                price: Number(formData.price),
                tags: tags, // Sending the array directly
                furnishingItems: formData.furnishingStatus === 'Unfurnished' ? [] : formData.furnishingItems
            }; 
            
            await API.post('/property', payload, config);
            alert("Property Listed Successfully! 🎉");
            navigate('/dashboard');
        } catch (error) {
            alert("Failed to list property.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <style>{`
                .page-container { max-width: 900px; margin: 40px auto; padding: 0 20px; font-family: 'Inter', sans-serif; }
                .form-card { background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); padding: 40px; border: 1px solid #e2e8f0; }
                
                h2 { color: #1e293b; font-size: 1.8rem; font-weight: 800; margin-bottom: 30px; text-align: center; }
                
                .section-label { font-size: 0.95rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin: 30px 0 15px; padding-bottom: 10px; border-bottom: 2px solid #f1f5f9; }
                
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .form-group { margin-bottom: 15px; }
                .form-group label { display: block; font-size: 0.9rem; font-weight: 600; color: #334155; margin-bottom: 8px; }
                
                .input-field { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.95rem; transition: 0.2s; background: #fff; }
                .input-field:focus { border-color: #2563eb; outline: none; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
                
                /* --- TAGS INPUT STYLES --- */
                .tag-container { 
                    display: flex; flex-wrap: wrap; gap: 8px; 
                    padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; 
                    background: #fff; min-height: 48px; align-items: center; 
                    transition: 0.2s;
                }
                .tag-container:focus-within { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
                
                .tag-pill { 
                    background: #eff6ff; color: #1e40af; 
                    padding: 4px 10px; border-radius: 20px; 
                    font-size: 0.85rem; font-weight: 600; 
                    display: flex; align-items: center; gap: 6px; 
                    border: 1px solid #bfdbfe;
                    animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .tag-remove { cursor: pointer; display: flex; align-items: center; justify-content: center; width: 16px; height: 16px; background: #dbeafe; border-radius: 50%; font-size: 10px; color: #1e40af; transition: 0.2s; }
                .tag-remove:hover { background: #ef4444; color: white; }
                
                .tag-input { border: none; outline: none; flex: 1; font-size: 0.95rem; min-width: 120px; background: transparent; padding: 4px; }
                
                /* --- UPLOAD AREA --- */
                .upload-zone { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 25px; text-align: center; transition: 0.2s; }
                .upload-zone:hover { border-color: #2563eb; background: #eff6ff; }
                .upload-label { cursor: pointer; display: block; }
                .upload-icon { font-size: 2rem; color: #94a3b8; margin-bottom: 10px; }
                
                .checkbox-group { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
                .checkbox-card { display: flex; align-items: center; gap: 10px; background: #fff; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: 0.2s; font-size: 0.9rem; color: #475569; }
                .checkbox-card:hover { border-color: #2563eb; }
                .checkbox-card input:checked + span { color: #2563eb; font-weight: 600; }

                .action-btn { width: 100%; padding: 16px; border-radius: 10px; font-size: 1.1rem; font-weight: 700; color: white; border: none; cursor: pointer; transition: 0.2s; background: linear-gradient(135deg, #2563eb, #1e40af); box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3); }
                .action-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(37, 99, 235, 0.4); }
                .action-btn:disabled { background: #94a3b8; cursor: not-allowed; transform: none; box-shadow: none; }

                @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
            `}</style>

            <div className="form-card">
                <h2>List Your Property</h2>
                <form onSubmit={handleSubmit}>
                    
                    {/* SECTION 1: OVERVIEW */}
                    <div className="section-label">1. Property Overview</div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Property Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Luxury 2BHK Near Station" className="input-field"/>
                        </div>
                        <div className="form-group">
                            <label>Monthly Rent (₹)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="e.g. 15000" className="input-field"/>
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="City, Area, Landmark" className="input-field"/>
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                                <option value="Apartment">Apartment</option>
                                <option value="PG">PG / Hostel</option>
                                <option value="Independent House">Independent House</option>
                                <option value="Villa">Villa</option>
                                <option value="Studio">Studio</option>
                            </select>
                        </div>
                    </div>

                    {/* SECTION 2: DESCRIPTION & TAGS */}
                    <div className="section-label">2. Details & Features</div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" placeholder="Describe your property..." className="input-field"></textarea>
                    </div>

                    {/* ✨✨ THE NEW TAG INPUT ✨✨ */}
                    <div className="form-group">
                        <label>Highlights (Tags)</label>
                        <div className="tag-container" onClick={() => document.getElementById('tagInput').focus()}>
                            {tags.map((tag, index) => (
                                <span key={index} className="tag-pill">
                                    {tag}
                                    <span className="tag-remove" onClick={() => removeTag(tag)}>✕</span>
                                </span>
                            ))}
                            <input 
                                id="tagInput"
                                type="text" 
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                placeholder={tags.length === 0 ? "e.g. Metro Nearby, Sea View (Press comma or enter)" : ""}
                                className="tag-input"
                            />
                        </div>
                        <small style={{color:'#64748b', fontSize:'0.8rem', marginTop:'5px', display:'block'}}>
                            💡 Tip: Type a feature and press <strong>Comma (,)</strong> or <strong>Enter</strong> to add it.
                        </small>
                    </div>

                    {/* SECTION 3: RULES & PREFS */}
                    <div className="section-label">3. Preferences</div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Tenant Preference</label>
                            <select name="tenantPreference" value={formData.tenantPreference} onChange={handleChange} className="input-field">
                                <option value="All">Anyone</option>
                                <option value="Family">Family Only</option>
                                <option value="Bachelor">Bachelors Only</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Parking Available</label>
                            <select name="parking" value={formData.parking} onChange={handleChange} className="input-field">
                                <option value="None">None</option>
                                <option value="Bike">Bike Only</option>
                                <option value="Car">Car Only</option>
                                <option value="Both">Bike & Car</option>
                            </select>
                        </div>
                    </div>

                    {/* SECTION 4: FURNISHING */}
                    <div className="section-label">4. Furnishing & Amenities</div>
                    <div className="form-group">
                        <label>Furnishing Status</label>
                        <select name="furnishingStatus" value={formData.furnishingStatus} onChange={handleChange} className="input-field">
                            <option value="Unfurnished">Unfurnished (Empty)</option>
                            <option value="Semi-Furnished">Semi-Furnished</option>
                            <option value="Fully Furnished">Fully Furnished</option>
                        </select>
                    </div>

                    {formData.furnishingStatus !== 'Unfurnished' && (
                        <div className="form-group">
                            <label style={{marginBottom:'10px', display:'block'}}>Included Items</label>
                            <div className="checkbox-group">
                                {furnishingOptions.map(item => (
                                    <label key={item} className="checkbox-card">
                                        <input type="checkbox" value={item} checked={formData.furnishingItems.includes(item)} onChange={(e) => handleCheckbox(e, 'furnishingItems')} />
                                        <span>{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="form-group" style={{marginTop:'20px'}}>
                        <label style={{marginBottom:'10px', display:'block'}}>Society Amenities</label>
                        <div className="checkbox-group">
                            {amenityOptions.map(item => (
                                <label key={item} className="checkbox-card">
                                    <input type="checkbox" value={item} checked={formData.amenities.includes(item)} onChange={(e) => handleCheckbox(e, 'amenities')} />
                                    <span>{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 5: MEDIA */}
                    <div className="section-label">5. Photos</div>
                    <div className="upload-zone">
                        <label className="upload-label">
                            <div className="upload-icon">📸</div>
                            <span style={{fontWeight:'600', color:'#334155'}}>Click to Upload Main Cover Photo</span>
                            <input type="file" accept='image/*' onChange={(e) => setMainFile(e.target.files[0])} hidden />
                        </label>
                        {mainFile && <div style={{marginTop:'10px', color:'#16a34a', fontWeight:'600'}}>✅ Selected: {mainFile.name}</div>}
                    </div>

                    <div className="upload-zone" style={{marginTop:'15px'}}>
                        <label className="upload-label">
                            <div className="upload-icon">🖼️</div>
                            <span style={{fontWeight:'600', color:'#334155'}}>Click to Add Gallery Photos</span>
                            <span style={{display:'block', fontSize:'0.8rem', color:'#64748b'}}>You can select multiple images</span>
                            <input type="file" accept='image/*' multiple onChange={handleGalleryChange} hidden />
                        </label>
                        {/* Preview Gallery Count */}
                        {galleryFiles.length > 0 && (
                            <div style={{marginTop:'10px', display:'flex', gap:'10px', flexWrap:'wrap', justifyContent:'center'}}>
                                {galleryFiles.map((f, i) => (
                                    <div key={i} style={{position:'relative'}}>
                                        <img src={URL.createObjectURL(f)} alt="prev" style={{width:'60px', height:'60px', objectFit:'cover', borderRadius:'6px'}} />
                                        <div onClick={() => removeGalleryImage(i)} style={{position:'absolute', top:-5, right:-5, background:'red', color:'white', borderRadius:'50%', width:'18px', height:'18px', fontSize:'10px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>✕</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* UPLOAD BUTTON */}
                    {(!formData.mainImage) && (
                        <button type="button" onClick={handleImageUpload} disabled={uploading} style={{width:'100%', marginTop:'20px', padding:'12px', background:'#0f766e', color:'white', border:'none', borderRadius:'8px', fontWeight:'600', cursor:'pointer'}}>
                            {uploading ? 'Compressing & Uploading... ⏳' : '⬆️ Upload Images First'}
                        </button>
                    )}

                    {formData.mainImage && (
                        <div style={{margin:'20px 0', padding:'15px', background:'#f0fdf4', color:'#166534', borderRadius:'8px', textAlign:'center', fontWeight:'bold'}}>
                            ✅ Images Ready! You can publish now.
                        </div>
                    )}

                    <div style={{marginTop:'30px'}}>
                        <button type="submit" className="action-btn" disabled={loading || uploading}>
                            {loading ? 'Publishing Listing...' : '🚀 Publish Property'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddProperty;