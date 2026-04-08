const trustItems = [
  { num: "500+", label: "Bác sĩ chuyên khoa" },
  { num: "50+", label: "Bệnh viện liên kết" },
  { num: "100K+", label: "Lượt đặt lịch" },
  { num: "4.9★", label: "Đánh giá trung bình" },
  { num: "24/7", label: "Hỗ trợ trực tuyến" },
];

const TrustBar = () => (
  <div style={styles.bar}>
    {trustItems.map((item, i) => (
      <div key={i} style={styles.item}>
        <div style={styles.num}>{item.num}</div>
        <div style={styles.label}>{item.label}</div>
      </div>
    ))}
  </div>
);

const styles = {
  bar: {
    background: "#fff",
    borderTop: "1px solid #e8edf3",
    borderBottom: "1px solid #e8edf3",
    padding: "24px 48px",
    display: "flex",
    justifyContent: "center",
    gap: 60,
    alignItems: "center",
  },
  item: {
    textAlign: "center",
  },
  num: {
    fontSize: 24,
    fontWeight: 700,
    color: "#0a6abf",
  },
  label: {
    fontSize: 12,
    color: "#8898aa",
    marginTop: 2,
  },
};

export default TrustBar;