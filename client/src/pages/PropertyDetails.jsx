// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import API from '../axiosConfig';

// const PropertyDetails = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
    
//     // Safely get user
//     const getUser = () => { try { return JSON.parse(localStorage.getItem('user')); } catch (err) { return null; } };
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

//     // --- HELPER: OPTIMIZE URL ---
//     const getOptimizedUrl = (url, width) => {
//         if (!url || !url.includes('cloudinary.com')) return url;
//         return url.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
//     };

//     useEffect(() => {
//         const fetchProperty = async () => {
//             try {
//                 const response = await API.get(`/property/${id}`);
//                 const data = response.data;
//                 setProperty(data);
                
//                 // Combine Main Image + Gallery for Lightbox
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

//     // Keyboard Navigation for Lightbox
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

//     const openLightbox = (index) => { setCurrentImageIndex(index); setIsLightboxOpen(true); };
//     const closeLightbox = () => setIsLightboxOpen(false);
//     const nextImage = (e) => { if(e) e.stopPropagation(); setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1)); };
//     const prevImage = (e) => { if(e) e.stopPropagation(); setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1)); };

//     const handleDelete = async () => {
//         if (window.confirm("Are you sure? This cannot be undone.")) {
//             try {
//                 const config = { headers: { Authorization: `Bearer ${user.token}` } };
//                 await API.delete(`/property/${id}`, config);
//                 alert("Property Deleted");
//                 navigate('/properties');
//             } catch (error) { alert("Delete failed"); }
//         }
//     };

//     const handleBook = async () => {
//         if (!user) { alert("Please login to book!"); navigate('/login'); return; }
        
//         // 🔒 Extra Frontend Security Check
//         if (property.status === 'Rented') { alert("This property is already rented."); return; }

//         if (!moveInDate || !visitTime || !message) { alert("Please fill date, time, and message."); return; }
        
//         try {
//             const config = { headers: { Authorization: `Bearer ${user.token}` } };
//             await API.post('/booking', { propertyId: property._id, moveInDate, visitTime, message }, config);
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
//     // Check if current user is owner (safely handle if user is null)
//     const isOwner = user && (user._id === ownerId);
    
//     // VISUAL EFFECT: If rented, grayscale slightly
//     const imgFilter = isRented ? 'grayscale(100%) contrast(90%)' : 'none';

//     return (
//         <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
            
//             {/* LIGHTBOX MODAL */}
//             {isLightboxOpen && (
//                 <div style={lightboxOverlayStyle} onClick={closeLightbox}>
//                     <button style={closeBtnStyle}>×</button>
//                     <button style={{...navBtnStyle, left: '20px'}} onClick={prevImage}>❮</button>
//                     <img src={allImages[currentImageIndex]} alt="Full Screen" style={{...lightboxImgStyle, filter: imgFilter}} onClick={(e) => e.stopPropagation()} />
//                     <button style={{...navBtnStyle, right: '20px'}} onClick={nextImage}>❯</button>
//                     <div style={counterStyle}>{currentImageIndex + 1} / {allImages.length}</div>
//                 </div>
//             )}

//             <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 16px', border:'1px solid #e2e8f0', background:'white', borderRadius:'8px', color:'#64748b', fontWeight:'600' }}>&larr; Back</button>
            
//             <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                
//                 {/* HERO IMAGE SECTION */}
//                 <div style={{ height: '450px', position: 'relative', background: '#f1f5f9', cursor: 'pointer' }} onClick={() => openLightbox(0)}>
//                     <img 
//                         src={getOptimizedUrl(property.mainImage, 1000)} 
//                         alt={property.title} 
//                         style={{ width: '100%', height: '100%', objectFit: 'cover', filter: imgFilter, transition: '0.3s' }} 
//                     />
                    
//                     <div style={{position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(255,255,255,0.9)', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'}}>
//                         📷 View {allImages.length} Photos
//                     </div>

//                     {/* --- RENTED OVERLAY --- */}
//                     {isRented && (
//                         <div style={{ 
//                             position:'absolute', top:0, left:0, width:'100%', height:'100%', 
//                             background:'rgba(0,0,0,0.6)', 
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

