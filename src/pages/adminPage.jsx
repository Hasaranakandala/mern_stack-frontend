import {
  Link,
  Route,
  Routes,
  useLocation,
   Navigate,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import { jwtDecode } from "jwt-decode";

import Loading from "../components/loading";

import AdminDashboardPage from "./admin/adminDashboardPage";

import AdminProductPage from "./admin/adminProductPage";

import AddProductPage from "./admin/addProductPage";

import EditProductPage from "./admin/productPageEdit";

import AdminOrderPage from "./admin/adminOrderPage";

import AdminUserPage from "./admin/adminUserPage";

import AdminReviewPage from "./admin/adminReviewPage";

export default function AdminPage() {
  const location = useLocation();

  const navigate =
    useNavigate();

  const path =
    location.pathname;

  const [
    status,
    setStatus,
  ] = useState("loading");

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  // =====================================================
  // CHECK ADMIN LOGIN
  // =====================================================

  useEffect(() => {
    function checkAdmin() {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        setStatus(
          "unauthenticated"
        );

        toast.error(
          "Please login first"
        );

        navigate(
          "/login",
          {
            replace: true,
          }
        );

        return;
      }

      try {
        const decoded =
          jwtDecode(token);

        if (
          decoded.exp &&
          decoded.exp * 1000 <
            Date.now()
        ) {
          localStorage.removeItem(
            "token"
          );

          toast.error(
            "Your session has expired"
          );

          setStatus(
            "unauthenticated"
          );

          navigate(
            "/login",
            {
              replace: true,
            }
          );

          return;
        }

        if (
          decoded.role !==
          "admin"
        ) {
          toast.error(
            "You are not authorized to access this page"
          );

          setStatus(
            "unauthorized"
          );

          navigate(
            "/",
            {
              replace: true,
            }
          );

          return;
        }

        setStatus(
          "authenticated"
        );
      } catch (error) {
        console.error(
          "Invalid token:",
          error
        );

        localStorage.removeItem(
          "token"
        );

        setStatus(
          "unauthenticated"
        );

        toast.error(
          "Invalid login session"
        );

        navigate(
          "/login",
          {
            replace: true,
          }
        );
      }
    }

    checkAdmin();
  }, [navigate]);

  // =====================================================
  // CLOSE SIDEBAR AFTER ROUTE CHANGE
  // =====================================================

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // =====================================================
  // LOCK BACKGROUND SCROLL
  // =====================================================

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [sidebarOpen]);

  // =====================================================
  // ESC KEY
  // =====================================================

  useEffect(() => {
    function handleEscape(
      event
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setSidebarOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  function handleLogout() {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "cart"
    );

    window.dispatchEvent(
      new Event(
        "auth-updated"
      )
    );

    window.dispatchEvent(
      new Event(
        "cart-updated"
      )
    );

    toast.success(
      "Logged out successfully"
    );

    navigate("/");
  }

  // =====================================================
  // ROUTE ACTIVE CHECK
  // =====================================================

  function isDashboardActive() {
    return (
      path === "/admin" ||
      path === "/admin/"
    );
  }

  function isRouteActive(
    route
  ) {
    return path.startsWith(
      `/admin/${route}`
    );
  }

  // =====================================================
  // NAVIGATION CLASS
  // =====================================================

  function navigationClass(
    active
  ) {
    const base = `
      group

      relative

      w-full

      px-4
      py-3

      rounded-xl

      flex
      items-center
      gap-3

      text-sm
      font-semibold

      overflow-hidden

      transition-all
      duration-300
    `;

    if (active) {
      return (
        base +
        `
          bg-[#B8A1FF]
          text-white

          shadow-md

          translate-x-1
        `
      );
    }

    return (
      base +
      `
        text-[#454B54]

        hover:bg-gray-100
        hover:text-purple-600

        hover:translate-x-1

        active:scale-[0.98]
      `
    );
  }

  // =====================================================
  // ICONS
  // =====================================================

  const DashboardIcon = () => (
    <svg
      className="w-5 h-5 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 4h6v6H4V4zm10 0h6v10h-6V4zM4 14h6v6H4v-6zm10 4h6v2h-6v-2z"
      />
    </svg>
  );

  const ProductIcon = () => (
    <svg
      className="w-5 h-5 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  );

  const UserIcon = () => (
    <svg
      className="w-5 h-5 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m6-4a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0"
      />
    </svg>
  );

  const OrderIcon = () => (
    <svg
      className="w-5 h-5 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12h6m-6 4h6M9 8h6M5 4h14v16H5V4z"
      />
    </svg>
  );

  const ReviewIcon = () => (
    <svg
      className="w-5 h-5 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.956a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.365 2.444a1 1 0 00-.364 1.118l1.285 3.956c.3.921-.755 1.688-1.538 1.118l-3.365-2.444a1 1 0 00-1.176 0l-3.365 2.444c-.783.57-1.838-.197-1.539-1.118l1.286-3.956a1 1 0 00-.364-1.118L4.065 9.383c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69l1.286-3.956z"
      />
    </svg>
  );

  // =====================================================
  // LOADING
  // =====================================================

  if (
    status === "loading"
  ) {
    return <Loading />;
  }

  if (
    status !==
    "authenticated"
  ) {
    return <Loading />;
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      className="
        w-full
        min-h-screen

        bg-[#F8F9FA]
      "
    >
      {/* =================================================
          MOBILE HEADER
      ================================================= */}

      <header
        className="
          lg:hidden

          fixed
          top-0
          left-0
          right-0

          z-40

          h-[70px]

          bg-white/95
          backdrop-blur-md

          border-b
          border-gray-200

          shadow-sm

          px-4
          sm:px-6

          flex
          items-center
          justify-between
        "
      >
        <div>
          <h1
            className="
              text-lg
              sm:text-xl

              font-bold
              text-[#393E46]
            "
          >
            Admin Panel
          </h1>

          <p
            className="
              text-[11px]
              text-gray-400
            "
          >
            Management Dashboard
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setSidebarOpen(true)
          }
          className="
            w-11
            h-11

            rounded-xl

            bg-gray-100

            flex
            items-center
            justify-center

            text-[#393E46]

            hover:bg-[#B8A1FF]
            hover:text-white

            active:scale-90

            transition-all
          "
          aria-label="Open admin menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </header>

      {/* =================================================
          MOBILE BACKDROP
      ================================================= */}

      <div
        onClick={() =>
          setSidebarOpen(false)
        }
        className={`
          lg:hidden

          fixed
          inset-0

          z-40

          bg-black/40
          backdrop-blur-[2px]

          transition-all
          duration-300

          ${
            sidebarOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }
        `}
      />

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed
          top-0
          left-0

          z-50

          h-[100dvh]

          w-[280px]
          sm:w-[300px]

          bg-white

          border-r
          border-gray-200

          shadow-xl
          lg:shadow-sm

          flex
          flex-col

          transition-transform
          duration-300

          lg:translate-x-0

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* ADMIN HEADER */}

        <div
          className="
            shrink-0

            px-5
            pt-7
            pb-5
          "
        >
          <div
            className="
              flex
              items-center
              justify-between

              gap-3
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  w-11
                  h-11

                  shrink-0

                  rounded-xl

                  bg-[#B8A1FF]
                  text-white

                  flex
                  items-center
                  justify-center

                  shadow-md
                "
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A9 9 0 1118.879 17.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>

              <div>
                <h1
                  className="
                    text-xl
                    font-bold

                    text-[#393E46]
                  "
                >
                  Admin Panel
                </h1>

                <p
                  className="
                    mt-0.5

                    text-xs
                    text-gray-400
                  "
                >
                  Management Dashboard
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="
                lg:hidden

                w-9
                h-9

                rounded-lg

                flex
                items-center
                justify-center

                text-gray-500

                hover:bg-red-50
                hover:text-red-500
              "
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* =================================================
            SCROLLABLE SIDEBAR
        ================================================= */}

        <div
          className="
            flex-1
            min-h-0

            overflow-y-auto

            px-5
            pb-4
          "
        >
          <div
            className="
              h-px
              bg-gray-100

              mb-5
            "
          />

          {/* WEBSITE */}

          <p
            className="
              px-3
              mb-2

              text-[11px]

              font-bold
              tracking-[0.16em]

              text-gray-400
            "
          >
            WEBSITE
          </p>

          <Link
            to="/"
            className="
              mb-6

              w-full

              px-4
              py-3.5

              rounded-xl

              border
              border-orange-200

              bg-orange-50
              text-orange-600

              flex
              items-center
              justify-between

              shadow-sm

              hover:bg-orange-100

              transition-all
            "
          >
            <div>
              <p
                className="
                  font-semibold
                "
              >
                View Website
              </p>

              <p
                className="
                  mt-0.5

                  text-[10px]

                  text-orange-500
                "
              >
                Go to customer homepage
              </p>
            </div>

            <span>›</span>
          </Link>

          {/* OVERVIEW */}

          <div
            className="
              h-px
              bg-gray-100

              mb-5
            "
          />

          <p
            className="
              px-3
              mb-2

              text-[11px]

              font-bold
              tracking-[0.16em]

              text-gray-400
            "
          >
            OVERVIEW
          </p>

          <Link
            to="/admin/dashboard"
            className={navigationClass(
              isDashboardActive()
            )}
          >
            <DashboardIcon />

            <span>
              Dashboard
            </span>

            {isDashboardActive() && (
              <span
                className="
                  ml-auto

                  w-2
                  h-2

                  rounded-full

                  bg-white

                  animate-pulse
                "
              />
            )}
          </Link>

          {/* MANAGEMENT */}

          <div
            className="
              h-px
              bg-gray-100

              my-5
            "
          />

          <p
            className="
              px-3
              mb-2

              text-[11px]

              font-bold
              tracking-[0.16em]

              text-gray-400
            "
          >
            MANAGEMENT
          </p>

          <nav
            className="
              flex
              flex-col

              gap-2
            "
          >
            <Link
              to="/admin/products"
              className={navigationClass(
                isRouteActive(
                  "products"
                ) ||
                  isRouteActive(
                    "add-product"
                  ) ||
                  isRouteActive(
                    "edit-product"
                  )
              )}
            >
              <ProductIcon />

              <span>
                Products
              </span>
            </Link>

            <Link
              to="/admin/users"
              className={navigationClass(
                isRouteActive(
                  "users"
                )
              )}
            >
              <UserIcon />

              <span>
                Users
              </span>
            </Link>

            <Link
              to="/admin/orders"
              className={navigationClass(
                isRouteActive(
                  "orders"
                )
              )}
            >
              <OrderIcon />

              <span>
                Orders
              </span>
            </Link>

            <Link
              to="/admin/reviews"
              className={navigationClass(
                isRouteActive(
                  "reviews"
                )
              )}
            >
              <ReviewIcon />

              <span>
                Reviews
              </span>
            </Link>
          </nav>
        </div>

        {/* =================================================
            SIDEBAR BOTTOM
        ================================================= */}

        <div
          className="
            shrink-0

            px-5
            pb-6
            pt-3

            bg-white

            border-t
            border-gray-100
          "
        >
          <button
            type="button"
            onClick={
              handleLogout
            }
            className="
              w-full

              px-4
              py-3

              mb-3

              rounded-xl

              bg-red-50
              text-red-600

              border
              border-red-100

              text-left
              text-sm
              font-semibold

              hover:bg-red-500
              hover:text-white

              transition-all
            "
          >
            Logout
          </button>

          <div
            className="
              p-4

              rounded-xl

              bg-gray-50

              border
              border-gray-100
            "
          >
            <p
              className="
                text-xs
                text-gray-400
              "
            >
              Logged in as
            </p>

            <div
              className="
                flex
                items-center
                gap-2

                mt-1
              "
            >
              <span
                className="
                  w-2
                  h-2

                  rounded-full

                  bg-green-500

                  animate-pulse
                "
              />

              <p
                className="
                  text-sm
                  font-semibold

                  text-[#393E46]
                "
              >
                Administrator
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* =================================================
          PAGE CONTENT
      ================================================= */}

      <main
        className="
          min-h-screen

          bg-[#F8F9FA]

          pt-[70px]
          lg:pt-0

          lg:ml-[300px]
        "
      >
        <div
          key={
            location.pathname
          }
          className="
            min-h-screen

            animate-[adminPageFade_0.25s_ease-out]
          "
        >
          

<Routes>
  <Route
    index
    element={
      <Navigate
        to="dashboard"
        replace
      />
    }
  />

  <Route
    path="dashboard"
    element={<AdminDashboardPage />}
  />

  <Route
    path="products"
    element={<AdminProductPage />}
  />

  <Route
    path="users"
    element={<AdminUserPage />}
  />

  <Route
    path="orders"
    element={<AdminOrderPage />}
  />

  <Route
    path="reviews"
    element={<AdminReviewPage />}
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
    path="*"
    element={
      <Navigate
        to="dashboard"
        replace
      />
    }
  />
</Routes>
        </div>
      </main>

      <style>
        {`
          @keyframes adminPageFade {
            from {
              opacity: 0;
              transform: translateY(5px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}