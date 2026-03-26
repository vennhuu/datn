import { HomeOutlined, MedicineBoxOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const SideBar = () => {

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

            {/* 🔥 Header */}
            <div style={{
                padding: '16px',
                borderBottom: '1px solid #f0f0f0',
                textAlign: 'center'
            }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    👋 Xin chào
                </div>
                <div style={{ color: '#1890ff', fontWeight: 500 }}>
                    Phước
                </div>
            </div>

            {/* 🔥 Menu */}
            <Menu
                mode="inline"
                items={items}
                style={{ borderRight: 0 }}
            />
        </div>
    );
};

export default SideBar;