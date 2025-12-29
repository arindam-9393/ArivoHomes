import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  const userRaw = localStorage.getItem('user');
  const user = userRaw ? JSON.parse(userRaw) : null;

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '80vh', padding: '40px 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* ================= HEADER CARD ================= */}
        <div
          style={{
            background: 'linear-gradient(135deg, #4f46e5, #3b82f6)',
            borderRadius: '16px 16px 0 0',
            padding: '40px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            position: 'relative'
          }}
        >
          {/* EDIT ICON */}
          <button
            onClick={() => navigate('/edit-profile')}
            title="Edit Profile"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              color: 'white',
              display: 'flex',         // Added for centering icon
              alignItems: 'center',    // Added for centering icon
              justifyContent: 'center' // Added for centering icon
            }}
          >
            ✏️
          </button>

          {/* AVATAR (UPDATED) */}
          <div
            style={{
              width: '100px',
              height: '100px',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#4f46e5',
              overflow: 'hidden',      // Ensures image stays circular
              border: '4px solid rgba(255,255,255,0.3)' // Added a nice border
            }}
          >
            {user.photo ? (
                <img 
                    src={user.photo} 
                    alt="Profile" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
            ) : (
                user.name?.charAt(0).toUpperCase()
            )}
          </div>

          <div>
            <h1 style={{ margin: 0 }}>{user.name}</h1>
            <p style={{ margin: '5px 0', opacity: 0.9 }}>{user.email}</p>
            {user.phone && <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', opacity: 0.8 }}>{user.phone}</p>}

            <span
              style={{
                background: 'rgba(255,255,255,0.25)',
                padding: '5px 14px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}
            >
              {user.role} account
            </span>
          </div>
        </div>

        {/* ================= DETAILS ================= */}
        <div
          style={{
            background: 'white',
            borderRadius: '0 0 16px 16px',
            padding: '40px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
          }}
        >
          <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
            Account Overview
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '25px',
              marginTop: '25px'
            }}
          >
            <div>
              <label style={{ color: '#64748b' }}>Full Name</label>
              <div style={{ fontWeight: 600 }}>{user.name}</div>
            </div>

            <div>
              <label style={{ color: '#64748b' }}>Email</label>
              <div style={{ fontWeight: 600 }}>{user.email}</div>
            </div>

            <div>
              <label style={{ color: '#64748b' }}>Phone</label>
              <div style={{ fontWeight: 600 }}>{user.phone || 'Not Added'}</div>
            </div>

            <div>
              <label style={{ color: '#64748b' }}>Role</label>
              <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                {user.role}
              </div>
            </div>

            <div>
              <label style={{ color: '#64748b' }}>Status</label>
              <div style={{ fontWeight: 600, color: '#16a34a' }}>
                Active ✅
              </div>
            </div>
          </div>

          {/* ================= QUICK ACTIONS ================= */}
          <h3
            style={{
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '12px',
              marginTop: '40px'
            }}
          >
            Quick Actions
          </h3>

          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            {user.role === 'owner' ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn"
                  style={{ flex: 1, padding: '12px', background: '#e0e7ff', color: '#4338ca', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Dashboard
                </button>

                <button
                  onClick={() => navigate('/add-property')}
                  className="btn"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'white',
                    color: '#2563eb',
                    border: '1px solid #2563eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  + Add Property
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/properties')}
                  className="btn"
                  style={{ flex: 1, padding: '12px', background: '#e0e7ff', color: '#4338ca', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Browse Homes
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="btn"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'white',
                    color: '#2563eb',
                    border: '1px solid #2563eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Home
                </button>
              </>
            )}
          </div>

          {/* ================= LOGOUT ================= */}
          <div style={{ marginTop: '40px' }}>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;