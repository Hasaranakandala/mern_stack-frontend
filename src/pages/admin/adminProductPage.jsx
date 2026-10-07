import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  FaTrash,
} from "react-icons/fa";

import {
  MdEditDocument,
} from "react-icons/md";

import toast from "react-hot-toast";

import Loading from "../../components/loading";

/*
=========================================================
VELMORA — PRODUCT MANAGEMENT
=========================================================

Primary Violet   #6C5CE7
Soft Lavender    #B8A1FF
Soft Rose        #F2B8C6
Champagne        #EADBC8
Warm Ivory       #FAF9F7
Surface          #FFFFFF
Charcoal         #2F3136
Muted Text       #6B7280

Success          #4F9D7A
Warning          #D99A3E
Error            #D95C5C

Admin direction:
Quiet Luxury
Professional
Structured
Beauty-focused
Mobile-first
=========================================================
*/

/* =========================================================
   SMALL ICONS
========================================================= */

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-4-4" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M4 4v6h6" />
      <path d="M20 20v-6h-6" />
      <path d="M5.6 15A7 7 0 0 0 18 18.4" />
      <path d="M18.4 9A7 7 0 0 0 6 5.6" />
    </svg>
  );
}

function ProductIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="m12 3 8 4-8 4-8-4 8-4Z" />
      <path d="m4 7 8 4 8-4" />
      <path d="M4 7v10l8 4 8-4V7" />
      <path d="M12 11v10" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

/* =========================================================
   ADMIN PRODUCT PAGE
========================================================= */

