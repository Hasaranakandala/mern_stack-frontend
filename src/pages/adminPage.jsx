import { Link, useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import AdminProductPage from "./admin/adminProductPage";
import AddProductPage from "./admin/addProductPage";
import EditProductPage from "./admin/productPageEdit";
import AdminOrderPage from "./admin/adminOrderPage";

export default function AdminPage() {

  const location = useLocation();
  const path = location.pathname;

  function getClass(name) {

    const baseClass =
      "w-full px-5 py-3 rounded-xl transition-all duration-200 " +
      "flex items-center cursor-pointer ";

    if (path.includes(name)) {
      return (
        baseClass +
        "bg-accent text-white shadow-md"
      );
    } else {
      return (
        baseClass +
        "text-accent hover:bg-gray-100 hover:translate-x-1"
      );
    }
  }

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

        {/* Admin Title */}

        <div className="mb-10 px-2">

          <h1 className="text-2xl font-bold text-[#393E46]">
            Admin Panel
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Management Dashboard
          </p>

        </div>


        {/* Navigation Links */}

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

      <div className="h-full flex-1 overflow-y-auto bg-[#F8F9FA]">

        <Routes>

          <Route
            path="/products"
            element={<AdminProductPage />}
          />

          <Route
            path="/orders"
            element={<AdminOrderPage/>}
          />

           <Route
            path="/users"
            element={<><h1>users</h1></>}
          />

          <Route
            path="/add-product"
            element={<AddProductPage />}
          />

          <Route
            path="/edit-product"
            element={<EditProductPage />}
          />

        </Routes>

      </div>

    </div>
  );
}