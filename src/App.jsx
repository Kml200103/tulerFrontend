import "./App.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./components/Home";
import { Layout } from "./components/Layout/Layout";
import Products from "./components/Products";
import About from "./components/About";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
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
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
