import { useState, useEffect } from 'react';
import API from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

const Home = () => {
    const navigate = useNavigate();
    const [allLocations, setAllLocations] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await API.get('/property');
                const locations = res.data.map(p => p.location);
                const tags = res.data.flatMap(p => p.tags || []);
                setAllLocations([...new Set([...locations, ...tags])]);
            } catch (err) {
                console.error(err);
            }
        };
        fetchLocations();
    }, []);

    const handleSearch = (filters) => {
        const params = new URLSearchParams(filters).toString();
        navigate(`/properties?${params}`);
    };

    // --- REUSABLE STYLES ---
    const sectionStyle = {
        padding: '100px 20px', // Consistent vertical spacing
        maxWidth: '1200px',    // Prevents stretching on big screens
        margin: '0 auto'       // Centers the content
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
                
                body { margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; background: #0f172a; }
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: #0f172a; }
                ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
                
                .hover-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
                .hover-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px -5px rgba(56, 189, 248, 0.3); }
                
                /* Gradient Text for Headings */
                .gradient-text {
                    background: linear-gradient(to right, #fff, #94a3b8);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>

            <div style={{ width: '100%', minHeight: '100vh', color: '#fff', position: 'relative', overflowX: 'hidden' }}>
                
                {/* ================= FIXED BACKGROUND (Parallax Effect) ================= */}
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: 'linear-gradient(to bottom, rgba(15,23,42,0.8), rgba(15,23,42,1)), url(https://images.unsplash.com/photo-1493809842364-78817add7ffb)',
                    backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -1
                }} />

                {/* ================= HERO SECTION ================= */}
                <section style={{ 
                    minHeight: '100vh', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    textAlign: 'center',
                    padding: '0 20px'
                }}>
                    <div style={{ maxWidth: '900px', width: '100%' }}>
                        <span style={{ color: '#38bdf8', fontWeight: 700, letterSpacing: '3px', fontSize: '0.8rem', textTransform: 'uppercase', display: 'block', marginBottom: '20px' }}>
                            Verified · Broker-Free · Simple
                        </span>

                        <h1 className="gradient-text" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px' }}>
                            Find a Home That <br /> Fits Your Life
                        </h1>

                        <p style={{ fontSize: '1.25rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto 48px', lineHeight: 1.6 }}>
                            Skip the brokerage. Connect directly with owners. Renting made as simple as ordering food.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <SearchBar onSearch={handleSearch} availableLocations={allLocations} />
                        </div>
                    </div>
                </section>

                {/* ================= TRUST STRIP ================= */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.5)' }}>
                    <div style={{ ...sectionStyle, padding: '30px 20px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '30px' }}>
                        {['100% No Brokerage', 'Verified Listings', 'Direct Owner Contact', 'Instant Move-in'].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1', fontWeight: 600 }}>
                                <span style={{ color: '#38bdf8' }}>✓</span> {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ================= WHY CHOOSE US ================= */}
                <section style={sectionStyle}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '80px', alignItems: 'center' }}>
                        {/* Text Side */}
                        <div>
                            <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px', lineHeight: 1.2 }}>
                                Renting, finally <br /> made <span style={{ color: '#38bdf8' }}>simple.</span>
                            </h2>
                            <p style={{ fontSize: '1.15rem', color: '#94a3b8', marginBottom: '40px', lineHeight: 1.6 }}>
                                We stripped away the complexity of traditional renting. No middlemen, no hidden fees, just verified homes and direct connections.
                            </p>
                            
                            <div style={{ display: 'grid', gap: '20px' }}>
                                {[
                                    { title: 'Search', desc: 'Verified homes city-wide' },
                                    { title: 'Connect', desc: 'Chat directly with owners' },
                                    { title: 'Move', desc: 'Paperwork done digitally' }
                                ].map((step, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '20px' }}>
                                        <div style={{ width: '50px', height: '50px', background: 'rgba(56,189,248,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', fontWeight: 'bold', fontSize: '1.2rem' }}>{i + 1}</div>
                                        <div>
                                            <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{step.title}</h4>
                                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Card Side */}
                        <div className="hover-card" style={{ background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(20px)', padding: '50px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h3 style={{ fontSize: '2rem', marginBottom: '30px' }}>Why ArivoHomes?</h3>
                            {[
                                ['100% No Brokerage', 'Pay exactly what you see'],
                                ['Verified Homes', 'Quality-checked listings'],
                                ['All Property Types', 'PGs to villas & offices'],
                            ].map(([title, desc], i) => (
                                <div key={i} style={{ marginBottom: '25px', paddingBottom: '25px', borderBottom: i !== 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                                    <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '5px' }}>{title}</strong>
                                    <span style={{ color: '#94a3b8' }}>{desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ================= CATEGORIES ================= */}
                <section style={{ ...sectionStyle, background: 'rgba(15,23,42,0.3)', borderRadius: '40px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '16px' }}>Browse by Category</h2>
                        <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Every type of space, for every stage of life.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                        {[
                            ['Apartment', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'],
                            ['PG', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'],
                            ['Villa', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'],
                            ['Studio', 'https://images.unsplash.com/photo-1502673530728-f79b4cab31b1'],
                            ['Office', 'https://images.unsplash.com/photo-1497366216548-37526070297c'],
                            ['Penthouse', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'],
                        ].map(([title, img]) => (
                            <div 
                                key={title} 
                                className="hover-card"
                                onClick={() => navigate(`/properties?category=${title}`)}
                                style={{
                                    height: '300px', borderRadius: '24px', overflow: 'hidden', cursor: 'pointer', position: 'relative',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                <img src={`${img}?auto=format&fit=crop&w=600&q=80`} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, width: '100%',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', padding: '30px 20px 20px'
                                }}>
                                    <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ================= FINAL CTA ================= */}
                <section style={{ padding: '150px 20px', textAlign: 'center' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(56, 189, 248, 0.02))', padding: '60px 40px', borderRadius: '40px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px' }}>Ready to move in?</h2>
                        <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '40px' }}>Your dream home is just a click away.</p>
                        <button 
                            onClick={() => navigate('/properties')}
                            style={{
                                padding: '18px 50px', fontSize: '1.1rem', fontWeight: 700, borderRadius: '100px',
                                background: '#38bdf8', color: '#0f172a', border: 'none', cursor: 'pointer',
                                boxShadow: '0 10px 25px -5px rgba(56, 189, 248, 0.5)'
                            }}
                        >
                            Browse All Properties
                        </button>
                    </div>
                </section>

            </div>
        </>
    );
};

export default Home;