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
import Register from "./pages/Register";
import ContactPage from "./pages/Contact";
import Checkout from "./pages/Checkout";
import ProfilePage from "./pages/Profile";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/Protected/ProtectedRoute";

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
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
