import logo from "../../../assets/logo.png";


const FooterHomepage = () => {
  const quickLinks = [
    { label: "Trang chủ", href: "/" },
    { label: "Đặt lịch khám", href: "/booking" },
    { label: "Tìm bác sĩ", href: "/doctors" },
    { label: "Hồ sơ sức khỏe", href: "/profile" },
    { label: "Lịch sử khám", href: "/history" },
  ];

  const services = [
    { label: "Khám tổng quát", href: "#" },
    { label: "Nội khoa", href: "#" },
    { label: "Nhi khoa", href: "#" },
    { label: "Da liễu", href: "#" },
    { label: "Sản phụ khoa", href: "#" },
  ];

  return (
    <footer style={styles.footer}>
      <div style={styles.topBar} />

      <div style={styles.container}>
        <div style={styles.grid}>
          {/* Cột 1: Brand */}
          <div style={styles.col}>
            <img 
              src={logo} 
              alt="PhuocBooking Logo" 
              style={styles.logoImg}
            />
            <p style={styles.desc}>
              Nền tảng đặt lịch khám bệnh trực tuyến uy tín hàng đầu. Kết nối
              bệnh nhân với hàng trăm bác sĩ chuyên khoa trên toàn quốc.
            </p>
            <div style={styles.socialRow}>
              {[
                { icon: "f", label: "Facebook", color: "#1877f2" },
                { icon: "z", label: "Zalo", color: "#0068ff" },
                { icon: "y", label: "Youtube", color: "#ff0000" },
              ].map((s) => (
                <a key={s.label} href="#" style={styles.socialBtn} title={s.label}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                    {s.icon.toUpperCase()}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Cột 2: Quick links */}
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Liên kết nhanh</h4>
            <div style={styles.divider} />
            <ul style={styles.linkList}>
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} style={styles.link}>
                    <span style={styles.linkArrow}>›</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Services */}
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Chuyên khoa</h4>
            <div style={styles.divider} />
            <ul style={styles.linkList}>
              {services.map((s) => (
                <li key={s.label}>
                  <a href={s.href} style={styles.link}>
                    <span style={styles.linkArrow}>›</span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Contact */}
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Liên hệ</h4>
            <div style={styles.divider} />
            <div style={styles.contactList}>
              {[
                { emoji: "📞", label: "Hotline", value: "1900 9095" },
                { emoji: "✉️", label: "Email", value: "support@phuocbooking.vn" },
                { emoji: "🕐", label: "Hỗ trợ", value: "24/7 tất cả các ngày" },
                { emoji: "📍", label: "Địa chỉ", value: "TP. Hồ Chí Minh, Việt Nam" },
              ].map((c) => (
                <div key={c.label} style={styles.contactItem}>
                  <span style={styles.contactEmoji}>{c.emoji}</span>
                  <div>
                    <div style={styles.contactLabel}>{c.label}</div>
                    <div style={styles.contactValue}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={styles.bottom}>
          <p style={styles.copy}>
            © {new Date().getFullYear()} PhuocBooking. Bảo lưu mọi quyền.
          </p>
          <div style={styles.bottomLinks}>
            {["Chính sách bảo mật", "Điều khoản sử dụng", "Sitemap"].map((l, i) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {i > 0 && <span style={{ color: "#2a5a8a", fontSize: 10 }}>•</span>}
                <a href="#" style={styles.bottomLink}>{l}</a>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: "linear-gradient(180deg, #0a2744 0%, #061a30 100%)",
    color: "#fff",
    marginTop: "auto",
    width: "100%",
    marginLeft: 0,
    marginRight: 0,
    boxSizing: "border-box",
  },
  topBar: {
    height: 4,
    background: "linear-gradient(90deg, #0a6abf 0%, #1a9fe0 50%, #0e9a57 100%)",
  },
  container: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "52px 24px 0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1.6fr",
    gap: 48,
    paddingBottom: 40,
  },
  col: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },

  /* Brand */
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  logoIcon: {
    width: 36,
    height: 36,
    background: "rgba(255,255,255,0.1)",
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 800,
    color: "#fff",
    letterSpacing: "-0.3px",
  },
  desc: {
    fontSize: 13,
    color: "#7ea9c9",
    lineHeight: 1.7,
    margin: "0 0 20px",
  },
  socialRow: {
    display: "flex",
    gap: 8,
  },
  socialBtn: {
    width: 32,
    height: 32,
    background: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    transition: "background .2s",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  /* Columns */
  colTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#fff",
    margin: "0 0 10px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  divider: {
    width: 28,
    height: 2,
    background: "#0a6abf",
    borderRadius: 2,
    marginBottom: 16,
  },
  linkList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  link: {
    fontSize: 13,
    color: "#7ea9c9",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: 6,
    transition: "color .2s",
  },
  linkArrow: {
    fontSize: 16,
    color: "#0a6abf",
    lineHeight: 1,
  },

  /* Contact */
  contactList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  contactItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
  },
  contactEmoji: {
    fontSize: 14,
    marginTop: 1,
    flexShrink: 0,
  },
  contactLabel: {
    fontSize: 11,
    color: "#4a7a9b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: 600,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 13,
    color: "#a8c8e0",
    lineHeight: 1.4,
  },

  /* Bottom */
  bottom: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    padding: "18px 0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  copy: {
    fontSize: 12,
    color: "#4a7a9b",
    margin: 0,
  },
  bottomLinks: {
    display: "flex",
    alignItems: "center",
    gap: 0,
  },
  bottomLink: {
    fontSize: 12,
    color: "#4a7a9b",
    textDecoration: "none",
  },
  logoImg: {
    height: 200,
    objectFit: "contain",
  },
};

export default FooterHomepage;