// import { useState } from 'react';
// import API from '../axiosConfig';
// import { useNavigate } from 'react-router-dom';

// const AddProperty = () => {
//     const navigate = useNavigate();
//     const user = JSON.parse(localStorage.getItem('user'));

//     // --- STATE MANAGEMENT ---
//     const [formData, setFormData] = useState({
//         title: '', 
//         location: '', 
//         price: '', 
//         category: 'Apartment',
//         description: '', 
//         tags: '', // Input is string, sent as Array
//         tenantPreference: 'All', 
//         parking: 'None', 
//         amenities: [],
//         furnishingStatus: 'Unfurnished',
//         furnishingItems: [],
//         // Database URLs (Filled after upload)
//         mainImage: '',
//         galleryImages: []
//     });
    
//     // --- FILE STATES ---
//     const [mainFile, setMainFile] = useState(null);
//     const [galleryFiles, setGalleryFiles] = useState([]); 
    
//     // --- UI STATES ---
//     const [uploading, setUploading] = useState(false);
//     const [imageError, setImageError] = useState(false);
//     const [customItem, setCustomItem] = useState(''); 
//     const [loading, setLoading] = useState(false);

//     // Fixed Lists
//     const amenityOptions = ["Power Backup", "Lift", "Security", "Gym", "Swimming Pool", "Garden", "CCTV", "Club House"];
//     const furnishingOptions = ["Lights", "Fans", "AC", "TV", "Bed", "Wardrobe", "Geyser", "Sofa", "Washing Machine", "Fridge", "Dining Table", "Modular Kitchen", "Chimney"];

//     // --- FORM HANDLERS ---
//     const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//     const handleCheckbox = (e, field) => {
//         const { value, checked } = e.target;
//         setFormData(prev => {
//             const list = prev[field] || [];
//             if (checked) {
//                 return { ...prev, [field]: [...list, value] };
//             } else {
//                 return { ...prev, [field]: list.filter(item => item !== value) };
//             }
//         });
//     };

//     // Custom Furnishing Items
//     const addCustomItem = (e) => {
//         e.preventDefault();
//         if (customItem.trim()) {
//             setFormData(prev => ({
//                 ...prev,
//                 furnishingItems: [...prev.furnishingItems, customItem.trim()]
//             }));
//             setCustomItem('');
//         }
//     };

//     const removeFurnishingItem = (itemToRemove) => {
//         setFormData(prev => ({
//             ...prev,
//             furnishingItems: prev.furnishingItems.filter(i => i !== itemToRemove)
//         }));
//     };

//     // --- GALLERY HANDLERS ---
//     const handleGalleryChange = (e) => {
//         if (e.target.files && e.target.files.length > 0) {
//             const newFiles = Array.from(e.target.files);
//             setGalleryFiles((prev) => [...prev, ...newFiles]);
//         }
//     };

//     const removeGalleryImage = (index) => {
//         setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
//     };

//     // --- SECURE SIGNED UPLOAD LOGIC ---
//     const storeImage = async (file) => {
//         return new Promise(async (resolve, reject) => {
//             try {
//                 // 1. Get Signature
//                 const config = { headers: { Authorization: `Bearer ${user.token}` } };
//                 const { data: signData } = await API.get('/property/upload-signature', config);

//                 // 2. Prepare Upload
//                 const formData = new FormData();
//                 formData.append("file", file);
//                 formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
//                 formData.append("timestamp", signData.timestamp);
//                 formData.append("signature", signData.signature);
//                 formData.append("folder", "arivo_homes");

//                 // 3. Upload to Cloudinary
//                 const res = await fetch(
//                     "https://api.cloudinary.com/v1_1/dtrpcnpkm/image/upload",
//                     { method: "POST", body: formData }
//                 );

//                 const uploadedImage = await res.json();
                
//                 if (uploadedImage.secure_url) {
//                     resolve(uploadedImage.secure_url);
//                 } else {
//                     reject(uploadedImage);
//                 }
//             } catch (error) {
//                 console.error("Upload Error:", error);
//                 reject(error);
//             }
//         });
//     };

