import { useState } from 'react';

const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Message sent! We'll get back to you shortly.");
    };

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
            <h1 style={{ fontSize: '2.5rem', color: '#1e293b', textAlign: 'center', marginBottom: '10px' }}>Contact Us</h1>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '40px' }}>Have questions? We'd love to hear from you.</p>

            <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Name</label>
                        <input type="text" placeholder="Your Name" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Email</label>
                        <input type="email" placeholder="you@example.com" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Message</label>
                        <textarea rows="5" placeholder="How can we help?" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}></textarea>
                    </div>
                    <button type="submit" className="btn" style={{ width: '100%' }}>Send Message</button>
                </form>
            </div>
        </div>
    );
};

export default Contact;