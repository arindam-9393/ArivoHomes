const Privacy = () => {
    return (
        <div className="container" style={{ maxWidth: '800px', padding: '60px 20px' }}>
            <h1 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '40px', color: '#1e293b' }}>
                Privacy Policy & Terms
            </h1>
            
            <div style={{ lineHeight: '1.8', color: '#334155' }}>
                <p style={{ marginBottom: '20px' }}><strong>Last Updated: October 2025</strong></p>

                <h3 style={{ marginTop: '30px', marginBottom: '10px', color: '#1e293b' }}>1. Data Collection</h3>
                <p>We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us.</p>

                <h3 style={{ marginTop: '30px', marginBottom: '10px', color: '#1e293b' }}>2. How We Use Your Data</h3>
                <p>We use the information we collect to provide, maintain, and improve our services, such as to process bookings and send receipts.</p>

                <h3 style={{ marginTop: '30px', marginBottom: '10px', color: '#1e293b' }}>3. User Responsibilities</h3>
                <p>Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account.</p>
            </div>
        </div>
    );
};

export default Privacy;