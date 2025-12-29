import { useState } from 'react';

const SearchBar = ({ onSearch, availableLocations = [] }) => {
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('All');
    const [furnishingStatus, setFurnishingStatus] = useState('Any'); // <--- NEW STATE

    const handleSearchClick = () => {
        // Pass all 3 filters to the parent component
        onSearch({ 
            location, 
            category,
            furnishingStatus: furnishingStatus === 'Any' ? '' : furnishingStatus 
        });
    };

    return (
        <div style={styles.wrapper}>
            {/* 1. LOCATION INPUT */}
            <div style={styles.inputGroup}>
                <span style={styles.icon}>📍</span>
                <input 
                    type="text" 
                    placeholder="Search Location..." 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    list="locations-list"
                    style={styles.input}
                />
                <datalist id="locations-list">
                    {availableLocations.map((loc, index) => (
                        <option key={index} value={loc} />
                    ))}
                </datalist>
            </div>

            <div style={styles.divider}></div>

            {/* 2. CATEGORY SELECT */}
            <div style={styles.inputGroup}>
                <span style={styles.icon}>🏠</span>
                <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    style={styles.select}
                >
                    <option value="All">All Categories</option>
                    <option value="Apartment">Apartment</option>
                    <option value="PG">PG / Hostel</option>
                    <option value="Studio">Studio</option>
                    <option value="Independent House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Office Space">Office</option>
                    <option value="Commercial Shop">Shop</option>
                </select>
            </div>

            <div style={styles.divider}></div>

            {/* 3. FURNISHING SELECT (NEW) */}
            <div style={styles.inputGroup}>
                <span style={styles.icon}>🛋️</span>
                <select 
                    value={furnishingStatus} 
                    onChange={(e) => setFurnishingStatus(e.target.value)} 
                    style={styles.select}
                >
                    <option value="Any">Any Furnishing</option>
                    <option value="Fully Furnished">Fully Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                </select>
            </div>

            {/* SEARCH BUTTON */}
            <button onClick={handleSearchClick} style={styles.button}>
                Search
            </button>
        </div>
    );
};

// --- STYLES ---
const styles = {
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        background: 'white',
        borderRadius: '50px',
        padding: '10px 15px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        maxWidth: '900px', // Increased width to fit 3 items
        width: '100%',
        margin: '0 auto',
        flexWrap: 'wrap', // Allow wrapping on small mobile screens
        gap: '10px'
    },
    inputGroup: {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        minWidth: '150px',
        padding: '0 10px'
    },
    icon: {
        fontSize: '1.2rem',
        marginRight: '10px'
    },
    input: {
        border: 'none',
        outline: 'none',
        width: '100%',
        fontSize: '1rem',
        color: '#333'
    },
    select: {
        border: 'none',
        outline: 'none',
        width: '100%',
        fontSize: '1rem',
        color: '#333',
        background: 'transparent',
        cursor: 'pointer'
    },
    divider: {
        width: '1px',
        height: '30px',
        background: '#e2e8f0'
    },
    button: {
        background: '#2563eb',
        color: 'white',
        border: 'none',
        padding: '12px 30px',
        borderRadius: '30px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background 0.3s'
    }
};

export default SearchBar;