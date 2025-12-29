import ApplicationCard from './ApplicationCard';

const ApplicationsSection = ({ bookings, tab, setTab, user, handleStatusUpdate }) => {
    
    // Filter logic
    const filteredBookings = bookings.filter(b => {
        // ACTIVE TAB
        if (tab === 'Applications') {
            return b.status === 'Pending' || b.status === 'Visit Scheduled';
        }
        // HISTORY TAB
        if (tab === 'History') {
            // Includes: Rejected apps, Finalized bookings (if you want them here), and Vacated (Past) homes
            return b.status === 'Rejected' || b.status === 'Booked' || b.status === 'Vacated';
        }
        return false; 
    });

    return (
        <section>
            <div className="tabs">
                <div className={`tab-item ${tab==='Applications'?'active':''}`} onClick={()=>setTab('Applications')}>
                    Applications ({bookings.filter(b => b.status === 'Pending' || b.status === 'Visit Scheduled').length})
                </div>
                <div className={`tab-item ${tab==='History'?'active':''}`} onClick={()=>setTab('History')}>
                    History
                </div>
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
                        />
                    ))
                )}
            </div>
        </section>
    );
};

export default ApplicationsSection;