// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import API from '../axiosConfig';

// const PropertyDetails = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
    
//     // Safely get user
//     const getUser = () => {
//         try { return JSON.parse(localStorage.getItem('user')); } catch (err) { return null; }
//     };
//     const user = getUser();

//     const [property, setProperty] = useState(null);
//     const [loading, setLoading] = useState(true);
    
//     // --- LIGHTBOX STATE ---
//     const [isLightboxOpen, setIsLightboxOpen] = useState(false);
//     const [currentImageIndex, setCurrentImageIndex] = useState(0);
//     const [allImages, setAllImages] = useState([]);

//     // --- BOOKING STATE ---
//     const [moveInDate, setMoveInDate] = useState('');
//     const [visitTime, setVisitTime] = useState(''); 
//     const [message, setMessage] = useState('');

//     useEffect(() => {
//         const fetchProperty = async () => {
//             try {
//                 const response = await API.get(`/property/${id}`);
//                 const data = response.data;
//                 setProperty(data);
                
//                 // Combine Main Image + Gallery for the Lightbox
//                 const images = [data.mainImage];
//                 if (data.galleryImages && data.galleryImages.length > 0) {
//                     images.push(...data.galleryImages);
//                 }
//                 setAllImages(images.filter(img => img));

//                 setLoading(false);
//             } catch (error) {
//                 console.error(error);
//                 setLoading(false);
//             }
//         };
//         fetchProperty();
//     }, [id]);

//     // --- KEYBOARD NAVIGATION ---
//     useEffect(() => {
//         const handleKeyDown = (e) => {
//             if (!isLightboxOpen) return;
//             if (e.key === 'Escape') closeLightbox();
//             if (e.key === 'ArrowRight') nextImage();
//             if (e.key === 'ArrowLeft') prevImage();
//         };
//         window.addEventListener('keydown', handleKeyDown);
//         return () => window.removeEventListener('keydown', handleKeyDown);
//     }, [isLightboxOpen, currentImageIndex]);

//     // --- HANDLERS ---
//     const openLightbox = (index) => {
//         setCurrentImageIndex(index);
//         setIsLightboxOpen(true);
//     };

//     const closeLightbox = () => setIsLightboxOpen(false);

//     const nextImage = (e) => {
//         if(e) e.stopPropagation();
//         setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
//     };

//     const prevImage = (e) => {
//         if(e) e.stopPropagation();
//         setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
//     };

//     const handleDelete = async () => {
//         if (window.confirm("Are you sure? This cannot be undone.")) {
//             try {
//                 const config = { headers: { Authorization: `Bearer ${user.token}` } };
//                 await API.delete(`/property/${id}`, config);
//                 alert("Property Deleted");
//                 navigate('/properties');
//             } catch (error) {
//                 alert("Delete failed");
//             }
//         }
//     };

//     const handleBook = async () => {
//         if (!user) { alert("Please login to book!"); navigate('/login'); return; }
//         if (!moveInDate || !visitTime || !message) { alert("Please fill date, time, and message."); return; }

//         try {
//             const config = { headers: { Authorization: `Bearer ${user.token}` } };
//             await API.post('/booking', { 
//                 propertyId: property._id, 
//                 moveInDate, 
//                 visitTime, 
//                 message 
//             }, config);

//             alert("Request Sent! Check your Dashboard for updates. 🚀");
//             navigate('/dashboard'); 
//         } catch (error) {
//             alert("Booking Failed: " + (error.response?.data?.message || "Server Error"));
//         }
//     };

//     const getAmenityIcon = (amenity) => {
//         const icons = { "Lift": "🛗", "Power Backup": "🔋", "Security": "👮", "Gym": "💪", "Swimming Pool": "🏊", "Garden": "🌳", "CCTV": "📹", "Club House": "🎉" };
//         return icons[amenity] || "🏢";
//     };

//     if (loading) return <h2 style={{textAlign:'center', marginTop:'80px', color:'#64748b'}}>Loading...</h2>;
//     if (!property) return <h2 style={{textAlign:'center', marginTop:'80px', color:'#ef4444'}}>Property not found</h2>;

