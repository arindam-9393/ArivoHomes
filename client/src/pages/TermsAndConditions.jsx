import { useEffect } from 'react';

const TermsAndConditions = () => {
  
  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <style>{`
        .legal-page {
          font-family: 'Inter', system-ui, sans-serif;
          background: #f8fafc;
          min-height: 100vh;
          color: #334155;
        }

        /* HERO HEADER */
        .legal-header {
          background: #0f172a;
          color: white;
          padding: 80px 20px;
          text-align: center;
        }

        .legal-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 16px;
        }

        .last-updated {
          color: #94a3b8;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        /* MAIN LAYOUT */
        .legal-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 60px;
          padding: 60px 20px;
        }

        /* SIDEBAR NAVIGATION */
        .legal-sidebar {
          position: sticky;
          top: 100px; /* Adjust based on your navbar height */
          height: fit-content;
        }

        .toc-title {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 16px;
          letter-spacing: 1px;
        }

        .toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
          border-left: 2px solid #e2e8f0;
        }

        .toc-item {
          padding: 8px 0 8px 20px;
          cursor: pointer;
          font-size: 0.95rem;
          color: #64748b;
          transition: all 0.2s;
          position: relative;
        }

        .toc-item:hover {
          color: #3b82f6;
          border-left: 2px solid #3b82f6;
          margin-left: -2px;
        }

        /* CONTENT AREA */
        .legal-content {
          background: white;
          padding: 60px;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .section-block {
          margin-bottom: 50px;
          scroll-margin-top: 120px; /* Offset for sticky header */
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        .legal-text {
          font-size: 1.05rem;
          line-height: 1.8;
          margin-bottom: 16px;
        }

        .legal-list {
          padding-left: 24px;
          margin-bottom: 24px;
        }

        .legal-list li {
          margin-bottom: 10px;
          line-height: 1.6;
        }

        /* MOBILE RESPONSIVENESS */
        @media (max-width: 900px) {
          .legal-container { grid-template-columns: 1fr; padding: 40px 20px; }
          .legal-sidebar { display: none; } /* Hide TOC on mobile */
          .legal-content { padding: 30px; }
        }
      `}</style>

      <div className="legal-page">
        {/* HERO */}
        <div className="legal-header">
          <h1 className="legal-title">Terms & Conditions</h1>
          <div className="last-updated">Last Updated: 1 January 2026</div>
        </div>

        <div className="legal-container">
          
          {/* SIDEBAR (Table of Contents) */}
          <aside className="legal-sidebar">
            <div className="toc-title">Table of Contents</div>
            <ul className="toc-list">
              <li className="toc-item" onClick={() => scrollToSection('eligibility')}>1. Eligibility</li>
              <li className="toc-item" onClick={() => scrollToSection('responsibilities')}>2. User Responsibilities</li>
              <li className="toc-item" onClick={() => scrollToSection('listings')}>3. Property Listings</li>
              <li className="toc-item" onClick={() => scrollToSection('liability')}>4. Limitation of Liability</li>
              <li className="toc-item" onClick={() => scrollToSection('termination')}>5. Termination</li>
              <li className="toc-item" onClick={() => scrollToSection('law')}>6. Governing Law</li>
            </ul>
          </aside>

          {/* MAIN DOCUMENT */}
          <div className="legal-content">
            
            <p className="legal-text" style={{ fontSize: '1.2rem', marginBottom: '40px' }}>
              Welcome to ArivoHomes. By accessing or using our platform, website, or mobile application, 
              you agree to comply with and be bound by these Terms & Conditions. Please read them carefully.
            </p>

            <div id="eligibility" className="section-block">
              <h2 className="section-title">1. Eligibility</h2>
              <p className="legal-text">
                By using ArivoHomes, you represent and warrant that you are at least 18 years of age 
                and are fully able and competent to enter into the terms, conditions, obligations, affirmations, 
                representations, and warranties set forth in these Terms.
              </p>
              <p className="legal-text">
                If you are using the platform on behalf of an organization, you represent that you have 
                the authority to bind that organization to these terms.
              </p>
            </div>

            <div id="responsibilities" className="section-block">
              <h2 className="section-title">2. User Responsibilities</h2>
              <p className="legal-text">
                To maintain the integrity of our community, you agree to:
              </p>
              <ul className="legal-list">
                <li>Provide accurate, current, and complete information during registration and listing creation.</li>
                <li>Maintain the security of your account credentials and notify us immediately of any unauthorized use.</li>
                <li>Respect the privacy and rights of other users, including tenants and property owners.</li>
                <li>Refrain from posting misleading, discriminatory, illegal, or fraudulent content.</li>
              </ul>
            </div>

            <div id="listings" className="section-block">
              <h2 className="section-title">3. Property Listings & Content</h2>
              <p className="legal-text">
                ArivoHomes acts exclusively as a technology platform connecting users. We do not own, manage, 
                or control any of the properties listed. 
              </p>
              <p className="legal-text">
                While we strive to verify users, we do not guarantee the accuracy, completeness, or quality 
                of any specific listing. Users are solely responsible for verifying property details 
                before entering into any rental agreements.
              </p>
            </div>

            <div id="liability" className="section-block">
              <h2 className="section-title">4. Limitation of Liability</h2>
              <p className="legal-text">
                ArivoHomes is provided on an "as is" and "as available" basis. We are not a party to any 
                rental agreement between users.
              </p>
              <p className="legal-text">
                To the fullest extent permitted by law, ArivoHomes shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, or any loss of profits or revenues, 
                whether incurred directly or indirectly, appearing from your use of the platform.
              </p>
            </div>

            <div id="termination" className="section-block">
              <h2 className="section-title">5. Termination</h2>
              <p className="legal-text">
                We reserve the right to suspend or terminate your access to ArivoHomes immediately, 
                without prior notice or liability, for any reason whatsoever, including without limitation 
                if you breach the Terms.
              </p>
            </div>

            <div id="law" className="section-block">
              <h2 className="section-title">6. Governing Law</h2>
              <p className="legal-text">
                These Terms shall be governed and construed in accordance with the laws of India, 
                without regard to its conflict of law provisions. Any disputes arising from these terms 
                shall be subject to the exclusive jurisdiction of the courts located in India.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;