import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
    "/admin/register-user",  // Added this path for the new route
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
              <Route
                path="/"
                element={
                  <>
                    <Hero />
                    <Content />
                    <Opportunities />
                  </>
                }
              />
              {/* <Route path="/login" element={<Login />} /> */}
              <Route path="/register" element={<Register/>} />
              {/* <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} /> */}
              <Route path="/menu" element={<MenuManagement />} />
              {/* <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
              <Route path="/customer/dashboard" element={<CustomerDashboard />} /> */}
              <Route path="/customer" element={<CustomerPage />} />
              <Route path="/restaurant" element={<RestaurantPage />} />
              <Route path="/delivery" element={<DeliveryPage />} />
              <Route element={<PrivateRoute />}/>
              <Route path="/admin" element={<AdminDashboard />}></Route>
              <Route path="/admin/add-delivery" element={<AddDeliveryForm />} />
              <Route path="/admin/register-user" element={<RegisterForm />} /> {/* Added new route for RegisterForm */}
              <Route path="/auth" element={<Login />} />
              <Route path="/admin/add-restaurant" element={<AddRestaurantForm />} />
              <Route path="/restaurants" element={<RestaurantList />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/subscribe/delivery" element={<DeliveryApplication />} />
              <Route path="/subscribe/partenaire" element={<PartnerRequest />} />
            </Routes>
          </Layout>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;