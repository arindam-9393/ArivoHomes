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
//     location: '',
//     category: 'All',
//     minPrice: '',
//     maxPrice: '',
//     tenantPreference: 'All',
//     parking: 'Any',
//     furnishingStatus: 'Any',
//     furnishingItems: [],
//     amenities: []
//   });

//   const amenitiesList = ["Power Backup", "Lift", "Security", "Gym", "Swimming Pool", "Garden", "CCTV", "Club House"];
//   const furnishingOptions = ["AC", "TV", "Fridge", "Washing Machine", "Wifi", "Bed", "Geyser", "Sofa"];
  
//   const categories = [
//     "All", "Apartment", "PG", "Studio",
//     "Independent House", "Villa",
//     "Office Space", "Commercial Shop"
//   ];

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

//   // Block body scroll when mobile filter is open
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
        
//         /* --- SIDEBAR (Desktop Default) --- */
//         .sidebar {
//             width: 300px; 
//             background: #ffffff; 
//             border-right: 1px solid #e2e8f0; 
//             padding: 25px;
//             height: calc(100vh - 60px); 
//             position: sticky; 
//             top: 60px;
//             overflow-y: auto; 
//             flex-shrink: 0;
//             z-index: 50;
//         }

//         .filter-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
//         .filter-header h3 { margin: 0; font-size: 1.2rem; color: #1e293b; font-weight: 800; }
        
//         .filter-section { border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 20px; }
//         .filter-section:last-child { border-bottom: none; }
//         .filter-title { font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 12px; display: block; text-transform: uppercase; letter-spacing: 0.5px; }

//         .input-text, .input-select { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; background: #fff; color: #0f172a; }
        
//         .price-row { display: flex; gap: 10px; align-items: center; }
//         .price-input { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; }

//         .radio-item { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; cursor: pointer; font-size: 0.95rem; color: #475569; padding: 4px 0; }
//         .radio-item input { width: 18px; height: 18px; accent-color: #2563eb; }

//         .checkbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
//         .check-box-item {
//             display: flex; align-items: center; gap: 8px;
//             background: #fff; border: 1px solid #e2e8f0;
//             padding: 10px; border-radius: 8px;
//             font-size: 0.85rem; cursor: pointer; color: #475569;
//             transition: all 0.2s;
//         }
//         .check-box-item.active { background: #eff6ff; border-color: #2563eb; color: #1e40af; font-weight: 700; }
//         .check-box-item input { display: none; }

//         .clear-btn { background: none; border: none; color: #ef4444; cursor: pointer; font-size: 0.9rem; font-weight: 600; text-decoration: underline; }
//         .close-mobile-btn { display: none; background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 1.2rem; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
//         .close-mobile-btn:hover { background: #e2e8f0; color: #0f172a; }

//         /* --- MAIN CONTENT --- */
//         .main-content { flex: 1; padding: 30px; width: 100%; }
//         .results-header { margin-bottom: 25px; }
//         .property-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }

//         /* --- CARD --- */
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

//         /* --- MOBILE RESPONSIVENESS --- */
//         @media (max-width: 900px) {
//             .layout-container { flex-direction: column; }
//             .main-content { padding: 15px; padding-bottom: 100px; }
            
//             /* --- DRAWER STYLE --- */
//             .sidebar {
//                 position: fixed;
//                 top: 0; 
//                 left: 0;
//                 height: 100vh;
//                 width: 85%;
//                 max-width: 320px;
//                 background: #ffffff;
//                 transform: translateX(-100%);
//                 transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
                
//                 /* High Z-Index to stay on top */
//                 z-index: 10000; 
                
//                 /* Strong Shadow for separation instead of dark overlay */
//                 box-shadow: 10px 0 40px -10px rgba(0,0,0,0.3);
//                 border-right: 1px solid #e2e8f0;
//                 overflow-y: auto;
//             }
            
//             .sidebar.open { transform: translateX(0); }
            
//             /* HIDE CLOSE BUTTON ON DESKTOP, SHOW ON MOBILE */
//             .close-mobile-btn { display: flex; }
            
//             /* --- OVERLAY FIX IS HERE --- */
//             .mobile-overlay {
//                 display: block;
//                 position: fixed; top: 0; left: 0; width: 100%; height: 100%;
//                 background: rgba(0,0,0,0.5); /* Darker for better contrast */
//                 z-index: 9999;
                
//                 /* FIX: Use visibility to prevent text blur when closed */
//                 opacity: 0; 
//                 visibility: hidden;
//                 pointer-events: none; 
//                 transition: opacity 0.3s, visibility 0.3s;
//             }
//             .mobile-overlay.open { 
//                 opacity: 1; 
//                 visibility: visible;
//                 pointer-events: auto; 
//             }

