import { useEffect, useState } from 'react';
import axios from 'axios';
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
      
      // 1. Fetch Bookings
      const bookingRes = await axios.get('https://arivohomes.onrender.com/booking', config);
      setBookings(bookingRes.data);

      // 2. Tenant Logic
      if (user.role !== 'owner') {
          const myHome = bookingRes.data.find(b => b.status === 'Booked');
          if (myHome) setActiveRental(myHome);
      }

      // 3. Owner Logic
      if (user.role === 'owner') {
        const propRes = await axios.get('https://arivohomes.onrender.com/property');
        // Filter my properties
        const ownerProps = propRes.data.filter(p => {
             const ownerId = p.owner?._id || p.owner; 
             return ownerId === user._id;
        });
        setMyProperties(ownerProps);
      }
    } catch (err) { console.error(err); }
  };

  // --- HANDLERS (Passed down to children) ---
  const handleStatusUpdate = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`https://arivohomes.onrender.com/booking/${id}`, { status }, config);
      alert(status === 'Booked' ? "Tenant Finalized! Property Locked." : "Status Updated");
      window.location.reload();
    } catch (err) { alert('Update Failed'); }
  };

  const handleVacate = async (propertyId) => {
    if(!confirm("Is the tenant leaving? Property will be available again.")) return;
    try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.put(`https://arivohomes.onrender.com/booking/vacate`, { propertyId }, config);
        window.location.reload();
    } catch { alert("Failed to vacate"); }
  };

  const handleDeleteProperty = async (id) => {
    if(!confirm("Delete this property?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`https://arivohomes.onrender.com/property/${id}`, config);
      window.location.reload();
    } catch { alert("Delete failed"); }
  };

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
        
        {/* 1. TENANT SECTION */}
        {user.role !== 'owner' && (
            <TenantSection activeRental={activeRental} />
        )}

        {/* 2. OWNER SECTION */}
        {user.role === 'owner' && (
            <OwnerSection 
                myProperties={myProperties} 
                bookings={bookings} 
                handleVacate={handleVacate} 
                handleDeleteProperty={handleDeleteProperty} 
            />
        )}

        {/* 3. APPLICATIONS SECTION (Shared) */}
        <ApplicationsSection 
            bookings={bookings} 
            tab={tab} 
            setTab={setTab} 
            user={user} 
            handleStatusUpdate={handleStatusUpdate} 
        />

      </main>
    </div>
  );
};

export default Dashboard;