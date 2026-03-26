import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import React from "react";
import { Link } from "react-router-dom";

const siderStyle = {
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  display: 'flex',
  flexDirection: 'column',
};

const Sidebar = () => {
  const menuItems = [
    {
      label: <Link to="/doctor">Tổng quan</Link>,
      key: 'home',
    },
    {
      key: 'schedule',
      label: <Link to="/doctor/schedule">Lịch khám</Link>,
    },
    {
      key: 'patient',
      label: <Link to="/doctor/patient">Bệnh nhân</Link>,
    },
    {
      key: 'chat',
      label: <Link to="/doctor/chat">Tin nhắn</Link>,
    },
    {
      key: 'profile',
      label: <Link to="/doctor/profile">Hồ sơ cá nhân</Link>,
    },
  ];

  return (
    <Sider style={siderStyle}>
      <div className="demo-logo-vertical" />

      <Menu
        theme="dark"
        mode="inline"
        items={menuItems}
        style={{ flex: 1 }}
      />

      <div style={{ padding: '16px', color: 'white' }}>
        <div style={{ marginTop: '300px' }}>
          Xin chào <b>Phước</b> 👋
        </div>

        <Menu
          theme="dark"
          mode="inline"
          items={[
            {
              key: 'logout',
              label: <Link to="/login">Đăng xuất</Link>,
            },
          ]}
        />
      </div>
    </Sider>
  );
};

export default Sidebar;