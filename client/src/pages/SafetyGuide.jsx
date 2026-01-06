import { Link } from 'react-router-dom';

const SafetyGuide = () => {
  return (
    <>
      <style>{`
        .safety-page {
          font-family: 'Inter', system-ui, sans-serif;
          background: #f8fafc;
          min-height: 100vh;
          padding-bottom: 80px;
        }

        /* HERO SECTION */
        .safety-hero {
          background: #0f172a;
          color: white;
          padding: 80px 20px 120px;
          text-align: center;
          position: relative;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 20px;
          background: linear-gradient(to right, #fff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          color: #cbd5e1;
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* GOLDEN RULE BANNER */
        .alert-banner {
          background: #fff;
          max-width: 900px;
          margin: -60px auto 40px;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          border-left: 6px solid #ef4444; /* Red warning line */
          display: flex;
          align-items: flex-start;
          gap: 20px;
          position: relative;
          z-index: 10;
        }

        .alert-icon {
          background: #fef2f2;
          color: #ef4444;
          min-width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        /* GRID LAYOUT */
        .guidelines-grid {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .guide-card {
          background: white;
          padding: 32px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .guide-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
          border-color: #3b82f6;
        }

        .card-icon {
          width: 48px;
          height: 48px;
          background: #eff6ff;
          color: #3b82f6;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .card-text {
          color: #64748b;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        /* REPORT SECTION */
        .report-section {
          max-width: 800px;
          margin: 80px auto 0;
          text-align: center;
          padding: 0 20px;
        }

        .report-btn {
          display: inline-block;
          background: #0f172a;
          color: white;
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          margin-top: 24px;
          transition: background 0.2s;
        }
        .report-btn:hover { background: #334155; }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; }
          .alert-banner { flex-direction: column; text-align: left; }
        }
      `}</style>

      <div className="safety-page">
        {/* HERO */}
        <div className="safety-hero">
          <h1 className="hero-title">Your Safety Matters</h1>
          <p className="hero-subtitle">
            We are committed to creating a secure environment for finding your next home. 
            Please review our guidelines to stay safe.
          </p>
        </div>

        {/* GOLDEN RULE ALERT */}
        <div className="alert-banner">
          <div className="alert-icon">⚠️</div>
          <div>
            <h3 style={{fontSize: '1.2rem', fontWeight: '700', color: '#7f1d1d', marginBottom: '8px'}}>
              The Golden Rule of Renting
            </h3>
            <p style={{color: '#450a0a', lineHeight: '1.5'}}>
              <strong>Never transfer money</strong> without physically visiting the property and meeting the owner. 
              ArivoHomes does not handle rental deposits or monthly payments. If someone asks you to pay via a generic link before a visit, it is likely a scam.
            </p>
          </div>
        </div>

        {/* SAFETY CARDS GRID */}
        <div className="guidelines-grid">
          
          {/* Card 1 */}
          <div className="guide-card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </div>
            <h3 className="card-title">Visit First, Pay Later</h3>
            <p className="card-text">
              Photos can be misleading. Always schedule a visit to inspect the property condition, water supply, and neighborhood before making any financial commitment.
            </p>
          </div>

          {/* Card 2 */}
          <div className="guide-card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h3 className="card-title">Protect Your Data</h3>
            <p className="card-text">
              Never share your OTPs, banking passwords, or UPI PINs with anyone claiming to be from ArivoHomes. We will never ask for your private banking details.
            </p>
          </div>

          {/* Card 3 */}
          <div className="guide-card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <h3 className="card-title">Meet in Public</h3>
            <p className="card-text">
              When meeting an owner or tenant for the first time, try to bring a friend or family member along. Ensure your phone is charged and share your live location with someone you trust.
            </p>
          </div>

          {/* Card 4 */}
          <div className="guide-card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <h3 className="card-title">Trust Your Instincts</h3>
            <p className="card-text">
              If a deal looks too good to be true (e.g., extremely low rent for a luxury apartment), it probably is. Be cautious of owners pushing for immediate urgency.
            </p>
          </div>

        </div>

        {/* REPORT SECTION */}
        <div className="report-section">
          <h2 style={{fontSize: '2rem', fontWeight: '700', marginBottom: '16px', color: '#0f172a'}}>
            Notice something suspicious?
          </h2>
          <p style={{color: '#64748b', maxWidth: '600px', margin: '0 auto'}}>
            Our community relies on trust. If you encounter a fake listing, harassment, or suspicious payment requests, please report it immediately.
          </p>
          <a href="mailto:safety@arivohomes.com" className="report-btn">
            Report an Issue
          </a>
        </div>
      </div>
    </>
  );
};

export default SafetyGuide;