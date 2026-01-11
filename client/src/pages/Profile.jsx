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
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '32px 12px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* ================= HEADER ================= */}
        <div
          style={{
            background: 'linear-gradient(135deg, #4f46e5, #3b82f6)',
            borderRadius: '16px 16px 0 0',
            padding: '32px',
            color: 'white',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '20px',
            position: 'relative'
          }}
        >
          {/* Edit Button */}
          <button
            onClick={() => navigate('/edit-profile')}
            title="Edit Profile"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✏️
          </button>

          {/* Avatar */}
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
              overflow: 'hidden',
              border: '4px solid rgba(255,255,255,0.3)',
              boxShadow: '0 10px 20px rgba(0,0,0,0.15)'
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

          {/* User Info */}
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
              {user.name}
            </h1>

            <p
              style={{
                margin: '6px 0',
                opacity: 0.9,
                fontSize: '0.95rem',
                wordBreak: 'break-all',
                overflowWrap: 'anywhere'
              }}
            >
              {user.email}
            </p>

            {user.phone && (
              <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.85 }}>
                {user.phone}
              </p>
            )}

            <span
              style={{
                display: 'inline-block',
                marginTop: '10px',
                background: 'rgba(255,255,255,0.25)',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
            >
              {user.role} account
            </span>
          </div>
        </div>

        {/* ================= BODY ================= */}
        <div
          style={{
            background: 'white',
            borderRadius: '0 0 16px 16px',
            padding: '32px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.06)'
          }}
        >
          {/* Account Overview */}
          <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
            Account Overview
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px',
              marginTop: '24px'
            }}
          >
            <Info label="Full Name" value={user.name} />
            <Info label="Email" value={user.email} />
            <Info label="Phone" value={user.phone || 'Not Added'} />
            <Info label="Role" value={user.role} />
            <Info label="Status" value="Active ✅" color="#16a34a" />
          </div>

          {/* Quick Actions */}
          <h3
            style={{
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '12px',
              marginTop: '40px'
            }}
          >
            Quick Actions
          </h3>

          <div
            style={{
              display: 'flex',
              gap: '15px',
              marginTop: '20px',
              flexWrap: 'wrap'
            }}
          >
            {user.role === 'owner' ? (
              <>
                <ActionBtn
                  label="Dashboard"
                  onClick={() => navigate('/dashboard')}
                  bg="#e0e7ff"
                  color="#4338ca"
                />
                <ActionBtn
                  label="+ Add Property"
                  onClick={() => navigate('/add-property')}
                  border
                />
              </>
            ) : (
              <>
                <ActionBtn
                  label="Browse Homes"
                  onClick={() => navigate('/properties')}
                  bg="#e0e7ff"
                  color="#4338ca"
                />
                <ActionBtn label="Home" onClick={() => navigate('/')} border />
              </>
            )}
          </div>

          {/* Logout */}
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

/* ================= SMALL COMPONENTS ================= */

const Info = ({ label, value, color }) => (
  <div>
    <label style={{ color: '#64748b', fontSize: '0.85rem' }}>{label}</label>
    <div style={{ fontWeight: 600, color: color || '#0f172a' }}>{value}</div>
  </div>
);

const ActionBtn = ({ label, onClick, bg, color, border }) => (
  <button
    onClick={onClick}
    style={{
      flex: '1 1 200px',
      padding: '12px',
      background: border ? 'white' : bg,
      color: border ? '#2563eb' : color,
      border: border ? '1px solid #2563eb' : 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 600
    }}
  >
    {label}
  </button>
);

export default Profile;
