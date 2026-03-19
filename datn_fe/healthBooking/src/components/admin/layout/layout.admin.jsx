import { Layout } from 'antd';
import Sidebar from './sidebar';
import Footer from './footer';
import { Outlet } from 'react-router-dom';

const { Sider, Content } = Layout;

const AdminLayout = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>

            <Sider
                width={256}
                style={{
                    position: "fixed",
                    height: "100vh",
                }}
            >
                <Sidebar />
            </Sider>

            <Layout style={{ marginLeft: 256 }}> 
                <Content style={{ padding: 20 }}>
                    <Outlet />
                </Content>

                <Footer />
            </Layout>

        </Layout>
    );
};

export default AdminLayout;