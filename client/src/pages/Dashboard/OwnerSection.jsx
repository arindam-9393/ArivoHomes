import { Link } from 'react-router-dom';

const OwnerSection = ({ myProperties, bookings, handleVacate, handleDeleteProperty }) => {
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
                            <img 
                                src={p.mainImage || 'https://via.placeholder.com/300x200'} 
                                className="prop-img" 
                                alt="property"
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
                                <Link to={`/edit-property/${p._id}`} className="btn btn-outline" style={{textAlign:'center', textDecoration:'none'}}>Edit</Link>
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