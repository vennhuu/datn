import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchValue.trim()) navigate(`/doctors?q=${searchValue}`);
  };

  const stats = [
    { num: "500+", label: "Bác sĩ chuyên khoa" },
    { num: "50+", label: "Bệnh viện liên kết" },
    { num: "100K+", label: "Bệnh nhân tin tưởng" },
  ];

  const miniCards = [
    { icon: "📅", title: "Lịch hôm nay", sub: "12 bác sĩ còn chỗ trống" },
    { icon: "⭐", title: "Đánh giá trung bình", sub: "4.9/5 từ 10,000+ đánh giá" },
    { icon: "🛡️", title: "Bảo mật thông tin", sub: "Mã hóa SSL 256-bit" },
  ];

  return (
    <div style={styles.banner}>
      {/* Decorative circles */}
      <div style={styles.circle1} />
      <div style={styles.circle2} />

      {/* Left: text + search */}
      <div style={styles.left}>
        <div style={styles.badge}>✦ Nền tảng y tế số hàng đầu</div>
        <h1 style={styles.title}>
          Đặt lịch khám<br />
          <span style={styles.titleAccent}>dễ dàng & nhanh chóng</span>
        </h1>
        <p style={styles.desc}>
          Kết nối với hơn 500+ bác sĩ chuyên khoa hàng đầu.<br />
          Đặt lịch trong 60 giây, nhận xác nhận ngay lập tức.
        </p>

        {/* Search bar */}
        <div style={styles.searchBar}>
          <SearchOutlined style={{ color: "#94a3b8", fontSize: 16, marginLeft: 14 }} />
          <input
            style={styles.searchInput}
            placeholder="Tìm bác sĩ, chuyên khoa, bệnh viện..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button style={styles.searchBtn} onClick={handleSearch}>
            Tìm kiếm
          </button>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          {stats.map((s, i) => (
            <div key={i} style={styles.stat}>
              <div style={styles.statNum}>{s.num}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: mini cards */}
      <div style={styles.right}>
        {miniCards.map((card, i) => (
          <div key={i} style={styles.miniCard}>
            <div style={styles.miniIcon}>{card.icon}</div>
            <div>
              <div style={styles.miniTitle}>{card.title}</div>
              <div style={styles.miniSub}>{card.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  banner: {
    background: "linear-gradient(135deg, #0a3d6b 0%, #0a6abf 60%, #1a9fe0 100%)",
    padding: "64px 48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 48,
    position: "relative",
    overflow: "hidden",
    minHeight: 380,
  },
  circle1: {
    position: "absolute",
    right: -80,
    top: -80,
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.05)",
    pointerEvents: "none",
  },
  circle2: {
    position: "absolute",
    right: 100,
    bottom: -120,
    width: 350,
    height: 350,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.05)",
    pointerEvents: "none",
  },
  left: {
    flex: 1,
    zIndex: 1,
    maxWidth: 580,
  },
  badge: {
    display: "inline-block",
    background: "rgba(255,255,255,0.15)",
    color: "#a8d8ff",
    padding: "4px 14px",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 16,
    border: "1px solid rgba(255,255,255,0.2)",
  },
  title: {
    fontSize: 38,
    fontWeight: 700,
    color: "#fff",
    lineHeight: 1.2,
    marginBottom: 14,
    letterSpacing: "-0.5px",
  },
  titleAccent: {
    color: "#5ec5ff",
  },
  desc: {
    color: "#b8d9f2",
    fontSize: 16,
    marginBottom: 28,
    lineHeight: 1.7,
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    borderRadius: 12,
    padding: 6,
    maxWidth: 520,
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    padding: "10px 8px",
    fontSize: 14,
    color: "#1e2d3d",
    background: "transparent",
  },
  searchBtn: {
    background: "#0a6abf",
    color: "white",
    border: "none",
    padding: "10px 22px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    flexShrink: 0,
  },
  statsRow: {
    display: "flex",
    gap: 32,
    marginTop: 28,
  },
  stat: {},
  statNum: {
    fontSize: 22,
    fontWeight: 700,
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: "#90bde0",
    marginTop: 2,
  },
  right: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    zIndex: 1,
    flexShrink: 0,
    minWidth: 260,
  },
  miniCard: {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 14,
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    backdropFilter: "blur(8px)",
  },
  miniIcon: {
    width: 40,
    height: 40,
    background: "rgba(255,255,255,0.15)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    flexShrink: 0,
  },
  miniTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#fff",
  },
  miniSub: {
    fontSize: 11,
    color: "#9fcee8",
    marginTop: 2,
  },
};

export default Banner;