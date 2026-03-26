import { Button, Menu, Dropdown, Avatar } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

const HeaderHomepage = () => {

    const menuItems = [
        {
            label: <Link to="/">Trang chủ</Link>,
            key: 'home',
        },
        {
            key: 'doctors',
            label: <Link to="/doctors">Bác sĩ</Link>,
        },
        {
            key: 'specialization',
            label: <Link to="/specialization">Chuyên khoa</Link>,
        },
        {
            key: 'hospital',
            label: <Link to="/hospital">Bệnh viện</Link>,
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
            />

            {/* USER DROPDOWN */}
            <Dropdown
                menu={{
                    items: [
                        {
                            key: "profile",
                            label: <Link to="/profile">Hồ sơ cá nhân</Link>,
                        },
                        {
                            key: "history",
                            label: <Link to="/appointmenthistory">Lịch sử đặt khám</Link>,
                        },
                        {
                            type: "divider",
                        },
                        {
                            key: "logout",
                            label: <Link to="/login">Đăng xuất</Link>,
                        },
                    ],
                }}
            >
                <Avatar
                    style={{ cursor: "pointer" }}
                    icon={<UserOutlined />}
                />
            </Dropdown>
        </>
    );
};

export default HeaderHomepage;