//             /* --- FLOATING BUTTON --- */
//             .mobile-filter-trigger {
//                 display: flex;
//                 align-items: center; gap: 8px;
//                 position: fixed;
//                 bottom: 30px;
//                 left: 50%;
//                 transform: translateX(-50%);
//                 background: #0f172a;
//                 color: white;
//                 padding: 12px 28px;
//                 border-radius: 50px;
//                 font-weight: 700;
//                 box-shadow: 0 5px 20px rgba(0,0,0,0.3);
//                 z-index: 9000;
//                 border: none;
//                 cursor: pointer;
//                 font-size: 1rem;
//             }
//         }
//       `}</style>

//       {/* --- OVERLAY (Click to close) --- */}
//       <div 
//         className={`mobile-overlay ${showMobileFilters ? 'open' : ''}`} 
//         onClick={() => setShowMobileFilters(false)}
//       />

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

//         {/* 3. Category */}
//         <div className="filter-section">
//             <label className="filter-title">Property Type</label>
//             <div style={{display:'flex', flexDirection:'column', gap:'4px'}}>
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
//                             <input type="checkbox" checked={isActive} onChange={() => toggleFilterArray('furnishingItems', item)} />
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
//                             <input type="checkbox" checked={isActive} onChange={() => toggleFilterArray('amenities', item)} />
//                             {item}
//                         </label>
//                     );
//                 })}
//             </div>
//         </div>
        
