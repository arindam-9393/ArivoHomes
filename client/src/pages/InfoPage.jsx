import { useLocation } from 'react-router-dom';

const InfoPage = () => {
    const location = useLocation();
    const path = location.pathname;

    // Content Dictionary
    const contentData = {
        '/about': {
            title: "About ArivoHomes",
            body: (
                <>
                    <p>Welcome to <strong>ArivoHomes</strong>, India's fastest-growing student and family housing network.</p>
                    <p>Founded in 2024, our mission is simple: to eliminate the hassle of finding a safe, affordable, and comfortable home. We verify every listing, ensuring that what you see is what you get.</p>
                    <h3>Our Vision</h3>
                    <p>To organize the unorganized rental market in India and provide a seamless, brokerage-free experience for tenants and owners.</p>
                </>
            )
        },
        '/careers': {
            title: "Join Our Team",
            body: (
                <>
                    <p>We are building the future of real estate tech. If you are passionate about coding, design, or sales, we want you!</p>
                    <h3>Open Positions</h3>
                    <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                        <li>Frontend Developer (React.js)</li>
                        <li>Backend Developer (Node.js)</li>
                        <li>Sales Manager (Noida)</li>
                    </ul>
                    <p style={{ marginTop: '20px' }}>Send your resume to <strong>careers@arivohomes.com</strong>.</p>
                </>
            )
        },
        '/privacy': {
            title: "Privacy Policy",
            body: (
                <>
                    <p>Your privacy is important to us. This policy explains how we handle your data.</p>
                    <h3>1. Data Collection</h3>
                    <p>We collect basic details like name, email, and phone number only when you register or book a property.</p>
                    <h3>2. Data Usage</h3>
                    <p>We use your data solely to connect you with property owners. We never sell your data to third parties.</p>
                </>
            )
        },
        '/terms': {
            title: "Terms & Conditions",
            body: (
                <>
                    <p>By using ArivoHomes, you agree to the following terms.</p>
                    <h3>1. Bookings</h3>
                    <p>Bookings made on the platform are requests. The owner has the final right to accept or reject.</p>
                    <h3>2. User Conduct</h3>
                    <p>Users must provide accurate information. Fraudulent listings will be removed immediately.</p>
                </>
            )
        }
    };

    // Default content if page not found
    const pageContent = contentData[path] || {
        title: "Page Not Found",
        body: <p>The page you are looking for does not exist or is under construction.</p>
    };

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', lineHeight: '1.8', color: '#334155' }}>
            <h1 style={{ fontSize: '2.5rem', color: '#1e293b', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
                {pageContent.title}
            </h1>
            <div style={{ fontSize: '1.1rem' }}>
                {pageContent.body}
            </div>
        </div>
    );
};

export default InfoPage;