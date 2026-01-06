import { useState } from 'react';

const FAQs = () => {
  // State to track which question is currently open
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Expanded Data: More questions to look professional
  const faqData = [
    {
      category: "General",
      questions: [
        {
          q: "What makes ArivoHomes different from other portals?",
          a: "ArivoHomes is built on a strictly 'No Brokerage' policy. Unlike other platforms that mix agent listings with owner listings, we prioritize direct connections between verified owners and tenants, ensuring a seamless and cost-effective experience."
        },
        {
          q: "Is ArivoHomes really free to use?",
          a: "Yes. Browsing properties, contacting owners, and listing your property is currently completely free. We believe in transparency and do not charge hidden fees for basic connections."
        },
      ]
    },
    {
      category: "For Tenants",
      questions: [
        {
          q: "Are the property listings verified?",
          a: "We employ a rigorous verification process using AI and manual checks to ensure listings are genuine. However, we always recommend that you physically visit the property and meet the owner before making any financial transfers."
        },
        {
          q: "How do I schedule a visit?",
          a: "Once you find a property you like, you can chat directly with the owner through our secure messaging platform to arrange a convenient time for a visit."
        }
      ]
    },
    {
      category: "For Property Owners",
      questions: [
        {
          q: "What details do I need to list my property?",
          a: "To ensure quality, we require clear photos, accurate location details, and rent expectations. You may also be asked to verify your identity to earn a 'Verified Owner' badge, which increases trust with tenants."
        },
        {
          q: "Can I remove my listing once it's rented?",
          a: "Absolutely. You have full control over your dashboard. You can mark a property as 'Rented' or deactivate the listing instantly to stop receiving inquiries."
        }
      ]
    }
  ];

  return (
    <>
      <style>{`
        .faq-page {
          font-family: 'Inter', system-ui, sans-serif;
          background: #f8fafc;
          min-height: 100vh;
          padding-bottom: 80px;
        }

        /* HEADER SECTION */
        .faq-header {
          background: #0f172a;
          color: white;
          padding: 80px 20px 100px;
          text-align: center;
        }

        .faq-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 16px;
          background: linear-gradient(to right, #fff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .faq-subtitle {
          color: #cbd5e1;
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        /* CONTENT CONTAINER */
        .faq-container {
          max-width: 900px;
          margin: -60px auto 0;
          padding: 0 20px;
          position: relative;
          z-index: 10;
        }

        /* CATEGORY SECTIONS */
        .faq-category {
          margin-bottom: 40px;
        }

        .category-title {
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #64748b;
          margin-bottom: 16px;
          padding-left: 8px;
        }

        /* ACCORDION ITEM */
        .faq-item {
          background: white;
          border-radius: 12px;
          margin-bottom: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .faq-item:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
          border-color: #cbd5e1;
        }

        .faq-question {
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-weight: 600;
          font-size: 1.1rem;
          color: #0f172a;
        }

        .faq-icon {
          font-size: 1.5rem;
          color: #3b82f6;
          transition: transform 0.3s ease;
          line-height: 0;
        }
        
        .faq-icon.open {
          transform: rotate(45deg);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: #f8fafc;
        }

        .faq-answer.open {
          max-height: 200px; /* Approximate height for animation */
          border-top: 1px solid #e2e8f0;
        }

        .answer-content {
          padding: 24px;
          color: #475569;
          line-height: 1.6;
        }

        /* CONTACT CARD */
        .contact-card {
          background: #3b82f6;
          color: white;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          margin-top: 60px;
          box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.3);
        }

        .contact-btn {
          display: inline-block;
          background: white;
          color: #2563eb;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          margin-top: 20px;
          text-decoration: none;
          transition: transform 0.2s;
        }
        
        .contact-btn:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 600px) {
          .faq-title { font-size: 2rem; }
          .faq-question { font-size: 1rem; padding: 20px; }
        }
      `}</style>

      <div className="faq-page">
        {/* HERO HEADER */}
        <div className="faq-header">
          <h1 className="faq-title">How can we help?</h1>
          <p className="faq-subtitle">
            Everything you need to know about renting, listing, and living with ArivoHomes.
          </p>
        </div>

        <div className="faq-container">
          
          {/* MAPPING THROUGH DATA */}
          {faqData.map((section, catIndex) => (
            <div key={catIndex} className="faq-category">
              <h3 className="category-title">{section.category}</h3>
              
              {section.questions.map((faq, qIndex) => {
                // Create unique ID for state: "categoryIndex-questionIndex"
                const uniqueId = `${catIndex}-${qIndex}`;
                const isOpen = openIndex === uniqueId;

                return (
                  <div key={uniqueId} className="faq-item">
                    <div 
                      className="faq-question" 
                      onClick={() => toggleFAQ(uniqueId)}
                    >
                      {faq.q}
                      <span className={`faq-icon ${isOpen ? 'open' : ''}`}>+</span>
                    </div>
                    <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
                      <div className="answer-content">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* SUPPORT CARD */}
          <div className="contact-card">
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '10px' }}>
              Still have questions?
            </h2>
            <p style={{ opacity: 0.9 }}>
              Can't find the answer you're looking for? Our team is here to help.
            </p>
            <a href="mailto:support@arivohomes.com" className="contact-btn">
              Contact Support
            </a>
          </div>

        </div>
      </div>
    </>
  );
};

export default FAQs;