const ApplicationCard = ({ booking, user, handleStatusUpdate, isIncoming }) => {
    // Helper to check if this is an active application
    const isActive = booking.status === 'Pending' || booking.status === 'Visit Scheduled';
    
    // Is this a PAST rental (Lived there and left)?
    const isPastRental = booking.status === 'Vacated'; 

    // --- HELPER: Convert 24hr time to 12hr format (e.g., "14:30" -> "02:30 PM") ---
    const convertTime = (timeString) => {
        if (!timeString) return 'Time Not Set'; // Fallback
        const [hour, minute] = timeString.split(':');
        const h = parseInt(hour);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedH = h % 12 || 12; 
        return `${formattedH}:${minute} ${ampm}`;
    };

    // --- HELPER: Return Date & Time objects separately ---
    const getVisitDetails = () => {
        if (!booking.moveInDate) return { date: 'N/A', time: 'N/A' };
        const date = new Date(booking.moveInDate).toLocaleDateString(undefined, {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
        });
        const time = booking.visitTime ? convertTime(booking.visitTime) : 'Any Time'; 
        return { date, time };
    };

    const { date, time } = getVisitDetails();

    // Helper: Calculate Stay Duration
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

    // --- REUSABLE COMPONENT: The Time Box ---
    const TimeDisplayBox = ({ label, color }) => (
        <div style={{
            marginTop: '10px', 
            marginBottom: '10px', 
            background: color === 'green' ? '#f0fdf4' : '#eff6ff', 
            border: `1px dashed ${color === 'green' ? '#166534' : '#2563eb'}`,
            borderRadius: '8px',
            padding: '10px',
            textAlign: 'center'
        }}>
            <div style={{fontSize:'0.75rem', fontWeight:'bold', color: color === 'green' ? '#166534' : '#1e40af', textTransform:'uppercase', letterSpacing:'0.5px'}}>
                {label}
            </div>
            <div style={{fontSize:'1.1rem', fontWeight:'800', color:'#1e293b', marginTop:'4px'}}>
                📅 {date}
            </div>
            <div style={{fontSize:'1.2rem', fontWeight:'800', color: color === 'green' ? '#15803d' : '#2563eb', marginTop:'2px'}}>
                ⏰ {time}
            </div>
        </div>
    );

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
            {/* SCENARIO 1: I AM THE LANDLORD (Incoming)            */}
            {/* =================================================== */}
            {isIncoming && (
                <div style={{background: isActive ? '#f9fafb' : '#f3f4f6', padding:'15px', borderRadius:'8px', margin:'10px 0'}}>
                    <div style={{fontSize:'0.75rem', color:'#6b7280', textTransform:'uppercase', fontWeight:'bold'}}>
                        {isPastRental ? 'Past Tenant' : (isActive ? 'Applicant Details' : 'Closed Application')}
                    </div>
                    
                    <div style={{fontWeight:'bold', fontSize:'1.2rem', color: isActive ? '#000' : '#4b5563', margin:'5px 0'}}>
                        {booking.user?.name}
                    </div>

                    {/* --- SHOW TIME BOX TO OWNER --- */}
                    {isActive && <TimeDisplayBox label="Requested Visit Time" color="blue" />}
                    
                    {isActive && <div style={{fontSize:'0.9rem', fontWeight:'600', marginTop:'10px'}}>📞 {booking.user?.phone}</div>}

                    {isPastRental && (
                        <div style={{fontSize:'0.85rem', color:'#4b5563', marginTop:'5px'}}>
                            <strong>Stayed:</strong> {getDuration()}
                        </div>
                    )}
                    
                    {!isPastRental && (
                        <div style={{fontSize:'0.9rem', fontStyle:'italic', color:'#4b5563', background:'white', padding:'8px', borderRadius:'6px', border:'1px solid #e2e8f0', marginTop:'10px'}}>
                            "{booking.message}"
                        </div>
                    )}

                    {/* ACTIONS FOR OWNER */}
                    {isActive && (
                        <div className="btn-row" style={{marginTop:'15px'}}>
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
            {/* SCENARIO 2: I AM THE VISITOR (Outgoing)             */}
            {/* =================================================== */}
            {!isIncoming && (
                <>
                    {/* Status Message */}
                    {booking.status === 'Pending' && (
                         <div style={{background:'#fff7ed', padding:'15px', borderRadius:'8px', margin:'10px 0', border:'1px solid #fed7aa'}}>
                            <div style={{color:'#9a3412', fontSize:'0.9rem', marginBottom:'10px'}}>
                                ⏳ Waiting for owner to accept...
                            </div>
                            {/* --- SHOW TIME BOX TO TENANT --- */}
                            <TimeDisplayBox label="Your Request" color="blue" />
                         </div>
                    )}
                    
                    {/* Confirmed Visit */}
                    {(booking.status === 'Visit Scheduled' || booking.status === 'Booked') && (
                        <div style={{background:'#f0fdf4', padding:'15px', borderRadius:'8px', margin:'10px 0', border:'1px solid #bbf7d0'}}>
                            {/* --- SHOW CONFIRMED TIME BOX --- */}
                            <TimeDisplayBox label="✅ Visit Confirmed" color="green" />

                            <div style={{marginTop:'15px', paddingTop:'10px', borderTop:'1px dashed #166534'}}>
                                <div style={{fontSize:'0.75rem', color:'#166534', fontWeight:'bold', textTransform:'uppercase'}}>Owner Contact</div>
                                <div style={{fontWeight:'bold', color:'#15803d', fontSize:'1.1rem'}}>{booking.property?.owner?.name}</div>
                                <div style={{fontSize:'1rem', fontWeight:'600'}}>📞 {booking.property?.owner?.phone}</div>
                            </div>
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