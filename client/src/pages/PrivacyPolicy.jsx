import { useEffect } from 'react';

const PrivacyPolicy = () => {
  
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
          top: 100px;
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
          scroll-margin-top: 120px;
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
          .legal-sidebar { display: none; }
          .legal-content { padding: 30px; }
        }
      `}</style>

      <div className="legal-page">
        {/* HERO */}
        <div className="legal-header">
          <h1 className="legal-title">Privacy Policy</h1>
          <div className="last-updated">Last Updated: 1 January 2026</div>
        </div>

        <div className="legal-container">
          
          {/* SIDEBAR */}
          <aside className="legal-sidebar">
            <div className="toc-title">On this page</div>
            <ul className="toc-list">
              <li className="toc-item" onClick={() => scrollToSection('collection')}>1. Information We Collect</li>
              <li className="toc-item" onClick={() => scrollToSection('usage')}>2. How We Use Data</li>
              <li className="toc-item" onClick={() => scrollToSection('sharing')}>3. Data Sharing</li>
              <li className="toc-item" onClick={() => scrollToSection('security')}>4. Data Security</li>
              <li className="toc-item" onClick={() => scrollToSection('rights')}>5. Your Rights</li>
              <li className="toc-item" onClick={() => scrollToSection('changes')}>6. Changes to Policy</li>
            </ul>
          </aside>

          {/* MAIN DOCUMENT */}
          <div className="legal-content">
            
            <p className="legal-text" style={{ fontSize: '1.2rem', marginBottom: '40px' }}>
              ArivoHomes ("we", "our", "us") respects your privacy and is committed to protecting the 
              personal information of our users. This Privacy Policy explains how we collect, use, store, 
              and protect your data when you use our website, mobile application, and related services.
            </p>

            <div id="collection" className="section-block">
              <h2 className="section-title">1. Information We Collect</h2>
              <p className="legal-text">
                To provide you with a seamless rental experience, we collect specific types of information 
                when you interact with our platform:
              </p>
              <ul className="legal-list">
                <li><strong>Identity Data:</strong> Personal details such as your full name, email address, and phone number when you register.</li>
                <li><strong>Profile Data:</strong> Your account login information, saved property preferences, and listing history.</li>
                <li><strong>Content Data:</strong> Details related to properties you list, including photos, descriptions, and amenities.</li>
                <li><strong>Technical Data:</strong> Device information including IP address, browser type, and usage patterns to optimize performance.</li>
              </ul>
            </div>

            <div id="usage" className="section-block">
              <h2 className="section-title">2. How We Use Your Information</h2>
              <p className="legal-text">
                We use the data we collect for specific, defined purposes:
              </p>
              <ul className="legal-list">
                <li>To provide, operate, and maintain our rental services.</li>
                <li>To verify user identities and maintain a safe, fraud-free environment.</li>
                <li>To communicate important updates, security alerts, and administrative messages.</li>
                <li>To improve our platform through analytics and user feedback.</li>
                <li>To comply with applicable legal obligations and regulatory requirements.</li>
              </ul>
            </div>

            <div id="sharing" className="section-block">
              <h2 className="section-title">3. Data Sharing</h2>
              <p className="legal-text">
                Your privacy is paramount. <strong>We do not sell or rent your personal data to third parties.</strong>
              </p>
              <p className="legal-text">
                Information may be shared only in the following limited circumstances:
              </p>
              <ul className="legal-list">
                <li>With trusted service providers (e.g., cloud hosting, OTP verification services) strictly for operational needs.</li>
                <li>When required by law enforcement or legal processes to protect the safety of our users.</li>
              </ul>
            </div>

            <div id="security" className="section-block">
              <h2 className="section-title">4. Data Security</h2>
              <p className="legal-text">
                We implement industry-standard security measures, including encryption and secure server protocols, 
                to protect your personal data from unauthorized access, alteration, disclosure, or destruction.
              </p>
              <p className="legal-text">
                However, please note that no method of transmission over the Internet is 100% secure. 
                While we strive to use commercially acceptable means to protect your personal data, we cannot 
                guarantee its absolute security.
              </p>
            </div>

            <div id="rights" className="section-block">
              <h2 className="section-title">5. Your Rights</h2>
              <p className="legal-text">
                You retain full control over your personal information. You have the right to:
              </p>
              <ul className="legal-list">
                <li>Request access to the personal data we hold about you.</li>
                <li>Request corrections to any inaccurate or incomplete data.</li>
                <li>Request the deletion of your account and associated data.</li>
              </ul>
              <p className="legal-text">
                To exercise any of these rights, please contact our Data Protection Officer at <b>support@arivohomes.com</b>.
              </p>
            </div>

            <div id="changes" className="section-block">
              <h2 className="section-title">6. Changes to This Policy</h2>
              <p className="legal-text">
                We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. 
                We will notify you of any material changes by posting the new policy on this page and updating 
                the "Last Updated" date. Continued use of our services implies acceptance of the updated policy.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;