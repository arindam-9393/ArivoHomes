import { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out. We will get back to you shortly.");
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <style>{`
        .contact-page {
          font-family: 'Inter', system-ui, sans-serif;
          background: #f8fafc;
          min-height: 100vh;
          color: #334155;
          padding-bottom: 80px;
        }

        /* HERO HEADER */
        .contact-hero {
          background: #0f172a;
          color: white;
          padding: 80px 20px 140px; /* Extra padding for overlap */
          text-align: center;
        }

        .contact-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 16px;
          background: linear-gradient(to right, #fff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .contact-subtitle {
          color: #cbd5e1;
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        /* MAIN CONTAINER */
        .contact-container {
          max-width: 1100px;
          margin: -80px auto 0;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 40px;
        }

        /* INFO CARDS (Left Side) */
        .info-stack {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-card {
          background: white;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          transition: transform 0.2s;
        }

        .info-card:hover {
          transform: translateY(-2px);
          border-color: #3b82f6;
        }

        .icon-box {
          width: 40px;
          height: 40px;
          background: #eff6ff;
          color: #3b82f6;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .card-label {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748b;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .card-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: #0f172a;
          line-height: 1.5;
        }

        .map-btn {
          display: inline-block;
          margin-top: 12px;
          color: #3b82f6;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
        }

        /* CONTACT FORM (Right Side) */
        .form-card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 8px;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
          background: #f8fafc;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: #0f172a;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-btn:hover {
          background: #334155;
        }

        @media (max-width: 900px) {
          .contact-container { grid-template-columns: 1fr; margin-top: -40px; }
          .contact-title { font-size: 2.5rem; }
        }
      `}</style>

      <div className="contact-page">
        {/* HERO */}
        <div className="contact-hero">
          <h1 className="contact-title">Get in touch</h1>
          <p className="contact-subtitle">
            Have questions about a property or need support? We're here to help.
          </p>
        </div>

        <div className="contact-container">
          
          {/* LEFT COLUMN: INFO CARDS */}
          <div className="info-stack">
            
            {/* Address Card */}
            <div className="info-card">
              <div className="icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div className="card-label">Headquarters</div>
              <div className="card-value">
                No. 94, Ramai Nagar,<br />
                Nari Road, Nagpur,<br />
                Maharashtra, India – 440026
              </div>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Ramai+Nagar+Nari+Road+Nagpur" 
                target="_blank" 
                rel="noreferrer"
                className="map-btn"
              >
                View on Google Maps →
              </a>
            </div>

            {/* Email Card */}
            <div className="info-card">
              <div className="icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div className="card-label">Email Support</div>
              <div className="card-value">support@arivohomes.com</div>
              <div style={{fontSize: '0.9rem', color: '#64748b', marginTop: '4px'}}>
                We usually reply within 24 hours.
              </div>
            </div>

            {/* Phone Card */}
            <div className="info-card">
              <div className="icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.12 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div className="card-label">Phone</div>
              <div className="card-value">+91 8208957682</div>
              <div style={{fontSize: '0.9rem', color: '#64748b', marginTop: '4px'}}>
                Mon-Fri, 9:00 AM - 6:00 PM IST
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: FORM */}
          <div className="form-card">
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px', color: '#0f172a' }}>
              Send us a message
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input 
                  type="text" 
                  name="name"
                  className="form-input" 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  className="form-input" 
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">How can we help?</label>
                <textarea 
                  name="message"
                  className="form-textarea" 
                  placeholder="Tell us about your inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>

        </div>
      </div>
    </>
  );
};

export default ContactUs;