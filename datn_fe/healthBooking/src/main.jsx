import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './styles/global.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from './components/admin/layout/layout.admin.jsx'
import User from './pages/admin/user.jsx'
import Doctor from './pages/admin/doctor.jsx'
import LayoutPatient from './components/patient/layout/layout.patient.jsx'
import Dashboard from './pages/admin/dashboard.jsx'
import Homepage from './pages/patient/homepage.jsx'
import DoctorList from './pages/patient/list.doctors.jsx'
import Specialization from './pages/patient/specialization.jsx'
import Hospital from './pages/patient/hospital.jsx'
import DoctorDetail from './pages/patient/view.doctor.detail.jsx'
import Login from './pages/auth/login.jsx'
import Register from './pages/auth/register.jsx'
import Profile from './pages/patient/profile.jsx'
import BookAppointment from './pages/patient/book.appointment.jsx'
import AppointmentHistory from './pages/patient/appointment.history.jsx'
import ForgotPassword from './pages/auth/forget.password.jsx'
import LayoutDoctor from './components/doctor/layout/layout.doctor.jsx'
import DashboardDoctor from './pages/doctor/dashboard.jsx'
import Schedule from './pages/doctor/schedule.jsx'
import ListPatient from './pages/doctor/patient.jsx'
import Message from './pages/doctor/message.jsx'
import ProfileDoctor from './pages/doctor/profile.jsx'
import ListHospitalAdmin from './pages/admin/hospital.jsx'
import HospitalDetail from './pages/patient/hospital.detail.jsx'

const router = createBrowserRouter([
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard/>
      },
      {
        path: "/admin/users",
        element: <User />
      },
      {
        path: "/admin/doctors",
        element: <Doctor />
      },
      {
        path: "/admin/hospitals",
        element: <ListHospitalAdmin />
      }
    ]
  },
  {
    path: "/doctor",
    element: <LayoutDoctor />,
    children: [
      {
        index: true,
        element: <DashboardDoctor/>
      },
      {
        path: "/doctor/schedule",
        element: <Schedule />
      },
      {
        path: "/doctor/patient",
        element: <ListPatient />
      },
      {
        path: "/doctor/chat",
        element: <Message />
      },
      {
        path: "/doctor/profile",
        element: <ProfileDoctor />
      }
    ]
  },
  {
    path: "/",
    element: <LayoutPatient />,
    children: [
      {
        index: true,
        element: <Homepage/>
      },
      {
        path: "/doctors",
        element: <DoctorList />
      },
      {
        path: "/specialization",
        element: <Specialization />
      },
      {
        path: "/hospital",
        element: <Hospital />
      },
      {
        path: "/hospital/:id",
        element: <HospitalDetail />
      },
      {
        path: "/view",
        element: <DoctorDetail />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/appointmenthistory",
        element: <AppointmentHistory />
      },
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
]);
createRoot(document.getElementById('root')).render(


      <RouterProvider router={router} />
)
