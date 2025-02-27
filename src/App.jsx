import React, { lazy, Suspense } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store";
import ProtectedRoute from "./components/Protected/ProtectedRoute";
import Loader from "./components/Loader";
import { Layout } from "./components/Layout/Layout";
import "./App.css";
import "./index.css";

import {  useLayoutEffect } from 'react';
import { useLocation } from 'react-router';

const ScrollToTop = ({ children }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return children;
};



// Lazy Load Components
const Home = lazy(() => import("./components/Home"));
const Products = lazy(() => import("./components/Products"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ContactPage = lazy(() => import("./pages/Contact"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ProductPage = lazy(() => import("./pages/AddProduct"));
const AllProducts = lazy(() => import("./pages/AllProducts"));
const AdminProfile = lazy(() => import("./components/AdminProfile"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const SuccessOrderPage = lazy(() => import("./pages/SuccessOrderPage"));
const Spin = lazy(() => import("./pages/Spinwheel"));
const OfferManagement = lazy(() => import("./pages/Offers"));
const ProductDescription = lazy(() => import("./pages/ProductDescription"));
const PaymentSuccess = lazy(() => import("./pages/Payment-Success"));

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Loader />
          <Suspense fallback={<div>Loading...</div>}>
          <ScrollToTop>
            <Routes>
              <Route
                path="/"
                element={
                  Layout ? (
                    <Layout.main>
                      <Home />
                    </Layout.main>
                  ) : (
                    <Home />
                  )
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/products"
                element={
                  Layout ? (
                    <Layout.main>
                      <Products />
                    </Layout.main>
                  ) : (
                    <Products />
                  )
                }
              />
              <Route
                path="/contact"
                element={
                  Layout ? (
                    <Layout.main>
                      <ContactPage />
                    </Layout.main>
                  ) : (
                    <ContactPage />
                  )
                }
              />
              <Route
                path="/product/description/:productName/:productId"
                element={
                  Layout ? (
                    <Layout.main>
                      <ProductDescription />
                    </Layout.main>
                  ) : (
                    <ProductDescription />
                  )
                }
              />
              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute>
                    {Layout ? (
                      <Layout.main>
                        <MyOrders />
                      </Layout.main>
                    ) : (
                      <MyOrders />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  Layout ? (
                    <Layout.main>
                      <ForgotPassword />
                    </Layout.main>
                  ) : (
                    <ForgotPassword />
                  )
                }
              />
              <Route
                path="/reset-password"
                element={
                  Layout ? (
                    <Layout.main>
                      <ResetPassword />
                    </Layout.main>
                  ) : (
                    <ResetPassword />
                  )
                }
              />
              {/* Protected Routes */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    {Layout ? (
                      <Layout.main>
                        <Checkout />
                      </Layout.main>
                    ) : (
                      <Checkout />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    {Layout ? (
                      <Layout.main>
                        <ProfilePage />
                      </Layout.main>
                    ) : (
                      <ProfilePage />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-product"
                element={
                  <ProtectedRoute>
                    {Layout ? (
                      <Layout.admin>
                        <ProductPage />
                      </Layout.admin>
                    ) : (
                      <ProductPage />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/all-products"
                element={
                  <ProtectedRoute>
                    {Layout ? (
                      <Layout.admin>
                        <AllProducts />
                      </Layout.admin>
                    ) : (
                      <AllProducts />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/all-orders"
                element={
                  <ProtectedRoute>
                    {Layout ? (
                      <Layout.admin>
                        <AdminOrders />
                      </Layout.admin>
                    ) : (
                      <AdminOrders />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/adminProfile"
                element={
                  <ProtectedRoute>
                    {Layout ? (
                      <Layout.admin>
                        <AdminProfile />
                      </Layout.admin>
                    ) : (
                      <AdminProfile />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/success-page"
                element={
                  Layout ? (
                    <Layout.main>
                      <SuccessOrderPage />
                    </Layout.main>
                  ) : (
                    <SuccessOrderPage />
                  )
                }
              />
              <Route
                path="/spin"
                element={
                  Layout ? (
                    <Layout.main>
                      <Spin />
                    </Layout.main>
                  ) : (
                    <Spin />
                  )
                }
              />
              <Route
                path="/offers"
                element={
                  <ProtectedRoute>
                    {Layout ? (
                      <Layout.admin>
                        <OfferManagement />
                      </Layout.admin>
                    ) : (
                      <OfferManagement />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-success"
                element={
                  <ProtectedRoute>
                    <PaymentSuccess />
                  </ProtectedRoute>
                }
              />
            </Routes>
            </ScrollToTop>
          </Suspense>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}