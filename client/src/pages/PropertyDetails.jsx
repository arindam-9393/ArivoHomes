import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../axiosConfig';

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const getUser = () => {
        try { return JSON.parse(localStorage.getItem('user')); } catch (err) { return null; }
    };
    const user = getUser();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // --- LIGHTBOX STATE ---
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [allImages, setAllImages] = useState([]);

    // --- BOOKING STATE ---
    const [moveInDate, setMoveInDate] = useState('');
    const [visitTime, setVisitTime] = useState(''); // --- NEW: TIME STATE ---
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await API.get(`/property/${id}`);
                const data = response.data;
                setProperty(data);
                
                // Combine Main Image + Gallery for the Lightbox
                const images = [data.mainImage];
                if (data.galleryImages && data.galleryImages.length > 0) {
                    images.push(...data.galleryImages);
                }
                setAllImages(images.filter(img => img)); // Remove empty/null if any

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    // --- KEYBOARD NAVIGATION FOR LIGHTBOX ---
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

    // --- HANDLERS ---
    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => setIsLightboxOpen(false);

    const nextImage = (e) => {
        if(e) e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    };

    const prevImage = (e) => {
        if(e) e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    };

    const handleDelete = async () => {
        if (confirm("Are you sure? This cannot be undone.")) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await API.delete(`/property/${id}`, config);
                alert("Property Deleted");
                navigate('/dashboard');
            } catch (error) {
                alert("Delete failed");
            }
        }
    };

    const handleBook = async () => {
        if (!user) { alert("Please login to book!"); navigate('/login'); return; }
        
        // --- UPDATED VALIDATION: Check for Date AND Time ---
        if (!moveInDate || !visitTime || !message) { alert("Please fill date, time, and message."); return; }

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            
            // --- UPDATED PAYLOAD: Sending visitTime ---
            await API.post('/booking', { 
                propertyId: property._id, 
                moveInDate, 
                visitTime, 
                message 
            }, config);

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
    const isOwner = user && user.role === 'owner' && (user._id === ownerId);

    return (
        <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
            
            {/* --- LIGHTBOX MODAL --- */}
            {isLightboxOpen && (
                <div style={lightboxOverlayStyle} onClick={closeLightbox}>
                    <button style={closeBtnStyle}>×</button>
                    
                    {/* Previous Button */}
                    <button style={{...navBtnStyle, left: '20px'}} onClick={prevImage}>❮</button>

                    <img 
                        src={allImages[currentImageIndex]} 
                        alt="Full Screen" 
                        style={lightboxImgStyle} 
                        onClick={(e) => e.stopPropagation()} // Prevent clicking image from closing modal
                    />

                    {/* Next Button */}
                    <button style={{...navBtnStyle, right: '20px'}} onClick={nextImage}>❯</button>
                    
                    <div style={counterStyle}>{currentImageIndex + 1} / {allImages.length}</div>
                </div>
            )}

            <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 16px', border:'1px solid #e2e8f0', background:'white', borderRadius:'8px', color:'#64748b', fontWeight:'600' }}>&larr; Back</button>
            
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                
                {/* --- HERO IMAGE (Clickable) --- */}
                <div style={{ height: '450px', position: 'relative', background: '#f1f5f9', cursor: 'pointer' }} onClick={() => openLightbox(0)}>
                    <img 
                        src={property.mainImage || "https://via.placeholder.com/800x400"} 
                        alt={property.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isRented ? 'grayscale(80%)' : 'none' }} 
                    />
                    
                    {/* View Photos Button Overlay */}
                    <div style={{position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(255,255,255,0.9)', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        📷 View {allImages.length} Photos
                    </div>

                    {isRented && (
                        <div style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <h1 style={{color:'white', fontSize:'4rem', border:'4px solid white', padding:'10px 40px', transform:'rotate(-10deg)'}}>RENTED</h1>
                        </div>
                    )}
                </div>

                {/* --- PHOTO GALLERY (Clickable) --- */}
                {property.galleryImages?.length > 0 && (
                    <div style={{ display: 'flex', gap: '10px', padding: '15px', overflowX: 'auto', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        {property.galleryImages.map((img, idx) => (
                            <img 
                                key={idx} 
                                src={img} 
                                alt={`gallery-${idx}`} 
                                // Index + 1 because 0 is mainImage
                                onClick={() => openLightbox(idx + 1)} 
                                style={{ height: '100px', width: '150px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', border: '1px solid #cbd5e1', transition: '0.2s' }} 
                                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                            />
                        ))}
                    </div>
                )}

                <div style={{ padding: '30px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'20px', marginBottom: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <h1 style={{ color: '#1e293b', fontSize:'2.2rem', marginBottom:'8px' }}>{property.title}</h1>
                            
                            {property.status !== 'Rented' && (
                                <div style={{ display: 'inline-block', background: '#fff1f2', color: '#be123c', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px', border: '1px solid #fda4af' }}>
                                    🔥 High Demand: People are currently viewing this
                                </div>
                            )}

                            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>📍 {property.location}</p>

                            {!isOwner && (
                                <div style={{ marginTop: '15px', padding: '15px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', display: 'inline-block' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontWeight: '600' }}>
                                        <span>🔒 Owner Details Locked</span>
                                    </div>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#94a3b8' }}>
                                        Schedule a visit below. Once the owner accepts, you will see their phone number.
                                    </p>
                                </div>
                            )}

                        </div>
                        <div style={{ textAlign:'right', background: '#f8fafc', padding: '15px 25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <h2 style={{ color: '#2563eb', fontSize:'2rem', margin:0, fontWeight: '800' }}>₹{property.price.toLocaleString()}</h2>
                            <span style={{ fontSize:'0.9rem', color:'#64748b' }}>per month</span>
                        </div>
                    </div>

                    {/* BADGES */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingBottom: '30px', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={badgeStyle}>🏠 {property.category}</div>
                        <div style={badgeStyle}>🛋️ {property.furnishingStatus || 'Unfurnished'}</div>
                        <div style={{ ...badgeStyle, background: '#dcfce7', color: '#166534' }}>
                            👥 {property.tenantPreference === 'All' ? 'Family & Bachelors' : property.tenantPreference}
                        </div>
                        <div style={badgeStyle}>🅿️ {property.parking}</div>
                    </div>

                    {/* FURNISHINGS */}
                    {property.furnishingItems?.length > 0 && (
                        <div style={{ marginTop: '30px' }}>
                            <h3 style={sectionTitleStyle}>🛏️ Included Furnishings</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {property.furnishingItems.map(item => (
                                    <span key={item} style={{ background: '#f0f9ff', color: '#0284c7', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', border: '1px solid #bae6fd' }}>✓ {item}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* AMENITIES */}
                    {property.amenities?.length > 0 && (
                        <div style={{ marginTop: '30px' }}>
                            <h3 style={sectionTitleStyle}>🏢 Society Amenities</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px' }}>
                                {property.amenities.map(amenity => (
                                    <div key={amenity} style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                                        <span style={{ display:'block', fontSize:'1.8rem', marginBottom:'5px' }}>{getAmenityIcon(amenity)}</span>
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
                            <div style={{ padding: '30px', background: '#fef2f2', border: '2px dashed #f87171', borderRadius: '12px', textAlign:'center' }}>
                                <h2 style={{color:'#b91c1c', marginBottom:'10px'}}>⛔ Not Available</h2>
                                <p style={{color:'#7f1d1d', fontSize:'1.1rem'}}>This property has already been rented out.</p>
                                <button onClick={() => navigate('/properties')} className="btn" style={{marginTop:'15px', background:'#b91c1c', color:'white', padding:'10px 20px', borderRadius:'6px', border:'none', cursor:'pointer' }}>Find Similar Properties</button>
                            </div>
                        ) : (
                            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '30px' }}>
                                <h3 style={{ marginBottom: '20px', color: '#0369a1' }}>Interested? Schedule a Visit</h3>
                                
                                {/* --- UPDATED: Grid changed to 3 columns to fit Time --- */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                    
                                    {/* Date Input */}
                                    <input 
                                        type="date" 
                                        value={moveInDate} 
                                        onChange={(e) => setMoveInDate(e.target.value)} 
                                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} 
                                    />
                                    
                                    {/* --- NEW: TIME INPUT --- */}
                                    <input 
                                        type="time" 
                                        value={visitTime} 
                                        onChange={(e) => setVisitTime(e.target.value)} 
                                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} 
                                    />

                                    {/* Message Input */}
                                    <input 
                                        type="text" 
                                        placeholder="Hi, I'm interested..." 
                                        value={message} 
                                        onChange={(e) => setMessage(e.target.value)} 
                                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} 
                                    />
                                </div>

                                <button onClick={handleBook} className="btn" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', background: '#2563eb', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold' }}>
                                    {user ? "Send Visit Request" : "Login to Schedule Visit"}
                                </button>
                                {!user && <p style={{textAlign:'center', marginTop:'10px', color:'#64748b', fontSize:'0.9rem'}}>Login required to contact the owner.</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- STYLES FOR LIGHTBOX & BADGES ---
const lightboxOverlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    background: 'rgba(0, 0, 0, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999
};

const lightboxImgStyle = {
    maxHeight: '90vh', maxWidth: '90vw', borderRadius: '8px', boxShadow: '0 0 20px rgba(0,0,0,0.5)'
};

const closeBtnStyle = {
    position: 'absolute', top: '20px', right: '30px', background: 'none', border: 'none',
    color: 'white', fontSize: '3rem', cursor: 'pointer', zIndex: 10000
};

const navBtnStyle = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none',
    fontSize: '2rem', padding: '10px 15px', cursor: 'pointer', borderRadius: '50%',
    transition: '0.2s'
};

const counterStyle = {
    position: 'absolute', bottom: '20px', color: 'white', fontSize: '1rem', opacity: 0.8
};

const badgeStyle = { background: '#f1f5f9', padding: '8px 16px', borderRadius: '30px', fontWeight: '600', color: '#334155', border: '1px solid #e2e8f0' };
const sectionTitleStyle = { fontSize: '1.3rem', color: '#1e293b', marginBottom: '15px', fontWeight: '700' };

export default PropertyDetails;