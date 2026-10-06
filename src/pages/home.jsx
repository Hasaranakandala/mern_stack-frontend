import Header from "../components/Header";
import { Route, Routes } from "react-router-dom";
import ClientHome from "./client/ClientHome";
import ProductPage from "./client/ProductPage";
import ProductOverview from "./client/productOverview";
import CheckOut from "./client/checkOut";
import SearchProductPage from "./client/searchProduct";
import About from "./about";
import Contact from "./contact"


export default function HomePage() {
  return (
    <div
      className="
        w-full
        h-screen
        flex
        flex-col
        bg-[#F8F9FA]
      "
    >
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main
        className="
          flex-1
          min-h-0
          w-full
          overflow-y-auto
          overflow-x-hidden
        "
      >
        <Routes>

          {/* Home */}
        
<Route
  path="/"
  element={<ClientHome />}
/>

          {/* Products */}
          <Route
            path="/products"
            element={<ProductPage />}
          />


          {/* About */}
          <Route
            path="/about"
            element={<About/>}
/>

          {/* Contacts */}
          <Route
            path="/contacts"
            element={<Contact/>}
          />


          {/* Product Overview */}
          <Route
            path="/overview/:id"
            element={<ProductOverview />}
          />


          {/* Checkout */}
          <Route
            path="/checkout"
            element={<CheckOut />}
          />
 <Route
            path="/search"
            element={<SearchProductPage />}
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div
                className="
                  w-full
                  min-h-full
                  flex
                  items-center
                  justify-center
                  px-4
                "
              >
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800">
                    404
                  </h1>

                  <p className="mt-2 text-gray-500">
                    Page not found
                  </p>
                </div>
              </div>
            }
          />

        </Routes>
      </main>
    </div>
  );
}