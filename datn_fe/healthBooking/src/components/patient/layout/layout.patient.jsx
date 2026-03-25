import { Layout, Menu, Button, Input, Row, Col, Card } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import HeaderHomepage from "./header";
import FooterHomepage from "./footer";
import { Outlet } from "react-router-dom";

const { Header, Content, Footer } = Layout;

const LayoutPatient = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* HEADER */}
      <Header
        style={{
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <HeaderHomepage />
      </Header>

      {/* CONTENT */}
      <Content style={{ flex: 1 }}>
        <Outlet />
      </Content>

      {/* FOOTER */}
      <Footer
        style={{
          textAlign: "center",
          background: "#001529",
          color: "#fff",
        }}
      >
        <FooterHomepage />
      </Footer>
    </Layout>
  );
};

export default LayoutPatient;