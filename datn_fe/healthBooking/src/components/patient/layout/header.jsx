import { Button, Avatar, Dropdown } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  UserOutlined, PhoneOutlined, MessageOutlined,
  MoonOutlined, SunOutlined, GlobalOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { logoutAPI } from "../../../services/api.services.auth";
import { useTheme } from "../../../context/ThemeContext";
import logo from "../../../assets/logo.png";

const HeaderHomepage = () => {
  const { isDark, toggleTheme } = useTheme(); // ← dùng context
  const [current, setCurrent]   = useState("home");
  const [user, setUser]         = useState(null);
  const [lang, setLang]         = useState("vi");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [openMenu, setOpenMenu] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location]);

  useEffect(() => {
    if (location?.pathname) {
      const allRoutes = ["home", "doctors", "specialization", "hospital"];
      const currentRoute = allRoutes.find((r) =>
        r === "home"
          ? location.pathname === "/"
          : location.pathname.startsWith(`/${r}`)
      );
      setCurrent(currentRoute || "");
    }
  }, [location]);

  const handleLogout = async () => {
    try { await logoutAPI(); } catch (e) { console.log(e); } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    }
  };

  const navLinks = [
    { key: "home",           label: lang === "vi" ? "Trang chủ"   : "Home",       to: "/" },
    { key: "doctors",        label: lang === "vi" ? "Bác sĩ"      : "Doctors",    to: "/doctors" },
    { key: "specialization", label: lang === "vi" ? "Chuyên khoa" : "Specialties",to: "/specialization" },
    { key: "hospital",       label: lang === "vi" ? "Bệnh viện"   : "Hospitals",  to: "/hospital" },
  ];

  const dropdownItems = [
    { key: "profile", label: <Link to="/profile">{lang === "vi" ? "Hồ sơ cá nhân" : "My Profile"}</Link> },
    { key: "history", label: <Link to="/appointmenthistory">{lang === "vi" ? "Lịch sử đặt khám" : "Appointment History"}</Link> },
    { type: "divider" },
    { key: "logout",  label: <span style={{ color: "#e53935" }} onClick={handleLogout}>{lang === "vi" ? "Đăng xuất" : "Logout"}</span> },
  ];

  // Màu động theo theme
  const navLinkColor       = isDark ? "#cbd5e1" : "#4a5568";
  const navLinkActiveBg    = isDark ? "#1e3a5f" : "#eef4ff";
  const navLinkActiveColor = "#0a6abf";
  const borderColor        = isDark ? "#334155" : "#e8edf3";
  const subTextColor       = isDark ? "#94a3b8" : "#64748b";

  return (
    <header style={styles.header}>
      {/* Logo */}
      <Link to="/" style={styles.logo}>
        <img src={logo} alt="PhuocBooking Logo" style={styles.logoImg} />
      </Link>

      {isMobile && (
        <Button onClick={() => setOpenMenu(!openMenu)}>☰</Button>
      )}

      {/* Nav */}
      {(!isMobile || openMenu) && (
        <nav style={{ ...styles.nav, ...(isMobile ? styles.navMobile : {}) }}>
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.to}
              onClick={() => setOpenMenu(false)}
              style={{
                ...styles.navLink,
                color: navLinkColor,
                ...(current === link.key
                  ? { background: navLinkActiveBg, color: navLinkActiveColor }
                  : {}),
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      {/* Right */}
      <div style={styles.right}>
        {/* Hotline */}
        <div style={{ ...styles.hotline, borderRight: `1px solid ${borderColor}` }}>
          <PhoneOutlined style={{ color: "#0a6abf", marginRight: 6 }} />
          <span style={{ fontSize: 13, color: subTextColor }}>
            Hotline: <strong style={{ color: "#0a6abf" }}>1800 6858</strong>
          </span>
        </div>

        {/* Chat icon */}
        <Link
          to="/chat"
          style={{ ...styles.iconBtn, border: `1px solid ${borderColor}`, color: subTextColor }}
          title={lang === "vi" ? "Nhắn tin" : "Messages"}
        >
          <MessageOutlined style={{ fontSize: 17 }} />
        </Link>

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          style={{ ...styles.iconBtn, border: `1px solid ${borderColor}`, color: subTextColor }}
          title={isDark
            ? (lang === "vi" ? "Giao diện sáng" : "Light mode")
            : (lang === "vi" ? "Giao diện tối"  : "Dark mode")}
        >
          {isDark
            ? <SunOutlined  style={{ fontSize: 17 }} />
            : <MoonOutlined style={{ fontSize: 17 }} />}
        </button>

        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === "vi" ? "en" : "vi")}
          style={{ ...styles.langBtn, border: `1px solid ${borderColor}`, color: subTextColor }}
        >
          <GlobalOutlined style={{ fontSize: 15 }} />
          <span style={styles.langLabel}>{lang === "vi" ? "🇻🇳 VI" : "🇬🇧 EN"}</span>
        </button>

        {/* Avatar / Login */}
        {user ? (
          <Dropdown menu={{ items: dropdownItems }}>
            <div style={{ ...styles.userMenu, border: `1px solid ${borderColor}` }}>
              <Avatar
                src={`${import.meta.env.VITE_BACKEND_URL}/storage/avt_patient/${user.avatar}`}
                icon={!user.avatar ? <UserOutlined /> : null}
                style={{ background: "#0a6abf" }}
              />
            </div>
          </Dropdown>
        ) : (
          <Button type="primary" style={styles.loginBtn}>
            <Link to="/login" style={{ color: "white" }}>
              {lang === "vi" ? "Đăng nhập" : "Login"}
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
};

const styles = {
  header:      { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 24 },
  logo:        { display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 },
  logoImg:     { height: 200, objectFit: "contain" },
  nav:         { display: "flex", gap: 4, flex: 1, marginLeft: 32 },
  navLink:     { padding: "7px 16px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "all .15s" },
  right:       { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
  hotline:     { display: "flex", alignItems: "center", paddingRight: 12, marginRight: 4 },
  iconBtn:     { width: 36, height: 36, borderRadius: 8, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", textDecoration: "none", padding: 0 },
  langBtn:     { display: "flex", alignItems: "center", gap: 5, height: 36, padding: "0 10px", borderRadius: 8, background: "transparent", cursor: "pointer" },
  langLabel:   { fontSize: 13, fontWeight: 500 },
  userMenu:    { display: "flex", alignItems: "center", cursor: "pointer", padding: 4, borderRadius: 8 },
  loginBtn:    { background: "#0a6abf", border: "none", borderRadius: 8, height: 38, fontWeight: 600, fontSize: 14, padding: "0 20px" },
  navMobile:   { position: "absolute", top: 70, left: 0, width: "100%", background: "white", flexDirection: "column", padding: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 100 },
};

export default HeaderHomepage;