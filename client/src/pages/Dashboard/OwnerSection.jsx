import { Link } from 'react-router-dom';

const OwnerSection = ({ myProperties, bookings, handleVacate, handleDeleteProperty }) => {
  
  // --- HELPER: Request small, optimized image (300px width) ---
  const getOptimizedUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/300x200';
    if (url.includes('cloudinary.com')) {
        // w_300: Resize to 300px width
        // f_auto: WebP format
        // q_auto: Optimized quality
        return url.replace('/upload/', '/upload/w_300,f_auto,q_auto/');
    }
    return url;
  };

  return (
    <section>
        <div className="section-header">My Properties</div>
        <div className="card-grid">
            {myProperties.map(p => {
                // Logic: Check if property has an active "Booked" tenant
                const activeBooking = bookings.find(b => {
                    const bookingPropId = b.property?._id || b.property;
                    return bookingPropId === p._id && b.status === 'Booked';
                });

                const isRented = p.status === 'Rented' || !!activeBooking;

                return (
                    <div key={p._id} className="card">
                        <div style={{position:'relative'}}>
                            {/* --- OPTIMIZED IMAGE --- */}
                            <img 
                                src={getOptimizedUrl(p.mainImage)} 
                                className="prop-img" 
                                alt="property"
                                loading="lazy" 
                            />
                            <span style={{ position:'absolute', top:'10px', left:'10px' }} 
                                  className={`badge ${isRented ? 'badge-rented' : 'badge-available'}`}>
                                  {isRented ? 'Rented' : 'Available'}
                            </span>
                        </div>
                        
                        <h3 style={{ margin: '0 0 5px 0' }}>{p.title}</h3>
                        <div style={{ color: '#2563eb', fontWeight: 'bold' }}>₹{p.price.toLocaleString()} / month</div>

                        {/* CASE A: RENTED - Show Tenant Details */}
                        {isRented && activeBooking ? (
                            <div className="details-box">
                                <div className="details-title">👤 Active Tenant</div>
                                <div className="info-row"><span className="info-label">Name:</span> {activeBooking.user?.name}</div>
                                <div className="info-row"><span className="info-label">Phone:</span> <strong>{activeBooking.user?.phone || 'Hidden'}</strong></div>
                                <div className="info-row"><span className="info-label">Joined:</span> {new Date(activeBooking.moveInDate).toLocaleDateString()}</div>
                                
                                <button onClick={()=>handleVacate(p._id)} className="btn btn-vacate">
                                    🔄 Mark Vacant (Tenant Left)
                                </button>
                            </div>
                        ) : (
                            /* CASE B: AVAILABLE - Show Edit/Delete */
                            <div className="btn-row">
                                {/* --- UPDATED EDIT BUTTON STYLE --- */}
                                <Link 
                                    to={`/edit-property/${p._id}`} 
                                    className="btn" 
                                    style={{textAlign:'center', textDecoration:'none', background:'#2563eb', color:'white'}}
                                >
                                    ✏️ Edit
                                </Link>
                                <button onClick={()=>handleDeleteProperty(p._id)} className="btn btn-red" style={{background:'#fee2e2', color:'#b91c1c'}}>Delete</button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    </section>
  );
};

export default OwnerSection;