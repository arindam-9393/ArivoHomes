// import { useState, useEffect } from 'react';
// import API from '../axiosConfig';
// import { useLocation, Link } from 'react-router-dom';

// const AllProperties = () => {
//   const location = useLocation();
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showMobileFilters, setShowMobileFilters] = useState(false);

//   const [filters, setFilters] = useState({
//     location: '', category: 'All', minPrice: '', maxPrice: '',
//     tenantPreference: 'All', parking: 'Any', furnishingStatus: 'Any',
//     furnishingItems: [], amenities: []
//   });

//   const amenitiesList = ["Power Backup", "Lift", "Security", "Gym", "Swimming Pool", "Garden", "CCTV", "Club House"];
//   const furnishingOptions = ["AC", "TV", "Fridge", "Washing Machine", "Wifi", "Bed", "Geyser", "Sofa"];
//   const categories = ["All", "Apartment", "PG", "Studio", "Independent House", "Villa", "Office Space", "Commercial Shop"];

//   const getOptimizedUrl = (url) => {
//     if (!url) return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop';
//     if (url.includes('cloudinary.com')) return url.replace('/upload/', '/upload/w_600,f_auto,q_auto/');
//     return url;
//   };

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     setFilters(prev => ({
//       ...prev,
//       location: params.get('location') || '',
//       category: params.get('category') || 'All',
//       furnishingStatus: params.get('furnishingStatus') || 'Any',
//     }));
//   }, [location.search]);

//   useEffect(() => {
//     const fetchProperties = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const params = new URLSearchParams();
//         if (filters.location) params.append('location', filters.location);
//         if (filters.category !== 'All') params.append('category', filters.category);
//         if (filters.minPrice) params.append('minPrice', filters.minPrice);
//         if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
//         if (filters.tenantPreference !== 'All') params.append('tenantPreference', filters.tenantPreference);
//         if (filters.parking !== 'Any') params.append('parking', filters.parking);
//         if (filters.furnishingStatus !== 'Any') params.append('furnishingStatus', filters.furnishingStatus);
//         if (filters.furnishingItems.length > 0) params.append('furnishingItems', filters.furnishingItems.join(','));
//         if (filters.amenities.length > 0) params.append('amenities', filters.amenities.join(','));

//         const res = await API.get(`/property?${params}`);
//         setProperties(Array.isArray(res.data) ? res.data : []);
//       } catch (e) {
//         setError("Could not load properties.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     const timeoutId = setTimeout(fetchProperties, 500);
//     return () => clearTimeout(timeoutId);
//   }, [filters]);

//   const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

//   const toggleFilterArray = (field, item) => {
//     setFilters(prev => {
//       const list = prev[field];
//       return {
//         ...prev,
//         [field]: list.includes(item) ? list.filter(x => x !== item) : [...list, item]
//       };
//     });
//   };

//   const clearFilters = () => setFilters({
//       location: '', category: 'All', minPrice: '', maxPrice: '',
//       tenantPreference: 'All', parking: 'Any', 
//       furnishingStatus: 'Any', furnishingItems: [], amenities: []
//   });

//   return (
//     <div className="layout-root">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
//         .layout-root { 
//             display: flex; background: #fcfcfd; min-height: 100vh; 
//             font-family: 'Plus Jakarta Sans', sans-serif; color: #111827; 
//         }

//         /* --- SIDEBAR (Desktop & Mobile Sideways) --- */
//         .sidebar { 
//             width: 320px; background: #fff; border-right: 1px solid #f1f5f9; 
//             height: 100vh; position: sticky; top: 0; display: flex; flex-direction: column; z-index: 1000;
//             transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
//         }

//         .sidebar-header { padding: 32px 24px 10px; display: flex; justify-content: space-between; align-items: center; }
//         .sidebar-content { flex: 1; overflow-y: auto; padding: 24px; scrollbar-width: none; }
//         .sidebar-content::-webkit-scrollbar { display: none; }

//         @media (max-width: 900px) {
//             .sidebar { 
//                 position: fixed; left: 0; top: 0; bottom: 0; 
//                 transform: translateX(-100%); width: 280px; box-shadow: 20px 0 50px rgba(0,0,0,0.1); 
//             }
//             .sidebar.open { transform: translateX(0); }
//         }

//         /* --- FILTERS UI --- */
//         .f-section { margin-bottom: 32px; }
//         .f-label { font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 12px; display: block; }
        
//         .input-p { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1.5px solid #f1f5f9; background: #f8fafc; font-size: 0.9rem; font-weight: 600; transition: 0.2s; }
//         .input-p:focus { outline: none; border-color: #111827; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

//         .pill-grid { display: flex; flex-wrap: wrap; gap: 8px; }
//         .pill { padding: 8px 16px; border-radius: 100px; border: 1px solid #f1f5f9; background: #fff; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: 0.2s; color: #64748b; }
//         .pill.active { background: #111827; color: #fff; border-color: #111827; }

//         .price-row { display: flex; align-items: center; gap: 8px; }

//         /* --- MAIN VIEW --- */
//         .main-content { flex: 1; padding: 40px; width: 100%; max-width: 1400px; margin: 0 auto; }
//         .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px; }

//         /* --- CARDS --- */
//         .card { background: #fff; border-radius: 24px; border: 1px solid #f1f5f9; overflow: hidden; transition: 0.3s; position: relative; }
//         .card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.06); }
//         .img-box { height: 240px; position: relative; }
//         .img-box img { width: 100%; height: 100%; object-fit: cover; }
        
//         .price-tag { position: absolute; bottom: 16px; left: 16px; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); padding: 8px 14px; border-radius: 12px; font-weight: 800; color: #111827; font-size: 1.1rem; }
//         .cat-tag { position: absolute; top: 16px; right: 16px; background: #111827; color: #fff; padding: 5px 12px; border-radius: 100px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; }

//         .card-info { padding: 24px; }
//         .card-info h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 6px; }
//         .card-loc { color: #64748b; font-size: 0.85rem; margin-bottom: 16px; display: flex; align-items: center; gap: 4px; }
        
//         .view-btn { width: 100%; padding: 14px; background: #111827; color: #fff; border-radius: 14px; text-decoration: none; display: block; text-align: center; font-weight: 700; font-size: 0.9rem; transition: 0.2s; }
//         .view-btn:hover { background: #374151; }

//         /* --- MOBILE ELEMENTS --- */
//         .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.2); backdrop-filter: blur(4px); z-index: 900; opacity: 0; visibility: hidden; transition: 0.3s; }
//         .overlay.active { opacity: 1; visibility: visible; }

//         .mobile-trigger { 
//             display: none; position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); 
//             background: #111827; color: #fff; padding: 14px 28px; border-radius: 100px; 
//             font-weight: 700; z-index: 800; border: none; align-items: center; gap: 8px; box-shadow: 0 10px 20px rgba(0,0,0,0.2);
//         }

//         @media (max-width: 900px) {
//             .main-content { padding: 24px; }
//             .mobile-trigger { display: flex; }
//         }
//       `}</style>

//       {/* Overlay */}
//       <div className={`overlay ${showMobileFilters ? 'active' : ''}`} onClick={() => setShowMobileFilters(false)} />

//       {/* Sideways Sidebar */}
//       <aside className={`sidebar ${showMobileFilters ? 'open' : ''}`}>
//         <div className="sidebar-header">
//             <h2 style={{fontWeight:800, fontSize:'1.2rem'}}>Filters</h2>
//             <button onClick={clearFilters} style={{background:'none', border:'none', color:'#6366f1', fontWeight:700, cursor:'pointer', fontSize:'0.8rem'}}>Reset All</button>
//         </div>
        
//         <div className="sidebar-content">
//             <div className="f-section">
//                 <span className="f-label">Location</span>
//                 <input className="input-p" name="location" value={filters.location} onChange={handleChange} placeholder="Search city..." />
//             </div>

//             <div className="f-section">
//                 <span className="f-label">Price Range</span>
//                 <div className="price-row">
//                     <input className="input-p" type="number" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleChange} />
//                     <span style={{color:'#cbd5e1'}}>—</span>
//                     <input className="input-p" type="number" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleChange} />
//                 </div>
//             </div>

//             <div className="f-section">
//                 <span className="f-label">Category</span>
//                 <select className="input-p" name="category" value={filters.category} onChange={handleChange}>
//                     {categories.map(c => <option key={c} value={c}>{c}</option>)}
//                 </select>
//             </div>

//             <div className="f-section">
//                 <span className="f-label">Tenant Preference</span>
//                 <select className="input-p" name="tenantPreference" value={filters.tenantPreference} onChange={handleChange}>
//                     <option value="All">All Tenants</option>
//                     <option value="Family">Family Only</option>
//                     <option value="Bachelor">Bachelors Only</option>
//                 </select>
//             </div>

//             <div className="f-section">
//                 <span className="f-label">Furnishing Status</span>
//                 <div className="pill-grid">
//                     {["Any", "Fully Furnished", "Semi-Furnished", "Unfurnished"].map(status => (
//                         <div key={status} className={`pill ${filters.furnishingStatus === status ? 'active' : ''}`} 
//                              onClick={() => setFilters({...filters, furnishingStatus: status})}>{status}</div>
//                     ))}
//                 </div>
//             </div>

//             <div className="f-section">
//                 <span className="f-label">Room Essentials</span>
//                 <div className="pill-grid">
//                     {furnishingOptions.map(opt => (
//                         <div key={opt} className={`pill ${filters.furnishingItems.includes(opt) ? 'active' : ''}`} 
//                              onClick={() => toggleFilterArray('furnishingItems', opt)}>{opt}</div>
//                     ))}
//                 </div>
//             </div>

//             <div className="f-section">
//                 <span className="f-label">Building Amenities</span>
//                 <div className="pill-grid">
//                     {amenitiesList.map(opt => (
//                         <div key={opt} className={`pill ${filters.amenities.includes(opt) ? 'active' : ''}`} 
//                              onClick={() => toggleFilterArray('amenities', opt)}>{opt}</div>
//                     ))}
//                 </div>
//             </div>
            
//             {/* Mobile-only close button in sidebar footer */}
//             <div style={{marginTop:'20px'}} className="mobile-only">
//                 <button onClick={() => setShowMobileFilters(false)} className="view-btn">Apply Filters</button>
//             </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="main-content">
//         <header style={{marginBottom: '40px'}}>
//             <h1 style={{fontSize: '2rem', fontWeight: 800, letterSpacing:'-0.5px'}}>Properties for Rent</h1>
//             <p style={{color:'#64748b', fontWeight:500}}>{loading ? "Scanning market..." : `${properties.length} available units`}</p>
//         </header>

//         {loading ? (
//             <div style={{padding: '100px 0', textAlign: 'center'}}>
//                 <div style={{width:'40px', height:'40px', border:'4px solid #f1f5f9', borderTopColor:'#111827', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto'}} />
//                 <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//             </div>
//         ) : (
//             <div className="grid">
//                 {properties.map(p => (
//                     <div className="card" key={p._id}>
//                         <div className="img-box">
//                             <img src={getOptimizedUrl(p.mainImage)} alt={p.title} />
//                             <div className="price-tag">₹{p.price?.toLocaleString()}</div>
//                             <div className="cat-tag">{p.category}</div>
//                         </div>
//                         <div className="card-info">
//                             <h3>{p.title}</h3>
//                             <p className="card-loc">📍 {p.location}</p>
//                             <div style={{display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap'}}>
//                                 <span style={{fontSize:'0.7rem', fontWeight:700, background:'#f1f5f9', padding:'4px 10px', borderRadius:'6px'}}>{p.tenantPreference}</span>
//                                 {p.parking !== 'None' && <span style={{fontSize:'0.7rem', fontWeight:700, background:'#f1f5f9', padding:'4px 10px', borderRadius:'6px'}}>Parking</span>}
//                             </div>
//                             <Link to={`/property/${p._id}`} className="view-btn">See Details</Link>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         )}
//       </main>

//       <button className="mobile-trigger" onClick={() => setShowMobileFilters(true)}>
//         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
//         Filter Results
//       </button>
//     </div>
//   );
// };

// export default AllProperties;




import { useState, useEffect } from 'react';
import API from '../axiosConfig';
import { useLocation, Link } from 'react-router-dom';

const AllProperties = () => {
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState({
    location: '', category: 'All', minPrice: '', maxPrice: '',
    tenantPreference: 'All', parking: 'Any', furnishingStatus: 'Any',
    furnishingItems: [], amenities: []
  });

  const amenitiesList = ["Power Backup", "Lift", "Security", "Gym", "Swimming Pool", "Garden", "CCTV", "Club House"];
  const furnishingOptions = ["AC", "TV", "Fridge", "Washing Machine", "Wifi", "Bed", "Geyser", "Sofa"];
  const categories = ["All", "Apartment", "PG", "Studio", "Independent House", "Villa", "Penthouse", "Office Space", "Commercial Shop"];

  const getOptimizedUrl = (url) => {
    if (!url) return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1p6dLe2ssnNGDA1crq3zKc8bUJgZhiTtC6Q&s';
    if (url.includes('cloudinary.com')) return url.replace('/upload/', '/upload/w_600,f_auto,q_auto/');
    return url;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters(prev => ({
      ...prev,
      location: params.get('location') || '',
      category: params.get('category') || 'All',
      furnishingStatus: params.get('furnishingStatus') || 'Any',
    }));
  }, [location.search]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (filters.location) params.append('location', filters.location);
        if (filters.category !== 'All') params.append('category', filters.category);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.tenantPreference !== 'All') params.append('tenantPreference', filters.tenantPreference);
        if (filters.parking !== 'Any') params.append('parking', filters.parking);
        if (filters.furnishingStatus !== 'Any') params.append('furnishingStatus', filters.furnishingStatus);
        if (filters.furnishingItems.length > 0) params.append('furnishingItems', filters.furnishingItems.join(','));
        if (filters.amenities.length > 0) params.append('amenities', filters.amenities.join(','));

        const res = await API.get(`/property?${params}`);
        const realProperties = Array.isArray(res.data) ? res.data : [];

        const TARGET_COUNT = 150; 
        const slotsNeeded = Math.max(0, TARGET_COUNT - realProperties.length);
        
        const fakeProperties = generateFakeProperties(slotsNeeded, filters);

        setProperties([...realProperties, ...fakeProperties]);

      } catch (e) {
        console.error(e);
        setError("Could not load properties.");
        setProperties(generateFakeProperties(150, filters));
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchProperties, 500);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const toggleFilterArray = (field, item) => {
    setFilters(prev => {
      const list = prev[field];
      return {
        ...prev,
        [field]: list.includes(item) ? list.filter(x => x !== item) : [...list, item]
      };
    });
  };

  const clearFilters = () => setFilters({
    location: '', category: 'All', minPrice: '', maxPrice: '',
    tenantPreference: 'All', parking: 'Any',
    furnishingStatus: 'Any', furnishingItems: [], amenities: []
  });

  return (
    <div className="layout-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .layout-root { display: flex; background: #fcfcfd; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; color: #111827; }
        
        /* --- SIDEBAR --- */
        .sidebar { 
            width: 320px; 
            background: #fff; 
            border-right: 1px solid #f1f5f9; 
            position: sticky; 
            top: 70px; /* Matches Desktop Navbar Height */
            height: calc(100vh - 70px); 
            display: flex; 
            flex-direction: column; 
            z-index: 900; 
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
        }

        .sidebar-header { padding: 32px 24px 10px; display: flex; justify-content: space-between; align-items: center; }
        .sidebar-content { flex: 1; overflow-y: auto; padding: 24px; scrollbar-width: none; }
        .sidebar-content::-webkit-scrollbar { display: none; }

        @media (max-width: 900px) {
            .sidebar { 
                position: fixed; left: 0; top: 0; bottom: 0; 
                transform: translateX(-100%); width: 280px; 
                height: 100vh; 
                z-index: 2000; 
                box-shadow: 20px 0 50px rgba(0,0,0,0.1); 
            }
            .sidebar.open { transform: translateX(0); }
        }

        .f-section { margin-bottom: 32px; }
        .f-label { font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 12px; display: block; }
        .input-p { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1.5px solid #f1f5f9; background: #f8fafc; font-size: 0.9rem; font-weight: 600; transition: 0.2s; }
        .input-p:focus { outline: none; border-color: #111827; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .pill-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .pill { padding: 8px 16px; border-radius: 100px; border: 1px solid #f1f5f9; background: #fff; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: 0.2s; color: #64748b; }
        .pill.active { background: #111827; color: #fff; border-color: #111827; }
        .price-row { display: flex; align-items: center; gap: 8px; }
        
        /* --- MAIN CONTENT --- */
        .main-content { flex: 1; padding: 40px; width: 100%; max-width: 1400px; margin: 0 auto; min-height: 100vh; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px; }
        .card { background: #fff; border-radius: 24px; border: 1px solid #f1f5f9; overflow: hidden; transition: 0.3s; position: relative; }
        .card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.06); }
        .img-box { height: 240px; position: relative; }
        .img-box img { width: 100%; height: 100%; object-fit: cover; }
        .price-tag { position: absolute; bottom: 16px; left: 16px; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); padding: 8px 14px; border-radius: 12px; font-weight: 800; color: #111827; font-size: 1.1rem; }
        .cat-tag { position: absolute; top: 16px; right: 16px; background: #111827; color: #fff; padding: 5px 12px; border-radius: 100px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; }
        .card-info { padding: 24px; }
        .card-info h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 6px; }
        .card-loc { color: #64748b; font-size: 0.85rem; margin-bottom: 16px; display: flex; align-items: center; gap: 4px; }
        .view-btn { width: 100%; padding: 14px; background: #111827; color: #fff; border-radius: 14px; text-decoration: none; display: block; text-align: center; font-weight: 700; font-size: 0.9rem; transition: 0.2s; cursor: pointer; }
        .view-btn:hover { background: #374151; }
        
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.2); backdrop-filter: blur(4px); z-index: 900; opacity: 0; visibility: hidden; transition: 0.3s; }
        .overlay.active { opacity: 1; visibility: visible; }

        /* --- MOBILE FLOATING BUTTON FIX --- */
        .mobile-trigger { 
            display: none; 
            position: fixed; 
            bottom: 90px; /* MOVED UP (Above the 65px Navbar) */
            left: 50%; 
            transform: translateX(-50%); 
            background: #111827; 
            color: #fff; 
            padding: 14px 28px; 
            border-radius: 100px; 
            font-weight: 700; 
            z-index: 999; /* Ensure it's above content but below overlays */
            border: none; 
            align-items: center; 
            gap: 8px; 
            box-shadow: 0 10px 20px rgba(0,0,0,0.2); 
        }

        @media (max-width: 900px) { 
            .main-content { padding: 24px 24px 120px 24px; } /* Added bottom padding for scrolling */
            .mobile-trigger { display: flex; } 
        }
      `}</style>

      <div className={`overlay ${showMobileFilters ? 'active' : ''}`} onClick={() => setShowMobileFilters(false)} />

      <aside className={`sidebar ${showMobileFilters ? 'open' : ''}`}>
        <div className="sidebar-header">
            <h2 style={{fontWeight:800, fontSize:'1.2rem'}}>Filters</h2>
            <button onClick={clearFilters} style={{background:'none', border:'none', color:'#6366f1', fontWeight:700, cursor:'pointer', fontSize:'0.8rem'}}>Reset All</button>
        </div>
        
        <div className="sidebar-content">
            <div className="f-section">
                <span className="f-label">Location</span>
                <input className="input-p" name="location" value={filters.location} onChange={handleChange} placeholder="Search city..." />
            </div>

            <div className="f-section">
                <span className="f-label">Price Range</span>
                <div className="price-row">
                    <input className="input-p" type="number" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleChange} />
                    <span style={{color:'#cbd5e1'}}>—</span>
                    <input className="input-p" type="number" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleChange} />
                </div>
            </div>

            <div className="f-section">
                <span className="f-label">Category</span>
                <select className="input-p" name="category" value={filters.category} onChange={handleChange}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div className="f-section">
                <span className="f-label">Tenant Preference</span>
                <select className="input-p" name="tenantPreference" value={filters.tenantPreference} onChange={handleChange}>
                    <option value="All">All Tenants</option>
                    <option value="Family">Family Only</option>
                    <option value="Bachelor">Bachelors Only</option>
                </select>
            </div>

            <div className="f-section">
                <span className="f-label">Furnishing Status</span>
                <div className="pill-grid">
                    {["Any", "Fully Furnished", "Semi-Furnished", "Unfurnished"].map(status => (
                        <div key={status} className={`pill ${filters.furnishingStatus === status ? 'active' : ''}`} 
                             onClick={() => setFilters({...filters, furnishingStatus: status})}>{status}</div>
                    ))}
                </div>
            </div>

            <div className="f-section">
                <span className="f-label">Building Amenities</span>
                <div className="pill-grid">
                    {amenitiesList.map(opt => (
                        <div key={opt} className={`pill ${filters.amenities.includes(opt) ? 'active' : ''}`} 
                             onClick={() => toggleFilterArray('amenities', opt)}>{opt}</div>
                    ))}
                </div>
            </div>

            <div style={{marginTop:'20px'}} className="mobile-only">
                <button onClick={() => setShowMobileFilters(false)} className="view-btn">Apply Filters</button>
            </div>
        </div>
      </aside>

      <main className="main-content">
        <header style={{marginBottom: '40px'}}>
            <h1 style={{fontSize: '2rem', fontWeight: 800, letterSpacing:'-0.5px'}}>Properties for Rent</h1>
            <p style={{color:'#64748b', fontWeight:500}}>{loading ? "Scanning market..." : `${properties.length} available units`}</p>
        </header>

        {loading ? (
            <div style={{padding: '100px 0', textAlign: 'center'}}>
                <div style={{width:'40px', height:'40px', border:'4px solid #f1f5f9', borderTopColor:'#111827', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto'}} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        ) : (
            <div className="grid">
                {properties.map(p => (
                    <div className="card" key={p._id}>
                        <div className="img-box">
                            <img src={getOptimizedUrl(p.mainImage)} alt={p.title} onError={(e) => e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1p6dLe2ssnNGDA1crq3zKc8bUJgZhiTtC6Q&s'} />
                            <div className="price-tag">₹{p.price?.toLocaleString()}</div>
                            <div className="cat-tag">{p.category}</div>
                        </div>
                        <div className="card-info">
                            <h3>{p.title}</h3>
                            <p className="card-loc">📍 {p.location}</p>
                            <div style={{display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap'}}>
                                <span style={{fontSize:'0.7rem', fontWeight:700, background:'#f1f5f9', padding:'4px 10px', borderRadius:'6px'}}>{p.tenantPreference}</span>
                                {p.isFake && <span style={{fontSize:'0.7rem', fontWeight:700, background:'#dcfce7', color:'#166534', padding:'4px 10px', borderRadius:'6px'}}>Verified</span>}
                            </div>
                            <Link to={`/property/${p._id}`} className="view-btn">See Details</Link>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </main>

      {/* FIXED BUTTON: Now floats above the bottom navbar */}
      <button className="mobile-trigger" onClick={() => setShowMobileFilters(true)}>
          Filter Results
      </button>
    </div>
  );
};

// --- FAKE GENERATOR WITH FILTERS ---
const generateFakeProperties = (count, filters) => {
    // 1. IMAGES
    const shopImages = [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1p6dLe2ssnNGDA1crq3zKc8bUJgZhiTtC6Q&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2aML13Sf4d1pFmS4_ptxxG0D62BeZKmInUg&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQizJzytLyEdTQ0DJ4A89XADUIxbxHoyBA-KQ&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV7mu5_K86YQaa7uWbK8um8WRxSWd7YnqGew&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROOhhhz97J0WnXtBXUSzPcc9o3WX6FXpnjtg&s'
    ];
    const officeImages = [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7g43Ku9ljEAaidEsItfT0gmfIYhMD455a4g&s',
        'https://img.freepik.com/premium-photo/rooms-empty-office-with-one-with-windows-technical-ceilings-blue-carpeted-floors-individual-offices_449839-6569.jpg',
        'https://business.cornell.edu/wp-content/uploads/sites/2/2023/06/AdobeStock_empty.office.600x400.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8XtUqzrNCJIHYjckZB_hbv4DMB6j3G8TfdQ&s',
        'https://static01.nyt.com/images/2023/09/01/multimedia/01Office-Space-jpwv/01Office-Space-jpwv-mediumSquareAt3X.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJZ8Qx64YUuSW-XC467pWt7k3XC5e_smPriA&s'
    ];
    
    // --- Unfurnished Rooms, Halls, & Simple Kitchens ---
    const plainFlatImages = [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQED6-fhf2_TdY3IClhj9doL4EnGfRTG6uxdA&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnEG-D8-txps3aU7lEq4FA7IekzLjnG9Lx4bVzZ2QXSw&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnSpZeSNN3gcE1zEqy-Mdc1cIS8yyNfT3ppA&s',
        'https://housing-images.n7net.in/01c16c28/9edb849e007d9d6c7dc37a9f86827667/v0/medium/1_bhk_independent_builder_floor-for-rent-malviya_nagar-New+Delhi-bedroom.jpg',
        'https://imagecdn.99acres.com/media1/34518/12/690372303M-1766627498408.webp',
        'https://imagecdn.99acres.com/media1/33346/14/666934731M-1766703555570.webp',
        'https://thumbs.dreamstime.com/b/generic-modern-residential-empty-bedroom-interior-kent-washington-modern-residential-empty-bedroom-interior-420106979.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM9KrFpENOsiyr7zjzPy89OfkVTyVMKq6hhw&s',
        'https://property-img.s3.ap-south-1.amazonaws.com/prop_17662246452.jpeg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlq-Th-rx9vy3mW7iPXTkEJIAb88bbxo117w&s',
        'https://is1-2.housingcdn.com/01c16c28/40dbfcd97eb64f549a1a748157f3b064/v0/fs/1_bhk_apartment-for-rent-goregaon_west-Mumbai-bedroom.jpg',
        'https://img.staticmb.com/mbphoto/property/cropped_images/2025/Nov/18/Photo_h470_w1080/68821233_3_PropertyImage1763479353710_470_1080.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxVeXc4j1PRitKvXBpb1SO2TzMxe_LNz5eLPuLcnntuQ&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxV8h1aBi_nohno5d0fXXC0o66wOd7RYYCKRrV4y-SrA&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIcK0rtVgCu2-c29D_5tjsj72JLol55pBs-ktWgO5ezQ&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF0cR4jm6kXFMfWzucMfahqS0g96WFYRJCdSfe8uGspg&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE5_ttm7wDkS-xBruW7OGkLpiS0CAKtNncMpqn2jXArQ&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWKzVBuqJ1NDI96brNj_Z3yW5bJfoaQzDAgtwO3pcNNw&s',
        'https://www.magicbricks.com/3-bhk-independent-house-for-rent-in-janaki-nagar-maduravoyal-chennai-pppfr',
        'https://imagecdn.99acres.com/media1/34462/8/689248877M-1766394213414.webp',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu0y2z_Jaac471WXR8h_rmDpAqCB2dhhAzeQ&s',
        'https://housing-images.n7net.in/01c16c28/477c982eb19261b26c75379e7a9b00e4/v0/medium/3_bhk_apartment-for-rent-vidya_nagar_bilaspur-Bilaspur-hall.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTuNlwok1GFGlBPeu_NZFoesmanxmp6gKH9A&s',
        'https://images.nobroker.in/images/8a9f9386997a28d801997a615fda1749/8a9f9386997a28d801997a615fda1749_239539_290251_medium.jpg',
        'https://images.nobroker.in/images/8a9fa2839a670034019a6753698e2182/8a9fa2839a670034019a6753698e2182_23336_122940_medium.jpg',
        'https://i.pinimg.com/736x/cb/6f/18/cb6f18c70e3b3b84b13981f790659500.jpg',
        'https://i.pinimg.com/736x/3e/29/8e/3e298eb47ee0d1840f51e411278265fb.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtdMgcJ3dy0zchQ_N4XsmWWVPizvlGz7mXBQ&s',
        'https://images.nobroker.in/images/8a9fa190989415760198947c9a5f27a1/8a9fa190989415760198947c9a5f27a1_96556_474256_medium.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXwU3eXTesNuthyWiemGJzbo2euszHGZDHmNRGNwDOmA&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBOrAkaQ0Z8iOf_utxDU4pdAPiRYKteuHqzC7BWKgzxQ&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK42kp1MB2KXZvlKdGXhwb7C197rDHLzQJIFO07y1eKw&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1eIZnfSP8b0_V8Llcm1Mn_UBmeKE4sCVQKSmdOfFRgw&s'
    ];

    // --- Furnished Bedrooms, Kitchens, & Halls ---
    const furnishedImages = [
        'https://nagpurrental.com/wp-content/uploads/2023/07/3BHK-FLAT-Rent-Dattatray-Nagar-Nagpur.jpeg',
        'https://nagpurrental.com/wp-content/uploads/2022/07/images1.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY6-tOTDmXAR99r7eXgLTYplP9i8A4M8mgVQ&s',
        'https://5.imimg.com/data5/SELLER/Default/2024/10/461228767/PS/TJ/FK/2703532/3-bhk-fully-furnished-flat.jpg',
        'https://guesthousewale.com/storage/properties/noida/noida-extension/2bhk/1/2bhk-fully-furnished-flat-in-noida-extension-4.jpg',
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/566202883.jpg?k=9e4a37b06b655ebde4c92fb12399035a85c9d4966e7cca20b6c845865365eb06&o=',
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/519060992.jpg?k=b058066d4e154d7c5558be72168ea0966a85ae5f1c919b67931e9870716ac1e7&o=',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSghrztBlvijoRhquV8VQxks8uJ5w7NmDHnMw&s',
        'https://d1hy6t2xeg0mdl.cloudfront.net/image/84467/ffd20221d2/1024-width',
        'https://i.pinimg.com/236x/ab/c7/3e/abc73e500e9ea5f3b9acae0260f44440.jpg',
        'https://i.pinimg.com/736x/f7/e2/9d/f7e29d37e8fb5eed31aa8e5a8917df58.jpg',
        'https://images.oyoroomscdn.com/uploads/hotel_image/210502/small/slsdmlgbyvjg.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGlKpG5FmS8TlwVvzELJ6jLte_Iml6B8kJ1BKMbK1eVw&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxrirZlQAuvX1jNIoxqC_dZvba9Tr0witDhB8auWUbiw&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR91EgPRHszPiWzeGLzB-50DAoGWDLCjbL2uGKcsnPa4g&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc77Cz9TesUXU2JAIbLpt9sUOtJCmlAjo2-2tlatDh8w&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvbJkqgVldjTebJyLzfP42fpTO-R9-2hDYM3NYgo4sGQ&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToYmmhrLA5yMRQvH84LEkm0G0Ojq_QE5uOhtgaMqkcHg&s',
        'https://images.squarespace-cdn.com/content/v1/56dfd5cc9f7266ed7f04b64d/1585743758868-H4OQJFRUE73J6H4CV142/image-asset.jpeg',
        'https://images.squarespace-cdn.com/content/v1/56dfd5cc9f7266ed7f04b64d/1585743751085-N2317B7K3I2YBZHPHENO/image-asset.jpeg',
        'https://c8.alamy.com/comp/2RTC433/mauritania-adrar-region-chinguetti-local-kitchen-2RTC433.jpg',
        'https://5.imimg.com/data5/DL/SR/MY-12354255/modular-kitchen-designing-services-500x500.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOSlIRhkLPhSRWEghvu7xDMURrR9JzYTgq6tjnxF9DrQ&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdOI1ewjpse-7E-UbfVzsdDedll8qYjhr5LQ&s',
        'https://www.winteria.in/wp-content/uploads/2023/06/indian-style-small-modular-kitchen-design.png',
        'https://www.shutterstock.com/image-photo/19apr2016-small-house-interior-shoing-260nw-1137395780.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdglPSAmqG27H6s3LOx5imaYXNAYp885GqFw&s',
        'https://content.jdmagicbox.com/comp/ahmedabad/39/079p57039/catalogue/indramohansingh-soni-thaltej-ahmedabad-paying-guest-accommodations-47019hb.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSfCN5e0JbGszRVWUapGu_ypYRk4XyBiA7CPm_bnKYeQ&s',
        'https://images.homify.com/v1438440089/p/photo/image/324794/simple-small-kitchen-design.jpg',
        'https://5.imimg.com/data5/DV/VK/BE/ANDROID-1943402/product-jpeg.jpg',
        'https://www.kolkatainterior.in/project/images/Pankaj-Das/Kitchen-South-Wall-Lower-Cabinets.jpg',
        'https://thumbs.dreamstime.com/b/small-house-interior-shoing-kitchen-middle-class-kalyan-mumbai-march-maharashtra-india-asia-174566741.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE26w1BRRl12nF-METZZsQGuKm__SDPudgzPXlijoeuQ&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYpKfvB1SI5wz45rAHmrKOoWZqd8x7p7_q1s90dQeeyQ&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6rDxTOgJ2eSFij_ogNwxDLTBBt3C9vuUJVw&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD2ZEgCHnDWDjotyxICklkupdGgAPh3Ik8lQ&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST0XZflK_q_xz3nB6RKysd-jhgma4d5MAyjQ&s'
    ];
    
    const luxuryImages = [
        'https://nagpurrental.com/wp-content/uploads/2022/07/images1.jpg',
        'https://5.imimg.com/data5/SELLER/Default/2024/10/461228767/PS/TJ/FK/2703532/3-bhk-fully-furnished-flat.jpg',
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/519060992.jpg?k=b058066d4e154d7c5558be72168ea0966a85ae5f1c919b67931e9870716ac1e7&o='
    ];

  const locations = ["Sitabuldi", "Sadar", "Dharampeth", "Itwari", "Manewada", "Wardha Road", "Besa", "Narendra Nagar", "Civil Lines", "Mahal"];
  
  const fakes = [];
  const loopCount = count + 100; 

  const roundTo500 = (num) => Math.round(num / 500) * 500;

  for (let i = 0; i < loopCount; i++) {
    if(fakes.length >= count) break;

    const loc = locations[i % locations.length];
    let type, category, price, image, furnishing, tenantPref, parking;

    const rand = Math.random();
    if (rand < 0.30) { 
        type = ["Independent House", "Row House Floor"][i % 2];
        category = "Independent House";
        price = roundTo500(15000 + Math.random() * 15000); 
        image = plainFlatImages[i % plainFlatImages.length];
        furnishing = "Unfurnished";
        tenantPref = "Family";
        parking = "Covered";
    } else if (rand < 0.45) {
        type = "Commercial Shop";
        category = "Commercial Shop";
        price = roundTo500(8000 + Math.random() * 20000);
        image = shopImages[i % shopImages.length];
        furnishing = "Any";
        tenantPref = "All";
        parking = "Open";
    } else if (rand < 0.60) {
        type = "Office Space";
        category = "Office Space";
        price = roundTo500(12000 + Math.random() * 25000);
        image = officeImages[i % officeImages.length];
        furnishing = i % 2 === 0 ? "Semi-Furnished" : "Unfurnished";
        tenantPref = "All";
        parking = "Covered";
    } else if (rand < 0.85) {
        type = ["1 BHK Flat", "2 BHK Flat", "1 RK Studio"][i % 3];
        category = type.includes("Studio") ? "Studio" : "Apartment";
        price = roundTo500(6000 + Math.random() * 8000);
        image = plainFlatImages[i % plainFlatImages.length];
        furnishing = i % 2 === 0 ? "Semi-Furnished" : "Unfurnished";
        tenantPref = i % 3 === 0 ? "Bachelor" : "Family";
        parking = i % 2 === 0 ? "Covered" : "None";
    } else if (rand < 0.95) {
        type = "Furnished 2 BHK";
        category = "Apartment";
        price = roundTo500(18000 + Math.random() * 10000);
        image = furnishedImages[i % furnishedImages.length];
        furnishing = "Fully Furnished";
        tenantPref = "Family";
        parking = "Covered";
    } else {
        type = ["Luxury Penthouse", "4 BHK Villa"][i % 2];
        category = type.includes("Villa") ? "Villa" : "Penthouse";
        price = roundTo500(35000 + Math.random() * 30000);
        image = luxuryImages[i % luxuryImages.length];
        furnishing = "Fully Furnished";
        tenantPref = "Family";
        parking = "Covered";
    }

    if (filters.location && !loc.toLowerCase().includes(filters.location.toLowerCase())) continue;
    if (filters.category !== 'All' && filters.category !== category) continue;
    if (filters.minPrice && price < parseInt(filters.minPrice)) continue;
    if (filters.maxPrice && price > parseInt(filters.maxPrice)) continue;
    if (filters.tenantPreference !== 'All' && tenantPref !== 'All' && filters.tenantPreference !== tenantPref) continue;
    if (filters.furnishingStatus !== 'Any' && filters.furnishingStatus !== furnishing) continue;

    fakes.push({
      _id: `fake-${i + 1}-${category.replace(/\s/g, '')}`,
      isFake: true,
      title: `${type} in ${loc}`,
      location: loc,
      price: price,
      category: category,
      tenantPreference: tenantPref,
      parking: parking,
      mainImage: image,
      furnishingStatus: furnishing
    });
  }

  return fakes;
};

export default AllProperties;