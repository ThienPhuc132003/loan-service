import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PrivateRoutes from "./route/PrivateRoutes";

const Login = lazy(() => import("./pages/Login"));
const LoanMain = lazy(() => import("./pages/LoanMain"));
const Register = lazy(() => import("./pages/Register"));
function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoutes />}>
            <Route index element={<Navigate to="/main-page" />} />
            <Route path="main-page" element={<LoanMain />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