//     const handleImageUpload = async () => {
//         if (!mainFile && galleryFiles.length === 0) {
//             alert("Please select images first.");
//             return;
//         }

//         try {
//             setUploading(true);
//             setImageError(false);
            
//             // 1. Upload Main Image
//             let mainUrl = formData.mainImage;
//             if (mainFile) {
//                 mainUrl = await storeImage(mainFile);
//             }

//             // 2. Upload Gallery Images
//             const promises = [];
//             for (let i = 0; i < galleryFiles.length; i++) {
//                 promises.push(storeImage(galleryFiles[i]));
//             }
//             const galleryUrls = await Promise.all(promises);

//             // 3. Update Form Data
//             setFormData(prev => ({
//                 ...prev,
//                 mainImage: mainUrl,
//                 galleryImages: [...prev.galleryImages, ...galleryUrls]
//             }));

//             setUploading(false);
//             alert("Images Uploaded Successfully! You can now publish.");
            
//             setMainFile(null);
//             setGalleryFiles([]);

//         } catch (err) {
//             console.error(err);
//             setImageError("Image upload failed.");
//             setUploading(false);
//         }
//     };

//     // --- SUBMIT TO BACKEND (FIXED) ---
//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         if (!formData.mainImage) {
//             alert("You MUST upload a Main Image before publishing.");
//             return;
//         }

//         setLoading(true);
//         try {
//             const config = { headers: { Authorization: `Bearer ${user.token}` } };
            
//             // --- CONSTRUCT PAYLOAD EXPLICITLY ---
//             // This ensures Tags, Furnishing, and Amenities are mapped correctly.
//             const payload = { 
//                 title: formData.title,
//                 description: formData.description,
//                 location: formData.location,
//                 price: Number(formData.price),
//                 category: formData.category,
                
//                 // Tags: Convert "Tag1, Tag2" string -> ["Tag1", "Tag2"] array
//                 tags: formData.tags 
//                       ? formData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0) 
//                       : [],
                
//                 tenantPreference: formData.tenantPreference,
//                 parking: formData.parking,
                
//                 amenities: formData.amenities, // Send array directly

//                 furnishingStatus: formData.furnishingStatus,
//                 // Logic: If Unfurnished, force empty array. Else send items.
//                 furnishingItems: formData.furnishingStatus === 'Unfurnished' 
//                                  ? [] 
//                                  : formData.furnishingItems,

//                 mainImage: formData.mainImage,
//                 galleryImages: formData.galleryImages
//             }; 
            
//             console.log("Submitting Payload:", payload); // Check console to verify data

//             await API.post('/property', payload, config);
            
//             alert("Property Listed Successfully! 🎉");
//             navigate('/properties');
//         } catch (error) {
//             console.error("Backend Error:", error);
//             alert("Failed to list property. Check console for details.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div style={{ maxWidth: '850px', margin: '40px auto', padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
//             <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1e293b' }}>List Your Property</h2>
            
//             <form onSubmit={handleSubmit}>
//                 {/* 1. OVERVIEW */}
//                 <h4 style={{borderBottom:'1px solid #eee', paddingBottom:'10px', marginBottom:'20px', color:'#334155'}}>1. Property Overview</h4>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
//                     <div className="form-group">
//                         <label style={{fontWeight:'600'}}>Title</label>
//                         <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Spacious 2BHK" style={{width:'100%', padding:'10px', border:'1px solid #cbd5e1', borderRadius:'6px'}}/>
//                     </div>
//                     <div className="form-group">
//                         <label style={{fontWeight:'600'}}>Rent (₹/mo)</label>
//                         <input type="number" name="price" value={formData.price} onChange={handleChange} required style={{width:'100%', padding:'10px', border:'1px solid #cbd5e1', borderRadius:'6px'}}/>
//                     </div>
//                     <div className="form-group">
//                         <label style={{fontWeight:'600'}}>Location</label>
//                         <input type="text" name="location" value={formData.location} onChange={handleChange} required style={{width:'100%', padding:'10px', border:'1px solid #cbd5e1', borderRadius:'6px'}}/>
//                     </div>
//                     <div className="form-group">
//                         <label style={{fontWeight:'600'}}>Category</label>
//                         <select name="category" value={formData.category} onChange={handleChange} style={{width:'100%', padding:'10px', border:'1px solid #cbd5e1', borderRadius:'6px'}}>
//                             <option value="Apartment">Apartment</option>
//                             <option value="PG">PG / Hostel</option>
//                             <option value="Independent House">Independent House</option>
//                             <option value="Villa">Villa</option>
//                             <option value="Studio">Studio</option>
//                         </select>
//                     </div>
//                 </div>

