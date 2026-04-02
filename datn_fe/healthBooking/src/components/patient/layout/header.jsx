import { Button, Menu, Dropdown, Avatar } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { logoutAPI } from "../../../services/api.services.auth";

const HeaderHomepage = () => {
    const [current, setCurrent] = useState('');
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    }, [location]);

    useEffect(() => {
        if (location && location.pathname) {
            const allRoutes = ["home", "doctors", "specialization", "hospital"];
            const currentRoute = allRoutes.find(items => `/${items}` === location.pathname);
            setCurrent(currentRoute || "home");
        }
    }, [location]);

    const handleLogout = async () => {
        try {
            await logoutAPI();
        } catch (error) {
            console.log("Logout error:", error);
        } finally {

            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            setUser(null);
            navigate("/login");
        }
    };

    const menuItems = [
        { label: <Link to="/">Trang chủ</Link>, key: 'home' },
        { key: 'doctors', label: <Link to="/doctors">Bác sĩ</Link> },
        { key: 'specialization', label: <Link to="/specialization">Chuyên khoa</Link> },
        { key: 'hospital', label: <Link to="/hospital">Bệnh viện</Link> },
    ];

    const dropdownItems = [
        { key: "profile", label: <Link to="/profile">Hồ sơ cá nhân</Link> },
        { key: "history", label: <Link to="/appointmenthistory">Lịch sử đặt khám</Link> },
        { type: "divider" },
        {
            key: "logout",
            label: (
                <span style={{ color: "red" }} onClick={handleLogout}>
                    Đăng xuất
                </span>
            ),
        },
    ];

    return (
        <>
            <h2 style={{ color: "#1890ff", margin: 0 }}>
                <Link to="/">🏥 PhuocBooking</Link>
            </h2>

            <Menu
                mode="horizontal"
                items={menuItems}
                style={{ flex: 1, marginLeft: 40 }}
                selectedKeys={[current]}
            />

            {user ? (
                <Dropdown menu={{ items: dropdownItems }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                        <Avatar
                            src={ `${import.meta.env.VITE_BACKEND_URL}/storage/avt_patient/${user.avatar}`}
                            icon={!user.avatar ? <UserOutlined /> : null}
                        />
                        <span style={{ fontWeight: 500 }}>
                            Xin chào, {user.name}
                        </span>
                    </div>
                </Dropdown>
            ) : (
                <Button type="primary" style={{ background: "#2f6fa3" }}>
                    <Link to="/login" style={{ color: "white" }}>Đăng nhập</Link>
                </Button>
            )}
        </>
    );
};

export default HeaderHomepage;