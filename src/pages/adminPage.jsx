import { Link, useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import {useState} from "react";
import {toast } from "react-hot-toast"

import axios from "axios";


import AdminProductPage from "./admin/adminProductPage";
import AddProductPage from "./admin/addProductPage";
import EditProductPage from "./admin/productPageEdit";
import AdminOrderPage from "./admin/adminOrderPage";
import { useEffect } from "react";
import Loading from "../components/loading";

export default function AdminPage() {

  const location = useLocation();
  const path = location.pathname;
  const [status,setStatus]=useState("loading");

  useEffect(()=>{
    const token=localStorage.getItem("token");
    if(!token){
      setStatus("unauthenticated");
      window.location.href="/login";

    }
    else{

      axios.get(import.meta.env.VITE_BACKEND_URL+"/api/user",{
        headers:{
          Authorization:`Bearer ${token}`
        }
      }).then((res)=>{
        if(res.data.role!=="admin"){
          setStatus("unauthorized");
          toast.error("you are not authorized to access this page");
          
          window.location.href="/";

        }else{
          setStatus("authenticated");


        }
      }).catch((err)=>{
        setStatus("unauthenticated");
        toast.error("you are not authorized to access this page,please login first");

        window.location.href="/login";
        console.error(err);


      })
      

    }


  },[status])

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
{status == "loading"  || status == "unauthenticated" ? <Loading/> : (
      <>

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
    </>)
}

    </div>
  );
}