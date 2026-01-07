// import { useState, useEffect } from 'react';
// import API from '../axiosConfig';
// import { useLocation, Link } from 'react-router-dom';

// const AllProperties = () => {
//   const location = useLocation();

//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showMobileFilters, setShowMobileFilters] = useState(false);

//   // --- FILTER STATE ---
//   const [filters, setFilters] = useState({
//     location: '', category: 'All', minPrice: '', maxPrice: '',
//     tenantPreference: 'All', parking: 'Any', furnishingStatus: 'Any',
//     furnishingItems: [], amenities: []
//   });

//   const amenitiesList = ["Power Backup", "Lift", "Security", "Gym", "Swimming Pool", "Garden", "CCTV", "Club House"];
//   const furnishingOptions = ["AC", "TV", "Fridge", "Washing Machine", "Wifi", "Bed", "Geyser", "Sofa"];
  
//   const categories = ["All", "Apartment", "PG", "Studio", "Independent House", "Villa", "Office Space", "Commercial Shop"];

//   // --- HELPER: OPTIMIZE CLOUDINARY URL ---
//   const getOptimizedUrl = (url) => {
//     if (!url) return 'https://via.placeholder.com/300x200';
//     if (url.includes('cloudinary.com')) {
//         return url.replace('/upload/', '/upload/w_400,f_auto,q_auto/');
//     }
//     return url;
//   };