//     // --- RENTED LOGIC ---
//     const isRented = property.status === 'Rented';
//     const ownerId = property.owner?._id || property.owner;
//     const isOwner = user && (user.role === 'owner' || true) && (user._id === ownerId);

//     // Filter style for Rented state
//     const imgFilter = isRented ? 'grayscale(100%) contrast(90%)' : 'none';

//     return (
//         <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
            
//             {/* --- LIGHTBOX MODAL --- */}
//             {isLightboxOpen && (
//                 <div style={lightboxOverlayStyle} onClick={closeLightbox}>
//                     <button style={closeBtnStyle}>×</button>
//                     <button style={{...navBtnStyle, left: '20px'}} onClick={prevImage}>❮</button>
//                     <img 
//                         src={allImages[currentImageIndex]} 
//                         alt="Full Screen" 
//                         style={{...lightboxImgStyle, filter: imgFilter}} 
//                         onClick={(e) => e.stopPropagation()} 
//                     />
//                     <button style={{...navBtnStyle, right: '20px'}} onClick={nextImage}>❯</button>
//                     <div style={counterStyle}>{currentImageIndex + 1} / {allImages.length}</div>
//                 </div>
//             )}

//             <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 16px', border:'1px solid #e2e8f0', background:'white', borderRadius:'8px', color:'#64748b', fontWeight:'600' }}>&larr; Back</button>
            
//             <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                
//                 {/* --- HERO IMAGE --- */}
//                 <div style={{ height: '450px', position: 'relative', background: '#f1f5f9', cursor: 'pointer' }} onClick={() => openLightbox(0)}>
//                     <img 
//                         src={property.mainImage || "https://via.placeholder.com/800x400"} 
//                         alt={property.title} 
//                         style={{ width: '100%', height: '100%', objectFit: 'cover', filter: imgFilter, transition: '0.3s' }} 
//                     />
                    
//                     {/* View Photos Button */}
//                     <div style={{position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(255,255,255,0.9)', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'}}>
//                         📷 View {allImages.length} Photos
//                     </div>

//                     {/* --- PROFESSIONAL RENTED OVERLAY --- */}
//                     {isRented && (
//                         <div style={{ 
//                             position:'absolute', top:0, left:0, width:'100%', height:'100%', 
//                             background:'rgba(0,0,0,0.6)', // Dark overlay
//                             display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
//                             backdropFilter: 'blur(2px)' 
//                         }}>
//                             <div style={{ border: '2px solid white', padding: '15px 40px', color: 'white', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', fontSize: '1.5rem', background: 'rgba(0,0,0,0.5)' }}>
//                                 Property Rented
//                             </div>
//                             <p style={{ color: '#e2e8f0', marginTop: '10px', fontSize: '0.9rem' }}>This listing is no longer available</p>
//                         </div>
//                     )}
//                 </div>

//                 {/* --- GALLERY STRIP --- */}
//                 {property.galleryImages?.length > 0 && (
//                     <div style={{ display: 'flex', gap: '10px', padding: '15px', overflowX: 'auto', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
//                         {property.galleryImages.map((img, idx) => (
//                             <img 
//                                 key={idx} 
//                                 src={img} 
//                                 alt={`gallery-${idx}`} 
//                                 onClick={() => openLightbox(idx + 1)} 
//                                 style={{ height: '100px', width: '150px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', border: '1px solid #cbd5e1', filter: imgFilter, opacity: isRented ? 0.7 : 1 }} 
//                             />
//                         ))}
//                     </div>
//                 )}

//                 <div style={{ padding: '30px' }}>
//                     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'20px', marginBottom: '20px' }}>
//                         <div style={{ flex: 1 }}>
//                             <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'8px'}}>
//                                 <h1 style={{ color: isRented ? '#94a3b8' : '#1e293b', fontSize:'2.2rem', margin:0 }}>{property.title}</h1>
//                                 {isRented && (
//                                     <span style={{background:'#334155', color:'white', padding:'4px 12px', borderRadius:'6px', fontSize:'0.8rem', fontWeight:'bold', textTransform:'uppercase'}}>Rented</span>
//                                 )}
//                             </div>
                            
