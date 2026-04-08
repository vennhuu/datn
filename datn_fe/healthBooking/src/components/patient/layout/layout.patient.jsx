import { Layout } from "antd";
import HeaderHomepage from "./header";
import FooterHomepage from "./footer";
import { Outlet } from "react-router-dom";

const { Header, Content, Footer } = Layout;

const LayoutPatient = () => {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f4f8" }}>
      {/* HEADER */}
      <Header
        style={{
          background: "#fff",
          display: "flex",
          alignItems: "center",
          padding: "0 48px",
          height: 68,
          lineHeight: "68px",
          boxShadow: "0 1px 0 #e8edf3",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <HeaderHomepage />
      </Header>

      {/* CONTENT */}
      <Content style={{ background: "#f0f4f8" }}>
        <Outlet />
      </Content>

      {/* FOOTER */}
      <Footer
        style={{
          background: "#0a1e35",
          padding: "28px 48px",
          textAlign: "center",
        }}
      >
        <FooterHomepage />
      </Footer>
    </Layout>
  );
};

export default LayoutPatient;