import { Button, Avatar, Dropdown } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { logoutAPI } from "../../../services/api.services.auth";

const HeaderHomepage = () => {
  const [current, setCurrent] = useState("home");
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [openMenu, setOpenMenu] = useState(false);

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
      const allRoutes = ["home", "doctors", "specialization", "hospital", "chat"];
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
    { key: "home", label: "Trang chủ", to: "/" },
    { key: "doctors", label: "Bác sĩ", to: "/doctors" },
    { key: "specialization", label: "Chuyên khoa", to: "/specialization" },
    { key: "hospital", label: "Bệnh viện", to: "/hospital" },
    { key: "chat" , label: "Nhắn tin", to: "/chat"}
  ];

  const dropdownItems = [
    { key: "profile", label: <Link to="/profile">Hồ sơ cá nhân</Link> },
    { key: "history", label: <Link to="/appointmenthistory">Lịch sử đặt khám</Link> },
    { type: "divider" },
    { key: "logout", label: <span style={{ color: "#e53935" }} onClick={handleLogout}>Đăng xuất</span> },
  ];

  return (
    <header style={styles.header}>
      {/* Logo */}
      <Link to="/" style={styles.logo}>
        <div style={styles.logoIcon}>🏥</div>
        <span style={styles.logoText}>PhuocBooking</span>
      </Link>

      {isMobile && (
        <Button onClick={() => setOpenMenu(!openMenu)}>
          ☰
        </Button>
      )}

      {/* Nav */}
      {(!isMobile || openMenu) && (
        <nav
          style={{
            ...styles.nav,
            ...(isMobile ? styles.navMobile : {}),
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.to}
              onClick={() => setOpenMenu(false)}
              style={{
                ...styles.navLink,
                ...(current === link.key ? styles.navLinkActive : {}),
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      {/* Right */}
      <div style={styles.right}>
        <div style={styles.hotline}>
          <PhoneOutlined style={{ color: "#0a6abf", marginRight: 6 }} />
          <span style={{ fontSize: 13, color: "#64748b" }}>
            Hotline: <strong style={{ color: "#0a6abf" }}>1800 6858</strong>
          </span>
        </div>

        {user ? (
          <Dropdown menu={{ items: dropdownItems }}>
            <div style={styles.userMenu}>
              <Avatar
                src={`${import.meta.env.VITE_BACKEND_URL}/storage/avt_patient/${user.avatar}`}
                icon={!user.avatar ? <UserOutlined /> : null}
                style={{ background: "#0a6abf" }}
              />
              <span style={styles.userName}>Xin chào, {user.name}</span>
            </div>
          </Dropdown>
        ) : (
          <Button
            type="primary"
            style={styles.loginBtn}
          >
            <Link to="/login" style={{ color: "white" }}>Đăng nhập</Link>
          </Button>
        )}
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    gap: 24,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    flexShrink: 0,
  },
  logoIcon: {
    width: 38,
    height: 38,
    background: "linear-gradient(135deg, #0a3d6b, #1890ff)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 700,
    color: "#0a6abf",
    letterSpacing: "-0.3px",
  },
  nav: {
    display: "flex",
    gap: 4,
    flex: 1,
    marginLeft: 32,
  },
  navLink: {
    padding: "7px 16px",
    borderRadius: 8,
    color: "#4a5568",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    transition: "all .15s",
  },
  navLinkActive: {
    background: "#eef4ff",
    color: "#0a6abf",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexShrink: 0,
  },
  hotline: {
    display: "flex",
    alignItems: "center",
  },
  userMenu: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
    padding: "4px 12px",
    borderRadius: 8,
    border: "1px solid #e8edf3",
  },
  userName: {
    fontSize: 14,
    fontWeight: 500,
    color: "#1e2d3d",
  },
  loginBtn: {
    background: "#0a6abf",
    border: "none",
    borderRadius: 8,
    height: 38,
    fontWeight: 600,
    fontSize: 14,
    padding: "0 20px",
  },
  navMobile: {
    position: "absolute",
    top: 70,
    left: 0,
    width: "100%",
    background: "white",
    flexDirection: "column",
    padding: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
};

export default HeaderHomepage;