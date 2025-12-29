const TenantSection = ({ activeRental }) => {
    if (!activeRental) return null;
  
    return (
      <div style={{ marginBottom: '40px' }}>
          <h2 className="section-header">🎉 My Current Home</h2>
          <div className="card" style={{ flexDirection: 'row', gap: '20px', alignItems: 'center' }}>
              <img 
                  src={activeRental.property.mainImage || 'https://via.placeholder.com/300x200'} 
                  style={{ width: '250px', height: '180px', objectFit: 'cover', borderRadius: '8px' }} 
                  alt="My Home"
              />
              <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem' }}>{activeRental.property.title}</h3>
                  <p style={{ color: '#6b7280', margin: 0 }}>{activeRental.property.location}</p>
                  
                  <div className="details-box" style={{ background: '#eff6ff', borderColor: '#bfdbfe', marginTop: '20px' }}>
                      <div className="details-title" style={{ color: '#1e40af', borderColor: '#bfdbfe' }}>Landlord Details</div>
                      <div className="info-row"><span className="info-label">Name:</span> {activeRental.property.owner?.name}</div>
                      <div className="info-row"><span className="info-label">Phone:</span> <strong>{activeRental.property.owner?.phone || 'Hidden'}</strong></div>
                      <div className="info-row"><span className="info-label">Email:</span> {activeRental.property.owner?.email}</div>
                  </div>
              </div>
          </div>
      </div>
    );
  };
  
  export default TenantSection;