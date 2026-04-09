import { Navigate } from "react-router-dom";
import UnauthorizedPage from "../pages/auth/unauthorized";

const getUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = getUser();

  if (!user) return <Navigate to="/login" replace />;

  const roleName = user.role?.name;

  // Admin vào được hết
  if (roleName === "ROLE_ADMIN") return children;

  // Không có quyền → hiện trang 403
  if (!allowedRoles.includes(roleName)) return <UnauthorizedPage />;

  return children;
};

export default ProtectedRoute;