//   /* ================== 1. LOAD URL PARAMS ================== */
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     setFilters(prev => ({
//       ...prev,
//       location: params.get('location') || '',
//       category: params.get('category') || 'All',
//       furnishingStatus: params.get('furnishingStatus') || 'Any',
//     }));
//   }, [location.search]);

//   /* ================== 2. FETCH PROPERTIES ================== */
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
//         console.error(e);
//         setError("Could not load properties.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     const timeoutId = setTimeout(() => fetchProperties(), 500);
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

//   useEffect(() => {
//     if (window.innerWidth < 900) {
//         document.body.style.overflow = showMobileFilters ? 'hidden' : 'auto';
//     }
//   }, [showMobileFilters]);

//   return (
//     <div className="layout-container">
//       <style>{`
//         /* RESET & BASE */
//         .layout-container { display: flex; align-items: flex-start; background-color: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; position: relative; }
        
//         /* --- SIDEBAR --- */
//         .sidebar { width: 300px; background: #ffffff; border-right: 1px solid #e2e8f0; padding: 25px; height: calc(100vh - 60px); position: sticky; top: 60px; overflow-y: auto; flex-shrink: 0; z-index: 50; }
//         .filter-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
//         .filter-section { border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 20px; }
//         .filter-title { font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 12px; display: block; text-transform: uppercase; letter-spacing: 0.5px; }
        
//         .input-text, .input-select { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; background: #fff; }
//         .price-row { display: flex; gap: 10px; align-items: center; }
//         .price-input { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; }

//         /* --- FIXED ALIGNMENT FOR RADIO BUTTONS --- */
//         .radio-item { 
//             display: flex; 
//             align-items: center; /* Perfect vertical centering */
//             gap: 12px; 
//             margin-bottom: 12px; /* Spacing between items */
//             cursor: pointer; 
//             font-size: 0.95rem; 
//             color: #475569; 
//             padding: 2px 0;
//             line-height: 1.2; 
//         }
        
//         .radio-item input { 
//             width: 18px; 
//             height: 18px; 
//             margin: 0; 
//             accent-color: #2563eb; 
//             flex-shrink: 0; /* Prevents button from squishing */
//             cursor: pointer;
//             position: relative;
//             top: -1px; /* Micro alignment fix */
//         }
        
//         .checkbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
//         .check-box-item { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px; font-size: 0.85rem; cursor: pointer; color: #475569; transition: all 0.2s; }
//         .check-box-item.active { background: #eff6ff; border-color: #2563eb; color: #1e40af; font-weight: 700; }
        
//         .main-content { flex: 1; padding: 30px; width: 100%; }
//         .property-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }
        
//         .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; }
//         .card:hover { box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); transform: translateY(-3px); }
//         .card-img-wrapper { height: 200px; position: relative; background: #f1f5f9; }
//         .card-img { width: 100%; height: 100%; object-fit: cover; }
        
//         .badge-status { position: absolute; top: 12px; left: 12px; background: #0f172a; color: white; font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; }
//         .badge-category { position: absolute; top: 12px; right: 12px; background: #fff; color: #0f172a; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        
//         .card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
//         .card-title { font-size: 1.2rem; font-weight: 700; color: #0f172a; margin: 0 0 5px 0; }
//         .card-location { font-size: 0.9rem; color: #64748b; margin-bottom: 15px; }
//         .card-price { font-size: 1.5rem; font-weight: 800; color: #2563eb; margin-bottom: 15px; }
        
//         .feature-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px; }
//         .tag { background: #f1f5f9; color: #475569; font-size: 0.75rem; padding: 4px 10px; border-radius: 4px; font-weight: 600; }
        
//         .view-btn { margin-top: auto; background: #0f172a; color: #fff; text-align: center; padding: 12px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: 0.2s; }
//         .view-btn:hover { background: #1e293b; }
        
//         .mobile-filter-trigger { display: none; }
//         .mobile-overlay { display: none; }
//         .close-mobile-btn { display: none; }

//         @media (max-width: 900px) {
//             .layout-container { flex-direction: column; }
//             .main-content { padding: 15px; padding-bottom: 100px; }
//             .sidebar { position: fixed; top: 0; left: 0; height: 100vh; width: 85%; max-width: 320px; transform: translateX(-100%); transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1); z-index: 10000; box-shadow: 10px 0 40px -10px rgba(0,0,0,0.3); border-right: 1px solid #e2e8f0; }
//             .sidebar.open { transform: translateX(0); }
//             .close-mobile-btn { display: flex; background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; align-items: center; justify-content: center; }
//             .mobile-overlay { display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; opacity: 0; visibility: hidden; transition: 0.3s; }
//             .mobile-overlay.open { opacity: 1; visibility: visible; }
//             .mobile-filter-trigger { display: flex; align-items: center; gap: 8px; position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: #0f172a; color: white; padding: 12px 28px; border-radius: 50px; font-weight: 700; box-shadow: 0 5px 20px rgba(0,0,0,0.3); z-index: 9000; border: none; cursor: pointer; font-size: 1rem; }
//         }
//       `}</style>

//       {/* --- OVERLAY --- */}
//       <div className={`mobile-overlay ${showMobileFilters ? 'open' : ''}`} onClick={() => setShowMobileFilters(false)} />

//       {/* --- FILTER SIDEBAR --- */}
//       <aside className={`sidebar ${showMobileFilters ? 'open' : ''}`}>
//         <div className="filter-header">
//             <h3>Filters</h3>
//             <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
//                 <button className="clear-btn" onClick={clearFilters}>Reset All</button>
//                 <button className="close-mobile-btn" onClick={() => setShowMobileFilters(false)}>✕</button>
//             </div>
//         </div>
        
//         {/* 1. Location */}
//         <div className="filter-section">
//             <label className="filter-title">Location</label>
//             <input className="input-text" name="location" value={filters.location} onChange={handleChange} placeholder="City, Area..." />
//         </div>
        
//         {/* 2. Price */}
//         <div className="filter-section">
//             <label className="filter-title">Price Range (₹)</label>
//             <div className="price-row">
//                 <input type="number" className="price-input" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleChange} />
//                 <span>-</span>
//                 <input type="number" className="price-input" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleChange} />
//             </div>
//         </div>
        
//         {/* 3. Category (UPDATED ALIGNMENT) */}
//         <div className="filter-section">
//             <label className="filter-title">Property Type</label>
//             <div style={{display:'flex', flexDirection:'column'}}>
//                 {categories.map(c => (
//                     <label key={c} className="radio-item" style={{ fontWeight: filters.category === c ? '600' : 'normal', color: filters.category === c ? '#2563eb' : '#475569' }}>
//                         <input type="radio" name="category" value={c} checked={filters.category === c} onChange={handleChange} />
//                         {c}
//                     </label>
//                 ))}
//             </div>
//         </div>
        
//         {/* 4. Dropdowns */}
//         <div className="filter-section">
//             <label className="filter-title">Preferences</label>
//             <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
//                 <select className="input-select" name="tenantPreference" value={filters.tenantPreference} onChange={handleChange}>
//                     <option value="All">Tenant: Any</option>
//                     <option value="Family">Tenant: Family Only</option>
//                     <option value="Bachelor">Tenant: Bachelors Only</option>
//                 </select>
//                 <select className="input-select" name="furnishingStatus" value={filters.furnishingStatus} onChange={handleChange}>
//                     <option value="Any">Furnishing: Any</option>
//                     <option value="Fully Furnished">Fully Furnished</option>
//                     <option value="Semi-Furnished">Semi-Furnished</option>
//                     <option value="Unfurnished">Unfurnished</option>
//                 </select>
//             </div>
//         </div>
        
//         {/* 5. Essentials */}
//         <div className="filter-section">
//             <label className="filter-title">Room Essentials</label>
//             <div className="checkbox-grid">
//                 {furnishingOptions.map(item => {
//                     const isActive = filters.furnishingItems.includes(item);
//                     return (
//                         <label key={item} className={`check-box-item ${isActive ? 'active' : ''}`}>
//                             <input type="checkbox" style={{display:'none'}} checked={isActive} onChange={() => toggleFilterArray('furnishingItems', item)} />
//                             {item}
//                         </label>
//                     );
//                 })}
//             </div>
//         </div>
        
//         {/* 6. Amenities */}
//         <div className="filter-section">
//             <label className="filter-title">Building Amenities</label>
//             <div className="checkbox-grid">
//                 {amenitiesList.map(item => {
//                     const isActive = filters.amenities.includes(item);
//                     return (
//                         <label key={item} className={`check-box-item ${isActive ? 'active' : ''}`}>
//                             <input type="checkbox" style={{display:'none'}} checked={isActive} onChange={() => toggleFilterArray('amenities', item)} />
//                             {item}
//                         </label>
//                     );
//                 })}
//             </div>
//         </div>
        
//         <div style={{marginTop: '20px', display: window.innerWidth < 900 ? 'block' : 'none'}}>
//             <button onClick={() => setShowMobileFilters(false)} style={{width: '100%', background: '#2563eb', color:'white', padding:'14px', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer', fontSize:'1rem'}}>
//                 Show {properties.length} Results
//             </button>
//         </div>
//       </aside>

//       {/* --- MAIN CONTENT --- */}
//       <main className="main-content">
//         <div className="results-header">
//             <h2 style={{ fontSize: '1.5rem', fontWeight:'800', color:'#1e293b', margin: 0 }}>
//                 Explore Properties
//                 <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 'normal', marginLeft: '10px' }}>
//                     {loading ? "Searching..." : `(${properties.length})`}
//                 </span>
//             </h2>
//         </div>
        
//         {error && <div style={{ padding: '15px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom:'20px' }}>{error}</div>}

//         {loading ? (
//              <p style={{color:'#64748b'}}>Loading...</p>
//         ) : (
//             <div className="property-grid">
//                 {properties.length === 0 ? (
//                     <div style={{ gridColumn: '1/-1', padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '12px', border:'1px dashed #cbd5e1' }}>
//                         <div style={{fontSize:'3rem', marginBottom:'10px'}}>🔍</div>
//                         <h3 style={{color:'#1e293b'}}>No properties found.</h3>
//                         <p style={{color:'#64748b'}}>Try removing some filters.</p>
//                         <button onClick={clearFilters} style={{marginTop:'15px', background:'none', border:'1px solid #2563eb', color:'#2563eb', padding:'8px 16px', borderRadius:'6px', cursor:'pointer', fontWeight:'600'}}>Clear All Filters</button>
//                     </div>
//                 ) : (
//                     properties.map(p => (
//                         <div key={p._id} className="card">
//                             <div className="card-img-wrapper">
//                                 <img 
//                                     src={getOptimizedUrl(p.mainImage)} 
//                                     alt={p.title} 
//                                     className="card-img" 
//                                     loading="lazy"
//                                 />
//                                 {p.furnishingStatus === 'Fully Furnished' && <span className="badge-status">Fully Furnished</span>}
//                                 <span className="badge-category">{p.category}</span>
//                             </div>

//                             <div className="card-body">
//                                 <h3 className="card-title">{p.title}</h3>
//                                 <p className="card-location">📍 {p.location}</p>
//                                 <div className="card-price">
//                                     <span style={{fontSize:'1rem', verticalAlign:'top'}}>₹</span>{p.price?.toLocaleString()}
//                                 </div>
//                                 <div className="feature-tags">
//                                     <span className="tag">
//                                         {p.tenantPreference === 'All' ? 'Family/Bachelor' : p.tenantPreference}
//                                     </span>
//                                     {p.parking !== 'None' && <span className="tag">Parking</span>}
//                                     { (p.furnishingItems || []).slice(0, 2).map(i => <span key={i} className="tag">{i}</span>) }
//                                 </div>
//                                 <Link to={`/property/${p._id}`} className="view-btn">See Details</Link>
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>
//         )}
//       </main>

//       {/* --- MOBILE FLOATING BUTTON --- */}
//       <button className="mobile-filter-trigger" onClick={() => setShowMobileFilters(true)}>
//          <span>⚡ Filters</span>
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
  const categories = ["All", "Apartment", "PG", "Studio", "Independent House", "Villa", "Office Space", "Commercial Shop"];

  const getOptimizedUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop';
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
        setProperties(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setError("Could not load properties.");
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
        
        .layout-root { 
            display: flex; background: #fcfcfd; min-height: 100vh; 
            font-family: 'Plus Jakarta Sans', sans-serif; color: #111827; 
        }

        /* --- SIDEBAR (Desktop & Mobile Sideways) --- */
        .sidebar { 
            width: 320px; background: #fff; border-right: 1px solid #f1f5f9; 
            height: 100vh; position: sticky; top: 0; display: flex; flex-direction: column; z-index: 1000;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar-header { padding: 32px 24px 10px; display: flex; justify-content: space-between; align-items: center; }
        .sidebar-content { flex: 1; overflow-y: auto; padding: 24px; scrollbar-width: none; }
        .sidebar-content::-webkit-scrollbar { display: none; }

        @media (max-width: 900px) {
            .sidebar { 
                position: fixed; left: 0; top: 0; bottom: 0; 
                transform: translateX(-100%); width: 280px; box-shadow: 20px 0 50px rgba(0,0,0,0.1); 
            }
            .sidebar.open { transform: translateX(0); }
        }

        /* --- FILTERS UI --- */
        .f-section { margin-bottom: 32px; }
        .f-label { font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 12px; display: block; }
        
        .input-p { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1.5px solid #f1f5f9; background: #f8fafc; font-size: 0.9rem; font-weight: 600; transition: 0.2s; }
        .input-p:focus { outline: none; border-color: #111827; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

        .pill-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .pill { padding: 8px 16px; border-radius: 100px; border: 1px solid #f1f5f9; background: #fff; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: 0.2s; color: #64748b; }
        .pill.active { background: #111827; color: #fff; border-color: #111827; }

        .price-row { display: flex; align-items: center; gap: 8px; }

        /* --- MAIN VIEW --- */
        .main-content { flex: 1; padding: 40px; width: 100%; max-width: 1400px; margin: 0 auto; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px; }

        /* --- CARDS --- */
        .card { background: #fff; border-radius: 24px; border: 1px solid #f1f5f9; overflow: hidden; transition: 0.3s; position: relative; }
        .card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.06); }
        .img-box { height: 240px; position: relative; }
        .img-box img { width: 100%; height: 100%; object-fit: cover; }
        
        .price-tag { position: absolute; bottom: 16px; left: 16px; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); padding: 8px 14px; border-radius: 12px; font-weight: 800; color: #111827; font-size: 1.1rem; }
        .cat-tag { position: absolute; top: 16px; right: 16px; background: #111827; color: #fff; padding: 5px 12px; border-radius: 100px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; }

        .card-info { padding: 24px; }
        .card-info h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 6px; }
        .card-loc { color: #64748b; font-size: 0.85rem; margin-bottom: 16px; display: flex; align-items: center; gap: 4px; }
        
        .view-btn { width: 100%; padding: 14px; background: #111827; color: #fff; border-radius: 14px; text-decoration: none; display: block; text-align: center; font-weight: 700; font-size: 0.9rem; transition: 0.2s; }
        .view-btn:hover { background: #374151; }

        /* --- MOBILE ELEMENTS --- */
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.2); backdrop-filter: blur(4px); z-index: 900; opacity: 0; visibility: hidden; transition: 0.3s; }
        .overlay.active { opacity: 1; visibility: visible; }

        .mobile-trigger { 
            display: none; position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); 
            background: #111827; color: #fff; padding: 14px 28px; border-radius: 100px; 
            font-weight: 700; z-index: 800; border: none; align-items: center; gap: 8px; box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        @media (max-width: 900px) {
            .main-content { padding: 24px; }
            .mobile-trigger { display: flex; }
        }
      `}</style>

      {/* Overlay */}
      <div className={`overlay ${showMobileFilters ? 'active' : ''}`} onClick={() => setShowMobileFilters(false)} />

      {/* Sideways Sidebar */}
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
                <span className="f-label">Room Essentials</span>
                <div className="pill-grid">
                    {furnishingOptions.map(opt => (
                        <div key={opt} className={`pill ${filters.furnishingItems.includes(opt) ? 'active' : ''}`} 
                             onClick={() => toggleFilterArray('furnishingItems', opt)}>{opt}</div>
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
            
            {/* Mobile-only close button in sidebar footer */}
            <div style={{marginTop:'20px'}} className="mobile-only">
                <button onClick={() => setShowMobileFilters(false)} className="view-btn">Apply Filters</button>
            </div>
        </div>
      </aside>

      {/* Main Content */}
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
                            <img src={getOptimizedUrl(p.mainImage)} alt={p.title} />
                            <div className="price-tag">₹{p.price?.toLocaleString()}</div>
                            <div className="cat-tag">{p.category}</div>
                        </div>
                        <div className="card-info">
                            <h3>{p.title}</h3>
                            <p className="card-loc">📍 {p.location}</p>
                            <div style={{display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap'}}>
                                <span style={{fontSize:'0.7rem', fontWeight:700, background:'#f1f5f9', padding:'4px 10px', borderRadius:'6px'}}>{p.tenantPreference}</span>
                                {p.parking !== 'None' && <span style={{fontSize:'0.7rem', fontWeight:700, background:'#f1f5f9', padding:'4px 10px', borderRadius:'6px'}}>Parking</span>}
                            </div>
                            <Link to={`/property/${p._id}`} className="view-btn">See Details</Link>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </main>

      <button className="mobile-trigger" onClick={() => setShowMobileFilters(true)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
        Filter Results
      </button>
    </div>
  );
};

export default AllProperties;