export default function AdminProductPage() {
  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isRefreshing,
    setIsRefreshing,
  ] = useState(false);

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    stockFilter,
    setStockFilter,
  ] = useState("all");

  const navigate =
    useNavigate();

  /* =====================================================
     FORMAT MONEY
  ===================================================== */

  function formatMoney(
    value
  ) {
    return Number(
      value || 0
    ).toLocaleString(
      "en-LK",
      {
        minimumFractionDigits:
          2,

        maximumFractionDigits:
          2,
      }
    );
  }

  /* =====================================================
     GET PRODUCTS
  ===================================================== */

  async function fetchProducts(
    showToast = false
  ) {
    try {
      const response =
        await axios.get(
          import.meta.env
            .VITE_BACKEND_URL +
            "/api/product"
        );

      setProducts(
        Array.isArray(
          response.data
        )
          ? response.data
          : []
      );

      if (showToast) {
        toast.success(
          "Velmora products refreshed"
        );
      }
    } catch (error) {
      console.error(
        "GET PRODUCTS ERROR:",
        error
      );

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to load Velmora products"
      );
    } finally {
      setIsLoading(false);

      setIsRefreshing(
        false
      );
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =====================================================
     REFRESH PRODUCTS
  ===================================================== */

  async function refreshProducts() {
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(
      true
    );

    await fetchProducts(
      true
    );
  }

  /* =====================================================
     DELETE PRODUCT
  ===================================================== */

  async function deleteProducts(
    productId
  ) {
    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      toast.error(
        "Please sign in first"
      );

      return;
    }

    const selectedProduct =
      products.find(
        (product) =>
          product.productId ===
          productId
      );

    const shouldDelete =
      window.confirm(
        `Delete ${
          selectedProduct
            ?.productName ||
          "this product"
        } from Velmora?\n\nThis action cannot be undone.`
      );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingId(
        productId
      );

      await axios.delete(
        import.meta.env
          .VITE_BACKEND_URL +
          "/api/product/" +
          productId,

        {
          headers: {
            Authorization:
              "Bearer " +
              token,
          },
        }
      );

      setProducts(
        (
          previousProducts
        ) =>
          previousProducts.filter(
            (product) =>
              product.productId !==
              productId
          )
      );

      toast.success(
        "Velmora product deleted successfully"
      );
    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to delete product"
      );
    } finally {
      setDeletingId(
        null
      );
    }
  }

  /* =====================================================
     EDIT PRODUCT
  ===================================================== */

  function editProduct(
    product
  ) {
    navigate(
      "/admin/edit-product",
      {
        state: product,
      }
    );
  }

  /* =====================================================
     PRODUCT ANALYTICS
  ===================================================== */

  const inStockProducts =
    useMemo(
      () =>
        products.filter(
          (product) =>
            Number(
              product.stock
            ) > 0
        ),
      [products]
    );

  const lowStockProducts =
    useMemo(
      () =>
        products.filter(
          (product) => {
            const stock =
              Number(
                product.stock
              );

            return (
              stock > 0 &&
              stock <= 5
            );
          }
        ),
      [products]
    );

  const outOfStockProducts =
    useMemo(
      () =>
        products.filter(
          (product) =>
            Number(
              product.stock
            ) <= 0
        ),
      [products]
    );

  /* =====================================================
     SEARCH + FILTER
  ===================================================== */

  const filteredProducts =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      return products.filter(
        (product) => {
          const alternativeNames =
            Array.isArray(
              product.alternativeName
            )
              ? product.alternativeName.join(
                  " "
                )
              : product.alternativeName ||
                "";

          const matchesSearch =
            searchValue ===
              "" ||
            product.productId
              ?.toLowerCase()
              .includes(
                searchValue
              ) ||
            product.productName
              ?.toLowerCase()
              .includes(
                searchValue
              ) ||
            alternativeNames
              .toLowerCase()
              .includes(
                searchValue
              );

          const stock =
            Number(
              product.stock
            );

          let matchesStock =
            true;

          if (
            stockFilter ===
            "available"
          ) {
            matchesStock =
              stock > 0;
          }

          if (
            stockFilter ===
            "low"
          ) {
            matchesStock =
              stock > 0 &&
              stock <= 5;
          }

          if (
            stockFilter ===
            "out"
          ) {
            matchesStock =
              stock <= 0;
          }

          return (
            matchesSearch &&
            matchesStock
          );
        }
      );
    }, [
      products,
      search,
      stockFilter,
    ]);

  /* =====================================================
     STOCK STYLE
  ===================================================== */

  function getStockStyle(
    stock
  ) {
    const value =
      Number(stock);

    if (value <= 0) {
      return {
        label:
          "Out of Stock",

        className:
          "border-[#F1D5DA] bg-[#FFF2F4] text-[#B45462]",
      };
    }

    if (value <= 5) {
      return {
        label: `${value} Low Stock`,

        className:
          "border-[#F1DFC1] bg-[#FFF8EC] text-[#A87328]",
      };
    }

    return {
      label: `${value} Available`,

      className:
        "border-[#D5E9DF] bg-[#EDF7F2] text-[#478465]",
    };
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (isLoading) {
    return (
      <Loading
        message="Preparing the Velmora collection..."
        fullScreen={false}
      />
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div
      className="
        relative

        min-h-screen
        w-full

        overflow-x-hidden

        bg-[#FAF9F7]

        p-3

        sm:p-5

        lg:p-7

        xl:p-8
      "
    >
      {/* =================================================
          BACKGROUND ATMOSPHERE
      ================================================= */}

      <div
        className="
          pointer-events-none

          absolute
          -left-36
          -top-28

          h-[380px]
          w-[380px]

          rounded-full

          bg-[#B8A1FF]/8

          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none

          absolute
          -right-36
          top-[520px]

          h-[400px]
          w-[400px]

          rounded-full

          bg-[#F2B8C6]/7

          blur-[130px]
        "
      />

      <div
        className="
          relative
          z-10

          mx-auto
          w-full
          max-w-[1500px]

          animate-[velmoraProductsEnter_0.4s_ease-out]
        "
      >
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <section
          className="
            relative

            mb-5

            overflow-hidden

            rounded-[26px]

            border
            border-[#E9E2F0]

            bg-gradient-to-r
            from-[#F5F1FF]
            via-white
            to-[#FFF3F7]

            p-5

            shadow-[0_16px_50px_rgba(63,48,84,0.05)]

            sm:mb-6
            sm:rounded-[30px]
            sm:p-6
          "
        >
          <div
            className="
              pointer-events-none

              absolute
              -right-20
              -top-20

              h-52
              w-52

              rounded-full

              bg-[#B8A1FF]/14

              blur-3xl
            "
          />

          <div
            className="
              relative

              flex
              flex-col
              gap-5

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2

                  rounded-full

                  border
                  border-[#DED5F4]

                  bg-white/75

                  px-3
                  py-1.5

                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.18em]

                  text-[#6C5CE7]

                  sm:text-[10px]
                "
              >
                <span
                  className="
                    text-[#B9955B]
                  "
                >
                  ✦
                </span>

                Velmora
                Catalogue
                Management
              </div>

              <h1
                className="
                  mt-3

                  text-2xl
                  font-extrabold
                  tracking-[-0.04em]

                  text-[#2F3136]

                  sm:text-3xl

                  lg:text-[34px]
                "
              >
                Beauty
                Collection
              </h1>

              <p
                className="
                  mt-2

                  max-w-2xl

                  text-xs
                  leading-6

                  text-[#78717D]

                  sm:text-sm
                "
              >
                Curate,
                maintain and
                refine the
                products that
                define the
                Velmora
                shopping
                experience.
              </p>
            </div>

            <div
              className="
                flex
                w-full
                flex-col
                gap-2

                sm:w-auto
                sm:flex-row
              "
            >
              <button
                type="button"
                onClick={
                  refreshProducts
                }
                disabled={
                  isRefreshing
                }
                className="
                  group

                  flex
                  min-h-[46px]
                  w-full
                  items-center
                  justify-center
                  gap-2

                  rounded-xl

                  border
                  border-[#DAD1EC]

                  bg-white

                  px-4

                  text-sm
                  font-bold
                  text-[#625A68]

                  shadow-sm

                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:border-[#C8B9F2]
                  hover:text-[#6C5CE7]
                  hover:shadow-md

                  active:scale-[0.98]

                  disabled:cursor-not-allowed
                  disabled:opacity-60

                  sm:w-auto
                "
              >
                <span
                  className={`
                    ${
                      isRefreshing
                        ? "animate-spin"
                        : "transition-transform duration-500 group-hover:rotate-180"
                    }
                  `}
                >
                  <RefreshIcon />
                </span>

                {isRefreshing
                  ? "Refreshing..."
                  : "Refresh"}
              </button>

              <Link
                to="/admin/add-product"
                className="
                  flex
                  min-h-[46px]
                  w-full
                  items-center
                  justify-center
                  gap-2

                  rounded-xl

                  bg-gradient-to-r
                  from-[#6C5CE7]
                  to-[#8F78EA]

                  px-5

                  text-sm
                  font-bold
                  text-white

                  shadow-[0_10px_24px_rgba(108,92,231,0.22)]

                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:shadow-[0_14px_32px_rgba(108,92,231,0.30)]

                  active:scale-[0.98]

                  sm:w-auto
                "
              >
                <PlusIcon />

                Add Product
              </Link>
            </div>
          </div>
        </section>

        {/* =================================================
            METRICS
        ================================================= */}

        <section
          className="
            mb-5

            grid
            grid-cols-2
            gap-3

            lg:grid-cols-4
            lg:gap-4
          "
        >
          <ProductMetric
            title="Total Products"
            value={
              products.length
            }
            type="total"
          />

          <ProductMetric
            title="Available"
            value={
              inStockProducts.length
            }
            type="available"
          />

          <ProductMetric
            title="Low Stock"
            value={
              lowStockProducts.length
            }
            type="low"
          />

          <ProductMetric
            title="Out of Stock"
            value={
              outOfStockProducts.length
            }
            type="out"
          />
        </section>

        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        <section
          className="
            mb-5

            rounded-[24px]

            border
            border-[#E9E3EF]

            bg-white

            p-4

            shadow-[0_12px_38px_rgba(63,48,84,0.04)]

            sm:p-5
          "
        >
          <div
            className="
              flex
              flex-col
              gap-3

              md:flex-row
              md:items-center
            "
          >
            {/* SEARCH */}

            <div
              className="
                relative
                flex-1
              "
            >
              <div
                className="
                  pointer-events-none

                  absolute
                  left-3
                  top-1/2

                  flex
                  h-9
                  w-9
                  -translate-y-1/2
                  items-center
                  justify-center

                  rounded-xl

                  bg-[#F2EDFF]

                  text-[#6C5CE7]
                "
              >
                <SearchIcon />
              </div>

              <input
                type="text"
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event
                      .target
                      .value
                  )
                }
                placeholder="Search product name, ID or alternative name..."
                className="
                  min-h-[52px]
                  w-full

                  rounded-2xl

                  border
                  border-[#DDD7E2]

                  bg-white

                  pl-[58px]
                  pr-4

                  text-sm
                  text-[#39333E]

                  outline-none

                  transition-all
                  duration-300

                  placeholder:text-[#AAA3AF]

                  hover:border-[#CFC5D8]

                  focus:border-[#B8A1FF]
                  focus:ring-4
                  focus:ring-[#B8A1FF]/15
                "
              />
            </div>

            {/* STOCK FILTER */}

            <select
              value={
                stockFilter
              }
              onChange={(
                event
              ) =>
                setStockFilter(
                  event.target
                    .value
                )
              }
              className="
                min-h-[52px]
                w-full

                rounded-2xl

                border
                border-[#DDD7E2]

                bg-white

                px-4

                text-sm
                font-semibold
                text-[#625B67]

                outline-none

                transition-all
                duration-300

                focus:border-[#B8A1FF]
                focus:ring-4
                focus:ring-[#B8A1FF]/15

                md:w-[205px]
              "
            >
              <option value="all">
                All Inventory
              </option>

              <option value="available">
                Available
              </option>

              <option value="low">
                Low Stock
              </option>

              <option value="out">
                Out of Stock
              </option>
            </select>
          </div>

          <div
            className="
              mt-3

              flex
              flex-col
              gap-2

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <p
              className="
                text-[10px]
                text-[#99919D]

                sm:text-xs
              "
            >
              Showing{" "}
              <span
                className="
                  font-bold
                  text-[#6C5CE7]
                "
              >
                {
                  filteredProducts.length
                }
              </span>{" "}
              of{" "}
              {
                products.length
              }{" "}
              products
            </p>

            {(search ||
              stockFilter !==
                "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");

                  setStockFilter(
                    "all"
                  );
                }}
                className="
                  self-start

                  text-xs
                  font-bold
                  text-[#6C5CE7]

                  transition-colors

                  hover:text-[#5544C5]
                  hover:underline

                  sm:self-auto
                "
              >
                Clear Filters
              </button>
            )}
          </div>
        </section>

        {/* =================================================
            EMPTY DATABASE
        ================================================= */}

        {products.length ===
        0 ? (
          <section
            className="
              flex
              min-h-[400px]
              flex-col
              items-center
              justify-center

              rounded-[26px]

              border
              border-[#E8E1EF]

              bg-gradient-to-br
              from-[#FBF9FF]
              via-white
              to-[#FFF4F7]

              px-5
              py-12

              text-center

              shadow-[0_15px_45px_rgba(63,48,84,0.04)]
            "
          >
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center

                rounded-[20px]

                bg-gradient-to-br
                from-[#6C5CE7]
                to-[#B8A1FF]

                text-white

                shadow-[0_12px_30px_rgba(108,92,231,0.22)]
              "
            >
              <ProductIcon />
            </div>

            <p
              className="
                mt-5

                text-[9px]
                font-black
                uppercase
                tracking-[0.19em]

                text-[#927CE4]
              "
            >
              Velmora
              Collection
            </p>

            <h2
              className="
                mt-2

                text-xl
                font-extrabold
                tracking-[-0.02em]

                text-[#39333E]

                sm:text-2xl
              "
            >
              Your beauty
              collection is
              ready to begin.
            </h2>

            <p
              className="
                mx-auto
                mt-3

                max-w-md

                text-sm
                leading-7
                text-[#89818D]
              "
            >
              Add the first
              Velmora product
              and start
              building a
              refined,
              carefully
              curated beauty
              catalogue.
            </p>

            <Link
              to="/admin/add-product"
              className="
                mt-6

                inline-flex
                min-h-[48px]
                items-center
                justify-center
                gap-2

                rounded-xl

                bg-gradient-to-r
                from-[#6C5CE7]
                to-[#8F78EA]

                px-6

                text-sm
                font-bold
                text-white

                shadow-[0_10px_24px_rgba(108,92,231,0.22)]

                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:shadow-[0_15px_32px_rgba(108,92,231,0.30)]

                active:scale-[0.98]
              "
            >
              <PlusIcon />

              Add First Product
            </Link>
          </section>
        ) : filteredProducts.length ===
          0 ? (
          /* ===============================================
             FILTER EMPTY
          =============================================== */

          <section
            className="
              flex
              min-h-[340px]
              flex-col
              items-center
              justify-center

              rounded-[26px]

              border
              border-[#E8E1EF]

              bg-white

              px-5
              py-10

              text-center

              shadow-[0_12px_38px_rgba(63,48,84,0.04)]
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-2xl

                bg-[#F2EDFF]

                text-[#6C5CE7]
              "
            >
              <SearchIcon />
            </div>

            <h2
              className="
                mt-4

                text-lg
                font-extrabold
                text-[#39333E]
              "
            >
              No matching
              products.
            </h2>

            <p
              className="
                mt-2

                max-w-sm

                text-sm
                leading-6
                text-[#918996]
              "
            >
              Try another
              product name or
              change the
              inventory
              filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");

                setStockFilter(
                  "all"
                );
              }}
              className="
                mt-5

                min-h-[44px]

                rounded-xl

                bg-[#6C5CE7]

                px-5

                text-sm
                font-bold
                text-white

                transition-all

                hover:bg-[#5949CF]

                active:scale-[0.98]
              "
            >
              Clear Filters
            </button>
          </section>
        ) : (
          <>
            {/* =============================================
                MOBILE PRODUCT CARDS
            ============================================= */}

            <section
              className="
                grid
                grid-cols-1
                gap-4

                md:hidden
              "
            >
              {filteredProducts.map(
                (product) => {
                  const stockInfo =
                    getStockStyle(
                      product.stock
                    );

                  const hasDiscount =
                    Number(
                      product.labelPrice
                    ) >
                    Number(
                      product.price
                    );

                  return (
                    <article
                      key={
                        product.productId
                      }
                      className="
                        overflow-hidden

                        rounded-[24px]

                        border
                        border-[#E8E1EF]

                        bg-white

                        shadow-[0_12px_38px_rgba(63,48,84,0.045)]

                        transition-all
                        duration-300

                        hover:border-[#D8CCF0]
                        hover:shadow-[0_18px_45px_rgba(90,69,123,0.08)]
                      "
                    >
                      {/* TOP */}

                      <div
                        className="
                          flex
                          gap-4

                          p-4
                        "
                      >
                        {/* IMAGE */}

                        <div
                          className="
                            relative
                            h-24
                            w-24
                            shrink-0

                            overflow-hidden

                            rounded-2xl

                            border
                            border-[#EAE4EE]

                            bg-gradient-to-br
                            from-[#FAF8FF]
                            to-[#FFF4F7]
                          "
                        >
                          {product.images?.[0] ? (
                            <img
                              src={
                                product
                                  .images?.[0]
                              }
                              alt={
                                product.productName
                              }
                              className="
                                h-full
                                w-full

                                object-cover

                                transition-transform
                                duration-500

                                hover:scale-105
                              "
                            />
                          ) : (
                            <div
                              className="
                                flex
                                h-full
                                w-full
                                items-center
                                justify-center

                                text-[#9A85E4]
                              "
                            >
                              <ProductIcon />
                            </div>
                          )}

                          {hasDiscount && (
                            <span
                              className="
                                absolute
                                left-1.5
                                top-1.5

                                rounded-full

                                bg-white/90

                                px-2
                                py-1

                                text-[8px]
                                font-bold
                                text-[#B46079]

                                shadow-sm

                                backdrop-blur-md
                              "
                            >
                              Offer
                            </span>
                          )}
                        </div>

                        {/* CONTENT */}

                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >
                          <p
                            className="
                              text-[9px]
                              font-black
                              uppercase
                              tracking-[0.12em]
                              text-[#927CE4]
                            "
                          >
                            {
                              product.productId
                            }
                          </p>

                          <h2
                            className="
                              mt-1

                              line-clamp-2

                              text-base
                              font-extrabold
                              leading-snug

                              text-[#39333E]
                            "
                          >
                            {
                              product.productName
                            }
                          </h2>

                          <div
                            className="
                              mt-3

                              flex
                              flex-wrap
                              items-center
                              gap-2
                            "
                          >
                            <span
                              className="
                                text-base
                                font-extrabold
                                text-[#6C5CE7]
                              "
                            >
                              Rs.{" "}
                              {formatMoney(
                                product.price
                              )}
                            </span>

                            {hasDiscount && (
                              <span
                                className="
                                  text-[10px]
                                  text-[#A69EA9]
                                  line-through
                                "
                              >
                                Rs.{" "}
                                {formatMoney(
                                  product.labelPrice
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* STOCK */}

                      <div
                        className="
                          px-4
                          pb-4
                        "
                      >
                        <span
                          className={`
                            inline-flex

                            rounded-full

                            border

                            px-3
                            py-1.5

                            text-[10px]
                            font-bold

                            ${stockInfo.className}
                          `}
                        >
                          {
                            stockInfo.label
                          }
                        </span>
                      </div>

                      {/* ACTIONS */}

                      <div
                        className="
                          flex
                          gap-2

                          border-t
                          border-[#EEE9F2]

                          bg-[#FCFAFD]

                          p-3
                        "
                      >
                        <button
                          type="button"
                          onClick={() =>
                            editProduct(
                              product
                            )
                          }
                          className="
                            flex
                            min-h-[46px]
                            flex-1
                            items-center
                            justify-center
                            gap-2

                            rounded-xl

                            border
                            border-[#DDD5F2]

                            bg-[#F4F0FF]

                            text-sm
                            font-bold
                            text-[#6C5CE7]

                            transition-all
                            duration-200

                            hover:bg-[#ECE5FF]

                            active:scale-[0.98]
                          "
                        >
                          <MdEditDocument className="text-[18px]" />

                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={
                            deletingId ===
                            product.productId
                          }
                          onClick={() =>
                            deleteProducts(
                              product.productId
                            )
                          }
                          className="
                            flex
                            min-h-[46px]
                            flex-1
                            items-center
                            justify-center
                            gap-2

                            rounded-xl

                            border
                            border-[#F0D6DB]

                            bg-[#FFF3F5]

                            text-sm
                            font-bold
                            text-[#B45462]

                            transition-all
                            duration-200

                            hover:bg-[#FFE9ED]

                            active:scale-[0.98]

                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >
                          {deletingId ===
                          product.productId ? (
                            <span
                              className="
                                h-4
                                w-4

                                animate-spin

                                rounded-full

                                border-2
                                border-[#E4AAB4]
                                border-t-[#B45462]
                              "
                            />
                          ) : (
                            <FaTrash className="text-[14px]" />
                          )}

                          {deletingId ===
                          product.productId
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </article>
                  );
                }
              )}
            </section>

            {/* =============================================
                TABLET / DESKTOP
            ============================================= */}

            <section
              className="
                hidden

                overflow-hidden

                rounded-[26px]

                border
                border-[#E8E1EF]

                bg-white

                shadow-[0_15px_48px_rgba(63,48,84,0.045)]

                md:block
              "
            >
              {/* TABLE HEADER */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4

                  border-b
                  border-[#EEE9F2]

                  px-5
                  py-5

                  lg:px-6
                "
              >
                <div>
                  <p
                    className="
                      text-[9px]
                      font-black
                      uppercase
                      tracking-[0.17em]

                      text-[#927CE4]
                    "
                  >
                    Velmora
                    Catalogue
                  </p>

                  <h2
                    className="
                      mt-1

                      text-lg
                      font-extrabold
                      text-[#2F3136]
                    "
                  >
                    Product
                    Inventory
                  </h2>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-[#918996]
                    "
                  >
                    Manage
                    pricing,
                    imagery and
                    inventory.
                  </p>
                </div>

                <span
                  className="
                    flex
                    min-w-[38px]
                    h-9
                    items-center
                    justify-center

                    rounded-full

                    border
                    border-[#E0D7F3]

                    bg-[#F5F1FF]

                    px-3

                    text-xs
                    font-bold
                    text-[#6C5CE7]
                  "
                >
                  {
                    filteredProducts.length
                  }
                </span>
              </div>

              <div
                className="
                  w-full
                  overflow-x-auto
                "
              >
                <table
                  className="
                    w-full
                    min-w-[950px]

                    text-left
                    text-sm
                  "
                >
                  <thead
                    className="
                      border-b
                      border-[#EAE4EE]

                      bg-[#F8F5FB]
                    "
                  >
                    <tr
                      className="
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.07em]
                        text-[#827A87]
                      "
                    >
                      <th className="px-5 py-4">
                        Product ID
                      </th>

                      <th className="px-5 py-4">
                        Product
                      </th>

                      <th className="px-5 py-4">
                        Image
                      </th>

                      <th className="px-5 py-4">
                        Label
                        Price
                      </th>

                      <th className="px-5 py-4">
                        Selling
                        Price
                      </th>

                      <th className="px-5 py-4">
                        Stock
                      </th>

                      <th className="px-5 py-4 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody
                    className="
                      divide-y
                      divide-[#F0EBF3]
                    "
                  >
                    {filteredProducts.map(
                      (
                        product
                      ) => {
                        const stockInfo =
                          getStockStyle(
                            product.stock
                          );

                        const hasDiscount =
                          Number(
                            product.labelPrice
                          ) >
                          Number(
                            product.price
                          );

                        return (
                          <tr
                            key={
                              product.productId
                            }
                            className="
                              transition-colors
                              duration-200

                              hover:bg-[#FCFAFD]
                            "
                          >
                            {/* ID */}

                            <td className="px-5 py-4">
                              <span
                                className="
                                  inline-flex

                                  rounded-lg

                                  bg-[#F5F1FF]

                                  px-3
                                  py-1.5

                                  text-xs
                                  font-bold
                                  text-[#6C5CE7]
                                "
                              >
                                {
                                  product.productId
                                }
                              </span>
                            </td>

                            {/* NAME */}

                            <td
                              className="
                                min-w-[190px]
                                px-5
                                py-4
                              "
                            >
                              <p
                                className="
                                  font-bold
                                  text-[#39333E]
                                "
                              >
                                {
                                  product.productName
                                }
                              </p>

                              {Array.isArray(
                                product.alternativeName
                              ) &&
                                product
                                  .alternativeName
                                  .length >
                                  0 && (
                                  <p
                                    className="
                                      mt-1

                                      max-w-[220px]

                                      truncate

                                      text-[10px]
                                      text-[#99919D]
                                    "
                                  >
                                    {
                                      product.alternativeName.join(
                                        ", "
                                      )
                                    }
                                  </p>
                                )}
                            </td>

                            {/* IMAGE */}

                            <td className="px-5 py-4">
                              <div
                                className="
                                  h-16
                                  w-16

                                  overflow-hidden

                                  rounded-xl

                                  border
                                  border-[#E8E1ED]

                                  bg-[#FAF8FC]
                                "
                              >
                                {product
                                  .images?.[0] ? (
                                  <img
                                    src={
                                      product
                                        .images?.[0]
                                    }
                                    alt={
                                      product.productName
                                    }
                                    className="
                                      h-full
                                      w-full
                                      object-cover
                                    "
                                  />
                                ) : (
                                  <div
                                    className="
                                      flex
                                      h-full
                                      w-full
                                      items-center
                                      justify-center
                                      text-[#9C88E3]
                                    "
                                  >
                                    <ProductIcon />
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* LABEL PRICE */}

                            <td
                              className="
                                whitespace-nowrap
                                px-5
                                py-4

                                text-[#9E96A2]
                              "
                            >
                              {hasDiscount ? (
                                <span className="line-through">
                                  Rs.{" "}
                                  {formatMoney(
                                    product.labelPrice
                                  )}
                                </span>
                              ) : (
                                <span>
                                  Rs.{" "}
                                  {formatMoney(
                                    product.labelPrice
                                  )}
                                </span>
                              )}
                            </td>

                            {/* PRICE */}

                            <td
                              className="
                                whitespace-nowrap
                                px-5
                                py-4
                              "
                            >
                              <span
                                className="
                                  font-extrabold
                                  text-[#6C5CE7]
                                "
                              >
                                Rs.{" "}
                                {formatMoney(
                                  product.price
                                )}
                              </span>
                            </td>

                            {/* STOCK */}

                            <td
                              className="
                                whitespace-nowrap
                                px-5
                                py-4
                              "
                            >
                              <span
                                className={`
                                  inline-flex

                                  rounded-full

                                  border

                                  px-3
                                  py-1.5

                                  text-[10px]
                                  font-bold

                                  ${stockInfo.className}
                                `}
                              >
                                {
                                  stockInfo.label
                                }
                              </span>
                            </td>

                            {/* ACTIONS */}

                            <td
                              className="
                                px-5
                                py-4
                              "
                            >
                              <div
                                className="
                                  flex
                                  items-center
                                  justify-center
                                  gap-2
                                "
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    editProduct(
                                      product
                                    )
                                  }
                                  title="Edit product"
                                  aria-label={`Edit ${product.productName}`}
                                  className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center

                                    rounded-xl

                                    border
                                    border-[#DDD5F2]

                                    bg-[#F4F0FF]

                                    text-[#6C5CE7]

                                    transition-all
                                    duration-200

                                    hover:-translate-y-0.5
                                    hover:bg-[#ECE5FF]

                                    active:scale-95
                                  "
                                >
                                  <MdEditDocument className="text-[19px]" />
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    deletingId ===
                                    product.productId
                                  }
                                  onClick={() =>
                                    deleteProducts(
                                      product.productId
                                    )
                                  }
                                  title="Delete product"
                                  aria-label={`Delete ${product.productName}`}
                                  className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center

                                    rounded-xl

                                    border
                                    border-[#F0D6DB]

                                    bg-[#FFF3F5]

                                    text-[#B45462]

                                    transition-all
                                    duration-200

                                    hover:-translate-y-0.5
                                    hover:bg-[#FFE9ED]

                                    active:scale-95

                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                  "
                                >
                                  {deletingId ===
                                  product.productId ? (
                                    <span
                                      className="
                                        h-4
                                        w-4

                                        animate-spin

                                        rounded-full

                                        border-2
                                        border-[#E4AAB4]
                                        border-t-[#B45462]
                                      "
                                    />
                                  ) : (
                                    <FaTrash className="text-[15px]" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {/* TABLE FOOTER */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4

                  border-t
                  border-[#EEE9F2]

                  bg-[#FCFAFD]

                  px-5
                  py-4

                  lg:px-6
                "
              >
                <p
                  className="
                    text-xs
                    text-[#99919D]
                  "
                >
                  Curate every
                  Velmora
                  listing with
                  clear imagery,
                  pricing and
                  stock
                  information.
                </p>

                <Link
                  to="/admin/add-product"
                  className="
                    inline-flex
                    min-h-[42px]
                    shrink-0
                    items-center
                    justify-center
                    gap-2

                    rounded-xl

                    bg-gradient-to-r
                    from-[#6C5CE7]
                    to-[#8F78EA]

                    px-4

                    text-xs
                    font-bold
                    text-white

                    shadow-[0_8px_20px_rgba(108,92,231,0.20)]

                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:shadow-[0_12px_26px_rgba(108,92,231,0.28)]
                  "
                >
                  <PlusIcon />

                  Add Product
                </Link>
              </div>
            </section>
          </>
        )}

        {/* =================================================
            ANIMATION
        ================================================= */}

        <style>{`
          @keyframes velmoraProductsEnter {
            from {
              opacity: 0;
              transform: translateY(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-\\[velmoraProductsEnter_0\\.4s_ease-out\\] {
              animation: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

/* =========================================================
   METRIC CARD
========================================================= */

function ProductMetric({
  title,
  value,
  type,
}) {
  const styles = {
    total: {
      card:
        "border-[#E0D7F5] bg-[#F7F4FF]",

      icon:
        "bg-[#6C5CE7] text-white",
    },

    available: {
      card:
        "border-[#D7EADF] bg-[#F2F9F5]",

      icon:
        "bg-[#DCEFE5] text-[#478465]",
    },

    low: {
      card:
        "border-[#F1E2C6] bg-[#FFF9EF]",

      icon:
        "bg-[#FFF0D2] text-[#A87328]",
    },

    out: {
      card:
        "border-[#F0D6DB] bg-[#FFF4F5]",

      icon:
        "bg-[#F9DCE1] text-[#B45462]",
    },
  };

  const current =
    styles[type] ||
    styles.total;

  return (
    <div
      className={`
        rounded-[20px]

        border

        p-3.5

        transition-all
        duration-300

        hover:-translate-y-0.5
        hover:shadow-md

        sm:p-4

        ${current.card}
      `}
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-2
        "
      >
        <p
          className="
            text-[9px]
            font-semibold
            leading-4
            text-[#7C7581]

            sm:text-xs
          "
        >
          {title}
        </p>

        <div
          className={`
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center

            rounded-xl

            ${current.icon}
          `}
        >
          <ProductIcon />
        </div>
      </div>

      <p
        className="
          mt-3

          text-lg
          font-extrabold
          tracking-[-0.025em]

          text-[#39333E]

          sm:text-xl
        "
      >
        {value}
      </p>
    </div>
  );
}