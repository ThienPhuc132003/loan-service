import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
function RoleRoute() {
  const isEmployee = Cookies.get("role") === "employee";
  return isEmployee ? <Outlet /> : <Navigate to="/main-page" />;
}

export default RoleRoute;