//                 {/* GALLERY STRIP */}
//                 {property.galleryImages?.length > 0 && (
//                     <div style={{ display: 'flex', gap: '10px', padding: '15px', overflowX: 'auto', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
//                         {property.galleryImages.map((img, idx) => (
//                             <img 
//                                 key={idx} 
//                                 src={getOptimizedUrl(img, 200)} 
//                                 alt={`gallery-${idx}`} 
//                                 onClick={() => openLightbox(idx + 1)} 
//                                 style={{ height: '100px', width: '150px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', border: '1px solid #cbd5e1', filter: imgFilter, opacity: isRented ? 0.7 : 1 }} 
//                             />
//                         ))}
//                     </div>
//                 )}

//                 <div style={{ padding: '30px' }}>
                    
//                     {/* TITLE & PRICE HEADER */}
//                     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'20px', marginBottom: '20px' }}>
//                         <div style={{ flex: 1 }}>
//                             <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'8px'}}>
//                                 <h1 style={{ color: isRented ? '#94a3b8' : '#1e293b', fontSize:'2.2rem', margin:0 }}>{property.title}</h1>
//                                 {isRented && (
//                                     <span style={{background:'#334155', color:'white', padding:'4px 12px', borderRadius:'6px', fontSize:'0.8rem', fontWeight:'bold', textTransform:'uppercase'}}>
//                                         Rented
//                                     </span>
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

//                     {/* TAGS */}
//                     {property.tags && property.tags.length > 0 && (
//                         <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
//                             {property.tags.map((tag, i) => (
//                                 <span key={i} style={{ background: isRented ? '#f1f5f9' : '#e0f2fe', color: isRented ? '#94a3b8' : '#0369a1', padding: '5px 12px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
//                                     #{tag}
//                                 </span>
//                             ))}
//                         </div>
//                     )}

//                     {/* KEY FEATURES BADGES */}
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

//                     {/* ========================================================= */}
//                     {/* ACTION SECTION (THIS IS THE LOGIC YOU ASKED FOR)          */}
//                     {/* ========================================================= */}
//                     <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #e2e8f0' }}>
                        
//                         {isOwner ? (
//                             // 1. OWNER VIEW: Can Edit/Delete
//                             <div style={{ padding: '25px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', textAlign:'center' }}>
//                                 <h3 style={{marginBottom:'15px', color:'#9a3412'}}>Owner Controls</h3>
//                                 <div style={{display:'flex', gap:'15px', justifyContent:'center'}}>
//                                     <button onClick={() => navigate(`/edit-property/${id}`)} className="btn" style={{ background: '#f59e0b', color: 'white', padding:'10px 20px', borderRadius:'6px', border:'none', cursor:'pointer', fontWeight:'bold' }}>✏️ Edit</button>
//                                     <button onClick={handleDelete} className="btn" style={{ background: '#ef4444', color: 'white', padding:'10px 20px', borderRadius:'6px', border:'none', cursor:'pointer', fontWeight:'bold' }}>🗑️ Delete</button>
//                                 </div>
//                             </div>

//                         ) : isRented ? (
//                             // 2. RENTED VIEW: FORM IS REMOVED (No Inputs, No Button)
//                             <div style={{ padding: '40px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', textAlign:'center' }}>
//                                 <div style={{fontSize:'3rem', marginBottom:'10px', filter: 'grayscale(100%)'}}>🔒</div>
//                                 <h2 style={{color:'#475569', marginBottom:'10px', fontSize:'1.5rem'}}>Property No Longer Available</h2>
//                                 <p style={{color:'#64748b', fontSize:'1rem', maxWidth:'500px', margin:'0 auto'}}>
//                                     This property has been rented out and is off the market. You can explore similar properties in the same area.
//                                 </p>
//                                 <button 
//                                     onClick={() => navigate('/properties')} 
//                                     style={{marginTop:'25px', background:'#334155', color:'white', padding:'12px 25px', borderRadius:'6px', border:'none', cursor:'pointer', fontWeight:'600' }}
//                                 >
//                                     View Other Properties
//                                 </button>
//                             </div>

