import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PrivateRoutes from "./route/PrivateRoutes";
import OtpProtectedRoute from "./route/OtpProtectedRoute";
import RoleRoute from "./route/RoleRoute";
const Login = lazy(() => import("./pages/Login"));
const DashBoard = lazy(() => import("./pages/DashBoard"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const OtpVerify = lazy(() => import("./pages/OtpVerify"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const UpdateUserProfile = lazy(() => import("./pages/UpdateUserProfile"));
const ListOfAssetTypes = lazy(() => import("./pages/ListOfAssetTypes"));
const ListOfAssets = lazy(() => import("./pages/ListOfAssets"));
const ListOfEmployeesPage = lazy(() => import("./pages/ListOfEmployees"));
const ListOfCustomers = lazy(() => import("./pages/ListOfCustomers"));
function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verify" element={<OtpVerify />} />
          <Route element={<OtpProtectedRoute />}>
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>
          <Route path="/" element={<PrivateRoutes />}>
            <Route index element={<Navigate to="/main-page" />} />
            <Route path="main-page" element={<DashBoard />} />
            <Route path="user-profile" element={<UserProfile />} />
            <Route path="update-user-profile" element={<UpdateUserProfile />} />
            <Route element={<RoleRoute />}> 
            <Route path="asset-type-management" element={<ListOfAssetTypes />} />
            <Route path="asset-management" element={<ListOfAssets />} />
            <Route path="employee-management" element={<ListOfEmployeesPage />} />
            <Route path="borrower-management" element={<ListOfCustomers />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
