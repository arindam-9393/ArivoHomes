import { useEffect, useState } from 'react';
import API from '../../axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

// Import Sub-Components
import OwnerSection from './OwnerSection';
import TenantSection from './TenantSection';
import ApplicationsSection from './ApplicationsSection';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // State
  const [bookings, setBookings] = useState([]);
  const [myProperties, setMyProperties] = useState([]);
  const [activeRental, setActiveRental] = useState(null);
  const [tab, setTab] = useState('Applications');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      // 1. Fetch ALL Bookings (Incoming & Outgoing)
      const bookingRes = await API.get('/booking', config);
      setBookings(bookingRes.data);

      // 2. Active Rental Logic (For when I am a Tenant)
      const myHome = bookingRes.data.find(b => 
          b.user._id === user._id && b.status === 'Booked'
      );
      if (myHome) setActiveRental(myHome);

      // 3. Owner Logic (My Properties)
      if (user.role === 'owner') {
        const propRes = await API.get('/property');
        // Filter properties where I am the owner
        const ownerProps = propRes.data.filter(p => {
             const ownerId = p.owner?._id || p.owner; 
             return ownerId === user._id;
        });
        setMyProperties(ownerProps);
      }
    } catch (err) { console.error(err); }
  };

  // --- HANDLERS ---
  const handleStatusUpdate = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await API.put(`/booking/${id}`, { status }, config);
      alert(status === 'Booked' ? "Tenant Finalized! Property Locked." : "Status Updated");
      window.location.reload();
    } catch (err) { alert('Update Failed'); }
  };

  // 🚨 THIS WAS THE BROKEN FUNCTION. IT IS NOW FIXED. 🚨
  const handleVacate = async (propertyId) => {
    if(!confirm("Is the tenant leaving? Property will be available again.")) return;
    try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        // ✅ FIXED: Using the Property Route with ID in the URL
        await API.put(`/property/${propertyId}/vacate`, {}, config);
        
        window.location.reload();
    } catch (error) { 
        console.error(error);
        alert("Failed to vacate"); 
    }
  };

  const handleDeleteProperty = async (id) => {
    if(!confirm("Delete this property?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await API.delete(`/property/${id}`, config);
      window.location.reload();
    } catch { alert("Delete failed"); }
  };

  // --- SPLIT BOOKINGS INTO "RECEIVED" vs "SENT" ---
  // Received: Bookings where I am the Owner of the property
  const receivedBookings = bookings.filter(b => b.property?.owner?._id === user._id);
  
  // Sent: Bookings where I am the User (Tenant)
  const sentBookings = bookings.filter(b => b.user?._id === user._id);

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="user-profile">
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.role === 'owner' ? 'Property Owner' : 'Tenant'}</div>
        </div>
        <button className="nav-btn active">📊 Dashboard</button>
        <Link to="/properties" className="nav-btn">🏠 Browse Homes</Link>
        {user.role === 'owner' && (
            <Link to="/add-property" className="nav-btn add-new">+ List New Property</Link>
        )}
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        
        {/* 1. CURRENT HOME (If I am renting somewhere) */}
        <TenantSection activeRental={activeRental} />

        {/* 2. MY PROPERTIES (If I am an Owner) */}
        {user.role === 'owner' && (
            <OwnerSection 
                myProperties={myProperties} 
                bookings={receivedBookings} // Only pass Received bookings here
                handleVacate={handleVacate} 
                handleDeleteProperty={handleDeleteProperty} 
            />
        )}

        {/* 3. REQUESTS RECEIVED (Tenants asking ME) */}
        {user.role === 'owner' && (
            <div style={{marginTop:'30px'}}>
                <h3 className="section-header">📥 Requests Received (Tenants)</h3>
                <ApplicationsSection 
                    bookings={receivedBookings} 
                    tab={tab} 
                    setTab={setTab} 
                    user={user} 
                    handleStatusUpdate={handleStatusUpdate} 
                    isIncoming={true} // Flag to tell Card "I am the Landlord"
                />
            </div>
        )}

        {/* 4. MY REQUESTS (Me asking OTHERS) */}
        {(user.role !== 'owner' || sentBookings.length > 0) && (
            <div style={{marginTop:'30px'}}>
                <h3 className="section-header">📤 My Applications (Outgoing)</h3>
                <ApplicationsSection 
                    bookings={sentBookings} 
                    tab="Applications" 
                    setTab={()=>{}} 
                    user={user} 
                    handleStatusUpdate={()=>{}} 
                    isIncoming={false} // Flag to tell Card "I am the Visitor"
                />
            </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;