//                             {!isRented && (
//                                 <div style={{ display: 'inline-block', background: '#fff1f2', color: '#be123c', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px', border: '1px solid #fda4af' }}>
//                                     🔥 High Demand: People are currently viewing this
//                                 </div>
//                             )}

//                             <p style={{ color: '#64748b', fontSize: '1.1rem' }}>📍 {property.location}</p>
//                         </div>
                        
//                         <div style={{ textAlign:'right', background: isRented ? '#f1f5f9' : '#f8fafc', padding: '15px 25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
//                             <h2 style={{ color: isRented ? '#64748b' : '#2563eb', fontSize:'2rem', margin:0, fontWeight: '800', textDecoration: isRented ? 'line-through' : 'none' }}>₹{property.price.toLocaleString()}</h2>
//                             <span style={{ fontSize:'0.9rem', color:'#64748b' }}>per month</span>
//                         </div>
//                     </div>

//                     {/* --- TAGS --- */}
//                     {property.tags && property.tags.length > 0 && (
//                         <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
//                             {property.tags.map((tag, i) => (
//                                 <span key={i} style={{ background: isRented ? '#f1f5f9' : '#e0f2fe', color: isRented ? '#94a3b8' : '#0369a1', padding: '5px 12px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
//                                     #{tag}
//                                 </span>
//                             ))}
//                         </div>
//                     )}

//                     {/* BADGES */}
//                     <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingBottom: '30px', borderBottom: '1px solid #e2e8f0' }}>
//                         <div style={badgeStyle}>🏠 {property.category}</div>
//                         <div style={badgeStyle}>🛋️ {property.furnishingStatus || 'Unfurnished'}</div>
//                         <div style={{ ...badgeStyle, background: isRented ? '#f1f5f9' : '#dcfce7', color: isRented ? '#64748b' : '#166534' }}>
//                             👥 {property.tenantPreference === 'All' ? 'Family & Bachelors' : property.tenantPreference}
//                         </div>
//                         <div style={badgeStyle}>🅿️ {property.parking}</div>
//                     </div>

//                     {/* AMENITIES */}
//                     {property.amenities?.length > 0 && (
//                         <div style={{ marginTop: '30px' }}>
//                             <h3 style={sectionTitleStyle}>🏢 Society Amenities</h3>
//                             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px' }}>
//                                 {property.amenities.map(amenity => (
//                                     <div key={amenity} style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', textAlign: 'center', border: '1px solid #e2e8f0', opacity: isRented ? 0.6 : 1 }}>
//                                         <span style={{ display:'block', fontSize:'1.8rem', marginBottom:'5px', filter: isRented ? 'grayscale(100%)' : 'none' }}>{getAmenityIcon(amenity)}</span>
//                                         <span style={{ fontSize:'0.9rem', color:'#475569', fontWeight:'600' }}>{amenity}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     <div style={{ marginTop: '30px' }}>
//                         <h3 style={sectionTitleStyle}>📝 Description</h3>
//                         <p style={{ lineHeight: '1.8', color: '#334155', whiteSpace: 'pre-line', fontSize: '1.05rem' }}>{property.description}</p>
//                     </div>

//                     <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #e2e8f0' }}>
                        
