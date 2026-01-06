import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <>
      {/* GLOBAL STYLES FOR THIS PAGE */}
      <style>{`
        .about-page {
          font-family: 'Inter', system-ui, sans-serif;
          color: #1e293b;
          overflow-x: hidden;
        }

        /* HERO SECTION */
        .hero-section {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          padding: 100px 20px 140px; /* Added extra bottom padding for overlap */
          text-align: center;
          position: relative;
        }
        
        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 24px;
          line-height: 1.1;
          background: linear-gradient(to right, #fff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #cbd5e1;
          max-width: 600px;
          margin: 0 auto 40px;
          line-height: 1.6;
        }

        /* FEATURES BAR (Replaces Stats) */
        .features-bar {
          background: white;
          max-width: 1000px;
          margin: -70px auto 0; /* Overlap hero */
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          text-align: center;
          position: relative;
          z-index: 10;
        }

        .feature-big-text {
          font-size: 2.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }
        .feature-label {
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.85rem;
        }

        /* MISSION SECTION */
        .mission-section {
          padding: 100px 20px;
          background: #f8fafc;
        }
        
        .mission-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .mission-image {
          width: 100%;
          height: 500px;
          object-fit: cover;
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .section-tag {
          color: #3b82f6;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 16px;
          display: block;
          font-size: 0.9rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 24px;
          line-height: 1.2;
        }

        .section-text {
          font-size: 1.1rem;
          color: #475569;
          line-height: 1.7;
          margin-bottom: 24px;
        }

        /* VALUES GRID */
        .values-section {
          padding: 100px 20px;
          background: white;
        }
        
        .values-grid {
          max-width: 1200px;
          margin: 60px auto 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
        }

        .value-card {
          padding: 32px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .value-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          border-color: #3b82f6;
        }

        .icon-box {
          width: 50px;
          height: 50px;
          background: #eff6ff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563eb;
          margin-bottom: 24px;
        }

        .value-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 12px;
        }

        /* CTA SECTION */
        .cta-section {
          background: #0f172a;
          padding: 80px 20px;
          text-align: center;
          color: white;
        }

        .btn-primary {
          display: inline-block;
          background: #3b82f6;
          color: white;
          padding: 16px 32px;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          margin-top: 32px;
          transition: background 0.2s;
        }
        .btn-primary:hover { background: #2563eb; }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; }
          .mission-container { grid-template-columns: 1fr; }
          .features-bar { grid-template-columns: 1fr; margin-top: 20px; box-shadow: none; border: 1px solid #e2e8f0; }
          .mission-image { height: 300px; }
        }
      `}</style>

      <div className="about-page">
        {/* HERO */}
        <div className="hero-section">
          <h1 className="hero-title">The Future of Renting is Here</h1>
          <p className="hero-subtitle">
            ArivoHomes is building a broker-free ecosystem where trust meets technology. 
            We are redefining how India rents, one home at a time.
          </p>
        </div>

        {/* PROMISE BAR (Replaced Fake Stats with Real Values) */}
        <div className="features-bar">
          <div>
            <div className="feature-big-text">0%</div>
            <div className="feature-label">Brokerage Fee</div>
          </div>
          <div>
            <div className="feature-big-text">100%</div>
            <div className="feature-label">Transparency</div>
          </div>
          <div>
            <div className="feature-big-text">Direct</div>
            <div className="feature-label">Owner Connect</div>
          </div>
        </div>

        {/* MISSION / STORY */}
        <section className="mission-section">
          <div className="mission-container">
            <div>
              <span className="section-tag">Our Vision</span>
              <h2 className="section-title">Why We Are Starting This Journey</h2>
              <p className="section-text">
                For too long, finding a home has been complicated by hidden fees, 
                unreliable middlemen, and a lack of trust. We realized that the rental 
                market doesn't just need a website—it needs a revolution.
              </p>
              <p className="section-text">
                ArivoHomes is a technology-driven platform built on a simple premise: 
                <strong> Tenants and owners deserve to connect directly.</strong> 
                Our mission is to remove the friction, eliminate the bias, and make renting 
                as simple as ordering food.
              </p>
              <p className="section-text">
                We are just getting started, but our vision is clear: To build India's most 
                trusted rental ecosystem.
              </p>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80" 
              alt="Modern Office Vision" 
              className="mission-image" 
            />
          </div>
        </section>

        {/* VALUES */}
        <section className="values-section">
          <div style={{textAlign: 'center', maxWidth: '800px', margin: '0 auto'}}>
            <span className="section-tag">Core Values</span>
            <h2 className="section-title">Built on Trust, Not Fees</h2>
            <p className="section-text">We aren't just another listing site. We are a team dedicated to solving the housing problem from the ground up.</p>
          </div>

          <div className="values-grid">
            {/* Value 1 */}
            <div className="value-card">
              <div className="icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h3 className="value-title">Verified Listings</h3>
              <p style={{color: '#64748b'}}>We prioritize quality over quantity. Every home listed on our platform is vetted to ensure safety and accuracy.</p>
            </div>

            {/* Value 2 */}
            <div className="value-card">
              <div className="icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect></svg>
              </div>
              <h3 className="value-title">Zero Brokerage</h3>
              <p style={{color: '#64748b'}}>We are committed to a brokerage-free future. Keep your money for your deposit, not for middlemen.</p>
            </div>

            {/* Value 3 */}
            <div className="value-card">
              <div className="icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <h3 className="value-title">Privacy First</h3>
              <p style={{color: '#64748b'}}>Your contact details are yours. We ensure you only connect with genuine parties when you are ready.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="cta-section">
          <h2 style={{fontSize: '2.5rem', marginBottom: '20px'}}>Be Part of the Change</h2>
          <p style={{color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto'}}>
            We are building something big. Experience the new standard in rental living.
          </p>
          <Link to="/properties" className="btn-primary">Explore ArivoHomes</Link>
        </div>
      </div>
    </>
  );
};

export default AboutUs;