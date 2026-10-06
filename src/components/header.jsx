import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { BsCart3 } from "react-icons/bs";

import {
  HiChevronDown,
  HiMenu,
  HiX,
} from "react-icons/hi";

import { jwtDecode } from "jwt-decode";

import toast from "react-hot-toast";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const accountMenuRef = useRef(null);

  // =====================================================
  // STATES
  // =====================================================

  const [menuOpen, setMenuOpen] = useState(false);

  const [accountMenuOpen, setAccountMenuOpen] =
    useState(false);

  const [user, setUser] = useState(null);

  const [cartCount, setCartCount] = useState(0);

  // =====================================================
  // CLOSE MOBILE MENU
  // =====================================================

  function closeMenu() {
    setMenuOpen(false);
  }

  // =====================================================
  // LOAD LOGGED USER FROM TOKEN
  // =====================================================

  function loadLoggedUser() {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // Token expired
      if (
        decoded.exp &&
        decoded.exp * 1000 < Date.now()
      ) {
        localStorage.removeItem("token");

        setUser(null);

        return;
      }

      setUser({
        firstName: decoded.firstName || "",
        lastName: decoded.lastName || "",
        email: decoded.email || "",
        role: decoded.role || "customer",
        img: decoded.img || null,
      });
    } catch (error) {
      console.error(
        "Invalid authentication token:",
        error
      );

      localStorage.removeItem("token");

      setUser(null);
    }
  }

  // =====================================================
  // LOAD CART COUNT
  // =====================================================

  function loadCartCount() {
    try {
      const storedCart =
        localStorage.getItem("cart");

      if (!storedCart) {
        setCartCount(0);
        return;
      }

      const cart = JSON.parse(storedCart);

      if (!Array.isArray(cart)) {
        setCartCount(0);
        return;
      }

      const total = cart.reduce(
        (sum, item) => {
          const quantity =
            Number(item.quantity) || 1;

          return sum + quantity;
        },
        0
      );

      setCartCount(total);
    } catch (error) {
      console.error(
        "Failed to read cart:",
        error
      );

      setCartCount(0);
    }
  }

  // =====================================================
  // LOAD DATA WHEN ROUTE CHANGES
  // =====================================================

  useEffect(() => {
    loadLoggedUser();
    loadCartCount();

    setMenuOpen(false);
    setAccountMenuOpen(false);
  }, [location.pathname]);

  // =====================================================
  // LISTEN FOR AUTH / CART CHANGES
  // =====================================================

  useEffect(() => {
    function handleAuthUpdate() {
      loadLoggedUser();
    }

    function handleCartUpdate() {
      loadCartCount();
    }

    function handleStorage(event) {
      if (event.key === "token") {
        loadLoggedUser();
      }

      if (event.key === "cart") {
        loadCartCount();
      }
    }

    window.addEventListener(
      "auth-updated",
      handleAuthUpdate
    );

    window.addEventListener(
      "cart-updated",
      handleCartUpdate
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "auth-updated",
        handleAuthUpdate
      );

      window.removeEventListener(
        "cart-updated",
        handleCartUpdate
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  // =====================================================
  // CLICK OUTSIDE DESKTOP ACCOUNT MENU
  // =====================================================

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(
          event.target
        )
      ) {
        setAccountMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // =====================================================
  // DISABLE PAGE SCROLL WHEN MOBILE MENU IS OPEN
  // =====================================================

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // =====================================================
  // ESC KEY
  // =====================================================

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setAccountMenuOpen(false);
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
  // CLOSE MOBILE MENU WHEN SCREEN BECOMES DESKTOP
  // =====================================================

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    }

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  function handleLogout() {
    // Remove authentication
    localStorage.removeItem("token");

    // Clear cart when logout
    localStorage.removeItem("cart");

    setUser(null);
    setCartCount(0);

    setAccountMenuOpen(false);
    setMenuOpen(false);

    // Inform other components
    window.dispatchEvent(
      new Event("auth-updated")
    );

    window.dispatchEvent(
      new Event("cart-updated")
    );

    toast.success(
      "Logged out successfully"
    );

    navigate("/");
  }

  // =====================================================
  // USER TYPES
  // =====================================================

  const isAdmin =
    user?.role === "admin";

  const isCustomer =
    user && !isAdmin;

  const userInitial =
    user?.firstName
      ?.charAt(0)
      ?.toUpperCase() || "U";

  // =====================================================
  // DESKTOP NAV STYLE
  // =====================================================

  const desktopNavLinkClass = ({
    isActive,
  }) => {
    const base =
      "relative px-3 lg:px-4 py-2.5 rounded-xl " +
      "text-sm font-semibold transition-all duration-200 " +
      "focus:outline-none focus-visible:ring-2 " +
      "focus-visible:ring-red-400 focus-visible:ring-offset-2";

    if (isActive) {
      return (
        base +
        " text-red-500 bg-red-50"
      );
    }

    return (
      base +
      " text-gray-600 hover:text-red-500 hover:bg-red-50"
    );
  };

  // =====================================================
  // MOBILE NAV STYLE
  // =====================================================

  const mobileNavLinkClass = ({
    isActive,
  }) => {
    const base =
      "w-full flex items-center px-4 py-3 rounded-xl " +
      "text-sm font-semibold transition-all duration-200";

    if (isActive) {
      return (
        base +
        " bg-red-50 text-red-500"
      );
    }

    return (
      base +
      " text-gray-700 hover:bg-gray-50 hover:text-red-500"
    );
  };

  // =====================================================
  // ADMIN MOBILE LINK STYLE
  // =====================================================

  const adminMobileLinkClass = ({
    isActive,
  }) => {
    const base =
      "w-full flex items-center justify-between " +
      "px-4 py-3 rounded-xl text-sm font-semibold " +
      "transition-all duration-200";

    if (isActive) {
      return (
        base +
        " bg-purple-100 text-purple-700"
      );
    }

    return (
      base +
      " text-gray-700 hover:bg-purple-50 hover:text-purple-700"
    );
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <header
      className="
        fixed
        top-0
        left-0
        right-0

        z-50

        w-full

        bg-white/95
        backdrop-blur-md

        border-b
        border-gray-100

        shadow-[0_2px_18px_rgba(0,0,0,0.05)]
      "
    >
      {/* =================================================
          MAIN HEADER BAR
      ================================================= */}

      <div
        className="
          max-w-[1440px]
          mx-auto

          h-[72px]
          md:h-[80px]

          px-4
          sm:px-6
          lg:px-8

          flex
          items-center
          justify-between

          gap-3
        "
      >
        {/* =================================================
            LOGO
        ================================================= */}

        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Go to home page"
          className="
            flex
            items-center
            gap-3

            shrink-0

            rounded-xl

            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-red-400
            focus-visible:ring-offset-2
          "
        >
          <img
            src="/logo.jpg"
            alt="Beauty Store logo"
            className="
              w-[44px]
              h-[44px]

              sm:w-[48px]
              sm:h-[48px]

              lg:w-[52px]
              lg:h-[52px]

              object-cover

              rounded-full

              border
              border-gray-100

              shadow-sm

              transition-all
              duration-300

              hover:scale-105
              hover:shadow-md
            "
            onError={(e) => {
              e.currentTarget.style.display =
                "none";
            }}
          />

          <div
            className="
              hidden
              sm:flex

              flex-col
              items-start
            "
          >
            <span
              className="
                text-base
                lg:text-lg

                font-bold

                text-[#393E46]

                leading-tight
              "
            >
              Beauty Store
            </span>

            <span
              className="
                text-[11px]
                text-gray-400
              "
            >
              Beauty & Care
            </span>
          </div>
        </button>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav
          aria-label="Primary navigation"
          className="
            hidden
            md:flex

            flex-1

            items-center
            justify-center

            gap-1
            lg:gap-2

            mx-3
            lg:mx-6
          "
        >
          <NavLink
            to="/"
            className={
              desktopNavLinkClass
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={
              desktopNavLinkClass
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/search"
            className={
              desktopNavLinkClass
            }
          >
            Search
          </NavLink>

          {/* =================================================
              ABOUT + CONTACT
              HIDDEN FOR ADMIN
          ================================================= */}

          {!isAdmin && (
            <>
              <NavLink
                to="/about"
                className={
                  desktopNavLinkClass
                }
              >
                About
              </NavLink>

              <NavLink
                to="/contacts"
                className={
                  desktopNavLinkClass
                }
              >
                Contact
              </NavLink>
            </>
          )}

          {/* =================================================
              GUEST DESKTOP
          ================================================= */}

          {!user && (
            <>
              <NavLink
                to="/login"
                className={
                  desktopNavLinkClass
                }
              >
                Login
              </NavLink>

              <Link
                to="/signup"
                className="
                  ml-1

                  px-4
                  lg:px-5

                  py-2.5

                  rounded-xl

                  bg-red-500
                  text-white

                  text-sm
                  font-semibold

                  shadow-sm

                  transition-all
                  duration-200

                  hover:bg-red-600
                  hover:shadow-md
                  hover:-translate-y-[1px]

                  active:scale-[0.98]
                "
              >
                Sign Up
              </Link>
            </>
          )}

          {/* =================================================
              ADMIN QUICK LINK
          ================================================= */}

          {isAdmin && (
            <NavLink
              to="/admin/products"
              className={
                desktopNavLinkClass
              }
            >
              Admin
            </NavLink>
          )}
        </nav>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div
          className="
            flex
            items-center

            gap-2
            sm:gap-3

            shrink-0
          "
        >
          {/* =================================================
              DESKTOP ACCOUNT
          ================================================= */}

          {user && (
            <div
              ref={accountMenuRef}
              className="
                relative

                hidden
                md:block
              "
            >
              <button
                type="button"
                onClick={() =>
                  setAccountMenuOpen(
                    (previous) =>
                      !previous
                  )
                }
                className="
                  flex
                  items-center

                  gap-2

                  rounded-xl

                  px-2
                  lg:px-3

                  py-2

                  transition-all

                  hover:bg-red-50
                "
              >
                {/* Profile image */}

                {user.img ? (
                  <img
                    src={user.img}
                    alt={`${user.firstName} profile`}
                    className="
                      h-9
                      w-9

                      rounded-full

                      object-cover

                      border
                      border-gray-200
                    "
                  />
                ) : (
                  <div
                    className="
                      h-9
                      w-9

                      rounded-full

                      bg-red-500

                      flex
                      items-center
                      justify-center

                      text-sm
                      font-bold
                      text-white
                    "
                  >
                    {userInitial}
                  </div>
                )}

                <div
                  className="
                    hidden
                    lg:block

                    text-left
                  "
                >
                  <p
                    className="
                      text-[10px]
                      text-gray-400

                      leading-none
                    "
                  >
                    {isAdmin
                      ? "Administrator"
                      : "Welcome"}
                  </p>

                  <p
                    className="
                      mt-1

                      max-w-[110px]

                      truncate

                      text-sm
                      font-semibold
                      text-gray-800
                    "
                  >
                    Hi, {user.firstName}
                  </p>
                </div>

                <HiChevronDown
                  className={`
                    text-gray-400

                    transition-transform
                    duration-200

                    ${
                      accountMenuOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </button>

              {/* =================================================
                  DESKTOP DROPDOWN
              ================================================= */}

              {accountMenuOpen && (
                <div
                  className="
                    absolute

                    right-0
                    top-[calc(100%+10px)]

                    w-[280px]

                    max-h-[calc(100dvh-100px)]

                    overflow-y-auto

                    rounded-2xl

                    border
                    border-gray-100

                    bg-white

                    shadow-[0_20px_60px_rgba(0,0,0,0.14)]

                    animate-[desktopMenuIn_0.18s_ease-out]
                  "
                >
                  {/* User Information */}

                  <div
                    className="
                      px-4
                      py-4

                      border-b
                      border-gray-100
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >
                      {user.img ? (
                        <img
                          src={user.img}
                          alt="Profile"
                          className="
                            h-11
                            w-11

                            rounded-full

                            object-cover
                          "
                        />
                      ) : (
                        <div
                          className="
                            h-11
                            w-11

                            rounded-full

                            bg-red-500

                            flex
                            items-center
                            justify-center

                            font-bold
                            text-white
                          "
                        >
                          {userInitial}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p
                          className="
                            truncate

                            text-sm
                            font-bold
                            text-gray-800
                          "
                        >
                          {user.firstName}{" "}
                          {user.lastName}
                        </p>

                        <p
                          className="
                            truncate

                            mt-0.5

                            text-xs
                            text-gray-400
                          "
                        >
                          {user.email}
                        </p>

                        <span
                          className={`
                            inline-flex

                            mt-2

                            px-2
                            py-1

                            rounded-full

                            text-[10px]
                            font-bold

                            uppercase

                            ${
                              isAdmin
                                ? "bg-purple-50 text-purple-600"
                                : "bg-green-50 text-green-600"
                            }
                          `}
                        >
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      CUSTOMER DESKTOP MENU
                  ================================================= */}

                  {isCustomer && (
                    <div className="p-2">
                      <Link
                        to="/profile"
                        onClick={() =>
                          setAccountMenuOpen(
                            false
                          )
                        }
                        className="
                          block

                          px-4
                          py-3

                          rounded-xl

                          text-sm
                          font-medium
                          text-gray-600

                          hover:bg-gray-50
                          hover:text-red-500

                          transition-all
                        "
                      >
                        My Profile
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() =>
                          setAccountMenuOpen(
                            false
                          )
                        }
                        className="
                          block

                          px-4
                          py-3

                          rounded-xl

                          text-sm
                          font-medium
                          text-gray-600

                          hover:bg-gray-50
                          hover:text-red-500

                          transition-all
                        "
                      >
                        My Orders
                      </Link>
                    </div>
                  )}

                  {/* =================================================
                      ADMIN DESKTOP MENU
                  ================================================= */}

                  {isAdmin && (
                    <div
                      className="
                        p-2

                        flex
                        flex-col

                        gap-1
                      "
                    >
                      <p
                        className="
                          px-3
                          pt-2
                          pb-1

                          text-[10px]

                          uppercase
                          tracking-[0.16em]

                          font-bold
                          text-purple-500
                        "
                      >
                        Administration
                      </p>

                      <Link
                        to="/admin/dashboard"
                        onClick={() =>
                          setAccountMenuOpen(
                            false
                          )
                        }
                        className="
                          px-4
                          py-3

                          rounded-xl

                          text-sm
                          font-medium
                          text-gray-600

                          hover:bg-purple-50
                          hover:text-purple-700

                          transition-all
                        "
                      >
                        Admin Dashboard
                      </Link>

                      <Link
                        to="/admin/products"
                        onClick={() =>
                          setAccountMenuOpen(
                            false
                          )
                        }
                        className="
                          px-4
                          py-3

                          rounded-xl

                          text-sm
                          font-medium
                          text-gray-600

                          hover:bg-purple-50
                          hover:text-purple-700

                          transition-all
                        "
                      >
                        Manage Products
                      </Link>

                      <Link
                        to="/admin/users"
                        onClick={() =>
                          setAccountMenuOpen(
                            false
                          )
                        }
                        className="
                          px-4
                          py-3

                          rounded-xl

                          text-sm
                          font-medium
                          text-gray-600

                          hover:bg-purple-50
                          hover:text-purple-700

                          transition-all
                        "
                      >
                        Manage Users
                      </Link>

                      <Link
                        to="/admin/orders"
                        onClick={() =>
                          setAccountMenuOpen(
                            false
                          )
                        }
                        className="
                          px-4
                          py-3

                          rounded-xl

                          text-sm
                          font-medium
                          text-gray-600

                          hover:bg-purple-50
                          hover:text-purple-700

                          transition-all
                        "
                      >
                        Manage Orders
                      </Link>

                      {/* IMPORTANT:
                          MANAGE REVIEWS IS NOW
                          CLEARLY AVAILABLE ON DESKTOP
                      */}

                      <Link
                        to="/admin/reviews"
                        onClick={() =>
                          setAccountMenuOpen(
                            false
                          )
                        }
                        className="
                          px-4
                          py-3

                          rounded-xl

                          text-sm
                          font-medium
                          text-gray-600

                          hover:bg-purple-50
                          hover:text-purple-700

                          transition-all
                        "
                      >
                        Manage Reviews
                      </Link>
                    </div>
                  )}

                  {/* =================================================
                      DESKTOP LOGOUT
                  ================================================= */}

                  <div
                    className="
                      sticky
                      bottom-0

                      bg-white

                      border-t
                      border-gray-100

                      p-2
                    "
                  >
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        w-full

                        px-4
                        py-3

                        rounded-xl

                        bg-red-50
                        text-red-600

                        text-left
                        text-sm
                        font-semibold

                        hover:bg-red-500
                        hover:text-white

                        active:scale-[0.98]

                        transition-all
                      "
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================
              CART
              CUSTOMER ONLY
          ================================================= */}

          {isCustomer && (
            <Link
              to="/cart"
              aria-label={`Open shopping cart. ${cartCount} items`}
              className="
                relative

                w-[42px]
                h-[42px]

                md:w-[44px]
                md:h-[44px]

                flex
                items-center
                justify-center

                rounded-xl

                bg-gray-50

                border
                border-gray-100

                text-gray-700

                transition-all
                duration-200

                hover:bg-red-50
                hover:text-red-500
                hover:border-red-100

                active:scale-95
              "
            >
              <BsCart3
                className="
                  text-[21px]
                  md:text-[23px]
                "
              />

              {cartCount > 0 && (
                <span
                  className="
                    absolute

                    -top-1.5
                    -right-1.5

                    min-w-[20px]
                    h-[20px]

                    px-1

                    rounded-full

                    bg-red-500

                    border-2
                    border-white

                    flex
                    items-center
                    justify-center

                    text-[10px]
                    font-bold
                    text-white
                  "
                >
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>
          )}

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              setMenuOpen(
                (previous) =>
                  !previous
              )
            }
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            className="
              md:hidden

              w-[42px]
              h-[42px]

              rounded-xl

              bg-gray-50

              border
              border-gray-100

              flex
              items-center
              justify-center

              text-gray-700

              hover:bg-red-50
              hover:text-red-500

              active:scale-95

              transition-all
            "
          >
            {menuOpen ? (
              <HiX className="text-[25px]" />
            ) : (
              <HiMenu className="text-[25px]" />
            )}
          </button>
        </div>
      </div>

      {/* =================================================
          MOBILE MENU

          IMPORTANT:
          This is ABSOLUTE under the fixed Header.
          Do not use fixed here because the Header has
          backdrop-filter/backdrop-blur.
      ================================================= */}

      {menuOpen && (
        <div
          className="
            md:hidden

            absolute

            top-full
            left-0
            right-0

            h-[calc(100dvh-72px)]

            bg-white

            border-t
            border-gray-100

            shadow-[0_20px_40px_rgba(0,0,0,0.12)]

            flex
            flex-col

            overflow-hidden

            animate-[mobileMenuIn_0.22s_ease-out]
          "
        >
          {/* =================================================
              SCROLLABLE PART

              ONLY THIS AREA SCROLLS
          ================================================= */}

          <div
            className="
              flex-1
              min-h-0

              overflow-y-auto
              overscroll-contain

              px-4
              sm:px-6

              pt-4
              pb-5

              [scrollbar-width:thin]
            "
          >
            {/* =================================================
                MOBILE USER CARD
            ================================================= */}

            {user && (
              <div
                className="
                  flex
                  items-center

                  gap-3

                  p-4

                  mb-4

                  rounded-2xl

                  bg-gray-50

                  border
                  border-gray-100
                "
              >
                {user.img ? (
                  <img
                    src={user.img}
                    alt={`${user.firstName} profile`}
                    className="
                      w-11
                      h-11

                      shrink-0

                      rounded-full

                      object-cover

                      border
                      border-gray-200
                    "
                  />
                ) : (
                  <div
                    className="
                      w-11
                      h-11

                      shrink-0

                      rounded-full

                      bg-red-500

                      flex
                      items-center
                      justify-center

                      font-bold
                      text-white
                    "
                  >
                    {userInitial}
                  </div>
                )}

                <div className="min-w-0">
                  <p
                    className="
                      font-bold
                      text-gray-800

                      truncate
                    "
                  >
                    Hi, {user.firstName}
                  </p>

                  <p
                    className="
                      mt-0.5

                      text-xs
                      text-gray-400

                      truncate
                    "
                  >
                    {user.email}
                  </p>

                  <span
                    className={`
                      inline-flex

                      mt-1.5

                      px-2
                      py-0.5

                      rounded-full

                      text-[10px]
                      font-bold

                      uppercase

                      ${
                        isAdmin
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      }
                    `}
                  >
                    {isAdmin
                      ? "Administrator"
                      : user.role}
                  </span>
                </div>
              </div>
            )}

            {/* =================================================
                WEBSITE SECTION
            ================================================= */}

            <div className="mb-4">
              <p
                className="
                  px-3
                  mb-1.5

                  text-[10px]

                  uppercase
                  tracking-[0.16em]

                  font-bold
                  text-gray-400
                "
              >
                Website
              </p>

              <nav
                className="
                  flex
                  flex-col

                  gap-1
                "
              >
                <NavLink
                  to="/"
                  onClick={closeMenu}
                  className={
                    mobileNavLinkClass
                  }
                >
                  Home
                </NavLink>

                <NavLink
                  to="/products"
                  onClick={closeMenu}
                  className={
                    mobileNavLinkClass
                  }
                >
                  Products
                </NavLink>

                <NavLink
                  to="/search"
                  onClick={closeMenu}
                  className={
                    mobileNavLinkClass
                  }
                >
                  Search
                </NavLink>

                {/* ADMIN DOESN'T NEED
                    ABOUT OR CONTACT
                */}

                {!isAdmin && (
                  <>
                    <NavLink
                      to="/about"
                      onClick={
                        closeMenu
                      }
                      className={
                        mobileNavLinkClass
                      }
                    >
                      About
                    </NavLink>

                    <NavLink
                      to="/contacts"
                      onClick={
                        closeMenu
                      }
                      className={
                        mobileNavLinkClass
                      }
                    >
                      Contact
                    </NavLink>
                  </>
                )}
              </nav>
            </div>

            {/* =================================================
                GUEST MOBILE
            ================================================= */}

            {!user && (
              <div
                className="
                  pt-4

                  border-t
                  border-gray-100
                "
              >
                <p
                  className="
                    px-3
                    mb-1.5

                    text-[10px]

                    uppercase
                    tracking-[0.16em]

                    font-bold
                    text-gray-400
                  "
                >
                  Account
                </p>

                <div
                  className="
                    flex
                    flex-col
                    gap-1
                  "
                >
                  <NavLink
                    to="/login"
                    onClick={
                      closeMenu
                    }
                    className={
                      mobileNavLinkClass
                    }
                  >
                    Login
                  </NavLink>

                  <Link
                    to="/signup"
                    onClick={
                      closeMenu
                    }
                    className="
                      w-full

                      mt-2

                      px-4
                      py-3

                      rounded-xl

                      bg-red-500
                      text-white

                      text-center
                      text-sm
                      font-semibold

                      hover:bg-red-600

                      active:scale-[0.98]

                      transition-all
                    "
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}

            {/* =================================================
                CUSTOMER MOBILE
            ================================================= */}

            {isCustomer && (
              <div
                className="
                  pt-4

                  border-t
                  border-gray-100
                "
              >
                <p
                  className="
                    px-3
                    mb-1.5

                    text-[10px]

                    uppercase
                    tracking-[0.16em]

                    font-bold
                    text-gray-400
                  "
                >
                  My Account
                </p>

                <nav
                  className="
                    flex
                    flex-col
                    gap-1
                  "
                >
                  <NavLink
                    to="/profile"
                    onClick={
                      closeMenu
                    }
                    className={
                      mobileNavLinkClass
                    }
                  >
                    My Profile
                  </NavLink>

                  <NavLink
                    to="/orders"
                    onClick={
                      closeMenu
                    }
                    className={
                      mobileNavLinkClass
                    }
                  >
                    My Orders
                  </NavLink>

                  <NavLink
                    to="/cart"
                    onClick={
                      closeMenu
                    }
                    className={
                      mobileNavLinkClass
                    }
                  >
                    <span
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      My Cart

                      {cartCount > 0 && (
                        <span
                          className="
                            min-w-[21px]
                            h-[21px]

                            px-1

                            rounded-full

                            bg-red-500
                            text-white

                            flex
                            items-center
                            justify-center

                            text-[10px]
                            font-bold
                          "
                        >
                          {cartCount >
                          99
                            ? "99+"
                            : cartCount}
                        </span>
                      )}
                    </span>
                  </NavLink>
                </nav>
              </div>
            )}

            {/* =================================================
                ADMIN MOBILE
            ================================================= */}

            {isAdmin && (
              <div
                className="
                  pt-4

                  border-t
                  border-gray-100
                "
              >
                <p
                  className="
                    px-3
                    mb-1.5

                    text-[10px]

                    uppercase
                    tracking-[0.16em]

                    font-bold
                    text-purple-500
                  "
                >
                  Administration
                </p>

                <nav
                  className="
                    flex
                    flex-col
                    gap-1
                  "
                >
                  <NavLink
                    to="/admin/dashboard"
                    onClick={
                      closeMenu
                    }
                    className={
                      adminMobileLinkClass
                    }
                  >
                    <span>
                      Admin Dashboard
                    </span>

                    <MobileArrow />
                  </NavLink>

                  <NavLink
                    to="/admin/products"
                    onClick={
                      closeMenu
                    }
                    className={
                      adminMobileLinkClass
                    }
                  >
                    <span>
                      Manage Products
                    </span>

                    <MobileArrow />
                  </NavLink>

                  <NavLink
                    to="/admin/users"
                    onClick={
                      closeMenu
                    }
                    className={
                      adminMobileLinkClass
                    }
                  >
                    <span>
                      Manage Users
                    </span>

                    <MobileArrow />
                  </NavLink>

                  <NavLink
                    to="/admin/orders"
                    onClick={
                      closeMenu
                    }
                    className={
                      adminMobileLinkClass
                    }
                  >
                    <span>
                      Manage Orders
                    </span>

                    <MobileArrow />
                  </NavLink>

                  <NavLink
                    to="/admin/reviews"
                    onClick={
                      closeMenu
                    }
                    className={
                      adminMobileLinkClass
                    }
                  >
                    <span>
                      Manage Reviews
                    </span>

                    <MobileArrow />
                  </NavLink>
                </nav>
              </div>
            )}
          </div>

          {/* =================================================
              MOBILE LOGOUT

              THIS DOES NOT SCROLL.
              ALWAYS VISIBLE AT BOTTOM.
          ================================================= */}

          {user && (
            <div
              className="
                shrink-0

                bg-white

                border-t
                border-gray-200

                px-4
                sm:px-6

                pt-3

                pb-[calc(0.75rem+env(safe-area-inset-bottom))]

                shadow-[0_-8px_30px_rgba(0,0,0,0.07)]
              "
            >
              <button
                type="button"
                onClick={handleLogout}
                className="
                  group

                  w-full

                  min-h-[50px]

                  px-4
                  py-3

                  rounded-xl

                  bg-red-50
                  text-red-600

                  border
                  border-red-100

                  flex
                  items-center
                  justify-between

                  text-sm
                  font-semibold

                  hover:bg-red-500
                  hover:text-white
                  hover:border-red-500

                  active:scale-[0.98]

                  transition-all
                  duration-200
                "
              >
                <span
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  {/* Logout Icon */}

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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                    />
                  </svg>

                  Logout
                </span>

                <svg
                  className="
                    w-4
                    h-4

                    transition-transform
                    duration-300

                    group-hover:translate-x-1
                  "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* =================================================
          ANIMATIONS
      ================================================= */}

      <style>
        {`
          @keyframes mobileMenuIn {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes desktopMenuIn {
            from {
              opacity: 0;
              transform: translateY(-6px) scale(0.98);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </header>
  );
}

// =========================================================
// MOBILE ARROW COMPONENT
// =========================================================

function MobileArrow() {
  return (
    <svg
      className="
        w-4
        h-4

        shrink-0

        text-gray-400
      "
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}