//                         {isOwner ? (
//                             <div style={{ padding: '25px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', textAlign:'center' }}>
//                                 <h3 style={{marginBottom:'15px', color:'#9a3412'}}>Owner Controls</h3>
//                                 <div style={{display:'flex', gap:'15px', justifyContent:'center'}}>
//                                     <button onClick={() => navigate(`/edit-property/${id}`)} className="btn" style={{ background: '#f59e0b', color: 'white', padding:'10px 20px', borderRadius:'6px', border:'none', cursor:'pointer', fontWeight:'bold' }}>✏️ Edit</button>
//                                     <button onClick={handleDelete} className="btn" style={{ background: '#ef4444', color: 'white', padding:'10px 20px', borderRadius:'6px', border:'none', cursor:'pointer', fontWeight:'bold' }}>🗑️ Delete</button>
//                                 </div>
//                             </div>
//                         ) : isRented ? (
//                             // --- PROFESSIONAL RENTED CARD ---
//                             <div style={{ padding: '40px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', textAlign:'center' }}>
//                                 <div style={{fontSize:'3rem', marginBottom:'10px', filter: 'grayscale(100%)'}}>🔒</div>
//                                 <h2 style={{color:'#475569', marginBottom:'10px', fontSize:'1.5rem'}}>Property No Longer Available</h2>
//                                 <p style={{color:'#64748b', fontSize:'1rem', maxWidth:'500px', margin:'0 auto'}}>
//                                     This property has been rented out and is off the market. You can explore similar properties in the same area.
//                                 </p>
//                                 <button onClick={() => navigate('/properties')} style={{marginTop:'25px', background:'#334155', color:'white', padding:'12px 25px', borderRadius:'6px', border:'none', cursor:'pointer', fontWeight:'600' }}>
//                                     View Other Properties
//                                 </button>
//                             </div>
//                         ) : (
//                             <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '30px' }}>
//                                 <h3 style={{ marginBottom: '20px', color: '#0369a1' }}>Interested? Schedule a Visit</h3>
//                                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
//                                     <div style={{display:'flex', flexDirection:'column'}}>
//                                         <label style={{fontSize:'0.85rem', fontWeight:'600', marginBottom:'5px', color:'#0369a1'}}>Date</label>
//                                         <input type="date" value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
//                                     </div>
//                                     <div style={{display:'flex', flexDirection:'column'}}>
//                                         <label style={{fontSize:'0.85rem', fontWeight:'600', marginBottom:'5px', color:'#0369a1'}}>Time</label>
//                                         <input type="time" value={visitTime} onChange={(e) => setVisitTime(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
//                                     </div>
//                                     <div style={{display:'flex', flexDirection:'column', gridColumn: '1 / -1'}}>
//                                         <label style={{fontSize:'0.85rem', fontWeight:'600', marginBottom:'5px', color:'#0369a1'}}>Message</label>
//                                         <input type="text" placeholder="Hi, I'm interested..." value={message} onChange={(e) => setMessage(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
//                                     </div>
//                                 </div>
//                                 <button onClick={handleBook} className="btn" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', background: '#2563eb', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', transition: '0.2s' }}>
//                                     {user ? "Send Visit Request" : "Login to Schedule Visit"}
//                                 </button>
//                                 {!user && <p style={{textAlign:'center', marginTop:'10px', color:'#64748b', fontSize:'0.9rem'}}>Login required to contact the owner.</p>}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // --- STYLES ---
// const lightboxOverlayStyle = {
//     position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
//     background: 'rgba(0, 0, 0, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center',
//     zIndex: 9999
// };

// const lightboxImgStyle = {
//     maxHeight: '90vh', maxWidth: '90vw', borderRadius: '8px', boxShadow: '0 0 20px rgba(0,0,0,0.5)'
// };

// const closeBtnStyle = {
//     position: 'absolute', top: '20px', right: '30px', background: 'none', border: 'none',
//     color: 'white', fontSize: '3rem', cursor: 'pointer', zIndex: 10000
// };

// const navBtnStyle = {
//     position: 'absolute', top: '50%', transform: 'translateY(-50%)',
//     background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none',
//     fontSize: '2rem', padding: '10px 15px', cursor: 'pointer', borderRadius: '50%',
//     transition: '0.2s'
// };

// const counterStyle = {
//     position: 'absolute', bottom: '20px', color: 'white', fontSize: '1rem', opacity: 0.8
// };

// const badgeStyle = { background: '#f1f5f9', padding: '8px 16px', borderRadius: '30px', fontWeight: '600', color: '#334155', border: '1px solid #e2e8f0' };
// const sectionTitleStyle = { fontSize: '1.3rem', color: '#1e293b', marginBottom: '15px', fontWeight: '700' };

// export default PropertyDetails;




