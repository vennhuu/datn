import Footer from './components/admin/layout/footer'
import './App.css'
import Sidebar from './components/admin/layout/sidebar'
import { Layout } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { Content } from 'antd/es/layout/layout'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <Layout style={{ minHeight: '100vh' }}>
      
      <Sider width={256}>
        <Sidebar />
      </Sider>

      <Layout>
        <Outlet/>

        <Footer style={{ textAlign: 'center' }}>
          © 2026
        </Footer>
      </Layout>

    </Layout>
  )
}

export default App
