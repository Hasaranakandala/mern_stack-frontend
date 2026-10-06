import "./App.css";
import { GoogleOAuthProvider } from '@react-oauth/google';


import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import { Toaster, ToastBar } from "react-hot-toast";

import HomePage from "./pages/home";
import CartPage from "./pages/client/cart";
import LoginPage from "./pages/login";
import AdminPage from "./pages/adminPage";
import TestPage from "./pages/test";
import RegisterPage from "./pages/rejister";
import ForgetPassword from "./pages/forgetPassword"
import About from "./pages/about";
import Contact from "./pages/contact";




function App() {
  return (

    <GoogleOAuthProvider clientId="324294888464-cod1o28ki9ckfubr2l70v2qsa0jqia5s.apps.googleusercontent.com">
    <BrowserRouter>

      <Toaster>
        {(t) => (
          <ToastBar
            toast={t}
            style={{
              ...t.style,
              animation: t.visible
                ? "custom-enter 1s ease"
                : "custom-exit 1s ease forwards",
            }}
          />
        )}
      </Toaster>

      <Routes>

        <Route
          path="/login"
          element={<LoginPage />}
        />
        <Route path="/forget" element={
          <ForgetPassword/>
        }/>

        <Route
          path="/signup"
          element={<RegisterPage />}
        />
        <Route
          path="/about"
          element={<About />}
        />
    
        <Route
          path="/contacts"
          element={<Contact />}
        />
        <Route
          path="/testing"
          element={<TestPage />}
        />

        <Route
          path="/admin/*"
          element={<AdminPage />}
        />

        <Route
          path="/cart"
          element={<CartPage />}
        />

        <Route
          path="/*"
          element={<HomePage />}
        />

      </Routes>

    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;