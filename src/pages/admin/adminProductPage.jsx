import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
import toast from "react-hot-toast";

import Loading from "../../components/loading";

export default function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      axios
        .get(
          import.meta.env.VITE_BACKEND_URL +
            "/api/product"
        )
        .then((res) => {
          console.log(res.data);

          setProducts(res.data);

          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);

          setIsLoading(false);
        });
    }
  }, [isLoading]);

  function deleteProducts(productId) {
    const token =
      localStorage.getItem("token");

    if (token == null) {
      toast.error("Please login first!");
      return;
    }

    axios
      .delete(
        import.meta.env.VITE_BACKEND_URL +
          "/api/product/" +
          productId,
        {
          headers: {
            Authorization:
              "Bearer " + token,
          },
        }
      )
      .then(() => {
        toast.success(
          "Product deleted successfully!"
        );

        setIsLoading(true);
      })
      .catch((e) => {
        toast.error(
          e.response?.data?.message ||
            "Failed to delete product"
        );
      });
  }

  return (
    <div
      className="
        w-full
        min-h-full
        bg-gray-50

        p-3
        sm:p-4
        md:p-5
        lg:p-6
      "
    >
     

      <div
        className="
          mb-5
          sm:mb-6

          flex
          flex-col
          sm:flex-row

          sm:items-center
          sm:justify-between

          gap-3
        "
      >
        <div>
          <h1
            className="
              text-xl
              sm:text-2xl
              lg:text-3xl

              font-bold
              text-gray-800
            "
          >
            Products
          </h1>

          <p
            className="
              mt-1
              text-xs
              sm:text-sm
              text-gray-500
            "
          >
            Manage your products
          </p>
        </div>

        {/* DESKTOP ADD PRODUCT */}

        <Link
          to="/admin/add-product"
          className="
            hidden
            sm:inline-flex

            items-center
            justify-center

            bg-green-500
            hover:bg-green-600

            text-white
            text-sm
            font-semibold

            px-5
            py-2.5

            rounded-xl

            shadow-sm

            transition-all
            duration-200

            hover:shadow-md
            active:scale-[0.98]
          "
        >
          + Add Product
        </Link>
      </div>

    

      {isLoading ? (
        <div
          className="
            w-full
            min-h-[400px]

            flex
            items-center
            justify-center
          "
        >
          <Loading
            message="Loading products..."
            fullScreen={false}
          />
        </div>
      ) : products.length === 0 ? (
        

        <div
          className="
            bg-white

            rounded-2xl

            border
            border-gray-200

            shadow-sm

            min-h-[350px]

            flex
            flex-col

            items-center
            justify-center

            text-center

            px-5
            py-10
          "
        >
          <div
            className="
              w-16
              h-16

              bg-gray-100

              rounded-full

              flex
              items-center
              justify-center

              text-3xl

              mb-4
            "
          >
            📦
          </div>

          <h2
            className="
              text-lg
              sm:text-xl

              font-bold
              text-gray-800
            "
          >
            No products found
          </h2>

          <p
            className="
              mt-2

              text-sm
              text-gray-500
            "
          >
            Add your first product to get
            started.
          </p>

          <Link
            to="/admin/add-product"
            className="
              mt-5

              bg-green-500
              hover:bg-green-600

              text-white
              text-sm
              font-semibold

              px-5
              py-2.5

              rounded-xl

              transition-all
              duration-200
            "
          >
            + Add Product
          </Link>
        </div>
      ) : (
        <>
      

          <div
            className="
              md:hidden

              grid
              grid-cols-1

              gap-3
              sm:gap-4
            "
          >
            {products.map((product) => (
              <div
                key={product.productId}
                className="
                  w-full

                  bg-white

                  rounded-2xl

                  border
                  border-gray-200

                  shadow-sm

                  overflow-hidden

                  transition-all
                  duration-200

                  hover:shadow-md
                "
              >
                

                <div
                  className="
                    flex
                    gap-4

                    p-4
                  "
                >
                  {/* IMAGE */}

                  <img
                    src={
                      product.images?.[0]
                    }
                    alt={
                      product.productName
                    }
                    className="
                      w-20
                      h-20

                      sm:w-24
                      sm:h-24

                      shrink-0

                      object-cover

                      rounded-xl

                      border
                      border-gray-200
                    "
                  />

                  {/* PRODUCT DETAILS */}

                  <div
                    className="
                      flex-1
                      min-w-0
                    "
                  >
                    <p
                      className="
                        text-[11px]
                        text-gray-400

                        font-medium
                      "
                    >
                      ID:{" "}
                      {
                        product.productId
                      }
                    </p>

                    <h2
                      className="
                        mt-1

                        text-base
                        sm:text-lg

                        font-bold
                        text-gray-800

                        line-clamp-2
                      "
                    >
                      {
                        product.productName
                      }
                    </h2>

                    {/* PRICES */}

                    <div
                      className="
                        mt-2

                        flex
                        flex-wrap

                        items-center

                        gap-2
                      "
                    >
                      <span
                        className="
                          text-sm
                          font-bold
                          text-green-600
                        "
                      >
                        Rs.{" "}
                        {product.price}
                      </span>

                      <span
                        className="
                          text-xs
                          text-gray-400
                          line-through
                        "
                      >
                        Rs.{" "}
                        {
                          product.labelPrice
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* STOCK */}

                <div
                  className="
                    px-4
                    pb-3
                  "
                >
                  <span
                    className={
                      product.stock > 0
                        ? `
                          inline-flex

                          px-3
                          py-1

                          rounded-full

                          bg-green-100
                          text-green-700

                          text-[11px]
                          font-semibold
                        `
                        : `
                          inline-flex

                          px-3
                          py-1

                          rounded-full

                          bg-red-100
                          text-red-700

                          text-[11px]
                          font-semibold
                        `
                    }
                  >
                    {product.stock > 0
                      ? `${product.stock} Available`
                      : "Out of Stock"}
                  </span>
                </div>

                {/* ACTIONS */}

                <div
                  className="
                    flex
                    gap-2

                    px-4
                    py-3

                    border-t
                    border-gray-100

                    bg-gray-50/70
                  "
                >
                  {/* EDIT */}

                  <button
                    type="button"
                    onClick={() => {
                      navigate(
                        "/admin/edit-product",
                        {
                          state:
                            product,
                        }
                      );
                    }}
                    className="
                      flex-1

                      h-11

                      flex
                      items-center
                      justify-center

                      gap-2

                      rounded-xl

                      bg-blue-50
                      text-blue-600

                      border
                      border-blue-100

                      text-sm
                      font-semibold

                      transition-all
                      duration-200

                      active:scale-[0.98]
                    "
                  >
                    <MdEditDocument
                      className="
                        text-[18px]
                      "
                    />

                    Edit
                  </button>

                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={() =>
                      deleteProducts(
                        product.productId
                      )
                    }
                    className="
                      flex-1

                      h-11

                      flex
                      items-center
                      justify-center

                      gap-2

                      rounded-xl

                      bg-red-50
                      text-red-600

                      border
                      border-red-100

                      text-sm
                      font-semibold

                      transition-all
                      duration-200

                      active:scale-[0.98]
                    "
                  >
                    <FaTrash
                      className="
                        text-[15px]
                      "
                    />

                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* =========================================
              TABLET / DESKTOP TABLE
              md and above
          ========================================== */}

          <div
            className="
              hidden
              md:block

              w-full

              bg-white

              rounded-2xl

              shadow-sm

              border
              border-gray-200

              overflow-hidden
            "
          >
            <div
              className="
                w-full
                overflow-x-auto
              "
            >
              <table
                className="
                  w-full
                  min-w-[850px]

                  text-sm
                  text-left
                "
              >
                <thead
                  className="
                    bg-gray-100

                    border-b
                    border-gray-200
                  "
                >
                  <tr>
                    <th className="px-4 lg:px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">
                      Product ID
                    </th>

                    <th className="px-4 lg:px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">
                      Product Name
                    </th>

                    <th className="px-4 lg:px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">
                      Product Image
                    </th>

                    <th className="px-4 lg:px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">
                      Label Price
                    </th>

                    <th className="px-4 lg:px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">
                      Price
                    </th>

                    <th className="px-4 lg:px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">
                      Stock
                    </th>

                    <th className="px-4 lg:px-6 py-4 font-semibold text-gray-600 text-center whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody
                  className="
                    divide-y
                    divide-gray-200
                  "
                >
                  {products.map(
                    (product) => (
                      <tr
                        key={
                          product.productId
                        }
                        className="
                          hover:bg-gray-50

                          transition-colors
                          duration-150
                        "
                      >
                        {/* ID */}

                        <td
                          className="
                            px-4
                            lg:px-6

                            py-4

                            font-medium
                            text-gray-700

                            whitespace-nowrap
                          "
                        >
                          {
                            product.productId
                          }
                        </td>

                        {/* NAME */}

                        <td
                          className="
                            px-4
                            lg:px-6

                            py-4

                            font-semibold
                            text-gray-800

                            min-w-[160px]
                          "
                        >
                          {
                            product.productName
                          }
                        </td>

                        {/* IMAGE */}

                        <td
                          className="
                            px-4
                            lg:px-6

                            py-4
                          "
                        >
                          <img
                            src={
                              product
                                .images?.[0]
                            }
                            alt={
                              product.productName
                            }
                            className="
                              w-14
                              h-14

                              lg:w-16
                              lg:h-16

                              object-cover

                              rounded-lg

                              border
                              border-gray-200
                            "
                          />
                        </td>

                        {/* LABEL PRICE */}

                        <td
                          className="
                            px-4
                            lg:px-6

                            py-4

                            text-gray-500
                            line-through

                            whitespace-nowrap
                          "
                        >
                          Rs.{" "}
                          {
                            product.labelPrice
                          }
                        </td>

                        {/* PRICE */}

                        <td
                          className="
                            px-4
                            lg:px-6

                            py-4

                            font-semibold
                            text-green-600

                            whitespace-nowrap
                          "
                        >
                          Rs.{" "}
                          {product.price}
                        </td>

                        {/* STOCK */}

                        <td
                          className="
                            px-4
                            lg:px-6

                            py-4

                            whitespace-nowrap
                          "
                        >
                          <span
                            className={
                              product.stock >
                              0
                                ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold"
                                : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold"
                            }
                          >
                            {product.stock >
                            0
                              ? `${product.stock} Available`
                              : "Out of Stock"}
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td
                          className="
                            px-4
                            lg:px-6

                            py-4
                          "
                        >
                          <div
                            className="
                              flex
                              justify-center
                              items-center

                              gap-2
                            "
                          >
                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                deleteProducts(
                                  product.productId
                                )
                              }
                              className="
                                w-10
                                h-10

                                flex
                                items-center
                                justify-center

                                rounded-lg

                                bg-red-50
                                text-red-600

                                border
                                border-red-100

                                hover:bg-red-100

                                transition-all
                                duration-200

                                active:scale-95
                              "
                              title="Delete product"
                            >
                              <FaTrash
                                className="
                                  text-[16px]
                                "
                              />
                            </button>

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  "/admin/edit-product",
                                  {
                                    state:
                                      product,
                                  }
                                )
                              }
                              className="
                                w-10
                                h-10

                                flex
                                items-center
                                justify-center

                                rounded-lg

                                bg-blue-50
                                text-blue-600

                                border
                                border-blue-100

                                hover:bg-blue-100

                                transition-all
                                duration-200

                                active:scale-95
                              "
                              title="Edit product"
                            >
                              <MdEditDocument
                                className="
                                  text-[20px]
                                "
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* DESKTOP BOTTOM BUTTON */}

            <div
              className="
                flex
                justify-end

                p-5

                border-t
                border-gray-200

                bg-gray-50/50
              "
            >
              <Link
                to="/admin/add-product"
                className="
                  bg-green-500
                  hover:bg-green-600

                  text-white
                  font-semibold

                  px-5
                  py-2.5

                  rounded-xl

                  shadow-sm

                  transition-all
                  duration-200

                  hover:shadow-md

                  active:scale-[0.98]
                "
              >
                + Add Product
              </Link>
            </div>
          </div>

     

          <div
            className="
              md:hidden

              mt-4
            "
          >
            <Link
              to="/admin/add-product"
              className="
                w-full

                h-12

                flex
                items-center
                justify-center

                bg-green-500
                hover:bg-green-600

                text-white
                text-sm
                font-semibold

                rounded-xl

                shadow-sm

                transition-all
                duration-200

                active:scale-[0.98]
              "
            >
              + Add Product
            </Link>
          </div>
        </>
      )}
    </div>
  );
}