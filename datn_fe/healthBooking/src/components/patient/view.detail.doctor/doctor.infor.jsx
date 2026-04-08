const DoctorInfo = ({ doctor }) => (
  <div style={s.card}>
    <div style={s.titleRow}>
      <span style={s.dot} />
      <h3 style={s.title}>Thông tin bác sĩ</h3>
    </div>

    <div style={s.row}>
      <span style={s.label}>Bằng cấp</span>
      <span style={s.value}>{doctor.degree}</span>
    </div>
    <div style={s.row}>
      <span style={s.label}>Kinh nghiệm</span>
      <span style={s.value}>{doctor.experienceYears} năm</span>
    </div>
    <div style={s.row}>
      <span style={s.label}>Chuyên khoa</span>
      <span style={s.value}>{doctor.specialization}</span>
    </div>

    {doctor.bio && (
      <div style={s.bio}>
        <p style={s.bioText}>{doctor.bio}</p>
      </div>
    )}
  </div>
);

const s = {
  card: {
    background: "#fff", padding: 28, borderRadius: 20,
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
  },
  titleRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 20 },
  dot: { width: 4, height: 22, borderRadius: 4, background: "linear-gradient(#0a6abf, #1a9fe0)" },
  title: { fontSize: 17, fontWeight: 700, color: "#0f172a", margin: 0 },
  row: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 0", borderBottom: "1px solid #f1f5f9",
  },
  label: { fontSize: 13, color: "#94a3b8", fontWeight: 500 },
  value: { fontSize: 14, color: "#0f172a", fontWeight: 600 },
  bio: { marginTop: 16, background: "#f8fafc", borderRadius: 10, padding: 16 },
  bioText: { fontSize: 14, color: "#334155", lineHeight: 1.8, margin: 0 },
};

export default DoctorInfo;