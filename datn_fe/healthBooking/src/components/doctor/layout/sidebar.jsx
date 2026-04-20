import { Menu, Avatar } from "antd";
import Sider from "antd/es/layout/Sider";
import {
  DashboardOutlined, CalendarOutlined, UserOutlined,
  MessageOutlined, LogoutOutlined, MedicineBoxOutlined, SettingOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; }
    catch { return {}; }
  })();

  const doctorName   = user?.name   || "Bác sĩ";
  const doctorAvatar = user?.avatar || null;
  const selectedKey  = location.pathname.split("/")[2] || "dashboard";

  const menuItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: <Link to="/doctor">Tổng quan</Link> },
    { key: "schedule",  icon: <CalendarOutlined />,  label: <Link to="/doctor/schedule">Lịch khám</Link> },
    { key: "patient",   icon: <UserOutlined />,      label: <Link to="/doctor/patient">Bệnh nhân</Link> },
    { key: "chat",      icon: <MessageOutlined />,   label: <Link to="/doctor/chat">Tin nhắn</Link> },
    { key: "profile",   icon: <SettingOutlined />,   label: <Link to="/doctor/profile">Hồ sơ cá nhân</Link> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Sider
      width={240}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={s.sider}
    >
      {/* Logo */}
      <div style={s.logo}>
        <div style={s.logoIcon}>
          <MedicineBoxOutlined style={{ fontSize: 18, color: "#fff" }} />
        </div>
        {!collapsed && <span style={s.logoText}>MediCare</span>}
      </div>

      <div style={s.divider} />

      {/* Doctor info card */}
      <div style={s.doctorCard}>
        <Avatar
          size={44}
          src={
            doctorAvatar
              ? `${import.meta.env.VITE_BACKEND_URL}/storage/avt_doctor/${doctorAvatar}`
              : null
          }
          style={{ background: "#1d4ed8", fontSize: 16, flexShrink: 0 }}
        >
          {!doctorAvatar && doctorName.charAt(0)}
        </Avatar>
        {!collapsed && (
          <div style={s.doctorInfo}>
            <div style={s.doctorName}>{doctorName}</div>
            <div style={s.doctorRole}>
              <span style={s.onlineDot} />
              Bác sĩ
            </div>
          </div>
        )}
      </div>

      <div style={s.divider} />

      {/* Navigation menu */}
      <div style={{ flex: 1, padding: "8px 10px" }}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{ background: "transparent", border: "none" }}
        />
      </div>

      {/* Logout */}
      <div style={s.bottom}>
        <button style={s.logoutBtn} onClick={handleLogout}>
          <LogoutOutlined style={{ fontSize: 14 }} />
          {!collapsed && "Đăng xuất"}
        </button>
      </div>
    </Sider>
  );
};

const s = {
  sider: {
    height: "100vh",
    position: "sticky",
    top: 0,
    background: "#0f172a",
    display: "flex",
    flexDirection: "column",
    boxShadow: "2px 0 16px rgba(0,0,0,0.2)",
    overflow: "hidden",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "22px 20px 18px",
  },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    background: "#0a6abf",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.3px",
  },
  divider: {
    height: 1,
    background: "#1e293b",
    margin: "0 16px",
  },
  doctorCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 18px",
  },
  doctorInfo: { flex: 1, overflow: "hidden" },
  doctorName: {
    fontSize: 14,
    fontWeight: 600,
    color: "#f1f5f9",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  doctorRole: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 3,
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#22c55e",
    flexShrink: 0,
  },
  bottom: { padding: "12px 16px", marginTop: "auto" },
  logoutBtn: {
    width: "100%",
    padding: "10px 16px",
    borderRadius: 10,
    background: "#1e293b",
    color: "#94a3b8",
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 10,
    transition: "all .15s",
  },
};

export default Sidebar;