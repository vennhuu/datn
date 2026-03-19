import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './styles/global.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from './components/admin/layout/layout.admin.jsx'
import User from './pages/admin/user.jsx'

const router = createBrowserRouter([
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <div>Dashboard Admin</div>
      },
      {
        path: "/admin/users",
        element: <User />
      }
    ]
  }
]);
createRoot(document.getElementById('root')).render(


      <RouterProvider router={router} />
)
