import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import AddOrder from "./pages/AddOrder";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import Designs from "./pages/Designs";
import AddDesign from "./pages/AddDesign";
import Login from "./pages/Login";
import { DataProvider } from "./context/DataContext";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/customers" replace />;
  }

  return children;
};

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarWidth = isSidebarOpen ? "250px" : "80px";

  return (
    <DataProvider>
      <div className="app" style={{ display: "flex" }}>
        {!isLoginPage && (
          <Sidebar
            isOpen={isSidebarOpen}
            toggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        )}
        <div className="main" style={{
          marginLeft: isLoginPage ? "0" : sidebarWidth,
          width: isLoginPage ? "100%" : `calc(100% - ${sidebarWidth})`,
          minHeight: "100vh",
          transition: "margin-left 0.3s ease, width 0.3s ease",
          flex: 1
        }}>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/orders" element={
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <Orders />
              </ProtectedRoute>
            } />

            <Route path="/add-order" element={
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <AddOrder />
              </ProtectedRoute>
            } />

            <Route path="/sales" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Sales />
              </ProtectedRoute>
            } />

            <Route path="/customers" element={
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <Customers />
              </ProtectedRoute>
            } />

            <Route path="/designs" element={
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <Designs />
              </ProtectedRoute>
            } />

            <Route path="/add-design" element={
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <AddDesign />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </DataProvider>
  );
}

export default App;
