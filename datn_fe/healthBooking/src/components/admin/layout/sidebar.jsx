import { HomeOutlined, LogoutOutlined, MedicineBoxOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const SideBar = () => {
    const [current, setCurrent] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const user = (() => {
        try { return JSON.parse(localStorage.getItem("user")) || {}; }
        catch { return {}; }
    })();

  const adminName   = user?.email   || "Admin";

    useEffect(() => {
    if (location.pathname.startsWith("/admin/users")) {
        setCurrent("users");
    } else if (location.pathname.startsWith("/admin/doctors")) {
        setCurrent("doctors");
    } else if (location.pathname.startsWith("/admin/hospitals")) {
        setCurrent("hospitals");
    } else {
        setCurrent("home");
    }
}, [location]);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const items = [
        {
            label: <Link to="/admin">Trang chủ</Link>,
            key: 'home',
            icon: <HomeOutlined />,
        },
        {
            key: 'users',
            icon: <UserOutlined />,
            label: <Link to="/admin/users">Quản lý người dùng</Link>,
        },
        {
            key: 'doctors',
            icon: <UserOutlined />,
            label: <Link to="/admin/doctors">Quản lý bác sĩ</Link>,
        },
        {
            key: 'hospitals',
            icon: <MedicineBoxOutlined  />,
            label: <Link to="/admin/hospitals">Quản lý bệnh viện</Link>,
        },
    ];

    return (
        <div style={{ 
            width: 256, 
            height: '100vh', 
            boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
            background: '#fff'
        }}>

            {/* Header */}
            <div style={{
                padding: '16px',
                borderBottom: '1px solid #f0f0f0',
                textAlign: 'center'
            }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    👋 Xin chào
                </div>
                <div style={{ color: '#1890ff', fontWeight: 500 }}>
                    {adminName}
                </div>
            </div>

            {/* Menu */}
            <Menu
                mode="inline"
                items={items}
                style={{ borderRight: 0 }}
                selectedKeys={[current]}
            />
            {/* Logout */}
            <div style={s.bottom}>
                <button style={s.logoutBtn} onClick={handleLogout}>
                <LogoutOutlined style={{ fontSize: 14 }} />
                {!collapsed && "Đăng xuất"}
                </button>
            </div>
        </div>
    );
};
const s = {
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

export default SideBar;