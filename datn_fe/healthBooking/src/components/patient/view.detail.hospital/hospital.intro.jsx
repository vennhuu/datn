const HospitalIntro = ({ introduction }) => {
  if (!introduction) return null;

  return (
    <div style={s.card}>
      <div style={s.titleRow}>
        <span style={s.dot} />
        <h3 style={s.title}>Giới thiệu</h3>
      </div>
      <p style={s.text}>{introduction}</p>
    </div>
  );
};

const s = {
  card: {
    background: "#fff", padding: 28, borderRadius: 20,
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)", marginBottom: 20,
  },
  titleRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 },
  dot: {
    width: 4, height: 22, borderRadius: 4,
    background: "linear-gradient(#0a6abf, #1a9fe0)",
    flexShrink: 0,
  },
  title: { fontSize: 17, fontWeight: 700, color: "#0f172a", margin: 0 },
  text: { fontSize: 14, color: "#334155", lineHeight: 1.8, margin: 0 },
};

export default HospitalIntro;