//                         ) : (
//                             // 3. AVAILABLE VIEW: SHOW FORM
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
// const lightboxOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 };
// const lightboxImgStyle = { maxHeight: '90vh', maxWidth: '90vw', borderRadius: '8px', boxShadow: '0 0 20px rgba(0,0,0,0.5)' };
// const closeBtnStyle = { position: 'absolute', top: '20px', right: '30px', background: 'none', border: 'none', color: 'white', fontSize: '3rem', cursor: 'pointer', zIndex: 10000 };
// const navBtnStyle = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none', fontSize: '2rem', padding: '10px 15px', cursor: 'pointer', borderRadius: '50%', transition: '0.2s' };
// const counterStyle = { position: 'absolute', bottom: '20px', color: 'white', fontSize: '1rem', opacity: 0.8 };
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

    const getOptimizedUrl = (url, width) => {
        // Use the first shop image as ultimate fallback if url is missing
        if (!url) return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1p6dLe2ssnNGDA1crq3zKc8bUJgZhiTtC6Q&s';
        if (!url.includes('cloudinary.com')) return url;
        return url.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
    };

    useEffect(() => {
        const fetchProperty = async () => {
            setLoading(true);

            // 1. CHECK IF FAKE PROPERTY
            if (id.startsWith('fake-')) {
                // Define Image Pools
                const shopImages = [
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1p6dLe2ssnNGDA1crq3zKc8bUJgZhiTtC6Q&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2aML13Sf4d1pFmS4_ptxxG0D62BeZKmInUg&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQizJzytLyEdTQ0DJ4A89XADUIxbxHoyBA-KQ&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV7mu5_K86YQaa7uWbK8um8WRxSWd7YnqGew&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROOhhhz97J0WnXtBXUSzPcc9o3WX6FXpnjtg&s'
                ];
                const officeImages = [
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7g43Ku9ljEAaidEsItfT0gmfIYhMD455a4g&s',
                    'https://img.freepik.com/premium-photo/rooms-empty-office-with-one-with-windows-technical-ceilings-blue-carpeted-floors-individual-offices_449839-6569.jpg',
                    'https://business.cornell.edu/wp-content/uploads/sites/2/2023/06/AdobeStock_empty.office.600x400.jpg',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8XtUqzrNCJIHYjckZB_hbv4DMB6j3G8TfdQ&s',
                    'https://static01.nyt.com/images/2023/09/01/multimedia/01Office-Space-jpwv/01Office-Space-jpwv-mediumSquareAt3X.jpg',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJZ8Qx64YUuSW-XC467pWt7k3XC5e_smPriA&s'
                ];
                
                const plainFlatImages = [
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQED6-fhf2_TdY3IClhj9doL4EnGfRTG6uxdA&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnEG-D8-txps3aU7lEq4FA7IekzLjnG9Lx4bVzZ2QXSw&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnSpZeSNN3gcE1zEqy-Mdc1cIS8yyNfT3ppA&s',
                    'https://housing-images.n7net.in/01c16c28/9edb849e007d9d6c7dc37a9f86827667/v0/medium/1_bhk_independent_builder_floor-for-rent-malviya_nagar-New+Delhi-bedroom.jpg',
                    'https://imagecdn.99acres.com/media1/34518/12/690372303M-1766627498408.webp',
                    'https://imagecdn.99acres.com/media1/33346/14/666934731M-1766703555570.webp',
                    'https://thumbs.dreamstime.com/b/generic-modern-residential-empty-bedroom-interior-kent-washington-modern-residential-empty-bedroom-interior-420106979.jpg',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM9KrFpENOsiyr7zjzPy89OfkVTyVMKq6hhw&s',
                    'https://property-img.s3.ap-south-1.amazonaws.com/prop_17662246452.jpeg',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlq-Th-rx9vy3mW7iPXTkEJIAb88bbxo117w&s',
                    'https://is1-2.housingcdn.com/01c16c28/40dbfcd97eb64f549a1a748157f3b064/v0/fs/1_bhk_apartment-for-rent-goregaon_west-Mumbai-bedroom.jpg',
                    'https://img.staticmb.com/mbphoto/property/cropped_images/2025/Nov/18/Photo_h470_w1080/68821233_3_PropertyImage1763479353710_470_1080.jpg',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxVeXc4j1PRitKvXBpb1SO2TzMxe_LNz5eLPuLcnntuQ&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxV8h1aBi_nohno5d0fXXC0o66wOd7RYYCKRrV4y-SrA&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIcK0rtVgCu2-c29D_5tjsj72JLol55pBs-ktWgO5ezQ&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF0cR4jm6kXFMfWzucMfahqS0g96WFYRJCdSfe8uGspg&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE5_ttm7wDkS-xBruW7OGkLpiS0CAKtNncMpqn2jXArQ&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWKzVBuqJ1NDI96brNj_Z3yW5bJfoaQzDAgtwO3pcNNw&s',
                    'https://www.magicbricks.com/3-bhk-independent-house-for-rent-in-janaki-nagar-maduravoyal-chennai-pppfr',
                    'https://imagecdn.99acres.com/media1/34462/8/689248877M-1766394213414.webp',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu0y2z_Jaac471WXR8h_rmDpAqCB2dhhAzeQ&s',
                    'https://housing-images.n7net.in/01c16c28/477c982eb19261b26c75379e7a9b00e4/v0/medium/3_bhk_apartment-for-rent-vidya_nagar_bilaspur-Bilaspur-hall.jpg',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTuNlwok1GFGlBPeu_NZFoesmanxmp6gKH9A&s',
                    'https://images.nobroker.in/images/8a9f9386997a28d801997a615fda1749/8a9f9386997a28d801997a615fda1749_239539_290251_medium.jpg',
                    'https://images.nobroker.in/images/8a9fa2839a670034019a6753698e2182/8a9fa2839a670034019a6753698e2182_23336_122940_medium.jpg',
                    'https://i.pinimg.com/736x/cb/6f/18/cb6f18c70e3b3b84b13981f790659500.jpg',
                    'https://i.pinimg.com/736x/3e/29/8e/3e298eb47ee0d1840f51e411278265fb.jpg',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtdMgcJ3dy0zchQ_N4XsmWWVPizvlGz7mXBQ&s',
                    'https://images.nobroker.in/images/8a9fa190989415760198947c9a5f27a1/8a9fa190989415760198947c9a5f27a1_96556_474256_medium.jpg',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXwU3eXTesNuthyWiemGJzbo2euszHGZDHmNRGNwDOmA&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBOrAkaQ0Z8iOf_utxDU4pdAPiRYKteuHqzC7BWKgzxQ&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK42kp1MB2KXZvlKdGXhwb7C197rDHLzQJIFO07y1eKw&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1eIZnfSP8b0_V8Llcm1Mn_UBmeKE4sCVQKSmdOfFRgw&s'
                ];

                const furnishedImages = [
                    'https://nagpurrental.com/wp-content/uploads/2023/07/3BHK-FLAT-Rent-Dattatray-Nagar-Nagpur.jpeg',
                    'https://nagpurrental.com/wp-content/uploads/2022/07/images1.jpg',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY6-tOTDmXAR99r7eXgLTYplP9i8A4M8mgVQ&s',
                    'https://5.imimg.com/data5/SELLER/Default/2024/10/461228767/PS/TJ/FK/2703532/3-bhk-fully-furnished-flat.jpg',
                    'https://guesthousewale.com/storage/properties/noida/noida-extension/2bhk/1/2bhk-fully-furnished-flat-in-noida-extension-4.jpg',
                    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/566202883.jpg?k=9e4a37b06b655ebde4c92fb12399035a85c9d4966e7cca20b6c845865365eb06&o=',
                    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/519060992.jpg?k=b058066d4e154d7c5558be72168ea0966a85ae5f1c919b67931e9870716ac1e7&o=',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSghrztBlvijoRhquV8VQxks8uJ5w7NmDHnMw&s',
                    'https://d1hy6t2xeg0mdl.cloudfront.net/image/84467/ffd20221d2/1024-width',
                    'https://i.pinimg.com/236x/ab/c7/3e/abc73e500e9ea5f3b9acae0260f44440.jpg',
                    'https://i.pinimg.com/736x/f7/e2/9d/f7e29d37e8fb5eed31aa8e5a8917df58.jpg',
                    'https://images.oyoroomscdn.com/uploads/hotel_image/210502/small/slsdmlgbyvjg.jpg',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGlKpG5FmS8TlwVvzELJ6jLte_Iml6B8kJ1BKMbK1eVw&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxrirZlQAuvX1jNIoxqC_dZvba9Tr0witDhB8auWUbiw&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR91EgPRHszPiWzeGLzB-50DAoGWDLCjbL2uGKcsnPa4g&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc77Cz9TesUXU2JAIbLpt9sUOtJCmlAjo2-2tlatDh8w&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvbJkqgVldjTebJyLzfP42fpTO-R9-2hDYM3NYgo4sGQ&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToYmmhrLA5yMRQvH84LEkm0G0Ojq_QE5uOhtgaMqkcHg&s',
                    'https://images.squarespace-cdn.com/content/v1/56dfd5cc9f7266ed7f04b64d/1585743758868-H4OQJFRUE73J6H4CV142/image-asset.jpeg',
                    'https://images.squarespace-cdn.com/content/v1/56dfd5cc9f7266ed7f04b64d/1585743751085-N2317B7K3I2YBZHPHENO/image-asset.jpeg',
                    'https://c8.alamy.com/comp/2RTC433/mauritania-adrar-region-chinguetti-local-kitchen-2RTC433.jpg',
                    'https://5.imimg.com/data5/DL/SR/MY-12354255/modular-kitchen-designing-services-500x500.jpg',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOSlIRhkLPhSRWEghvu7xDMURrR9JzYTgq6tjnxF9DrQ&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdOI1ewjpse-7E-UbfVzsdDedll8qYjhr5LQ&s',
                    'https://www.winteria.in/wp-content/uploads/2023/06/indian-style-small-modular-kitchen-design.png',
                    'https://www.shutterstock.com/image-photo/19apr2016-small-house-interior-shoing-260nw-1137395780.jpg',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdglPSAmqG27H6s3LOx5imaYXNAYp885GqFw&s',
                    'https://content.jdmagicbox.com/comp/ahmedabad/39/079p57039/catalogue/indramohansingh-soni-thaltej-ahmedabad-paying-guest-accommodations-47019hb.jpg',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSfCN5e0JbGszRVWUapGu_ypYRk4XyBiA7CPm_bnKYeQ&s',
                    'https://images.homify.com/v1438440089/p/photo/image/324794/simple-small-kitchen-design.jpg',
                    'https://5.imimg.com/data5/DV/VK/BE/ANDROID-1943402/product-jpeg.jpg',
                    'https://www.kolkatainterior.in/project/images/Pankaj-Das/Kitchen-South-Wall-Lower-Cabinets.jpg',
                    'https://thumbs.dreamstime.com/b/small-house-interior-shoing-kitchen-middle-class-kalyan-mumbai-march-maharashtra-india-asia-174566741.jpg',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE26w1BRRl12nF-METZZsQGuKm__SDPudgzPXlijoeuQ&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYpKfvB1SI5wz45rAHmrKOoWZqd8x7p7_q1s90dQeeyQ&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6rDxTOgJ2eSFij_ogNwxDLTBBt3C9vuUJVw&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD2ZEgCHnDWDjotyxICklkupdGgAPh3Ik8lQ&s',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST0XZflK_q_xz3nB6RKysd-jhgma4d5MAyjQ&s'
                ];
                
                const luxuryImages = [
                    'https://nagpurrental.com/wp-content/uploads/2022/07/images1.jpg',
                    'https://5.imimg.com/data5/SELLER/Default/2024/10/461228767/PS/TJ/FK/2703532/3-bhk-fully-furnished-flat.jpg',
                    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/519060992.jpg?k=b058066d4e154d7c5558be72168ea0966a85ae5f1c919b67931e9870716ac1e7&o='
                ];

                setTimeout(() => {
                    let fakeData = { _id: id, isFake: true, location: "Nagpur", status: "Available", owner: { _id: 'admin', name: 'Verified Agent' } };
                    let selectedImages = [];

                    // Determine type based on ID string created in AllProperties
                    if (id.includes('CommercialShop')) {
                         fakeData = { ...fakeData, title: "Prime Commercial Shop", category: "Commercial Shop", price: 15000, furnishingStatus: "Any", tenantPreference: "All",
                            description: "Ground floor shop available in busy market area. Good visibility. Suitable for retail or small office.",
                            amenities: ["Water Supply", "Parking"], tags: ["Main Road", "High Footfall"] };
                         selectedImages = shopImages;
                    } else if (id.includes('OfficeSpace')) {
                         fakeData = { ...fakeData, title: "Ready to move Office Space", category: "Office Space", price: 22000, furnishingStatus: "Semi-Furnished", tenantPreference: "All",
                            description: "Office space with cabins and open seating area. Good connectivity. Washroom attached.",
                            amenities: ["Lift", "Power Backup", "Security"], tags: ["Commercial", "Ready"] };
                        selectedImages = officeImages;
                    } else if (id.includes('IndependentHouse') || id.includes('Villa')) {
                         fakeData = { ...fakeData, title: id.includes('Villa') ? "Luxury Villa" : "Spacious Independent House", category: id.includes('Villa') ? "Villa" : "Independent House", price: 30000, furnishingStatus: id.includes('Villa') ? "Fully Furnished" : "Unfurnished", tenantPreference: "Family",
                            description: "Independent property with terrace access. Spacious rooms, separate meter. Ideal for families looking for privacy.",
                            amenities: ["Parking", "Water Supply", "Garden"], tags: ["Private", "Spacious"] };
                        selectedImages = id.includes('Villa') ? furnishedImages : plainFlatImages;
                    } else if (id.includes('Penthouse')) {
                        // NEW LOGIC FOR PENTHOUSE
                        fakeData = { ...fakeData, title: "Premium Penthouse with Terrace", category: "Penthouse", price: 38000, furnishingStatus: "Fully Furnished", tenantPreference: "Family",
                           description: "Luxurious penthouse on the top floor with private terrace garden. Panoramic city view. Premium fittings.",
                           amenities: ["Lift", "Power Backup", "Gym", "Private Terrace"], tags: ["Luxury", "View"] };
                       selectedImages = luxuryImages;
                    } else {
                        // Default to Flat/Apartment
                         fakeData = { ...fakeData, title: "2 BHK Residential Flat", category: "Apartment", price: 12000, furnishingStatus: "Semi-Furnished", tenantPreference: "Family & Bachelor",
                            description: "Well ventilated 2 BHK flat in a good society. Near market and public transport. 24 hours water.",
                            amenities: ["Lift", "Security", "CCTV"], tags: ["Budget Friendly", "Verified"] };
                        // Randomly pick furnished or plain
                        selectedImages = Math.random() > 0.8 ? furnishedImages : plainFlatImages;
                    }

                    // Set Main and Gallery Images from selected pool
                    fakeData.mainImage = selectedImages[0];
                    // Pick 2-3 other images randomly from the same pool for gallery
                    fakeData.galleryImages = selectedImages.slice(1, Math.min(selectedImages.length, 4));

                    setProperty(fakeData);
                    setAllImages([fakeData.mainImage, ...fakeData.galleryImages]);
                    setLoading(false);
                }, 300);
                return;
            }

            // 2. REAL PROPERTY FETCH
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
            if(property.isFake) {
                alert("Property Deleted (Demo)");
                navigate('/properties');
                return;
            }
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
        
        if (property.status === 'Rented') { alert("This property is already rented."); return; }
        if (!moveInDate || !visitTime || !message) { alert("Please fill date, time, and message."); return; }

        if (property.isFake) {
            setTimeout(() => {
                alert("Request Sent! (This is a demo property, but your request has been logged!)");
                navigate('/dashboard'); 
            }, 500);
            return;
        }
        
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await API.post('/booking', { propertyId: property._id, moveInDate, visitTime, message }, config);
            alert("Request Sent! Check your Dashboard for updates.");
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
    const isOwner = user && (user._id === ownerId) && !property.isFake;
    const imgFilter = isRented ? 'grayscale(100%) contrast(90%)' : 'none';

    return (
        <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
            
            {/* LIGHTBOX MODAL */}
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
                
                <div style={{ height: '450px', position: 'relative', background: '#f1f5f9', cursor: 'pointer' }} onClick={() => openLightbox(0)}>
                    <img 
                        src={getOptimizedUrl(property.mainImage, 1000)} 
                        alt={property.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: imgFilter, transition: '0.3s' }} 
                        onError={(e) => e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1p6dLe2ssnNGDA1crq3zKc8bUJgZhiTtC6Q&s'}
                    />
                    
                    <div style={{position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(255,255,255,0.9)', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        📷 View {allImages.length} Photos
                    </div>

                    {isRented && (
                        <div style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.6)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', backdropFilter: 'blur(2px)' }}>
                            <div style={{ border: '2px solid white', padding: '15px 40px', color: 'white', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', fontSize: '1.5rem', background: 'rgba(0,0,0,0.5)' }}>Property Rented</div>
                        </div>
                    )}
                </div>

                {property.galleryImages?.length > 0 && (
                    <div style={{ display: 'flex', gap: '10px', padding: '15px', overflowX: 'auto', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        {property.galleryImages.map((img, idx) => (
                            <img 
                                key={idx} 
                                src={getOptimizedUrl(img, 200)} 
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
                                {isRented && <span style={{background:'#334155', color:'white', padding:'4px 12px', borderRadius:'6px', fontSize:'0.8rem', fontWeight:'bold', textTransform:'uppercase'}}>Rented</span>}
                            </div>
                            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>📍 {property.location}</p>
                        </div>
                        <div style={{ textAlign:'right', background: isRented ? '#f1f5f9' : '#f8fafc', padding: '15px 25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <h2 style={{ color: isRented ? '#64748b' : '#2563eb', fontSize:'2rem', margin:0, fontWeight: '800', textDecoration: isRented ? 'line-through' : 'none' }}>₹{property.price.toLocaleString()}</h2>
                        </div>
                    </div>

                    {property.tags && property.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                            {property.tags.map((tag, i) => (
                                <span key={i} style={{ background: isRented ? '#f1f5f9' : '#e0f2fe', color: isRented ? '#94a3b8' : '#0369a1', padding: '5px 12px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>#{tag}</span>
                            ))}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingBottom: '30px', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={badgeStyle}>🏠 {property.category}</div>
                        <div style={badgeStyle}>🛋️ {property.furnishingStatus || 'Unfurnished'}</div>
                        <div style={{ ...badgeStyle, background: isRented ? '#f1f5f9' : '#dcfce7', color: isRented ? '#64748b' : '#166534' }}>
                            👥 {property.tenantPreference === 'All' ? 'Family & Bachelors' : property.tenantPreference}
                        </div>
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
                                <button onClick={() => navigate('/properties')} style={{marginTop:'25px', background:'#334155', color:'white', padding:'12px 25px', borderRadius:'6px', border:'none', cursor:'pointer', fontWeight:'600' }}>View Other Properties</button>
                            </div>
                        ) : (
                            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '30px' }}>
                                <h3 style={{ marginBottom: '20px', color: '#0369a1' }}>Interested? Schedule a Visit</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                                    <div style={{display:'flex', flexDirection:'column'}}>
                                        <label style={{fontSize:'0.85rem', fontWeight:'600', marginBottom:'5px', color:'#0369a1'}}>Date</label>
                                        <input type="date" value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                                    </div>
                                    <div style={{display:'flex', flexDirection:'column'}}>
                                        <label style={{fontSize:'0.85rem', fontWeight:'600', marginBottom:'5px', color:'#0369a1'}}>Time</label>
                                        <input type="time" value={visitTime} onChange={(e) => setVisitTime(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                                    </div>
                                    <div style={{display:'flex', flexDirection:'column', gridColumn: '1 / -1'}}>
                                        <label style={{fontSize:'0.85rem', fontWeight:'600', marginBottom:'5px', color:'#0369a1'}}>Message</label>
                                        <input type="text" placeholder="Hi, I'm interested..." value={message} onChange={(e) => setMessage(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                                    </div>
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