//                 {/* 2. RULES */}
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
//                     <div className="form-group">
//                         <label style={{fontWeight:'600'}}>Tenant Preference</label>
//                         <select name="tenantPreference" value={formData.tenantPreference} onChange={handleChange} style={{width:'100%', padding:'10px', border:'1px solid #cbd5e1', borderRadius:'6px'}}>
//                             <option value="All">Anyone</option>
//                             <option value="Family">Family Only</option>
//                             <option value="Bachelor">Bachelors Only</option>
//                         </select>
//                     </div>
//                     <div className="form-group">
//                         <label style={{fontWeight:'600'}}>Parking</label>
//                         <select name="parking" value={formData.parking} onChange={handleChange} style={{width:'100%', padding:'10px', border:'1px solid #cbd5e1', borderRadius:'6px'}}>
//                             <option value="None">None</option>
//                             <option value="Bike">Bike Only</option>
//                             <option value="Car">Car Only</option>
//                             <option value="Both">Bike & Car</option>
//                         </select>
//                     </div>
//                 </div>

//                 {/* 3. FURNISHING */}
//                 <h4 style={{borderBottom:'1px solid #eee', paddingBottom:'10px', margin:'30px 0 20px', color:'#334155'}}>2. Furnishing Status</h4>
//                 <div style={{ marginBottom: '20px' }}>
//                     <label style={{fontWeight:'600', display:'block', marginBottom:'10px'}}>Furnishing Level</label>
//                     <select name="furnishingStatus" value={formData.furnishingStatus} onChange={handleChange} style={{width:'100%', padding:'10px', border:'1px solid #cbd5e1', borderRadius:'6px', fontWeight:'bold', color:'#2563eb'}}>
//                         <option value="Unfurnished">Unfurnished (Empty)</option>
//                         <option value="Semi-Furnished">Semi-Furnished</option>
//                         <option value="Fully Furnished">Fully Furnished</option>
//                     </select>
//                 </div>

//                 {formData.furnishingStatus !== 'Unfurnished' && (
//                     <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
//                         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', marginBottom: '20px' }}>
//                             {furnishingOptions.map(item => (
//                                 <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
//                                     <input type="checkbox" value={item} checked={formData.furnishingItems.includes(item)} onChange={(e) => handleCheckbox(e, 'furnishingItems')} />
//                                     <span style={{fontSize:'0.9rem'}}>{item}</span>
//                                 </label>
//                             ))}
//                         </div>
//                         <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
//                             <input type="text" value={customItem} onChange={(e) => setCustomItem(e.target.value)} placeholder="Add item (e.g. Microwave)" style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
//                             <button onClick={addCustomItem} type="button" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}>Add</button>
//                         </div>
//                         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '15px' }}>
//                             {formData.furnishingItems.filter(i => !furnishingOptions.includes(i)).map(item => (
//                                 <span key={item} style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '15px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
//                                     {item} <button type="button" onClick={() => removeFurnishingItem(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e40af', fontWeight: 'bold' }}>×</button>
//                                 </span>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 {/* 4. AMENITIES */}
//                 <h4 style={{borderBottom:'1px solid #eee', paddingBottom:'10px', margin:'30px 0 20px', color:'#334155'}}>3. Amenities</h4>
//                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
//                     {amenityOptions.map(amenity => (
//                         <label key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
//                             <input type="checkbox" value={amenity} checked={formData.amenities.includes(amenity)} onChange={(e) => handleCheckbox(e, 'amenities')} />
//                             <span style={{fontSize:'0.9rem'}}>{amenity}</span>
//                         </label>
//                     ))}
//                 </div>

