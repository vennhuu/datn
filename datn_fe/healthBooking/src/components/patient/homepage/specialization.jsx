import { useNavigate } from "react-router-dom";

const specializations = [
  { name: "Tim mạch", emoji: "🫀" },
  { name: "Thần kinh", emoji: "🧠" },
  { name: "Cơ xương khớp", emoji: "🦴" },
  { name: "Mắt", emoji: "👁️" },
  { name: "Nhi khoa", emoji: "🍼" },
  { name: "Sản phụ khoa", emoji: "🤰" },
  { name: "Răng hàm mặt", emoji: "🦷" },
  { name: "Hô hấp", emoji: "🫁" },
  { name: "Nội tiết", emoji: "🧬" },
  { name: "Nội tổng quát", emoji: "🩺" },
  { name: "Ngoại khoa", emoji: "✂️" },
  { name: "Da liễu", emoji: "🧴" },
  { name: "Tâm lý", emoji: "💬" },
  { name: "Tiêu hóa", emoji: "🔬" },
];

const Specialization = () => {
  const navigate = useNavigate();

  return (
    <section style={styles.section}>
      {/* Section header */}
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.title}>
            Chuyên khoa <span style={styles.accent}>phổ biến</span>
          </h2>
          <p style={styles.sub}>Tìm bác sĩ theo chuyên khoa phù hợp với bạn</p>
        </div>
        <span
          style={styles.seeAll}
          onClick={() => navigate("/specialization")}
        >
          Xem tất cả →
        </span>
      </div>

      {/* Scrollable grid */}
      <div style={styles.scrollContainer}>
        {specializations.map((item, i) => (
          <div
            key={i}
            style={styles.card}
            onClick={() => navigate(`/specialization?name=${item.name}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#0a6abf";
              e.currentTarget.style.background = "#eef4ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e8edf3";
              e.currentTarget.style.background = "#fff";
            }}
          >
            <div style={styles.emoji}>{item.emoji}</div>
            <p style={styles.name}>{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: "48px 0",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1e2d3d",
    margin: 0,
    letterSpacing: "-0.3px",
  },
  accent: {
    color: "#0a6abf",
  },
  sub: {
    fontSize: 14,
    color: "#8898aa",
    margin: "4px 0 0",
  },
  seeAll: {
    fontSize: 13,
    color: "#0a6abf",
    fontWeight: 500,
    cursor: "pointer",
  },
  scrollContainer: {
    display: "flex",
    gap: 12,
    overflowX: "auto",
    paddingBottom: 8,
    scrollbarWidth: "thin",
    scrollbarColor: "#c8ddf0 transparent",
  },
  card: {
    minWidth: 118,
    background: "#fff",
    borderRadius: 14,
    padding: "18px 12px",
    textAlign: "center",
    border: "1.5px solid #e8edf3",
    cursor: "pointer",
    transition: "border-color .15s, background .15s",
    flexShrink: 0,
  },
  emoji: {
    fontSize: 30,
    marginBottom: 8,
  },
  name: {
    fontSize: 12,
    fontWeight: 500,
    color: "#3d5166",
    lineHeight: 1.3,
    margin: 0,
  },
};

export default Specialization;