import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../axiosConfig';

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const getUser = () => { try { return JSON.parse(localStorage.getItem('user')); } catch (err) { return null; } };
    const user = getUser();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // --- LIGHTBOX STATE ---
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [allImages, setAllImages] = useState([]);

    // --- BOOKING STATE ---
    const [moveInDate, setMoveInDate] = useState('');
    const [visitTime, setVisitTime] = useState(''); 
    const [message, setMessage] = useState('');

    // --- HELPER: OPTIMIZE URL ---
    const getOptimizedUrl = (url, width) => {
        if (!url || !url.includes('cloudinary.com')) return url;
        return url.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
    };

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await API.get(`/property/${id}`);
                const data = response.data;
                setProperty(data);
                
                const images = [data.mainImage];
                if (data.galleryImages && data.galleryImages.length > 0) {
                    images.push(...data.galleryImages);
                }
                setAllImages(images.filter(img => img));
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isLightboxOpen) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, currentImageIndex]);

    const openLightbox = (index) => { setCurrentImageIndex(index); setIsLightboxOpen(true); };
    const closeLightbox = () => setIsLightboxOpen(false);
    const nextImage = (e) => { if(e) e.stopPropagation(); setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1)); };
    const prevImage = (e) => { if(e) e.stopPropagation(); setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1)); };

    const handleDelete = async () => {
        if (window.confirm("Are you sure? This cannot be undone.")) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await API.delete(`/property/${id}`, config);
                alert("Property Deleted");
                navigate('/properties');
            } catch (error) { alert("Delete failed"); }
        }
    };

    const handleBook = async () => {
        if (!user) { alert("Please login to book!"); navigate('/login'); return; }
        if (!moveInDate || !visitTime || !message) { alert("Please fill date, time, and message."); return; }
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await API.post('/booking', { propertyId: property._id, moveInDate, visitTime, message }, config);
            alert("Request Sent! Check your Dashboard for updates. 🚀");
            navigate('/dashboard'); 
        } catch (error) {
            alert("Booking Failed: " + (error.response?.data?.message || "Server Error"));
        }
    };

    const getAmenityIcon = (amenity) => {
        const icons = { "Lift": "🛗", "Power Backup": "🔋", "Security": "👮", "Gym": "💪", "Swimming Pool": "🏊", "Garden": "🌳", "CCTV": "📹", "Club House": "🎉" };
        return icons[amenity] || "🏢";
    };

    if (loading) return <h2 style={{textAlign:'center', marginTop:'80px', color:'#64748b'}}>Loading...</h2>;
    if (!property) return <h2 style={{textAlign:'center', marginTop:'80px', color:'#ef4444'}}>Property not found</h2>;

    const isRented = property.status === 'Rented';
    const ownerId = property.owner?._id || property.owner;
    const isOwner = user && (user.role === 'owner' || true) && (user._id === ownerId);
    const imgFilter = isRented ? 'grayscale(100%) contrast(90%)' : 'none';

    return (
        <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
            
            {/* LIGHTBOX */}
            {isLightboxOpen && (
                <div style={lightboxOverlayStyle} onClick={closeLightbox}>
                    <button style={closeBtnStyle}>×</button>
                    <button style={{...navBtnStyle, left: '20px'}} onClick={prevImage}>❮</button>
                    <img src={allImages[currentImageIndex]} alt="Full Screen" style={{...lightboxImgStyle, filter: imgFilter}} onClick={(e) => e.stopPropagation()} />
                    <button style={{...navBtnStyle, right: '20px'}} onClick={nextImage}>❯</button>
                    <div style={counterStyle}>{currentImageIndex + 1} / {allImages.length}</div>
                </div>
            )}

            <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 16px', border:'1px solid #e2e8f0', background:'white', borderRadius:'8px', color:'#64748b', fontWeight:'600' }}>&larr; Back</button>
            
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                
                {/* HERO IMAGE */}
                <div style={{ height: '450px', position: 'relative', background: '#f1f5f9', cursor: 'pointer' }} onClick={() => openLightbox(0)}>
                    <img 
                        src={getOptimizedUrl(property.mainImage, 1000)} // REQUEST 1000px
                        alt={property.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: imgFilter, transition: '0.3s' }} 
                    />
                    <div style={{position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(255,255,255,0.9)', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'}}>📷 View {allImages.length} Photos</div>
                    {isRented && (<div style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.6)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', backdropFilter: 'blur(2px)' }}><div style={{ border: '2px solid white', padding: '15px 40px', color: 'white', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', fontSize: '1.5rem', background: 'rgba(0,0,0,0.5)' }}>Property Rented</div><p style={{ color: '#e2e8f0', marginTop: '10px', fontSize: '0.9rem' }}>This listing is no longer available</p></div>)}
                </div>

                {/* GALLERY STRIP */}
                {property.galleryImages?.length > 0 && (
                    <div style={{ display: 'flex', gap: '10px', padding: '15px', overflowX: 'auto', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        {property.galleryImages.map((img, idx) => (
                            <img 
                                key={idx} 
                                src={getOptimizedUrl(img, 200)} // REQUEST 200px
                                alt={`gallery-${idx}`} 
                                onClick={() => openLightbox(idx + 1)} 
                                style={{ height: '100px', width: '150px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', border: '1px solid #cbd5e1', filter: imgFilter, opacity: isRented ? 0.7 : 1 }} 
                            />
                        ))}
                    </div>
                )}

                <div style={{ padding: '30px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'20px', marginBottom: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'8px'}}>
                                <h1 style={{ color: isRented ? '#94a3b8' : '#1e293b', fontSize:'2.2rem', margin:0 }}>{property.title}</h1>
                                {isRented && (<span style={{background:'#334155', color:'white', padding:'4px 12px', borderRadius:'6px', fontSize:'0.8rem', fontWeight:'bold', textTransform:'uppercase'}}>Rented</span>)}
                            </div>
                            {!isRented && (<div style={{ display: 'inline-block', background: '#fff1f2', color: '#be123c', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px', border: '1px solid #fda4af' }}>🔥 High Demand: People are currently viewing this</div>)}
                            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>📍 {property.location}</p>
                        </div>
                        <div style={{ textAlign:'right', background: isRented ? '#f1f5f9' : '#f8fafc', padding: '15px 25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <h2 style={{ color: isRented ? '#64748b' : '#2563eb', fontSize:'2rem', margin:0, fontWeight: '800', textDecoration: isRented ? 'line-through' : 'none' }}>₹{property.price.toLocaleString()}</h2>
                            <span style={{ fontSize:'0.9rem', color:'#64748b' }}>per month</span>
                        </div>
                    </div>

                    {property.tags && property.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                            {property.tags.map((tag, i) => (<span key={i} style={{ background: isRented ? '#f1f5f9' : '#e0f2fe', color: isRented ? '#94a3b8' : '#0369a1', padding: '5px 12px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>#{tag}</span>))}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingBottom: '30px', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={badgeStyle}>🏠 {property.category}</div>
                        <div style={badgeStyle}>🛋️ {property.furnishingStatus || 'Unfurnished'}</div>
                        <div style={{ ...badgeStyle, background: isRented ? '#f1f5f9' : '#dcfce7', color: isRented ? '#64748b' : '#166534' }}>👥 {property.tenantPreference === 'All' ? 'Family & Bachelors' : property.tenantPreference}</div>
                        <div style={badgeStyle}>🅿️ {property.parking}</div>
                    </div>

                    {property.amenities?.length > 0 && (
                        <div style={{ marginTop: '30px' }}>
                            <h3 style={sectionTitleStyle}>🏢 Society Amenities</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px' }}>
                                {property.amenities.map(amenity => (
                                    <div key={amenity} style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', textAlign: 'center', border: '1px solid #e2e8f0', opacity: isRented ? 0.6 : 1 }}>
                                        <span style={{ display:'block', fontSize:'1.8rem', marginBottom:'5px', filter: isRented ? 'grayscale(100%)' : 'none' }}>{getAmenityIcon(amenity)}</span>
                                        <span style={{ fontSize:'0.9rem', color:'#475569', fontWeight:'600' }}>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '30px' }}>
                        <h3 style={sectionTitleStyle}>📝 Description</h3>
                        <p style={{ lineHeight: '1.8', color: '#334155', whiteSpace: 'pre-line', fontSize: '1.05rem' }}>{property.description}</p>
                    </div>

                    <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #e2e8f0' }}>
                        {isOwner ? (
                            <div style={{ padding: '25px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', textAlign:'center' }}>
                                <h3 style={{marginBottom:'15px', color:'#9a3412'}}>Owner Controls</h3>
                                <div style={{display:'flex', gap:'15px', justifyContent:'center'}}>
                                    <button onClick={() => navigate(`/edit-property/${id}`)} className="btn" style={{ background: '#f59e0b', color: 'white', padding:'10px 20px', borderRadius:'6px', border:'none', cursor:'pointer', fontWeight:'bold' }}>✏️ Edit</button>
                                    <button onClick={handleDelete} className="btn" style={{ background: '#ef4444', color: 'white', padding:'10px 20px', borderRadius:'6px', border:'none', cursor:'pointer', fontWeight:'bold' }}>🗑️ Delete</button>
                                </div>
                            </div>
                        ) : isRented ? (
                            <div style={{ padding: '40px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', textAlign:'center' }}>
                                <div style={{fontSize:'3rem', marginBottom:'10px', filter: 'grayscale(100%)'}}>🔒</div>
                                <h2 style={{color:'#475569', marginBottom:'10px', fontSize:'1.5rem'}}>Property No Longer Available</h2>
                                <p style={{color:'#64748b', fontSize:'1rem', maxWidth:'500px', margin:'0 auto'}}>This property has been rented out and is off the market.</p>
                                <button onClick={() => navigate('/properties')} style={{marginTop:'25px', background:'#334155', color:'white', padding:'12px 25px', borderRadius:'6px', border:'none', cursor:'pointer', fontWeight:'600' }}>View Other Properties</button>
                            </div>
                        ) : (
                            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '30px' }}>
                                <h3 style={{ marginBottom: '20px', color: '#0369a1' }}>Interested? Schedule a Visit</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                                    <div style={{display:'flex', flexDirection:'column'}}><label style={{fontSize:'0.85rem', fontWeight:'600', marginBottom:'5px', color:'#0369a1'}}>Date</label><input type="date" value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} /></div>
                                    <div style={{display:'flex', flexDirection:'column'}}><label style={{fontSize:'0.85rem', fontWeight:'600', marginBottom:'5px', color:'#0369a1'}}>Time</label><input type="time" value={visitTime} onChange={(e) => setVisitTime(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} /></div>
                                    <div style={{display:'flex', flexDirection:'column', gridColumn: '1 / -1'}}><label style={{fontSize:'0.85rem', fontWeight:'600', marginBottom:'5px', color:'#0369a1'}}>Message</label><input type="text" placeholder="Hi, I'm interested..." value={message} onChange={(e) => setMessage(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} /></div>
                                </div>
                                <button onClick={handleBook} className="btn" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', background: '#2563eb', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', transition: '0.2s' }}>{user ? "Send Visit Request" : "Login to Schedule Visit"}</button>
                                {!user && <p style={{textAlign:'center', marginTop:'10px', color:'#64748b', fontSize:'0.9rem'}}>Login required to contact the owner.</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
const lightboxOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 };
const lightboxImgStyle = { maxHeight: '90vh', maxWidth: '90vw', borderRadius: '8px', boxShadow: '0 0 20px rgba(0,0,0,0.5)' };
const closeBtnStyle = { position: 'absolute', top: '20px', right: '30px', background: 'none', border: 'none', color: 'white', fontSize: '3rem', cursor: 'pointer', zIndex: 10000 };
const navBtnStyle = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none', fontSize: '2rem', padding: '10px 15px', cursor: 'pointer', borderRadius: '50%', transition: '0.2s' };
const counterStyle = { position: 'absolute', bottom: '20px', color: 'white', fontSize: '1rem', opacity: 0.8 };
const badgeStyle = { background: '#f1f5f9', padding: '8px 16px', borderRadius: '30px', fontWeight: '600', color: '#334155', border: '1px solid #e2e8f0' };
const sectionTitleStyle = { fontSize: '1.3rem', color: '#1e293b', marginBottom: '15px', fontWeight: '700' };
export default PropertyDetails;