//                 {/* 5. MEDIA & INFO */}
//                 <h4 style={{borderBottom:'1px solid #eee', paddingBottom:'10px', margin:'30px 0 20px', color:'#334155'}}>4. Media & Info</h4>
//                 <div className="form-group" style={{ marginBottom: '20px' }}>
//                     <label style={{fontWeight:'600'}}>Description</label>
//                     <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" style={{width:'100%', padding:'10px', border:'1px solid #cbd5e1', borderRadius:'6px'}}></textarea>
//                 </div>
//                 <div className="form-group" style={{ marginBottom: '20px' }}>
//                     <label style={{fontWeight:'600'}}>Tags</label>
//                     <input type="text" name="tags" value={formData.tags} placeholder='e.g. Near Metro, Highway View' onChange={handleChange} style={{width:'100%', padding:'10px', border:'1px solid #cbd5e1', borderRadius:'6px'}} />
//                 </div>

//                 {/* --- IMAGE UPLOAD SECTION (Cloudinary) --- */}
//                 <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '10px', border: '1px solid #bae6fd', marginBottom: '20px' }}>
//                     <h5 style={{margin: '0 0 15px 0', color: '#0369a1'}}>Upload Photos</h5>
                    
//                     {/* Main Image */}
//                     <div style={{marginBottom:'15px'}}>
//                         <label style={{display:'block', marginBottom:'5px', fontSize:'0.9rem', fontWeight:'600'}}>Main Cover Photo <span style={{color:'red'}}>*</span></label>
//                         <input type="file" accept='image/*' onChange={(e) => setMainFile(e.target.files[0])} style={{ width: '100%', padding: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
//                         {mainFile && <p style={{fontSize:'0.8rem', color:'green', marginTop:'5px'}}>Selected: {mainFile.name}</p>}
//                     </div>

//                     {/* Gallery Images */}
//                     <div style={{marginBottom:'15px'}}>
//                         <label style={{display:'block', marginBottom:'5px', fontSize:'0.9rem', fontWeight:'600'}}>Gallery Images (Max 6)</label>
//                         <input 
//                             type="file" 
//                             accept='image/*' 
//                             multiple 
//                             onChange={handleGalleryChange} 
//                             style={{ width: '100%', padding: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
//                         />
//                         <p style={{fontSize: '0.8rem', color: '#64748b', marginTop: '5px'}}>* You can select multiple files or add them one by one.</p>

//                         {/* PREVIEW AREA */}
//                         {galleryFiles.length > 0 && (
//                             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
//                                 {galleryFiles.map((file, index) => (
//                                     <div key={index} style={{ position: 'relative', width: '80px', height: '80px' }}>
//                                         <img src={URL.createObjectURL(file)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd' }} />
//                                         <button type="button" onClick={() => removeGalleryImage(index)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', width: '20px', height: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                          <button 
//                             type="button" 
//                             onClick={handleImageUpload}
//                             disabled={uploading}
//                             style={{ background: uploading ? '#94a3b8' : '#0f766e', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: uploading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
//                         >
//                             {uploading ? 'Uploading...' : 'Upload Images'}
//                         </button>
//                         {formData.mainImage && <span style={{color: 'green', fontWeight: 'bold'}}>✓ Ready to Publish</span>}
//                     </div>
//                     {imageError && <p style={{color: 'red', marginTop: '10px'}}>{imageError}</p>}
//                 </div>

//                 <button type="submit" disabled={loading || uploading} style={{ width: '100%', padding: '15px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
//                     {loading ? 'Publishing Property...' : 'Publish Property'}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default AddProperty;









import { useState } from 'react';
import API from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression'; // <--- IMPORT THIS

