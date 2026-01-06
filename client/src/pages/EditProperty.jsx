import { useState, useEffect } from 'react';
import API from '../axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import imageCompression from 'browser-image-compression';

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    // --- STATE ---
    const [formData, setFormData] = useState({
        title: '', location: '', price: '', category: 'Apartment',
        description: '', tenantPreference: 'All', parking: 'None', 
        amenities: [], furnishingStatus: 'Unfurnished', furnishingItems: [],
        mainImage: '', galleryImages: []
    });

    // --- NEW: TAG STATE ---
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    const [mainFile, setMainFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const amenityOptions = ["Power Backup", "Lift", "Security", "Gym", "Swimming Pool", "Garden", "CCTV", "Club House"];
    const furnishingOptions = ["Lights", "Fans", "AC", "TV", "Bed", "Wardrobe", "Geyser", "Sofa", "Washing Machine", "Fridge", "Dining Table", "Modular Kitchen", "Chimney"];

    // --- 1. FETCH DATA ---
    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await API.get(`/property/${id}`);
                const p = res.data;
                
                // Initialize Tags correctly (array or empty)
                setTags(p.tags || []);

                setFormData({
                    title: p.title, location: p.location, price: p.price, category: p.category,
                    description: p.description, 
                    tenantPreference: p.tenantPreference || 'All', parking: p.parking || 'None',
                    amenities: p.amenities || [], furnishingStatus: p.furnishingStatus || 'Unfurnished',
                    furnishingItems: p.furnishingItems || [], mainImage: p.mainImage || '',
                    galleryImages: p.galleryImages || []
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
                alert("Error fetching property details");
                navigate('/dashboard');
            }
        };
        fetchProperty();
    }, [id, navigate]);

    // --- 2. HANDLERS ---
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // --- TAG HANDLERS (Same as AddProperty) ---
    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = tagInput.trim().replace(',', '');
            if (val && !tags.includes(val)) {
                setTags([...tags, val]);
                setTagInput('');
            }
        }
        if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
            setTags(tags.slice(0, -1));
        }
    };
    const removeTag = (tagToRemove) => setTags(tags.filter(t => t !== tagToRemove));

    const handleCheckbox = (e, field) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const list = prev[field];
            if (checked) return { ...prev, [field]: [...list, value] };
            return { ...prev, [field]: list.filter(item => item !== value) };
        });
    };

    // --- IMAGE HANDLERS ---
    const handleGalleryChange = (e) => {
        if (e.target.files && e.target.files.length > 0) setGalleryFiles(prev => [...prev, ...Array.from(e.target.files)]);
    };

    // Remove EXISTING gallery image (URL)
    const removeExistingImage = (idxToRemove) => {
        setFormData(prev => ({
            ...prev, galleryImages: prev.galleryImages.filter((_, idx) => idx !== idxToRemove)
        }));
    };

    // Remove NEW gallery file (File Object)
    const removeNewGalleryFile = (idxToRemove) => {
        setGalleryFiles(prev => prev.filter((_, idx) => idx !== idxToRemove));
    };

    // --- 3. COMPRESSED UPLOAD LOGIC ---
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

                const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dtrpcnpkm'}/image/upload`,
                    { method: "POST", body: data }
                );
                const uploadedImage = await res.json();
                resolve(uploadedImage.secure_url);
            } catch (error) { reject(error); }
        });
    };

    // --- 4. SUBMIT UPDATE ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let newMainImage = formData.mainImage;
            let newGalleryImages = [...formData.galleryImages];

            // Upload NEW Main Image if selected
            if (mainFile) {
                newMainImage = await storeImage(mainFile);
            }
            // Upload NEW Gallery Images
            if (galleryFiles.length > 0) {
                const promises = galleryFiles.map(file => storeImage(file));
                const uploadedUrls = await Promise.all(promises);
                newGalleryImages = [...newGalleryImages, ...uploadedUrls];
            }

            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const payload = {
                ...formData,
                mainImage: newMainImage,
                galleryImages: newGalleryImages,
                price: Number(formData.price),
                tags: tags, // Send the tag array
                furnishingItems: formData.furnishingStatus === 'Unfurnished' ? [] : formData.furnishingItems
            };

            await API.put(`/property/${id}`, payload, config);
            alert("Property Updated Successfully!");
            navigate('/dashboard'); 
        } catch (error) {
            console.error(error);
            alert("Update failed. Check console.");
        } finally {
            setUploading(false);
        }
    };

    if(loading) return <p style={{textAlign:'center', marginTop:'50px'}}>Loading...</p>;

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
                
                /* TAGS */
                .tag-container { display: flex; flex-wrap: wrap; gap: 8px; padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; min-height: 48px; align-items: center; transition: 0.2s; }
                .tag-container:focus-within { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
                .tag-pill { background: #eff6ff; color: #1e40af; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 6px; border: 1px solid #bfdbfe; }
                .tag-remove { cursor: pointer; display: flex; align-items: center; justify-content: center; width: 16px; height: 16px; background: #dbeafe; border-radius: 50%; font-size: 10px; color: #1e40af; transition: 0.2s; }
                .tag-remove:hover { background: #ef4444; color: white; }
                .tag-input { border: none; outline: none; flex: 1; font-size: 0.95rem; min-width: 120px; background: transparent; padding: 4px; }
                
                /* UPLOAD ZONES */
                .upload-zone { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 25px; text-align: center; transition: 0.2s; }
                .upload-zone:hover { border-color: #2563eb; background: #eff6ff; }
                .upload-label { cursor: pointer; display: block; }
                
                .checkbox-group { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
                .checkbox-card { display: flex; align-items: center; gap: 10px; background: #fff; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: 0.2s; font-size: 0.9rem; color: #475569; }
                .checkbox-card:hover { border-color: #2563eb; }
                .checkbox-card input:checked + span { color: #2563eb; font-weight: 600; }

                .action-btn { width: 100%; padding: 16px; border-radius: 10px; font-size: 1.1rem; font-weight: 700; color: white; border: none; cursor: pointer; transition: 0.2s; background: linear-gradient(135deg, #2563eb, #1e40af); box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3); }
                .action-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(37, 99, 235, 0.4); }
                .action-btn:disabled { background: #94a3b8; cursor: not-allowed; transform: none; box-shadow: none; }

                @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
            `}</style>

            <div className="form-card">
                <h2>Edit Property</h2>
                <form onSubmit={handleSubmit}>
                    
                    {/* SECTION 1: OVERVIEW */}
                    <div className="section-label">1. Basic Details</div>
                    <div className="form-grid">
                        <div className="form-group"><label>Property Title</label><input type="text" name="title" value={formData.title} onChange={handleChange} required className="input-field" /></div>
                        <div className="form-group"><label>Price (₹ / month)</label><input type="number" name="price" value={formData.price} onChange={handleChange} required className="input-field" /></div>
                        <div className="form-group"><label>Location</label><input type="text" name="location" value={formData.location} onChange={handleChange} required className="input-field" /></div>
                        <div className="form-group"><label>Category</label><select name="category" value={formData.category} onChange={handleChange} className="input-field"><option value="Apartment">Apartment</option><option value="PG">PG / Hostel</option><option value="Independent House">Independent House</option><option value="Villa">Villa</option><option value="Studio">Studio</option></select></div>
                    </div>

                    {/* SECTION 2: DESCRIPTION & TAGS */}
                    <div className="section-label">2. Details & Features</div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="input-field"></textarea>
                    </div>

                    {/* ✨✨ TAG INPUT ✨✨ */}
                    <div className="form-group">
                        <label>Highlights (Tags)</label>
                        <div className="tag-container" onClick={() => document.getElementById('tagInput').focus()}>
                            {tags.map((tag, index) => (
                                <span key={index} className="tag-pill">
                                    {tag} <span className="tag-remove" onClick={() => removeTag(tag)}>✕</span>
                                </span>
                            ))}
                            <input 
                                id="tagInput" type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown}
                                placeholder={tags.length === 0 ? "e.g. Metro Nearby (Press Enter)" : ""}
                                className="tag-input"
                            />
                        </div>
                    </div>

                    {/* SECTION 3: RULES */}
                    <div className="section-label">3. Rules & Facilities</div>
                    <div className="form-grid">
                        <div className="form-group"><label>Tenant Preference</label><select name="tenantPreference" value={formData.tenantPreference} onChange={handleChange} className="input-field"><option value="All">Anyone</option><option value="Family">Family Only</option><option value="Bachelor">Bachelors Only</option></select></div>
                        <div className="form-group"><label>Parking</label><select name="parking" value={formData.parking} onChange={handleChange} className="input-field"><option value="None">None</option><option value="Bike">Bike Only</option><option value="Car">Car Only</option><option value="Both">Both</option></select></div>
                    </div>

                    {/* SECTION 4: FURNISHING */}
                    <div className="section-label">4. Furnishing & Amenities</div>
                    <div className="form-group"><label>Furnishing Status</label><select name="furnishingStatus" value={formData.furnishingStatus} onChange={handleChange} className="input-field"><option value="Unfurnished">Unfurnished</option><option value="Semi-Furnished">Semi-Furnished</option><option value="Fully Furnished">Fully Furnished</option></select></div>
                    
                    {formData.furnishingStatus !== 'Unfurnished' && (
                        <div className="form-group">
                            <label style={{marginBottom:'10px', display:'block'}}>Included Items</label>
                            <div className="checkbox-group">{furnishingOptions.map(item => (<label key={item} className="checkbox-card"><input type="checkbox" value={item} checked={formData.furnishingItems.includes(item)} onChange={(e) => handleCheckbox(e, 'furnishingItems')} /><span>{item}</span></label>))}</div>
                        </div>
                    )}

                    <div className="form-group" style={{marginTop:'20px'}}>
                        <label style={{marginBottom:'10px', display:'block'}}>Society Amenities</label>
                        <div className="checkbox-group">{amenityOptions.map(item => (<label key={item} className="checkbox-card"><input type="checkbox" value={item} checked={formData.amenities.includes(item)} onChange={(e) => handleCheckbox(e, 'amenities')} /><span>{item}</span></label>))}</div>
                    </div>

                    {/* SECTION 5: PHOTOS */}
                    <div className="section-label">5. Manage Photos</div>
                    
                    {/* MAIN IMAGE */}
                    <div className="upload-zone" style={{textAlign:'left', display:'flex', gap:'20px', alignItems:'center'}}>
                        <div style={{width:'100px', height:'80px', borderRadius:'8px', overflow:'hidden', border:'1px solid #cbd5e1'}}>
                            <img src={mainFile ? URL.createObjectURL(mainFile) : formData.mainImage} alt="Main" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                        </div>
                        <label className="upload-label" style={{flex:1}}>
                            <span style={{fontWeight:'600', color:'#334155', display:'block'}}>Change Cover Photo</span>
                            <span style={{fontSize:'0.85rem', color:'#64748b'}}>Click to select new file</span>
                            <input type="file" accept='image/*' onChange={(e) => setMainFile(e.target.files[0])} hidden />
                        </label>
                    </div>

                    {/* GALLERY IMAGES */}
                    <div className="upload-zone" style={{marginTop:'15px'}}>
                        <label className="upload-label">
                            <span style={{fontWeight:'600', color:'#334155'}}>Add More Gallery Photos</span>
                            <input type="file" accept='image/*' multiple onChange={handleGalleryChange} hidden />
                        </label>
                        
                        {/* COMBINED PREVIEW (Existing + New) */}
                        <div style={{marginTop:'15px', display:'flex', gap:'10px', flexWrap:'wrap', justifyContent:'center'}}>
                            {/* 1. Existing URL Images */}
                            {formData.galleryImages.map((img, idx) => (
                                <div key={`exist-${idx}`} style={{position:'relative'}}>
                                    <img src={img} alt="gallery" style={{width:'70px', height:'70px', objectFit:'cover', borderRadius:'6px', border:'1px solid #e2e8f0'}} />
                                    <div onClick={() => removeExistingImage(idx)} style={{position:'absolute', top:-6, right:-6, background:'red', color:'white', borderRadius:'50%', width:'20px', height:'20px', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>✕</div>
                                </div>
                            ))}
                            {/* 2. New File Images */}
                            {galleryFiles.map((file, idx) => (
                                <div key={`new-${idx}`} style={{position:'relative'}}>
                                    <img src={URL.createObjectURL(file)} alt="new" style={{width:'70px', height:'70px', objectFit:'cover', borderRadius:'6px', border:'2px solid #22c55e'}} />
                                    <div onClick={() => removeNewGalleryFile(idx)} style={{position:'absolute', top:-6, right:-6, background:'red', color:'white', borderRadius:'50%', width:'20px', height:'20px', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>✕</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{marginTop:'30px'}}>
                        <button type="submit" className="action-btn" disabled={uploading}>
                            {uploading ? "Uploading & Saving..." : "💾 Save Changes"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditProperty;