const ApplicationCard = ({ booking, user, handleStatusUpdate }) => {
    // Helper to check if this is an active application
    const isActive = booking.status === 'Pending' || booking.status === 'Visit Scheduled';
    
    // Is this a PAST rental (Lived there and left)?
    // We assume 'Vacated' status means they lived there. 
    // If you don't have 'Vacated', we check if it was 'Rejected' BUT had a move-in date set (unlikely for rejected)
    const isPastRental = booking.status === 'Vacated'; 

    // Helper: Calculate Stay Duration
    const getDuration = () => {
        if (!booking.moveInDate) return 'N/A';
        const start = new Date(booking.moveInDate);
        const end = new Date(booking.updatedAt); // Assuming updatedAt is when they vacated
        
        // Calculate difference in days
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return `${start.toLocaleDateString()} - ${end.toLocaleDateString()} (${diffDays} days)`;
    };

    // Helper to determine badge text
    const getStatusLabel = (status) => {
        if (status === 'Rejected') return 'Closed';
        if (status === 'Booked') return 'Finalized';
        if (status === 'Vacated') return 'Past Home'; // <--- NEW LABEL
        return status;
    };

    // Helper for badge colors
    const getBadgeStyle = (status) => {
        if (status === 'Pending') return { background: '#fef3c7', color: '#b45309' };
        if (status === 'Visit Scheduled') return { background: '#dbeafe', color: '#1e40af' };
        if (status === 'Booked') return { background: '#dcfce7', color: '#166534' };
        if (status === 'Vacated') return { background: '#e5e7eb', color: '#374151' }; // Grey for past home
        return { background: '#f3f4f6', color: '#9ca3af' }; // Light grey for rejected
    };

    return (
        <div className="card" style={{ opacity: isActive ? 1 : 0.8 }}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                <span className="badge" style={getBadgeStyle(booking.status)}>
                    {getStatusLabel(booking.status)}
                </span>
                <small style={{color:'#9ca3af'}}>{new Date(booking.createdAt).toLocaleDateString()}</small>
            </div>
            
            <h4 style={{color: isActive ? '#000' : '#6b7280'}}>{booking.property?.title || "Property Deleted"}</h4>
            
            {/* ================= OWNER VIEW ================= */}
            {user.role === 'owner' && (
                <div style={{background: isActive ? '#f9fafb' : '#f3f4f6', padding:'10px', borderRadius:'6px', margin:'10px 0'}}>
                    <div style={{fontSize:'0.75rem', color:'#6b7280', textTransform:'uppercase'}}>
                        {isPastRental ? 'Past Tenant' : (isActive ? 'Applicant' : 'Closed Application')}
                    </div>
                    
                    <div style={{fontWeight:'bold', fontSize:'1.1rem', color: isActive ? '#000' : '#4b5563'}}>
                        {booking.user?.name}
                    </div>
                    
                    {/* HIDE Phone/Email if it's history/past */}
                    {isActive && <div style={{fontSize:'0.9rem', fontWeight:'600'}}>📞 {booking.user?.phone}</div>}

                    {/* Show Duration for Past Tenants */}
                    {isPastRental && (
                        <div style={{fontSize:'0.85rem', color:'#4b5563', marginTop:'5px'}}>
                            <strong>Stayed:</strong> {getDuration()}
                        </div>
                    )}
                    
                    {!isPastRental && (
                        <div style={{fontSize:'0.9rem', fontStyle:'italic', color:'#6b7280', marginTop:'5px'}}>"{booking.message}"</div>
                    )}
                </div>
            )}

            {/* ================= TENANT VIEW ================= */}
            {user.role !== 'owner' && (
                <>
                    {/* Case 1: Active Waiting */}
                    {booking.status === 'Pending' && (
                         <div style={{background:'#fff7ed', padding:'10px', borderRadius:'6px', margin:'10px 0', border:'1px solid #fed7aa', color:'#9a3412', fontSize:'0.9rem'}}>
                            ⏳ Waiting for owner to accept visit...
                         </div>
                    )}
                    
                    {/* Case 2: Visit/Booked (Show Contact) */}
                    {(booking.status === 'Visit Scheduled' || booking.status === 'Booked') && (
                        <div style={{background:'#f0fdf4', padding:'10px', borderRadius:'6px', margin:'10px 0', border:'1px solid #bbf7d0'}}>
                            <div style={{fontSize:'0.75rem', color:'#166534', fontWeight:'bold', textTransform:'uppercase'}}>Owner Contact</div>
                            <div style={{fontWeight:'bold', color:'#15803d', fontSize:'1.1rem'}}>{booking.property?.owner?.name}</div>
                            <div style={{fontSize:'1rem', fontWeight:'600'}}>📞 {booking.property?.owner?.phone}</div>
                        </div>
                    )}

                    {/* Case 3: PAST HOME (Vacated) - Show Owner Name & Dates ONLY */}
                    {isPastRental && (
                        <div style={{background:'#f3f4f6', padding:'10px', borderRadius:'6px', margin:'10px 0', border:'1px solid #e5e7eb'}}>
                            <div style={{fontSize:'0.75rem', color:'#6b7280', fontWeight:'bold', textTransform:'uppercase'}}>Past Landlord</div>
                            <div style={{fontWeight:'bold', color:'#374151', fontSize:'1.1rem'}}>
                                {booking.property?.owner?.name}
                            </div>
                            <div style={{fontSize:'0.85rem', color:'#4b5563', marginTop:'5px'}}>
                                <strong>Lived:</strong> {getDuration()}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* --- OWNER ACTIONS (Only Show if ACTIVE) --- */}
            {user.role === 'owner' && isActive && (
                <div className="btn-row">
                    {booking.status === 'Pending' && (
                        <button onClick={()=>handleStatusUpdate(booking._id, 'Visit Scheduled')} className="btn btn-blue">📅 Accept Visit</button>
                    )}
                    {booking.status === 'Visit Scheduled' && (
                        <button onClick={()=>handleStatusUpdate(booking._id, 'Booked')} className="btn btn-green">🤝 Finalize Tenant</button>
                    )}
                    
                    <button onClick={()=>handleStatusUpdate(booking._id, 'Rejected')} className="btn btn-red">Reject</button>
                </div>
            )}
        </div>
    );
};

export default ApplicationCard;