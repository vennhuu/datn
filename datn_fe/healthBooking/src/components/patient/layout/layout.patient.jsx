import { ConfigProvider, Layout, theme } from "antd";
import HeaderHomepage from "./header";
import FooterHomepage from "./footer";
import { Outlet } from "react-router-dom";
import { ThemeProvider, useTheme } from "../../../context/ThemeContext";
import { LangProvider } from "../../../context/LangContext";

const { Header, Content, Footer } = Layout;

const PatientContent = () => {
  const { isDark } = useTheme();

  const bg         = isDark ? "#0f172a" : "#f0f4f8";
  const headerBg   = isDark ? "#1e293b" : "#ffffff";
  const headerShadow = isDark
    ? "0 1px 0 #334155"
    : "0 1px 0 #e8edf3";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { colorPrimary: "#0a6abf" },
      }}
    >
      <Layout style={{ minHeight: "100vh", background: bg }}>
        <Header
          style={{
            background: headerBg,
            display: "flex",
            alignItems: "center",
            padding: "0 48px",
            height: 68,
            lineHeight: "68px",
            boxShadow: headerShadow,
            position: "sticky",
            top: 0,
            zIndex: 100,
            transition: "background 0.3s",
          }}
        >
          <HeaderHomepage />
        </Header>

        <Content style={{ background: bg, transition: "background 0.3s" }}>
          <Outlet />
        </Content>

        <Footer style={{ background: "#0a1e35", textAlign: "center", padding: 0 }}>
          <FooterHomepage />
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

const LayoutPatient = () => (
  <ThemeProvider>
    <LangProvider>
      <PatientContent />
    </LangProvider>
  </ThemeProvider>
);

export default LayoutPatient;