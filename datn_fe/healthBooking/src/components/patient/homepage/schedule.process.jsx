const steps = [
  { num: 1, title: "Tìm bác sĩ", desc: "Chọn theo chuyên khoa, bệnh viện hoặc tên bác sĩ" },
  { num: 2, title: "Chọn lịch hẹn", desc: "Xem lịch trống và chọn thời gian phù hợp nhất" },
  { num: 3, title: "Nhập thông tin", desc: "Điền thông tin bệnh nhân và lý do khám bệnh" },
  { num: 4, title: "Xác nhận ngay", desc: "Nhận SMS/email xác nhận và nhắc lịch khám" },
];

const ScheduleProcess = () => (
  <section style={styles.section}>
    <div style={styles.sectionHeader}>
      <div>
        <h2 style={styles.title}>
          Quy trình <span style={styles.accent}>đặt lịch</span>
        </h2>
        <p style={styles.sub}>Chỉ 4 bước đơn giản để có lịch khám với bác sĩ</p>
      </div>
    </div>

    <div style={styles.gridWrapper}>
      {/* Connector line */}
      <div style={styles.line} />
      {steps.map((step) => (
        <div key={step.num} style={styles.card}>
          <div style={styles.stepNum}>{step.num}</div>
          <h3 style={styles.stepTitle}>{step.title}</h3>
          <p style={styles.stepDesc}>{step.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

const styles = {
  section: { paddingBottom: 48 },
  sectionHeader: { marginBottom: 28 },
  title: { fontSize: 22, fontWeight: 700, color: "#1e2d3d", margin: 0, letterSpacing: "-0.3px" },
  accent: { color: "#0a6abf" },
  sub: { fontSize: 14, color: "#8898aa", margin: "4px 0 0" },
  gridWrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 18,
    position: "relative",
  },
  line: {
    position: "absolute",
    top: 28,
    left: "calc(12.5% + 8px)",
    width: "calc(75% - 16px)",
    height: 2,
    background: "linear-gradient(90deg, #0a6abf, #5ec5ff)",
    zIndex: 0,
  },
  card: {
    background: "#fff",
    borderRadius: 14,
    padding: "22px 16px",
    textAlign: "center",
    border: "1px solid #e8edf3",
    position: "relative",
    zIndex: 1,
  },
  stepNum: {
    width: 44,
    height: 44,
    background: "#0a6abf",
    color: "white",
    borderRadius: "50%",
    fontSize: 16,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
    border: "3px solid #fff",
    boxShadow: "0 0 0 3px #c2dcf5",
  },
  stepTitle: { fontSize: 14, fontWeight: 600, color: "#1e2d3d", margin: "0 0 6px" },
  stepDesc: { fontSize: 12, color: "#8898aa", lineHeight: 1.6, margin: 0 },
};

export default ScheduleProcess;