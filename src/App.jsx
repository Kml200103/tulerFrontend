import "./App.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./components/Home";
import { Layout } from "./components/Layout/Layout";
import Products from "./components/Products";
import About from "./components/About";
import Login from "./pages/Login";

import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/Register";
import ContactPage from "./pages/Contact";
import Checkout from "./pages/Checkout";

import ProfilePage from "./pages/Profile";

import Loader from "./components/Loader";
import MyOrders from "./pages/MyOrders";

import { ResetPassword } from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";

export default function App() {
  return (
    <Provider store={store}>
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
            path="/checkout"
            element={
              Layout ? (
                <Layout.main>
                  <Checkout />
                </Layout.main>
              ) : (
                <Checkout />
              )
            }
          />
          <Route
            path="/profile"
            element={
              Layout ? (
                <Layout.main>
                  <ProfilePage />
                </Layout.main>
              ) : (
                <ProfilePage />
              )
            }
          />
          <Route
            path="/my-orders"
            element={
              Layout ? (
                <Layout.main>
                  <MyOrders />
                </Layout.main>
              ) : (
                <MyOrders />
              )
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
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
