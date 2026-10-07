import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  jwtDecode,
} from "jwt-decode";

import Loading from "../components/loading";

import AdminDashboardPage from "./admin/adminDashboardPage";
import AdminProductPage from "./admin/adminProductPage";
import AddProductPage from "./admin/addProductPage";
import EditProductPage from "./admin/productPageEdit";
import AdminOrderPage from "./admin/adminOrderPage";
import AdminUserPage from "./admin/adminUserPage";
import AdminReviewPage from "./admin/adminReviewPage";

/*
=========================================================
VELMORA ADMIN SHELL
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

Direction:
Luxury beauty
Professional administration
Calm navigation
Responsive
Consistent with Velmora customer brand
=========================================================
*/

/* =========================================================
   ICONS
========================================================= */

function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="2"
      />

      <rect
        x="14"
        y="3"
        width="7"
        height="11"
        rx="2"
      />

      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="2"
      />

      <rect
        x="14"
        y="18"
        width="7"
        height="3"
        rx="1.5"
      />
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
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <path d="m12 3 8 4-8 4-8-4 8-4Z" />
      <path d="m4 7 8 4 8-4" />
      <path d="M4 7v10l8 4 8-4V7" />
      <path d="M12 11v10" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <circle
        cx="9"
        cy="8"
        r="3"
      />

      <path d="M3.5 19c.5-3.5 2.4-5 5.5-5s5 1.5 5.5 5" />

      <path d="M16 5.5a3 3 0 0 1 0 5" />

      <path d="M16.5 14c2.5.4 3.7 2 4 5" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <path d="M6 3h12v18H6z" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </svg>
  );
}

function ReviewIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <path d="M21 12c0 4-4 7-9 7a10.8 10.8 0 0 1-4-.75L3 20l1.35-3.37A6.57 6.57 0 0 1 3 12c0-4 4-7 9-7s9 3 9 7Z" />

      <path d="m12 8.5.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2-1.45-1.4 2-.3.9-1.8Z" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M4 10v10h16V10" />
      <path d="M3 10 5 4h14l2 6" />
      <path d="M8 20v-6h8v6" />
      <path d="M3 10c0 2 3 2 4.5 0 1.5 2 4.5 2 6 0 1.5 2 4.5 2 6 0" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M10 4H5v16h5" />
      <path d="M14 8l4 4-4 4" />
      <path d="M8 12h10" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function AdminPage() {
  const location =
    useLocation();

  const navigate =
    useNavigate();

  const path =
    location.pathname;

  const [
    status,
    setStatus,
  ] = useState(
    "loading"
  );

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  /* =====================================================
     ADMIN AUTHENTICATION
  ===================================================== */

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
          "Please sign in first"
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

        /*
        ===============================================
        TOKEN EXPIRED
        ===============================================
        */

        if (
          decoded.exp &&
          decoded.exp *
            1000 <
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

        /*
        ===============================================
        ADMIN ROLE
        ===============================================
        */

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

  /* =====================================================
     CLOSE SIDEBAR AFTER ROUTE CHANGE
  ===================================================== */

  useEffect(() => {
    setSidebarOpen(false);
  }, [
    location.pathname,
  ]);

  /* =====================================================
     LOCK BODY ON MOBILE DRAWER
  ===================================================== */

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

  /* =====================================================
     ESC CLOSE
  ===================================================== */

  useEffect(() => {
    function handleEscape(
      event
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setSidebarOpen(
          false
        );
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

  /* =====================================================
     LOGOUT
  ===================================================== */

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
      "Signed out of Velmora"
    );

    navigate("/");
  }

  /* =====================================================
     ACTIVE ROUTE HELPERS
  ===================================================== */

  function isDashboardActive() {
    return (
      path ===
        "/admin" ||
      path ===
        "/admin/" ||
      path ===
        "/admin/dashboard" ||
      path.startsWith(
        "/admin/dashboard/"
      )
    );
  }

  function isRouteActive(
    route
  ) {
    return path.startsWith(
      `/admin/${route}`
    );
  }

  /* =====================================================
     CURRENT PAGE NAME
  ===================================================== */

  function getCurrentSection() {
    if (
      isRouteActive(
        "products"
      ) ||
      isRouteActive(
        "add-product"
      ) ||
      isRouteActive(
        "edit-product"
      )
    ) {
      return "Products";
    }

    if (
      isRouteActive(
        "users"
      )
    ) {
      return "Customers";
    }

    if (
      isRouteActive(
        "orders"
      )
    ) {
      return "Orders";
    }

    if (
      isRouteActive(
        "reviews"
      )
    ) {
      return "Reviews";
    }

    return "Dashboard";
  }

  /* =====================================================
     NAVIGATION CLASS
  ===================================================== */

  function navigationClass(
    active
  ) {
    const base = `
      group
      relative

      flex
      min-h-[48px]
      w-full
      items-center
      gap-3

      overflow-hidden

      rounded-2xl

      px-3.5
      py-3

      text-sm
      font-semibold

      transition-all
      duration-300

      active:scale-[0.98]
    `;

    if (active) {
      return (
        base +
        `
          border
          border-[#7564DC]

          bg-gradient-to-r
          from-[#6C5CE7]
          to-[#8873E7]

          text-white

          shadow-[0_10px_24px_rgba(108,92,231,0.22)]
        `
      );
    }

    return (
      base +
      `
        border
        border-transparent

        text-[#625B67]

        hover:translate-x-1
        hover:border-[#E6DFF1]
        hover:bg-[#F6F2FF]
        hover:text-[#6C5CE7]
      `
    );
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (
    status ===
    "loading"
  ) {
    return (
      <Loading message="Opening the Velmora administration studio..." />
    );
  }

  if (
    status !==
    "authenticated"
  ) {
    return (
      <Loading message="Checking Velmora access..." />
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div
      className="
        min-h-screen
        w-full

        bg-[#FAF9F7]

        text-[#2F3136]
      "
    >
      {/* =================================================
          MOBILE HEADER
      ================================================= */}

      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-30

          flex
          h-[72px]
          items-center
          justify-between

          border-b
          border-[#E9E2EF]

          bg-[#FAF9F7]/95

          px-4

          shadow-[0_5px_24px_rgba(52,41,67,0.05)]

          backdrop-blur-xl

          sm:px-6

          lg:hidden
        "
      >
        {/* BRAND */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >
          <div
            className="
              relative

              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center

              overflow-hidden

              rounded-[14px]

              bg-gradient-to-br
              from-[#6C5CE7]
              to-[#A68EF1]

              text-white

              shadow-[0_8px_20px_rgba(108,92,231,0.20)]
            "
          >
            <span
              className="
                font-serif
                text-lg
                font-semibold
              "
            >
              V
            </span>

            <span
              className="
                absolute
                bottom-1
                right-1.5

                text-[5px]
                text-[#F1DCB7]
              "
            >
              ✦
            </span>
          </div>

          <div className="min-w-0">
            <p
              className="
                truncate

                text-sm
                font-black
                tracking-[0.08em]

                text-[#302C3C]
              "
            >
              VELMORA
            </p>

            <p
              className="
                truncate

                text-[10px]
                font-semibold

                text-[#918A96]
              "
            >
              {getCurrentSection()}{" "}
              · Admin
            </p>
          </div>
        </div>

        {/* MENU BUTTON */}

        <button
          type="button"
          aria-label="Open Velmora admin menu"
          aria-expanded={
            sidebarOpen
          }
          onClick={() =>
            setSidebarOpen(
              true
            )
          }
          className="
            flex
            h-11
            w-11
            items-center
            justify-center

            rounded-2xl

            border
            border-[#E1D9EA]

            bg-white

            text-[#5D5562]

            shadow-sm

            transition-all
            duration-200

            hover:border-[#CDC0EF]
            hover:bg-[#F5F1FF]
            hover:text-[#6C5CE7]

            active:scale-90
          "
        >
          <MenuIcon />
        </button>
      </header>

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      <button
        type="button"
        aria-label="Close navigation"
        onClick={() =>
          setSidebarOpen(
            false
          )
        }
        className={`
          fixed
          inset-0
          z-40

          bg-[#221D29]/55

          backdrop-blur-[3px]

          transition-all
          duration-300

          lg:hidden

          ${
            sidebarOpen
              ? "visible opacity-100"
              : "invisible opacity-0"
          }
        `}
      />

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50

          flex
          h-[100dvh]
          w-[88vw]
          max-w-[300px]
          flex-col

          border-r
          border-[#E8E1ED]

          bg-[#FEFDFD]

          shadow-[15px_0_50px_rgba(46,35,59,0.12)]

          transition-transform
          duration-300

          sm:w-[300px]

          lg:w-[300px]
          lg:translate-x-0
          lg:shadow-[6px_0_25px_rgba(46,35,59,0.035)]

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* =================================================
            SIDEBAR BRAND
        ================================================= */}

        <div
          className="
            shrink-0

            border-b
            border-[#EEE8F1]

            px-5
            pb-5
            pt-6
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
                min-w-0
                items-center
                gap-3
              "
            >
              {/* MONOGRAM */}

              <div
                className="
                  relative

                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center

                  overflow-hidden

                  rounded-[17px]

                  bg-gradient-to-br
                  from-[#6C5CE7]
                  via-[#8370E5]
                  to-[#B8A1FF]

                  text-white

                  shadow-[0_10px_25px_rgba(108,92,231,0.23)]
                "
              >
                <span
                  className="
                    font-serif
                    text-[22px]
                    font-semibold
                  "
                >
                  V
                </span>

                <span
                  className="
                    absolute
                    bottom-1.5
                    right-2

                    text-[6px]

                    text-[#F1DCB7]
                  "
                >
                  ✦
                </span>
              </div>

              <div className="min-w-0">
                <h1
                  className="
                    truncate

                    text-lg
                    font-black
                    tracking-[0.10em]

                    text-[#302C3C]
                  "
                >
                  VELMORA
                </h1>

                <p
                  className="
                    mt-0.5

                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.14em]

                    text-[#9A929E]
                  "
                >
                  Administration
                </p>
              </div>
            </div>

            {/* MOBILE CLOSE */}

            <button
              type="button"
              aria-label="Close admin menu"
              onClick={() =>
                setSidebarOpen(
                  false
                )
              }
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center

                rounded-xl

                border
                border-[#ECE5EE]

                bg-[#FAF8FB]

                text-[#857D89]

                transition-all

                hover:border-[#ECCFD5]
                hover:bg-[#FFF3F5]
                hover:text-[#B45462]

                active:scale-90

                lg:hidden
              "
            >
              <CloseIcon />
            </button>
          </div>

          {/* BRAND LINE */}

          <div
            className="
              mt-5

              flex
              items-center
              gap-2
            "
          >
            <div
              className="
                h-px
                flex-1

                bg-gradient-to-r
                from-[#B8A1FF]/60
                to-transparent
              "
            />

            <p
              className="
                text-[8px]
                font-bold
                uppercase
                tracking-[0.18em]

                text-[#B29B72]
              "
            >
              Beauty · Business
            </p>
          </div>
        </div>

        {/* =================================================
            SCROLLABLE NAV
        ================================================= */}

        <div
          className="
            min-h-0
            flex-1

            overflow-y-auto

            px-4
            py-5

            [scrollbar-width:thin]
          "
        >
          {/* ===============================================
              CUSTOMER STORE
          =============================================== */}

          <p
            className="
              mb-2
              px-3

              text-[9px]
              font-black
              uppercase
              tracking-[0.19em]

              text-[#AAA2AE]
            "
          >
            Customer Experience
          </p>

          <Link
            to="/"
            className="
              group
              relative

              mb-6

              flex
              items-center
              justify-between
              gap-3

              overflow-hidden

              rounded-[18px]

              border
              border-[#EEE0C9]

              bg-gradient-to-r
              from-[#FFFAF2]
              to-[#FFF6F8]

              px-4
              py-3.5

              shadow-[0_7px_20px_rgba(129,101,67,0.05)]

              transition-all
              duration-300

              hover:-translate-y-0.5
              hover:border-[#E5D0AE]
              hover:shadow-md
            "
          >
            <div
              className="
                pointer-events-none

                absolute
                -right-8
                -top-8

                h-20
                w-20

                rounded-full

                bg-[#EADBC8]/30

                blur-2xl
              "
            />

            <div
              className="
                relative

                flex
                min-w-0
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center

                  rounded-xl

                  bg-white

                  text-[#9B7542]

                  shadow-sm
                "
              >
                <StoreIcon />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-sm
                    font-bold
                    text-[#50444A]
                  "
                >
                  View Velmora
                </p>

                <p
                  className="
                    mt-0.5

                    truncate

                    text-[9px]
                    font-medium
                    text-[#A08B7B]
                  "
                >
                  Open customer
                  storefront
                </p>
              </div>
            </div>

            <div
              className="
                relative

                text-[#B08B5B]

                transition-transform
                duration-300

                group-hover:translate-x-1
              "
            >
              <ArrowIcon />
            </div>
          </Link>

          {/* ===============================================
              OVERVIEW
          =============================================== */}

          <SidebarSectionLabel>
            Overview
          </SidebarSectionLabel>

          <nav
            className="
              flex
              flex-col
              gap-1.5
            "
          >
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

                    h-2
                    w-2

                    rounded-full

                    bg-white

                    shadow-[0_0_0_4px_rgba(255,255,255,0.13)]
                  "
                />
              )}
            </Link>
          </nav>

          {/* ===============================================
              DIVIDER
          =============================================== */}

          <div
            className="
              my-5
              h-px

              bg-gradient-to-r
              from-transparent
              via-[#ECE6F0]
              to-transparent
            "
          />

          {/* ===============================================
              MANAGEMENT
          =============================================== */}

          <SidebarSectionLabel>
            Management
          </SidebarSectionLabel>

          <nav
            className="
              flex
              flex-col
              gap-1.5
            "
          >
            {/* PRODUCTS */}

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

              {(isRouteActive(
                "products"
              ) ||
                isRouteActive(
                  "add-product"
                ) ||
                isRouteActive(
                  "edit-product"
                )) && (
                <span
                  className="
                    ml-auto

                    h-2
                    w-2

                    rounded-full

                    bg-white
                  "
                />
              )}
            </Link>

            {/* USERS */}

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
                Customers
              </span>

              {isRouteActive(
                "users"
              ) && (
                <span
                  className="
                    ml-auto

                    h-2
                    w-2

                    rounded-full

                    bg-white
                  "
                />
              )}
            </Link>

            {/* ORDERS */}

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

              {isRouteActive(
                "orders"
              ) && (
                <span
                  className="
                    ml-auto

                    h-2
                    w-2

                    rounded-full

                    bg-white
                  "
                />
              )}
            </Link>

            {/* REVIEWS */}

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

              {isRouteActive(
                "reviews"
              ) && (
                <span
                  className="
                    ml-auto

                    h-2
                    w-2

                    rounded-full

                    bg-white
                  "
                />
              )}
            </Link>
          </nav>

          {/* ===============================================
              BRAND NOTE
          =============================================== */}

          <div
            className="
              relative

              mt-7

              overflow-hidden

              rounded-[20px]

              bg-[#302C3C]

              p-4

              text-white

              shadow-[0_12px_30px_rgba(48,44,60,0.13)]
            "
          >
            <div
              className="
                pointer-events-none

                absolute
                -right-10
                -top-10

                h-24
                w-24

                rounded-full

                bg-[#B8A1FF]/20

                blur-3xl
              "
            />

            <p
              className="
                relative

                text-[8px]
                font-black
                uppercase
                tracking-[0.18em]

                text-[#D0C3FF]
              "
            >
              Velmora Standard
            </p>

            <p
              className="
                relative

                mt-2

                text-xs
                font-semibold
                leading-5

                text-white/75
              "
            >
              Curate every
              product,
              customer
              interaction and
              order with care.
            </p>

            <div
              className="
                relative

                mt-3

                text-[10px]
                text-[#EADBC8]
              "
            >
              ✦ Beauty with
              elegance
            </div>
          </div>
        </div>

        {/* =================================================
            SIDEBAR FOOTER
        ================================================= */}

        <div
          className="
            shrink-0

            border-t
            border-[#EEE8F1]

            bg-[#FEFDFD]

            px-4
            pb-5
            pt-4
          "
        >
          {/* ADMIN STATUS */}

          <div
            className="
              mb-3

              rounded-[18px]

              border
              border-[#E7E0EE]

              bg-gradient-to-br
              from-[#FBF9FF]
              to-[#FFF8FA]

              p-3.5
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
                  relative

                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center

                  rounded-xl

                  bg-[#F2EDFF]

                  text-[#6C5CE7]
                "
              >
                <UserIcon />

                <span
                  className="
                    absolute
                    -bottom-0.5
                    -right-0.5

                    h-3
                    w-3

                    rounded-full

                    border-2
                    border-white

                    bg-[#4F9D7A]
                  "
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-[9px]
                    font-semibold
                    text-[#9A929E]
                  "
                >
                  Signed in as
                </p>

                <p
                  className="
                    mt-0.5
                    truncate

                    text-sm
                    font-extrabold
                    text-[#39333E]
                  "
                >
                  Administrator
                </p>
              </div>
            </div>
          </div>

          {/* LOGOUT */}

          <button
            type="button"
            onClick={
              handleLogout
            }
            className="
              group

              flex
              min-h-[46px]
              w-full
              items-center
              justify-center
              gap-2.5

              rounded-xl

              border
              border-[#EED7DC]

              bg-[#FFF4F6]

              px-4

              text-sm
              font-bold
              text-[#AD5666]

              transition-all
              duration-300

              hover:border-[#B45462]
              hover:bg-[#B45462]
              hover:text-white

              active:scale-[0.98]
            "
          >
            <LogoutIcon />

            Sign Out
          </button>

          <p
            className="
              mt-3

              text-center

              text-[8px]
              font-bold
              uppercase
              tracking-[0.15em]

              text-[#BBB3BE]
            "
          >
            Velmora
            Administration
          </p>
        </div>
      </aside>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main
        className="
          min-h-screen

          bg-[#FAF9F7]

          pt-[72px]

          lg:ml-[300px]
          lg:pt-0

          transition-[margin]
          duration-300
        "
      >
        <div
          key={
            location.pathname
          }
          className="
            min-h-screen

            animate-[velmoraAdminFade_0.25s_ease-out]
          "
        >
          <Routes>
            {/* DEFAULT */}

            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />

            {/* DASHBOARD */}

            <Route
              path="dashboard"
              element={
                <AdminDashboardPage />
              }
            />

            {/* PRODUCTS */}

            <Route
              path="products"
              element={
                <AdminProductPage />
              }
            />

            {/* USERS */}

            <Route
              path="users"
              element={
                <AdminUserPage />
              }
            />

            {/* ORDERS */}

            <Route
              path="orders"
              element={
                <AdminOrderPage />
              }
            />

            {/* REVIEWS */}

            <Route
              path="reviews"
              element={
                <AdminReviewPage />
              }
            />

            {/* ADD PRODUCT */}

            <Route
              path="add-product"
              element={
                <AddProductPage />
              }
            />

            {/* EDIT PRODUCT */}

            <Route
              path="edit-product"
              element={
                <EditProductPage />
              }
            />

            {/* UNKNOWN ADMIN ROUTE */}

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

      {/* =================================================
          GLOBAL ADMIN ANIMATION
      ================================================= */}

      <style>{`
        @keyframes velmoraAdminFade {
          from {
            opacity: 0;
            transform: translateY(5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-\\[velmoraAdminFade_0\\.25s_ease-out\\] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   SIDEBAR SECTION LABEL
========================================================= */

function SidebarSectionLabel({
  children,
}) {
  return (
    <p
      className="
        mb-2
        px-3

        text-[9px]
        font-black
        uppercase
        tracking-[0.19em]

        text-[#AAA2AE]
      "
    >
      {children}
    </p>
  );
}