import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const AllProperties = () => {
  const location = useLocation();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FILTER STATE ---
  const [filters, setFilters] = useState({
    location: '',
    category: 'All',
    minPrice: '',
    maxPrice: '',
    tenantPreference: 'All',
    parking: 'Any',
    furnishingStatus: 'Any',
    furnishingItems: [],
    amenities: []
  });

  // --- OPTIONS LISTS ---
  const amenitiesList = ["Power Backup", "Lift", "Security", "Gym", "Swimming Pool", "Garden", "CCTV", "Club House"];
  const furnishingOptions = ["AC", "TV", "Fridge", "Washing Machine", "Wifi", "Bed", "Geyser", "Sofa"];
  
  const categories = [
    "All", "Apartment", "PG", "Studio",
    "Independent House", "Villa",
    "Office Space", "Commercial Shop"
  ];

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

        // Basic Filters
        if (filters.location) params.append('location', filters.location);
        if (filters.category !== 'All') params.append('category', filters.category);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        
        // Dropdowns
        if (filters.tenantPreference !== 'All') params.append('tenantPreference', filters.tenantPreference);
        if (filters.parking !== 'Any') params.append('parking', filters.parking);
        if (filters.furnishingStatus !== 'Any') params.append('furnishingStatus', filters.furnishingStatus);
        
        // Arrays (Checkboxes)
        if (filters.furnishingItems.length > 0) params.append('furnishingItems', filters.furnishingItems.join(','));
        if (filters.amenities.length > 0) params.append('amenities', filters.amenities.join(','));

        const res = await axios.get(`http://localhost:3000/property?${params}`);
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

  // --- HANDLERS ---
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
    <div className="layout-container">
      {/* ================= CSS STYLES ================= */}
      <style>{`
        .layout-container { display: flex; align-items: flex-start; background-color: #f3f4f6; min-height: 100vh; font-family: sans-serif; }

        /* --- SIDEBAR --- */
        .sidebar {
            width: 300px; background: #fff; border-right: 1px solid #e5e7eb; padding: 20px;
            height: calc(100vh - 60px); position: sticky; top: 0; overflow-y: auto; flex-shrink: 0;
            box-shadow: 2px 0 5px rgba(0,0,0,0.02);
        }

        .filter-section { border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px; }
        .filter-title { font-size: 0.9rem; font-weight: 700; color: #111; margin-bottom: 10px; display: block; }

        .input-text, .input-select { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 0.9rem; margin-bottom: 5px; }
        .price-row { display: flex; gap: 5px; align-items: center; }
        .price-input { width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px; }

        .radio-item {
            display: flex; align-items: center; gap: 8px; 
            margin-bottom: 6px; cursor: pointer; font-size: 0.9rem; color: #333;
        }
        .radio-item input { margin: 0; accent-color: #e47911; width: 16px; height: 16px; }

        .checkbox-grid {
            display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
        }
        .check-box-item {
            display: flex; align-items: center; gap: 8px;
            background: #fff; border: 1px solid #d5d9d9;
            padding: 8px; border-radius: 4px;
            font-size: 0.8rem; cursor: pointer; color: #333;
            transition: all 0.2s;
        }
        .check-box-item:hover { background: #f0f2f2; border-color: #e47911; }
        .check-box-item input { margin: 0; accent-color: #e47911; width: 14px; height: 14px; cursor: pointer; }
        
        .check-box-item.active { background: #fff0f0; border-color: #e47911; color: #b12704; font-weight: 600; }

        .clear-btn { background: none; border: none; color: #007185; cursor: pointer; font-size: 0.85rem; text-decoration: underline; }

        /* --- MAIN CONTENT --- */
        .main-content { flex: 1; padding: 20px; }
        .results-header { margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
        .property-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }

        /* --- CARD --- */
        .card { background: #fff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; transition: box-shadow 0.2s; position: relative; display: flex; flex-direction: column; }
        .card:hover { box-shadow: 0 5px 15px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .card-img-wrapper { height: 180px; position: relative; background: #eee; }
        .card-img { width: 100%; height: 100%; object-fit: cover; }

        .badge-status { position: absolute; top: 0; left: 0; background: #e47911; color: white; font-size: 0.75rem; font-weight: bold; padding: 4px 8px; border-bottom-right-radius: 8px; }
        .badge-category { position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.9); color: #333; font-size: 0.7rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; }

        .card-body { padding: 15px; flex: 1; display: flex; flex-direction: column; }
        .card-title { font-size: 1.1rem; font-weight: 600; color: #111; margin: 0 0 5px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .card-location { font-size: 0.85rem; color: #565959; margin-bottom: 10px; }
        .card-price { font-size: 1.3rem; font-weight: 700; color: #b12704; margin-bottom: 10px; }
        .price-symbol { font-size: 0.8rem; vertical-align: top; }

        .feature-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 15px; }
        .tag { background: #f0f2f2; color: #111; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px; border: 1px solid #d5d9d9; }

        .view-btn { margin-top: auto; background: #ffd814; border: 1px solid #fcd200; color: #111; text-align: center; padding: 8px; border-radius: 20px; text-decoration: none; font-weight: 500; box-shadow: 0 2px 5px rgba(213,217,217,0.5); }
        .view-btn:hover { background: #f7ca00; border-color: #f2c200; }

        @media (max-width: 768px) { .layout-container { flex-direction: column; } .sidebar { width: 100%; height: auto; position: static; border-right: none; border-bottom: 1px solid #ddd; } }
      `}</style>

      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{margin:0, fontSize:'1.1rem'}}>Filters</h3>
            <button className="clear-btn" onClick={clearFilters}>Clear All</button>
        </div>

        {/* 1. Location */}
        <div className="filter-section">
            <label className="filter-title">Location</label>
            <input className="input-text" name="location" value={filters.location} onChange={handleChange} placeholder="City, Area..." />
        </div>

        {/* 2. Price */}
        <div className="filter-section">
            <label className="filter-title">Price Range</label>
            <div className="price-row">
                <input type="number" className="price-input" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleChange} />
                <span>-</span>
                <input type="number" className="price-input" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleChange} />
            </div>
        </div>

        {/* 3. Category (Radio List) */}
        <div className="filter-section">
            <label className="filter-title">Category</label>
            <div style={{display:'flex', flexDirection:'column', gap:'4px'}}>
                {categories.map(c => (
                    <label key={c} className="radio-item" style={{ fontWeight: filters.category === c ? 'bold' : 'normal', color: filters.category === c ? '#e47911' : '#333' }}>
                        <input type="radio" name="category" value={c} checked={filters.category === c} onChange={handleChange} />
                        {c}
                    </label>
                ))}
            </div>
        </div>

        {/* 4. Dropdowns */}
        <div className="filter-section">
            <label className="filter-title">Tenant Preference</label>
            <select className="input-select" name="tenantPreference" value={filters.tenantPreference} onChange={handleChange}>
                <option value="All">Any</option>
                <option value="Family">Family</option>
                <option value="Bachelor">Bachelor</option>
            </select>
        </div>

        <div className="filter-section">
            <label className="filter-title">Furnishing Status</label>
            <select className="input-select" name="furnishingStatus" value={filters.furnishingStatus} onChange={handleChange}>
                <option value="Any">Any</option>
                <option value="Fully Furnished">Fully Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
            </select>
        </div>

        {/* 5. Included Items (Pill Grid) */}
        <div className="filter-section">
            <label className="filter-title">Room Essentials</label>
            <div className="checkbox-grid">
                {furnishingOptions.map(item => {
                    const isActive = filters.furnishingItems.includes(item);
                    return (
                        <label key={item} className={`check-box-item ${isActive ? 'active' : ''}`}>
                            <input 
                                type="checkbox" 
                                checked={isActive} 
                                onChange={() => toggleFilterArray('furnishingItems', item)} 
                            />
                            {item}
                        </label>
                    );
                })}
            </div>
        </div>

        {/* 6. Amenities (Pill Grid) */}
        <div className="filter-section">
            <label className="filter-title">Building Amenities</label>
            <div className="checkbox-grid">
                {amenitiesList.map(item => {
                    const isActive = filters.amenities.includes(item);
                    return (
                        <label key={item} className={`check-box-item ${isActive ? 'active' : ''}`}>
                            <input 
                                type="checkbox" 
                                checked={isActive} 
                                onChange={() => toggleFilterArray('amenities', item)} 
                            />
                            {item}
                        </label>
                    );
                })}
            </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="main-content">
        <div className="results-header">
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Results 
                <span style={{ fontSize: '1rem', color: '#565959', fontWeight: 'normal', marginLeft: '10px' }}>
                    {loading ? "Searching..." : `(${properties.length} found)`}
                </span>
            </h2>
        </div>
        
        {error && <div style={{ padding: '15px', background: '#ffebee', color: '#c62828', borderRadius: '5px' }}>{error}</div>}

        {loading ? (
             <p>Loading properties...</p>
        ) : (
            <div className="property-grid">
                {properties.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', padding: '40px', textAlign: 'center', background: '#fff', borderRadius: '8px' }}>
                        <h3>No properties found matching your criteria.</h3>
                        <p>Try clearing some filters.</p>
                    </div>
                ) : (
                    properties.map(p => (
                        <div key={p._id} className="card">
                            <div className="card-img-wrapper">
                                {/* FIX: USE mainImage INSTEAD OF IMAGES ARRAY */}
                                <img src={p.mainImage || 'https://via.placeholder.com/300x200'} alt={p.title} className="card-img" />
                                
                                {/* Status Badges */}
                                {p.furnishingStatus === 'Fully Furnished' && <span className="badge-status">Fully Furnished</span>}
                                {p.furnishingStatus === 'Semi-Furnished' && <span className="badge-status" style={{background:'#007185'}}>Semi Furnished</span>}
                                
                                <span className="badge-category">{p.category}</span>
                            </div>

                            <div className="card-body">
                                <h3 className="card-title">{p.title}</h3>
                                <p className="card-location">📍 {p.location}</p>
                                
                                <div className="card-price">
                                    <span className="price-symbol">₹</span>{p.price?.toLocaleString()}
                                </div>
                                
                                <div className="feature-tags">
                                    <span className="tag">
                                        {p.tenantPreference === 'All' ? 'Family/Bachelor' : p.tenantPreference}
                                    </span>
                                    {p.parking !== 'None' && <span className="tag">Parking</span>}
                                    { (p.furnishingItems || []).slice(0, 2).map(i => <span key={i} className="tag">{i}</span>) }
                                </div>

                                <Link to={`/property/${p._id}`} className="view-btn">
                                    See Details
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        )}
      </main>
    </div>
  );
};

export default AllProperties;