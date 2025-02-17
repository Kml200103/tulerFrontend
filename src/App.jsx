import "./App.css";
import { Provider } from "react-redux";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./components/Home";
import { Layout } from "./components/Layout/Layout";
import Products from "./components/Products";
import About from "./components/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ContactPage from "./pages/Contact";
import Checkout from "./pages/Checkout";
import ProfilePage from "./pages/Profile";
import Loader from "./components/Loader";
import MyOrders from "./pages/MyOrders";
import { ResetPassword } from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/Protected/ProtectedRoute";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store";
import ProductPage from "./pages/AddProduct";
import AllProducts from "./pages/AllProducts";
import AdminProfile from "./components/AdminProfile";
import AdminOrders from "./pages/AdminOrders";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Loader />
          <Routes>
            <Route path="/" element={<Home />} />
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
              path="/about"
              element={
                Layout ? (
                  <Layout.main>
                    <About />
                  </Layout.main>
                ) : (
                  <About />
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
              path="/my-orders"
              element={
                <ProtectedRoute>
                  {Layout ? (
                    <Layout.main>
                      <MyOrders />
                    </Layout.main>
                  ) : (
                    <MyOrders />
                  )
                  }
                </ProtectedRoute>}
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
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}
