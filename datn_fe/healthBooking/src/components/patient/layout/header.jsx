import { Button, Menu } from "antd";
import { Link } from "react-router-dom";

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
        }
    ];
    return (
        <>
            <h2 style={{ color: "#1890ff", margin: 0 }}>
            🏥 PhuocBooking
            </h2>

            <Menu
                mode="horizontal"
                items={menuItems}
                style={{ flex: 1, marginLeft: 40 }}
            />

            <Button type="primary">Đăng nhập</Button>
        </>
    )
}
export default HeaderHomepage ;