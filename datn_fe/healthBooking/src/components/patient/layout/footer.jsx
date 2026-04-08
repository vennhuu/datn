const FooterHomepage = () => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.logoRow}>
        <span style={{ fontSize: 20 }}>🏥</span>
        <span style={styles.logoText}>PhuocBooking</span>
      </div>
      <p style={styles.copy}>
        © {new Date().getFullYear()} PhuocBooking — Nền tảng đặt lịch khám bệnh trực tuyến
      </p>
    </div>
  );
};

const styles = {
  wrapper: {
    textAlign: "center",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 700,
    color: "#fff",
  },
  copy: {
    fontSize: 13,
    color: "#7ea9c9",
    margin: 0,
  },
};

export default FooterHomepage;