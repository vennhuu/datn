import { Menu, Avatar } from "antd";
import Sider from "antd/es/layout/Sider";
import {
  DashboardOutlined, CalendarOutlined, UserOutlined,
  MessageOutlined, LogoutOutlined, MedicineBoxOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : {};

  const doctorName = user?.name || "Bác sĩ";
  const doctorAvatar = user?.avatar || null;

  const selectedKey = location.pathname.split("/")[2] || "dashboard";

  const menuItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: <Link to="/doctor">Tổng quan</Link> },
    { key: "schedule",  icon: <CalendarOutlined />,  label: <Link to="/doctor/schedule">Lịch khám</Link> },
    { key: "patient",   icon: <UserOutlined />,      label: <Link to="/doctor/patient">Bệnh nhân</Link> },
    { key: "chat",      icon: <MessageOutlined />,   label: <Link to="/doctor/chat">Tin nhắn</Link> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <Sider width={240} style={s.sider}>
      {/* Logo */}
      <div style={s.logo}>
        <MedicineBoxOutlined style={{ fontSize: 22, color: "#40a9ff" }} />
        <span style={s.logoText}>MediCare</span>
      </div>

      {/* Doctor info */}
      <div style={s.doctorInfo}>
        <Avatar
          size={48}
          src={doctorAvatar
            ? `${import.meta.env.VITE_BACKEND_URL}/storage/avt_doctor/${doctorAvatar}`
            : null
          }
          style={{ background: "#1d4ed8", fontSize: 18, flexShrink: 0 }}
        >
          {!doctorAvatar && doctorName.charAt(0)}
        </Avatar>
        <div style={s.doctorText}>
          <div style={s.doctorName}>{doctorName}</div>
          <div style={s.doctorSpec}>Bác sĩ</div>
        </div>
      </div>

      <div style={s.divider} />

      {/* Main menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        style={{ background: "transparent", border: "none", flex: 1 }}
      />

      {/* Logout */}
      <div style={s.bottom}>
        <button style={s.logoutBtn} onClick={handleLogout}>
          <LogoutOutlined style={{ marginRight: 8 }} />
          Đăng xuất
        </button>
      </div>
    </Sider>
  );
};

const s = {
  sider: {
    height: "100vh", position: "sticky", top: 0,
    background: "#0f172a", display: "flex", flexDirection: "column",
    boxShadow: "2px 0 12px rgba(0,0,0,0.15)",
  },
  logo: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "20px 24px 16px",
  },
  logoText: { fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" },
  doctorInfo: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "12px 20px 16px",
  },
  doctorText: { flex: 1, overflow: "hidden" },
  doctorName: { fontSize: 14, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  doctorSpec: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  divider: { height: 1, background: "#1e293b", margin: "0 16px 8px" },
  bottom: { padding: 16, marginTop: "auto" },
  logoutBtn: {
    width: "100%", padding: "10px 16px", borderRadius: 10,
    background: "#1e293b", color: "#94a3b8", border: "none",
    cursor: "pointer", fontSize: 13, fontWeight: 500,
    display: "flex", alignItems: "center",
    transition: "all .15s",
  },
};

export default Sidebar;