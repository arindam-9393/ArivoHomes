const ApplicationCard = ({ booking, user, handleStatusUpdate, isIncoming }) => {
    // Helper to check if this is an active application
    const isActive = booking.status === 'Pending' || booking.status === 'Visit Scheduled';
    const isPastRental = booking.status === 'Vacated'; 

    // --- TIME HELPERS ---
    const convertTime = (timeString) => {
        if (!timeString) return '';
        const [hour, minute] = timeString.split(':');
        const h = parseInt(hour);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedH = h % 12 || 12; 
        return `${formattedH}:${minute} ${ampm}`;
    };

    const formatVisitInfo = () => {
        const date = new Date(booking.moveInDate).toLocaleDateString();
        const time = booking.visitTime ? convertTime(booking.visitTime) : ''; 
        return `${date} ${time ? `at ${time}` : ''}`;
    };

    const getDuration = () => {
        if (!booking.moveInDate) return 'N/A';
        const start = new Date(booking.moveInDate);
        const end = new Date(booking.updatedAt); 
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${start.toLocaleDateString()} - ${end.toLocaleDateString()} (${diffDays} days)`;
    };

    const getStatusLabel = (status) => {
        if (status === 'Rejected') return 'Closed';
        if (status === 'Booked') return 'Finalized';
        if (status === 'Vacated') return 'Past Home'; 
        return status;
    };

    const getBadgeStyle = (status) => {
        if (status === 'Pending') return { background: '#fef3c7', color: '#b45309' };
        if (status === 'Visit Scheduled') return { background: '#dbeafe', color: '#1e40af' };
        if (status === 'Booked') return { background: '#dcfce7', color: '#166534' };
        if (status === 'Vacated') return { background: '#e5e7eb', color: '#374151' }; 
        return { background: '#f3f4f6', color: '#9ca3af' }; 
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
            
            {/* =================================================== */}
            {/* SCENARIO 1: I AM THE LANDLORD (Incoming)     */}
            {/* =================================================== */}
            {isIncoming && (
                <div style={{background: isActive ? '#f9fafb' : '#f3f4f6', padding:'10px', borderRadius:'6px', margin:'10px 0'}}>
                    <div style={{fontSize:'0.75rem', color:'#6b7280', textTransform:'uppercase'}}>
                        {isPastRental ? 'Past Tenant' : (isActive ? 'Applicant' : 'Closed Application')}
                    </div>
                    
                    <div style={{fontWeight:'bold', fontSize:'1.1rem', color: isActive ? '#000' : '#4b5563'}}>
                        {booking.user?.name}
                    </div>

                    {isActive && (
                        <div style={{marginTop:'8px', marginBottom:'8px', color:'#2563eb', fontWeight:'600', background:'#eff6ff', padding:'6px 10px', borderRadius:'6px', border:'1px solid #bfdbfe', display:'inline-block', fontSize:'0.9rem'}}>
                            📅 Visit: {formatVisitInfo()}
                        </div>
                    )}
                    
                    {isActive && <div style={{fontSize:'0.9rem', fontWeight:'600'}}>📞 {booking.user?.phone}</div>}

                    {isPastRental && (
                        <div style={{fontSize:'0.85rem', color:'#4b5563', marginTop:'5px'}}>
                            <strong>Stayed:</strong> {getDuration()}
                        </div>
                    )}
                    
                    {!isPastRental && (
                        <div style={{fontSize:'0.9rem', fontStyle:'italic', color:'#6b7280', marginTop:'5px'}}>"{booking.message}"</div>
                    )}

                    {/* ACTIONS FOR OWNER */}
                    {isActive && (
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
            )}

            {/* =================================================== */}
            {/* SCENARIO 2: I AM THE VISITOR (Outgoing)      */}
            {/* =================================================== */}
            {!isIncoming && (
                <>
                    {/* Status Message */}
                    {booking.status === 'Pending' && (
                         <div style={{background:'#fff7ed', padding:'10px', borderRadius:'6px', margin:'10px 0', border:'1px solid #fed7aa', color:'#9a3412', fontSize:'0.9rem'}}>
                            ⏳ Waiting for owner to accept visit...
                            <div style={{marginTop:'5px', fontWeight:'600'}}>Requested: {formatVisitInfo()}</div>
                         </div>
                    )}
                    
                    {/* Confirmed Visit */}
                    {(booking.status === 'Visit Scheduled' || booking.status === 'Booked') && (
                        <div style={{background:'#f0fdf4', padding:'10px', borderRadius:'6px', margin:'10px 0', border:'1px solid #bbf7d0'}}>
                            <div style={{marginBottom:'8px', color:'#15803d', fontWeight:'bold', fontSize:'0.95rem', background:'white', padding:'5px', borderRadius:'4px', border:'1px dashed #166534', textAlign:'center'}}>
                                ✅ Visit Confirmed: <br/> {formatVisitInfo()}
                            </div>
                            <div style={{fontSize:'0.75rem', color:'#166534', fontWeight:'bold', textTransform:'uppercase'}}>Owner Contact</div>
                            <div style={{fontWeight:'bold', color:'#15803d', fontSize:'1.1rem'}}>{booking.property?.owner?.name}</div>
                            <div style={{fontSize:'1rem', fontWeight:'600'}}>📞 {booking.property?.owner?.phone}</div>
                        </div>
                    )}

                    {/* Past Rental Info */}
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
        </div>
    );
};

export default ApplicationCard;