const LegalLayout = ({ title, lastUpdated, children }) => {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "40px 0" }}>
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        background: "#ffffff",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
      }}>
        <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>{title}</h1>
        <p style={{ color: "#64748b", marginBottom: "30px" }}>
          Last updated: {lastUpdated}
        </p>
        <div style={{ lineHeight: "1.8", color: "#334155", fontSize: "15px" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default LegalLayout;
