import ApplicationCard from './ApplicationCard';

const ApplicationsSection = ({ bookings, tab, setTab, user, handleStatusUpdate, isIncoming }) => {
    
    // Filter logic
    const filteredBookings = bookings.filter(b => {
        if (tab === 'Applications') {
            return b.status === 'Pending' || b.status === 'Visit Scheduled';
        }
        if (tab === 'History') {
            return b.status === 'Rejected' || b.status === 'Booked' || b.status === 'Vacated';
        }
        return false; 
    });

    return (
        <section>
            {/* Only show Tabs if we are looking at incoming requests (to separate history) */}
            {/* For outgoing, we usually just show everything or simplify */}
            <div className="tabs">
                <div className={`tab-item ${tab==='Applications'?'active':''}`} onClick={()=>setTab('Applications')}>
                    Active ({bookings.filter(b => b.status === 'Pending' || b.status === 'Visit Scheduled').length})
                </div>
                {isIncoming && (
                    <div className={`tab-item ${tab==='History'?'active':''}`} onClick={()=>setTab('History')}>
                        History
                    </div>
                )}
            </div>

            <div className="card-grid">
                {filteredBookings.length === 0 ? (
                    <p style={{color:'#9ca3af', fontStyle:'italic'}}>No records found.</p>
                ) : (
                    filteredBookings.map(booking => (
                        <ApplicationCard 
                            key={booking._id} 
                            booking={booking} 
                            user={user} 
                            handleStatusUpdate={handleStatusUpdate}
                            isIncoming={isIncoming} // <--- PASS THE FLAG DOWN
                        />
                    ))
                )}
            </div>
        </section>
    );
};

export default ApplicationsSection;