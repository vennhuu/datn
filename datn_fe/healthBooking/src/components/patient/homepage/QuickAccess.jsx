import { useNavigate } from "react-router-dom";

const quickItems = [
  { icon: "🩺", title: "Khám tổng quát", sub: "Đặt lịch ngay hôm nay", color: "#eef4ff", to: "/doctors" },
  { icon: "💊", title: "Tư vấn online", sub: "Gặp bác sĩ qua video", color: "#edfaf3", to: "/doctors?type=online" },
  { icon: "🧪", title: "Xét nghiệm", sub: "Đặt lịch xét nghiệm", color: "#fff4ea", to: "/doctors?type=test" },
  { icon: "📋", title: "Hồ sơ sức khỏe", sub: "Lưu trữ bệnh án", color: "#f2eeff", to: "/profile" },
];

const QuickAccess = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
      {quickItems.map((item, i) => (
        <div
          key={i}
          style={styles.card}
          onClick={() => navigate(item.to)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 10px 32px rgba(10,106,191,0.13)";
            e.currentTarget.style.borderColor = "#c2dcf5";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
            e.currentTarget.style.borderColor = "transparent";
          }}
        >
          <div style={{ ...styles.iconBox, background: item.color }}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
          </div>
          <div>
            <div style={styles.cardTitle}>{item.title}</div>
            <div style={styles.cardSub}>{item.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  wrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    maxWidth: 1200,
    margin: "-36px auto 0",
    padding: "0 48px",
    position: "relative",
    zIndex: 10,
  },
  card: {
    background: "#fff",
    borderRadius: 14,
    padding: "18px 16px",
    display: "flex",
    alignItems: "center",
    gap: 14,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    cursor: "pointer",
    transition: "transform .15s, box-shadow .15s, border-color .15s",
    border: "1.5px solid transparent",
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#1e2d3d",
  },
  cardSub: {
    fontSize: 12,
    color: "#8898aa",
    marginTop: 2,
  },
};

export default QuickAccess;