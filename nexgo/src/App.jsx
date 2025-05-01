import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./component/Header";
import Hero from "./component/Hero";
import Content from "./component/Content";
import Opportunities from "./component/Opportunities";
import Footer from "./component/Footer";
import AddRestaurantForm from "./component/AddRestaurantForm";
import RestaurantList from "./component/RestaurantList";
import AdminDashboard from "./component/dashboard/AdminDashboard";
import Login from "./component/Login";
import PrivateRoute from "./component/PrivateRoute";
import OrderPage from "./component/OrderPage";
import DeliveryApplication from "./component/DeliveryApplication";
import AddDeliveryForm from "./component/AddDeliveryForm";
// import RestaurantDashboard from "./pages/RestaurantDashboard";
// import DeliveryDashboard from "./pages/DeliveryDashboard";
// import CustomerDashboard from "./pages/CustomerDashboard";
import Register from "./component/Register";
import MenuManagement from "./layouts/Menu";
import PartnerRequest from "./component/PartnerRequest";
import CustomerPage from "./page/CustomerPage";
import RestaurantPage from "./page/RestaurantPage";
import DeliveryPage from "./page/DeliveryPage";
import RegisterForm from "./component/dashboard/RegisterForm";
import AuthGuard from "./component/AuthGuard";
import ProtectedRoute from "./component/ProtectedRoute";

function Layout({ children }) {
  const location = useLocation();
  const hideHeaderFooter = [
    "/login", 
    "/register", 
    "/auth",
    "/customer", 
    "/restaurant", 
    "/delivery",
    "/admin/add-delivery", 
    "/admin/add-restaurant",
    "/admin/register-user",
    "/restaurant/dashboard", 
    "/menu", 
    "/delivery/dashboard", 
    "/customer/dashboard", 
    "/subscribe/delivery", 
    "/order", 
    "/admin", 
    "/subscribe/partenaire"
  ].includes(location.pathname);
  
  return (
    <>
      {!hideHeaderFooter && <Header />}
      <main>{children}</main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/register" element={<Register/>} />
              <Route path="/auth" element={<Login />} />
              <Route path="/restaurants" element={<RestaurantList />} />
              <Route path="/subscribe/delivery" element={<DeliveryApplication />} />
              <Route path="/subscribe/partenaire" element={<PartnerRequest />} />
              
              {/* Home page with components */}
              <Route 
                path="/home" 
                element={
                  <>
                    <Hero />
                    <Content />
                    <Opportunities />
                  </>
                }
              />

              {/* Protected admin routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute allowedRole="admin">
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/dashboard" element={<Navigate to="/admin" />} />
                    <Route path="/add-delivery" element={<AddDeliveryForm />} />
                    <Route path="/add-restaurant" element={<AddRestaurantForm />} />
                    <Route path="/register-user" element={<RegisterForm />} />
                  </Routes>
                </ProtectedRoute>
              } />

              {/* Restaurant protected routes */}
              <Route path="/restaurant/*" element={
                <ProtectedRoute allowedRole="restaurant">
                  <Routes>
                    <Route path="/" element={<RestaurantPage />} />
                    <Route path="/dashboard" element={<Navigate to="/restaurant" />} />
                    <Route path="/menu" element={<MenuManagement />} />
                  </Routes>
                </ProtectedRoute>
              } />

              {/* Delivery protected routes */}
              <Route path="/delivery/*" element={
                <ProtectedRoute allowedRole="delivery">
                  <Routes>
                    <Route path="/" element={<DeliveryPage />} />
                    <Route path="/dashboard" element={<Navigate to="/delivery" />} />
                  </Routes>
                </ProtectedRoute>
              } />

              {/* Customer protected routes */}
              <Route path="/customer/*" element={
                <ProtectedRoute allowedRole="customer">
                  <Routes>
                    <Route path="/" element={<CustomerPage />} />
                    <Route path="/dashboard" element={<Navigate to="/customer" />} />
                    <Route path="/order" element={<OrderPage />} />
                  </Routes>
                </ProtectedRoute>
              } />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Layout>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;