const AddProperty = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    // --- STATE MANAGEMENT ---
    const [formData, setFormData] = useState({
        title: '', location: '', price: '', category: 'Apartment',
        description: '', tags: '', tenantPreference: 'All', parking: 'None', 
        amenities: [], furnishingStatus: 'Unfurnished', furnishingItems: [],
        mainImage: '', galleryImages: []
    });
    
    // --- FILE STATES ---
    const [mainFile, setMainFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]); 
    
    // --- UI STATES ---
    const [uploading, setUploading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [customItem, setCustomItem] = useState(''); 
    const [loading, setLoading] = useState(false);

    // Fixed Lists
    const amenityOptions = ["Power Backup", "Lift", "Security", "Gym", "Swimming Pool", "Garden", "CCTV", "Club House"];
    const furnishingOptions = ["Lights", "Fans", "AC", "TV", "Bed", "Wardrobe", "Geyser", "Sofa", "Washing Machine", "Fridge", "Dining Table", "Modular Kitchen", "Chimney"];

    // --- FORM HANDLERS ---
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
            setFormData(prev => ({
                ...prev, furnishingItems: [...prev.furnishingItems, customItem.trim()]
            }));
            setCustomItem('');
        }
    };

    const removeFurnishingItem = (itemToRemove) => {
        setFormData(prev => ({
            ...prev, furnishingItems: prev.furnishingItems.filter(i => i !== itemToRemove)
        }));
    };

    const handleGalleryChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setGalleryFiles((prev) => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const removeGalleryImage = (index) => {
        setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // --- SECURE UPLOAD WITH COMPRESSION ---
    const storeImage = async (file) => {
        return new Promise(async (resolve, reject) => {
            try {
                // 1. COMPRESS THE IMAGE
                const options = {
                    maxSizeMB: 1,           // Max size 1MB
                    maxWidthOrHeight: 1920, // Max dim 1920px
                    useWebWorker: true
                };
                const compressedFile = await imageCompression(file, options);
                
                // 2. GET SIGNATURE
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data: signData } = await API.get('/property/upload-signature', config);

                // 3. UPLOAD COMPRESSED FILE
                const formData = new FormData();
                formData.append("file", compressedFile); // <--- Upload Compressed
                formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
                formData.append("timestamp", signData.timestamp);
                formData.append("signature", signData.signature);
                formData.append("folder", "arivo_homes");

                const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dtrpcnpkm'}/image/upload`,
                    { method: "POST", body: formData }
                );

                const uploadedImage = await res.json();
                
                if (uploadedImage.secure_url) {
                    resolve(uploadedImage.secure_url);
                } else {
                    reject(uploadedImage);
                }
            } catch (error) {
                console.error("Upload Error:", error);
                reject(error);
            }
        });
    };

    const handleImageUpload = async () => {
        if (!mainFile && galleryFiles.length === 0) {
            alert("Please select images first.");
            return;
        }

        try {
            setUploading(true);
            setImageError(false);
            
            // Upload Main
            let mainUrl = formData.mainImage;
            if (mainFile) {
                mainUrl = await storeImage(mainFile);
            }

            // Upload Gallery
            const promises = [];
            for (let i = 0; i < galleryFiles.length; i++) {
                promises.push(storeImage(galleryFiles[i]));
            }
            const galleryUrls = await Promise.all(promises);

            setFormData(prev => ({
                ...prev,
                mainImage: mainUrl,
                galleryImages: [...prev.galleryImages, ...galleryUrls]
            }));

            setUploading(false);
            alert("Images Uploaded Successfully! You can now publish.");
            
            setMainFile(null);
            setGalleryFiles([]);

        } catch (err) {
            console.error(err);
            setImageError("Image upload failed.");
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.mainImage) {
            alert("You MUST upload a Main Image before publishing.");
            return;
        }

        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            
            const payload = { 
                title: formData.title,
                description: formData.description,
                location: formData.location,
                price: Number(formData.price),
                category: formData.category,
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0) : [],
                tenantPreference: formData.tenantPreference,
                parking: formData.parking,
                amenities: formData.amenities,
                furnishingStatus: formData.furnishingStatus,
                furnishingItems: formData.furnishingStatus === 'Unfurnished' ? [] : formData.furnishingItems,
                mainImage: formData.mainImage,
                galleryImages: formData.galleryImages
            }; 
            
            await API.post('/property', payload, config);
            
            alert("Property Listed Successfully! 🎉");
            navigate('/dashboard'); // Changed from /properties to dashboard usually better
        } catch (error) {
            console.error("Backend Error:", error);
            alert("Failed to list property.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '850px', margin: '40px auto', padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1e293b' }}>List Your Property</h2>
            
            <form onSubmit={handleSubmit}>
                {/* 1. OVERVIEW */}
                <h4 style={{borderBottom:'1px solid #eee', paddingBottom:'10px', marginBottom:'20px', color:'#334155'}}>1. Property Overview</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div className="form-group">
                        <label style={{fontWeight:'600'}}>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Spacious 2BHK" style={{width:'100%', padding:'10px', border:'1px solid #cbd5e1', borderRadius:'6px'}}/>
                    </div>
                    <div className="form-group">
                        <label style={{fontWeight:'600'}}>Rent (₹/mo)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required style={{width:'100%', padding:'10px', border:'1px solid #cbd5e1', borderRadius:'6px'}}/>
                    </div>
                    <div className="form-group">
                        <label style={{fontWeight:'600'}}>Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} required style={{width:'100%', padding:'10px', border:'1px solid #cbd5e1', borderRadius:'6px'}}/>
                    </div>
                    <div className="form-group">
                        <label style={{fontWeight:'600'}}>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} style={{width:'100%', padding:'10px', border:'1px solid #cbd5e1', borderRadius:'6px'}}>
                            <option value="Apartment">Apartment</option>
                            <option value="PG">PG / Hostel</option>
                            <option value="Independent House">Independent House</option>
                            <option value="Villa">Villa</option>
                            <option value="Studio">Studio</option>
                        </select>
                    </div>
                </div>

                {/* 2. RULES */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div className="form-group">
                        <label style={{fontWeight:'600'}}>Tenant Preference</label>
                        <select name="tenantPreference" value={formData.tenantPreference} onChange={handleChange} style={{width:'100%', padding:'10px', border:'1px solid #cbd5e1', borderRadius:'6px'}}>
                            <option value="All">Anyone</option>
                            <option value="Family">Family Only</option>
                            <option value="Bachelor">Bachelors Only</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label style={{fontWeight:'600'}}>Parking</label>
                        <select name="parking" value={formData.parking} onChange={handleChange} style={{width:'100%', padding:'10px', border:'1px solid #cbd5e1', borderRadius:'6px'}}>
                            <option value="None">None</option>
                            <option value="Bike">Bike Only</option>
                            <option value="Car">Car Only</option>
                            <option value="Both">Bike & Car</option>
                        </select>
                    </div>
                </div>

                {/* 3. FURNISHING */}
                <h4 style={{borderBottom:'1px solid #eee', paddingBottom:'10px', margin:'30px 0 20px', color:'#334155'}}>2. Furnishing Status</h4>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{fontWeight:'600', display:'block', marginBottom:'10px'}}>Furnishing Level</label>
                    <select name="furnishingStatus" value={formData.furnishingStatus} onChange={handleChange} style={{width:'100%', padding:'10px', border:'1px solid #cbd5e1', borderRadius:'6px', fontWeight:'bold', color:'#2563eb'}}>
                        <option value="Unfurnished">Unfurnished (Empty)</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Fully Furnished">Fully Furnished</option>
                    </select>
                </div>

                {formData.furnishingStatus !== 'Unfurnished' && (
                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                            {furnishingOptions.map(item => (
                                <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input type="checkbox" value={item} checked={formData.furnishingItems.includes(item)} onChange={(e) => handleCheckbox(e, 'furnishingItems')} />
                                    <span style={{fontSize:'0.9rem'}}>{item}</span>
                                </label>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input type="text" value={customItem} onChange={(e) => setCustomItem(e.target.value)} placeholder="Add item (e.g. Microwave)" style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                            <button onClick={addCustomItem} type="button" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}>Add</button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '15px' }}>
                            {formData.furnishingItems.filter(i => !furnishingOptions.includes(i)).map(item => (
                                <span key={item} style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '15px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    {item} <button type="button" onClick={() => removeFurnishingItem(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e40af', fontWeight: 'bold' }}>×</button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. AMENITIES */}
                <h4 style={{borderBottom:'1px solid #eee', paddingBottom:'10px', margin:'30px 0 20px', color:'#334155'}}>3. Amenities</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                    {amenityOptions.map(amenity => (
                        <label key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input type="checkbox" value={amenity} checked={formData.amenities.includes(amenity)} onChange={(e) => handleCheckbox(e, 'amenities')} />
                            <span style={{fontSize:'0.9rem'}}>{amenity}</span>
                        </label>
                    ))}
                </div>

                {/* 5. MEDIA & INFO */}
                <h4 style={{borderBottom:'1px solid #eee', paddingBottom:'10px', margin:'30px 0 20px', color:'#334155'}}>4. Media & Info</h4>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{fontWeight:'600'}}>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" style={{width:'100%', padding:'10px', border:'1px solid #cbd5e1', borderRadius:'6px'}}></textarea>
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{fontWeight:'600'}}>Tags</label>
                    <input type="text" name="tags" value={formData.tags} placeholder='e.g. Near Metro, Highway View' onChange={handleChange} style={{width:'100%', padding:'10px', border:'1px solid #cbd5e1', borderRadius:'6px'}} />
                </div>

                {/* --- IMAGE UPLOAD SECTION --- */}
                <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '10px', border: '1px solid #bae6fd', marginBottom: '20px' }}>
                    <h5 style={{margin: '0 0 15px 0', color: '#0369a1'}}>Upload Photos</h5>
                    
                    {/* Main Image */}
                    <div style={{marginBottom:'15px'}}>
                        <label style={{display:'block', marginBottom:'5px', fontSize:'0.9rem', fontWeight:'600'}}>Main Cover Photo <span style={{color:'red'}}>*</span></label>
                        <input type="file" accept='image/*' onChange={(e) => setMainFile(e.target.files[0])} style={{ width: '100%', padding: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                        {mainFile && <p style={{fontSize:'0.8rem', color:'green', marginTop:'5px'}}>Selected: {mainFile.name}</p>}
                    </div>

                    {/* Gallery Images */}
                    <div style={{marginBottom:'15px'}}>
                        <label style={{display:'block', marginBottom:'5px', fontSize:'0.9rem', fontWeight:'600'}}>Gallery Images (Max 6)</label>
                        <input type="file" accept='image/*' multiple onChange={handleGalleryChange} style={{ width: '100%', padding: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                        
                        {/* PREVIEW */}
                        {galleryFiles.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                                {galleryFiles.map((file, index) => (
                                    <div key={index} style={{ position: 'relative', width: '80px', height: '80px' }}>
                                        <img src={URL.createObjectURL(file)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd' }} />
                                        <button type="button" onClick={() => removeGalleryImage(index)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', width: '20px', height: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <button type="button" onClick={handleImageUpload} disabled={uploading} style={{ background: uploading ? '#94a3b8' : '#0f766e', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: uploading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                            {uploading ? 'Uploading...' : 'Upload Images'}
                        </button>
                        {formData.mainImage && <span style={{color: 'green', fontWeight: 'bold'}}>✓ Ready to Publish</span>}
                    </div>
                    {imageError && <p style={{color: 'red', marginTop: '10px'}}>{imageError}</p>}
                </div>

                <button type="submit" disabled={loading || uploading} style={{ width: '100%', padding: '15px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Publishing Property...' : 'Publish Property'}
                </button>
            </form>
        </div>
    );
};

export default AddProperty;