//         {/* Mobile "Show Results" Button */}
//         <div style={{marginTop: '20px', display: window.innerWidth < 900 ? 'block' : 'none'}}>
//             <button 
//                 onClick={() => setShowMobileFilters(false)}
//                 style={{width: '100%', background: '#2563eb', color:'white', padding:'14px', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer', fontSize:'1rem'}}
//             >
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
//                                 <img src={p.mainImage || 'https://via.placeholder.com/300x200'} alt={p.title} className="card-img" />
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

  // --- FILTER STATE ---
  const [filters, setFilters] = useState({
    location: '', category: 'All', minPrice: '', maxPrice: '',
    tenantPreference: 'All', parking: 'Any', furnishingStatus: 'Any',
    furnishingItems: [], amenities: []
  });

  const amenitiesList = ["Power Backup", "Lift", "Security", "Gym", "Swimming Pool", "Garden", "CCTV", "Club House"];
  const furnishingOptions = ["AC", "TV", "Fridge", "Washing Machine", "Wifi", "Bed", "Geyser", "Sofa"];
  
  const categories = ["All", "Apartment", "PG", "Studio", "Independent House", "Villa", "Office Space", "Commercial Shop"];

  // --- HELPER: OPTIMIZE CLOUDINARY URL ---
  const getOptimizedUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/300x200';
    if (url.includes('cloudinary.com')) {
        return url.replace('/upload/', '/upload/w_400,f_auto,q_auto/');
    }
    return url;
  };

  /* ================== 1. LOAD URL PARAMS ================== */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters(prev => ({
      ...prev,
      location: params.get('location') || '',
      category: params.get('category') || 'All',
      furnishingStatus: params.get('furnishingStatus') || 'Any',
    }));
  }, [location.search]);

  /* ================== 2. FETCH PROPERTIES ================== */
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
        console.error(e);
        setError("Could not load properties.");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => fetchProperties(), 500);
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

  useEffect(() => {
    if (window.innerWidth < 900) {
        document.body.style.overflow = showMobileFilters ? 'hidden' : 'auto';
    }
  }, [showMobileFilters]);

  return (
    <div className="layout-container">
      <style>{`
        /* RESET & BASE */
        .layout-container { display: flex; align-items: flex-start; background-color: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; position: relative; }
        
        /* --- SIDEBAR --- */
        .sidebar { width: 300px; background: #ffffff; border-right: 1px solid #e2e8f0; padding: 25px; height: calc(100vh - 60px); position: sticky; top: 60px; overflow-y: auto; flex-shrink: 0; z-index: 50; }
        .filter-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
        .filter-section { border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 20px; }
        .filter-title { font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 12px; display: block; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .input-text, .input-select { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; background: #fff; }
        .price-row { display: flex; gap: 10px; align-items: center; }
        .price-input { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; }

        /* --- FIXED ALIGNMENT FOR RADIO BUTTONS --- */
        .radio-item { 
            display: flex; 
            align-items: center; /* Perfect vertical centering */
            gap: 12px; 
            margin-bottom: 12px; /* Spacing between items */
            cursor: pointer; 
            font-size: 0.95rem; 
            color: #475569; 
            padding: 2px 0;
            line-height: 1.2; 
        }
        
        .radio-item input { 
            width: 18px; 
            height: 18px; 
            margin: 0; 
            accent-color: #2563eb; 
            flex-shrink: 0; /* Prevents button from squishing */
            cursor: pointer;
            position: relative;
            top: -1px; /* Micro alignment fix */
        }
        
        .checkbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .check-box-item { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px; font-size: 0.85rem; cursor: pointer; color: #475569; transition: all 0.2s; }
        .check-box-item.active { background: #eff6ff; border-color: #2563eb; color: #1e40af; font-weight: 700; }
        
        .main-content { flex: 1; padding: 30px; width: 100%; }
        .property-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }
        
        .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; }
        .card:hover { box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); transform: translateY(-3px); }
        .card-img-wrapper { height: 200px; position: relative; background: #f1f5f9; }
        .card-img { width: 100%; height: 100%; object-fit: cover; }
        
        .badge-status { position: absolute; top: 12px; left: 12px; background: #0f172a; color: white; font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; }
        .badge-category { position: absolute; top: 12px; right: 12px; background: #fff; color: #0f172a; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        
        .card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
        .card-title { font-size: 1.2rem; font-weight: 700; color: #0f172a; margin: 0 0 5px 0; }
        .card-location { font-size: 0.9rem; color: #64748b; margin-bottom: 15px; }
        .card-price { font-size: 1.5rem; font-weight: 800; color: #2563eb; margin-bottom: 15px; }
        
        .feature-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px; }
        .tag { background: #f1f5f9; color: #475569; font-size: 0.75rem; padding: 4px 10px; border-radius: 4px; font-weight: 600; }
        
        .view-btn { margin-top: auto; background: #0f172a; color: #fff; text-align: center; padding: 12px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: 0.2s; }
        .view-btn:hover { background: #1e293b; }
        
        .mobile-filter-trigger { display: none; }
        .mobile-overlay { display: none; }
        .close-mobile-btn { display: none; }

        @media (max-width: 900px) {
            .layout-container { flex-direction: column; }
            .main-content { padding: 15px; padding-bottom: 100px; }
            .sidebar { position: fixed; top: 0; left: 0; height: 100vh; width: 85%; max-width: 320px; transform: translateX(-100%); transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1); z-index: 10000; box-shadow: 10px 0 40px -10px rgba(0,0,0,0.3); border-right: 1px solid #e2e8f0; }
            .sidebar.open { transform: translateX(0); }
            .close-mobile-btn { display: flex; background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; align-items: center; justify-content: center; }
            .mobile-overlay { display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; opacity: 0; visibility: hidden; transition: 0.3s; }
            .mobile-overlay.open { opacity: 1; visibility: visible; }
            .mobile-filter-trigger { display: flex; align-items: center; gap: 8px; position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: #0f172a; color: white; padding: 12px 28px; border-radius: 50px; font-weight: 700; box-shadow: 0 5px 20px rgba(0,0,0,0.3); z-index: 9000; border: none; cursor: pointer; font-size: 1rem; }
        }
      `}</style>

      {/* --- OVERLAY --- */}
      <div className={`mobile-overlay ${showMobileFilters ? 'open' : ''}`} onClick={() => setShowMobileFilters(false)} />

      {/* --- FILTER SIDEBAR --- */}
      <aside className={`sidebar ${showMobileFilters ? 'open' : ''}`}>
        <div className="filter-header">
            <h3>Filters</h3>
            <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                <button className="clear-btn" onClick={clearFilters}>Reset All</button>
                <button className="close-mobile-btn" onClick={() => setShowMobileFilters(false)}>✕</button>
            </div>
        </div>
        
        {/* 1. Location */}
        <div className="filter-section">
            <label className="filter-title">Location</label>
            <input className="input-text" name="location" value={filters.location} onChange={handleChange} placeholder="City, Area..." />
        </div>
        
        {/* 2. Price */}
        <div className="filter-section">
            <label className="filter-title">Price Range (₹)</label>
            <div className="price-row">
                <input type="number" className="price-input" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleChange} />
                <span>-</span>
                <input type="number" className="price-input" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleChange} />
            </div>
        </div>
        
        {/* 3. Category (UPDATED ALIGNMENT) */}
        <div className="filter-section">
            <label className="filter-title">Property Type</label>
            <div style={{display:'flex', flexDirection:'column'}}>
                {categories.map(c => (
                    <label key={c} className="radio-item" style={{ fontWeight: filters.category === c ? '600' : 'normal', color: filters.category === c ? '#2563eb' : '#475569' }}>
                        <input type="radio" name="category" value={c} checked={filters.category === c} onChange={handleChange} />
                        {c}
                    </label>
                ))}
            </div>
        </div>
        
        {/* 4. Dropdowns */}
        <div className="filter-section">
            <label className="filter-title">Preferences</label>
            <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                <select className="input-select" name="tenantPreference" value={filters.tenantPreference} onChange={handleChange}>
                    <option value="All">Tenant: Any</option>
                    <option value="Family">Tenant: Family Only</option>
                    <option value="Bachelor">Tenant: Bachelors Only</option>
                </select>
                <select className="input-select" name="furnishingStatus" value={filters.furnishingStatus} onChange={handleChange}>
                    <option value="Any">Furnishing: Any</option>
                    <option value="Fully Furnished">Fully Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                </select>
            </div>
        </div>
        
        {/* 5. Essentials */}
        <div className="filter-section">
            <label className="filter-title">Room Essentials</label>
            <div className="checkbox-grid">
                {furnishingOptions.map(item => {
                    const isActive = filters.furnishingItems.includes(item);
                    return (
                        <label key={item} className={`check-box-item ${isActive ? 'active' : ''}`}>
                            <input type="checkbox" style={{display:'none'}} checked={isActive} onChange={() => toggleFilterArray('furnishingItems', item)} />
                            {item}
                        </label>
                    );
                })}
            </div>
        </div>
        
        {/* 6. Amenities */}
        <div className="filter-section">
            <label className="filter-title">Building Amenities</label>
            <div className="checkbox-grid">
                {amenitiesList.map(item => {
                    const isActive = filters.amenities.includes(item);
                    return (
                        <label key={item} className={`check-box-item ${isActive ? 'active' : ''}`}>
                            <input type="checkbox" style={{display:'none'}} checked={isActive} onChange={() => toggleFilterArray('amenities', item)} />
                            {item}
                        </label>
                    );
                })}
            </div>
        </div>
        
        <div style={{marginTop: '20px', display: window.innerWidth < 900 ? 'block' : 'none'}}>
            <button onClick={() => setShowMobileFilters(false)} style={{width: '100%', background: '#2563eb', color:'white', padding:'14px', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer', fontSize:'1rem'}}>
                Show {properties.length} Results
            </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="main-content">
        <div className="results-header">
            <h2 style={{ fontSize: '1.5rem', fontWeight:'800', color:'#1e293b', margin: 0 }}>
                Explore Properties
                <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 'normal', marginLeft: '10px' }}>
                    {loading ? "Searching..." : `(${properties.length})`}
                </span>
            </h2>
        </div>
        
        {error && <div style={{ padding: '15px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom:'20px' }}>{error}</div>}

        {loading ? (
             <p style={{color:'#64748b'}}>Loading...</p>
        ) : (
            <div className="property-grid">
                {properties.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '12px', border:'1px dashed #cbd5e1' }}>
                        <div style={{fontSize:'3rem', marginBottom:'10px'}}>🔍</div>
                        <h3 style={{color:'#1e293b'}}>No properties found.</h3>
                        <p style={{color:'#64748b'}}>Try removing some filters.</p>
                        <button onClick={clearFilters} style={{marginTop:'15px', background:'none', border:'1px solid #2563eb', color:'#2563eb', padding:'8px 16px', borderRadius:'6px', cursor:'pointer', fontWeight:'600'}}>Clear All Filters</button>
                    </div>
                ) : (
                    properties.map(p => (
                        <div key={p._id} className="card">
                            <div className="card-img-wrapper">
                                <img 
                                    src={getOptimizedUrl(p.mainImage)} 
                                    alt={p.title} 
                                    className="card-img" 
                                    loading="lazy"
                                />
                                {p.furnishingStatus === 'Fully Furnished' && <span className="badge-status">Fully Furnished</span>}
                                <span className="badge-category">{p.category}</span>
                            </div>

                            <div className="card-body">
                                <h3 className="card-title">{p.title}</h3>
                                <p className="card-location">📍 {p.location}</p>
                                <div className="card-price">
                                    <span style={{fontSize:'1rem', verticalAlign:'top'}}>₹</span>{p.price?.toLocaleString()}
                                </div>
                                <div className="feature-tags">
                                    <span className="tag">
                                        {p.tenantPreference === 'All' ? 'Family/Bachelor' : p.tenantPreference}
                                    </span>
                                    {p.parking !== 'None' && <span className="tag">Parking</span>}
                                    { (p.furnishingItems || []).slice(0, 2).map(i => <span key={i} className="tag">{i}</span>) }
                                </div>
                                <Link to={`/property/${p._id}`} className="view-btn">See Details</Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        )}
      </main>

      {/* --- MOBILE FLOATING BUTTON --- */}
      <button className="mobile-filter-trigger" onClick={() => setShowMobileFilters(true)}>
         <span>⚡ Filters</span>
      </button>

    </div>
  );
};

export default AllProperties;