import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

// --- HELPER: Pure function defined outside to avoid recreation ---
const getOptimizedUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/300x200';
    if (url.includes('cloudinary.com')) {
        return url.replace('/upload/', '/upload/w_300,f_auto,q_auto/');
    }
    return url;
};

// --- SUB-COMPONENT: Handles individual card logic ---
// This isolates the rendering logic for a single card
const PropertyCard = React.memo(({ property, activeBooking, onVacate, onDelete }) => {
    const isRented = property.status === 'Rented' || !!activeBooking;

    return (
        <div className="card">
            <div style={{ position: 'relative' }}>
                <img 
                    src={getOptimizedUrl(property.mainImage)} 
                    className="prop-img" 
                    alt="property"
                    loading="lazy" 
                />
                <span className={`badge ${isRented ? 'badge-rented' : 'badge-available'}`} 
                      style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    {isRented ? 'Rented' : 'Available'}
                </span>
            </div>
            
            <h3 style={{ margin: '0 0 5px 0' }}>{property.title}</h3>
            <div style={{ color: '#2563eb', fontWeight: 'bold' }}>
                ₹{property.price.toLocaleString()} / month
            </div>

            {/* CASE A: RENTED */}
            {isRented && activeBooking ? (
                <div className="details-box">
                    <div className="details-title">👤 Active Tenant</div>
                    <div className="info-row">
                        <span className="info-label">Name:</span> {activeBooking.user?.name || 'Unknown'}
                    </div>
                    <div className="info-row">
                        <span className="info-label">Phone:</span> 
                        <strong>{activeBooking.user?.phone || 'Hidden'}</strong>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Joined:</span> 
                        {new Date(activeBooking.moveInDate).toLocaleDateString()}
                    </div>
                    
                    <button onClick={() => onVacate(property._id)} className="btn btn-vacate">
                        🔄 Mark Vacant (Tenant Left)
                    </button>
                </div>
            ) : (
                /* CASE B: AVAILABLE */
                <div className="btn-row">
                    <Link 
                        to={`/edit-property/${property._id}`} 
                        className="btn" 
                        style={{ textAlign: 'center', textDecoration: 'none', background: '#2563eb', color: 'white' }}
                    >
                        ✏️ Edit
                    </Link>
                    <button 
                        onClick={() => onDelete(property._id)} 
                        className="btn btn-red" 
                        style={{ background: '#fee2e2', color: '#b91c1c' }}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
});

// --- MAIN COMPONENT ---
const OwnerSection = ({ myProperties, bookings, handleVacate, handleDeleteProperty }) => {
  
    // OPTIMIZATION: Create a lookup map for active bookings.
    // Instead of looping through bookings for every property (O(N*M)),
    // we build a map once (O(M)) and look it up instantly (O(1)).
    const activeBookingMap = useMemo(() => {
        const map = {};
        if (!bookings) return map;

        bookings.forEach(b => {
            // Check if booking is active
            if (b.status === 'Booked') {
                // Handle populated object vs raw ID string
                const propId = b.property?._id || b.property;
                if (propId) {
                    map[propId] = b;
                }
            }
        });
        return map;
    }, [bookings]);

    return (
        <section>
            <div className="section-header">My Properties</div>
            
            {myProperties.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', marginTop: '20px' }}>
                    You haven't listed any properties yet.
                </p>
            ) : (
                <div className="card-grid">
                    {myProperties.map(property => (
                        <PropertyCard 
                            key={property._id} 
                            property={property} 
                            activeBooking={activeBookingMap[property._id]} 
                            onVacate={handleVacate}
                            onDelete={handleDeleteProperty}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

// React.memo ensures OwnerSection doesn't re-render if parent changes but props are same
export default React.memo(OwnerSection);