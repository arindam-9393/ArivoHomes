import { useState, useEffect } from 'react';
import API from '../axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    // --- STATE ---
    const [formData, setFormData] = useState({
        title: '', location: '', price: '', category: 'Apartment',
        description: '', tags: '',
        tenantPreference: 'All', parking: 'None', 
        amenities: [],
        furnishingStatus: 'Unfurnished',
        furnishingItems: [],
        mainImage: '',
        galleryImages: []
    });

    // File States for NEW uploads
    const [mainFile, setMainFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Fixed Lists (Must match AddProperty.jsx)
    const amenityOptions = ["Power Backup", "Lift", "Security", "Gym", "Swimming Pool", "Garden", "CCTV", "Club House"];
    const furnishingOptions = ["Lights", "Fans", "AC", "TV", "Bed", "Wardrobe", "Geyser", "Sofa", "Washing Machine", "Fridge", "Dining Table", "Modular Kitchen", "Chimney"];

    // --- 1. FETCH DATA ---
    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await API.get(`/property/${id}`);
                const p = res.data;
                
                setFormData({
                    title: p.title,
                    location: p.location,
                    price: p.price,
                    category: p.category,
                    description: p.description,
                    tags: p.tags ? p.tags.join(', ') : '',
                    tenantPreference: p.tenantPreference || 'All',
                    parking: p.parking || 'None',
                    amenities: p.amenities || [],
                    furnishingStatus: p.furnishingStatus || 'Unfurnished',
                    furnishingItems: p.furnishingItems || [],
                    mainImage: p.mainImage || '',
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

    // Handle Checkboxes (Amenities & Furnishings)
    const handleCheckbox = (e, field) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const list = prev[field];
            if (checked) return { ...prev, [field]: [...list, value] };
            return { ...prev, [field]: list.filter(item => item !== value) };
        });
    };

    // --- 3. CLOUDINARY UPLOAD LOGIC ---
    // (Same secure logic as AddProperty.jsx)
    const storeImage = async (file) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Get Signature
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data: signData } = await API.get('/property/upload-signature', config);

                const data = new FormData();
                data.append("file", file);
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
            } catch (error) {
                reject(error);
            }
        });
    };

    // --- 4. SUBMIT UPDATE ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            let newMainImage = formData.mainImage;
            let newGalleryImages = [...formData.galleryImages];

            // 1. Upload NEW Main Image if selected
            if (mainFile) {
                newMainImage = await storeImage(mainFile);
            }

            // 2. Upload NEW Gallery Images if selected
            if (galleryFiles.length > 0) {
                const promises = galleryFiles.map(file => storeImage(file));
                const uploadedUrls = await Promise.all(promises);
                newGalleryImages = [...newGalleryImages, ...uploadedUrls];
            }

            // 3. Send Update to Backend
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const payload = {
                ...formData,
                mainImage: newMainImage,
                galleryImages: newGalleryImages,
                // Ensure number format
                price: Number(formData.price),
                // Handle tags string to array
                tags: formData.tags.includes(',') ? formData.tags.split(',').map(t=>t.trim()) : formData.tags
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

    // Helper to remove existing gallery image
    const removeExistingImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            galleryImages: prev.galleryImages.filter((_, idx) => idx !== indexToRemove)
        }));
    };

    if(loading) return <p style={{textAlign:'center', marginTop:'50px'}}>Loading...</p>;

    return (
        <div style={{maxWidth:'800px', margin:'40px auto', background:'white', padding:'30px', borderRadius:'12px', boxShadow:'0 4px 15px rgba(0,0,0,0.05)'}}>
            <h2 style={{textAlign:'center', marginBottom:'20px', color:'#1e293b'}}>Edit Property</h2>
            
            <form onSubmit={handleSubmit}>
                
                {/* 1. BASIC DETAILS */}
                <h4 style={sectionHeader}>Basic Details</h4>
                <div className="grid-2">
                    <div className="form-group">
                        <label>Property Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="input-field" />
                    </div>
                    <div className="form-group">
                        <label>Price (₹ / month)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required className="input-field" />
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} required className="input-field" />
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

                {/* 2. RULES */}
                <h4 style={sectionHeader}>Rules & Facilities</h4>
                <div className="grid-2">
                    <div className="form-group">
                        <label>Tenant Preference</label>
                        <select name="tenantPreference" value={formData.tenantPreference} onChange={handleChange} className="input-field">
                            <option value="All">Anyone</option>
                            <option value="Family">Family Only</option>
                            <option value="Bachelor">Bachelors Only</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Parking</label>
                        <select name="parking" value={formData.parking} onChange={handleChange} className="input-field">
                            <option value="None">None</option>
                            <option value="Bike">Bike Only</option>
                            <option value="Car">Car Only</option>
                            <option value="Both">Both</option>
                        </select>
                    </div>
                </div>

                {/* 3. FURNISHING */}
                <h4 style={sectionHeader}>Furnishing</h4>
                <div className="form-group" style={{marginBottom:'15px'}}>
                    <label>Status</label>
                    <select name="furnishingStatus" value={formData.furnishingStatus} onChange={handleChange} className="input-field" style={{fontWeight:'bold'}}>
                        <option value="Unfurnished">Unfurnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Fully Furnished">Fully Furnished</option>
                    </select>
                </div>
                
                {formData.furnishingStatus !== 'Unfurnished' && (
                    <div className="checkbox-grid">
                        {furnishingOptions.map(item => (
                            <label key={item} className="checkbox-label">
                                <input type="checkbox" value={item} checked={formData.furnishingItems.includes(item)} onChange={(e) => handleCheckbox(e, 'furnishingItems')} />
                                {item}
                            </label>
                        ))}
                    </div>
                )}

                {/* 4. AMENITIES */}
                <h4 style={sectionHeader}>Amenities</h4>
                <div className="checkbox-grid">
                    {amenityOptions.map(amenity => (
                        <label key={amenity} className="checkbox-label">
                            <input type="checkbox" value={amenity} checked={formData.amenities.includes(amenity)} onChange={(e) => handleCheckbox(e, 'amenities')} />
                            {amenity}
                        </label>
                    ))}
                </div>

                {/* 5. DESCRIPTION */}
                <h4 style={sectionHeader}>Description</h4>
                <textarea name="description" value={formData.description} rows="4" onChange={handleChange} required className="input-field"></textarea>
                <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="input-field" style={{marginTop:'10px'}} />

                {/* 6. IMAGES (UPDATED) */}
                <h4 style={sectionHeader}>Manage Images</h4>
                
                {/* Main Image */}
                <div style={{marginBottom:'20px'}}>
                    <label style={{display:'block', fontWeight:'600', marginBottom:'5px'}}>Main Cover Image</label>
                    <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                        <img src={mainFile ? URL.createObjectURL(mainFile) : formData.mainImage} alt="Main" style={{width:'100px', height:'80px', objectFit:'cover', borderRadius:'6px', border:'1px solid #ddd'}} />
                        <div>
                            <p style={{fontSize:'0.85rem', color:'#666', margin:0}}>Change Cover Image:</p>
                            <input type="file" onChange={(e) => setMainFile(e.target.files[0])} />
                        </div>
                    </div>
                </div>

                {/* Gallery Images */}
                <div style={{marginBottom:'20px'}}>
                    <label style={{display:'block', fontWeight:'600', marginBottom:'5px'}}>Gallery Images</label>
                    
                    {/* Existing Images List */}
                    <div style={{display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'10px'}}>
                        {formData.galleryImages.map((img, idx) => (
                            <div key={idx} style={{position:'relative'}}>
                                <img src={img} alt="gallery" style={{width:'80px', height:'60px', objectFit:'cover', borderRadius:'4px'}} />
                                <button type="button" onClick={() => removeExistingImage(idx)} style={{position:'absolute', top:'-5px', right:'-5px', background:'red', color:'white', borderRadius:'50%', border:'none', width:'20px', height:'20px', cursor:'pointer'}}>×</button>
                            </div>
                        ))}
                    </div>

                    <div style={{background:'#f8fafc', padding:'10px', borderRadius:'6px'}}>
                        <p style={{fontSize:'0.85rem', margin:'0 0 5px 0'}}>Add More Photos:</p>
                        <input type="file" multiple onChange={(e) => setGalleryFiles(Array.from(e.target.files))} />
                    </div>
                </div>

                <button type="submit" disabled={uploading} className="btn" style={{width:'100%', padding:'15px', background:'#2563eb', color:'white', fontSize:'1.1rem', marginTop:'20px'}}>
                    {uploading ? "Updating..." : "Save Changes"}
                </button>
            </form>

            {/* INTERNAL STYLES */}
            <style>{`
                .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
                .form-group { margin-bottom: 10px; }
                .form-group label { display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 5px; color: #334155; }
                .input-field { width: 100%; padding: 10px; border: 1px solid #cbd5e1; borderRadius: 6px; }
                .checkbox-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; margin-bottom: 20px; }
                .checkbox-label { display: flex; alignItems: center; gap: 8px; background: #f8fafc; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0; cursor: pointer; font-size: 0.9rem; }
                .btn { border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
                @media(max-width: 600px) { .grid-2 { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
};

const sectionHeader = { margin: '25px 0 15px', color: '#475569', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', fontSize: '1.1rem', fontWeight: '700' };

export default EditProperty;