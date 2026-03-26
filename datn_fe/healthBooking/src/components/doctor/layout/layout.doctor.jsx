import { Layout, Menu, theme } from "antd";
import React from "react";
import Sidebar from "./sidebar";
import FooterDoctor from "./footer";
import { Outlet } from "react-router-dom";


const { Header, Content, Footer, Sider } = Layout;
const LayoutDoctor = () => {
    return(
        <Layout hasSider>
            <Sidebar/>
            <Layout>
                {/* <Header style={{ padding: 0,backgroundColor: "white" }} /> */}
                <Content style={{ flex: 1 }}>
                    <Outlet />
                </Content>
                <FooterDoctor/>
            </Layout>
        </Layout>
    )
}
export default LayoutDoctor ;