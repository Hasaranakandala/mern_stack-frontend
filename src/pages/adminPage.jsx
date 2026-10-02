import {
  Link,
  useLocation,
  useNavigate,
  Routes,
  Route,
} from "react-router-dom";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import AdminProductPage from "./admin/adminProductPage";
import AddProductPage from "./admin/addProductPage";
import EditProductPage from "./admin/productPageEdit";
import AdminOrderPage from "./admin/adminOrderPage";
import Loading from "../components/loading";


export default function AdminPage() {

  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname;

  const [status, setStatus] = useState("loading");


  // ============================================
  // DECODE JWT TOKEN
  // ============================================

  function decodeToken(token) {
    try {
      const payload = token.split(".")[1];

      const decodedPayload = atob(
        payload.replace(/-/g, "+").replace(/_/g, "/")
      );

      return JSON.parse(decodedPayload);

    } catch (error) {
      console.error("Token decode error:", error);
      return null;
    }
  }


  // ============================================
  // CHECK ADMIN
  // ============================================

  useEffect(() => {

    const checkAdmin = () => {

      const token = localStorage.getItem("token");


      // ========================================
      // NO TOKEN
      // ========================================

      if (!token) {

        setStatus("unauthenticated");

        toast.error("Please login first");

        navigate("/login", {
          replace: true,
        });

        return;
      }


      // ========================================
      // DECODE TOKEN
      // ========================================

      const decodedUser = decodeToken(token);

      console.log("Decoded user:", decodedUser);


      // Invalid token
      if (!decodedUser) {

        localStorage.removeItem("token");

        setStatus("unauthenticated");

        toast.error(
          "Invalid login session. Please login again."
        );

        navigate("/login", {
          replace: true,
        });

        return;
      }


      // ========================================
      // CHECK TOKEN EXPIRATION
      // ========================================

      if (
        decodedUser.exp &&
        decodedUser.exp * 1000 < Date.now()
      ) {

        localStorage.removeItem("token");

        setStatus("unauthenticated");

        toast.error(
          "Your session has expired. Please login again."
        );

        navigate("/login", {
          replace: true,
        });

        return;
      }


      // ========================================
      // CHECK ADMIN ROLE
      // ========================================

      if (decodedUser.role !== "admin") {

        setStatus("unauthorized");

        toast.error(
          "You are not authorized to access this page"
        );

        navigate("/", {
          replace: true,
        });

        return;
      }


      // ========================================
      // ADMIN AUTHENTICATED
      // ========================================

      console.log("Admin authenticated successfully");

      setStatus("authenticated");
    };


    checkAdmin();

  }, [navigate]);


  // ============================================
  // SIDEBAR ACTIVE CLASS
  // ============================================

  function getClass(name) {

    const baseClass =
      "w-full px-5 py-3 rounded-xl transition-all duration-200 " +
      "flex items-center cursor-pointer ";

    if (path.includes(name)) {

      return (
        baseClass +
        "bg-accent text-white shadow-md"
      );

    }

    return (
      baseClass +
      "text-accent hover:bg-gray-100 hover:translate-x-1"
    );
  }


  // ============================================
  // LOADING
  // ============================================

  if (status === "loading") {
    return <Loading />;
  }


  // ============================================
  // DON'T SHOW ADMIN PANEL TO NON-ADMIN
  // ============================================

  if (status !== "authenticated") {
    return <Loading />;
  }


  // ============================================
  // ADMIN PANEL
  // ============================================

  return (

    <div className="w-full h-screen flex bg-[#FBFBFB]">


      {/* ================= SIDEBAR ================= */}

      <div
        className="
          h-full
          w-[300px]
          bg-white
          border-r
          border-gray-200
          shadow-sm
          flex
          flex-col
          px-5
          py-8
        "
      >

        {/* ADMIN TITLE */}

        <div className="mb-10 px-2">

          <h1 className="text-2xl font-bold text-[#393E46]">
            Admin Panel
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Management Dashboard
          </p>

        </div>


        {/* NAVIGATION LINKS */}

        <div className="flex flex-col gap-3 text-base font-semibold">


          <Link
            to="/admin/products"
            className={getClass("products")}
          >
            Products
          </Link>


          <Link
            to="/admin/users"
            className={getClass("users")}
          >
            Users
          </Link>


          <Link
            to="/admin/orders"
            className={getClass("orders")}
          >
            Orders
          </Link>


          <Link
            to="/admin/reviews"
            className={getClass("reviews")}
          >
            Reviews
          </Link>


        </div>

      </div>


      {/* ================= PAGE CONTENT ================= */}

      <div
        className="
          h-full
          flex-1
          overflow-y-auto
          bg-[#F8F9FA]
        "
      >

        <Routes>


          <Route
            path="products"
            element={<AdminProductPage />}
          />


          <Route
            path="orders"
            element={<AdminOrderPage />}
          />


          <Route
            path="users"
            element={
              <h1 className="p-10 text-2xl font-bold">
                Users
              </h1>
            }
          />


          <Route
            path="add-product"
            element={<AddProductPage />}
          />


          <Route
            path="edit-product"
            element={<EditProductPage />}
          />


          <Route
            path="reviews"
            element={
              <h1 className="p-10 text-2xl font-bold">
                Reviews
              </h1>
            }
          />


        </Routes>

      </div>

    </div>
  );
}