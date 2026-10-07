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

/*
=========================================================
VELMORA HEADER
=========================================================

Primary Violet   #6C5CE7
Soft Lavender    #B8A1FF
Soft Rose        #F2B8C6
Champagne        #EADBC8
Warm Ivory       #FAF9F7
Surface          #FFFFFF
Charcoal         #2F3136
Muted Text       #6B7280

Direction:
Quiet Luxury
Modern Beauty
Premium Ecommerce
Mobile-first
=========================================================
*/

/* =========================================================
   BRAND MARK
========================================================= */

function BrandMark({
  compact = false,
}) {
  return (
    <div
      className={`
        relative
        flex
        shrink-0
        items-center
        justify-center

        overflow-hidden

        border
        border-[#DCD2F7]

        bg-gradient-to-br
        from-[#6C5CE7]
        via-[#9079E9]
        to-[#B8A1FF]

        text-white

        shadow-[0_8px_22px_rgba(108,92,231,0.22)]

        ${
          compact
            ? "h-10 w-10 rounded-[14px]"
            : "h-11 w-11 rounded-[15px] lg:h-12 lg:w-12 lg:rounded-[17px]"
        }
      `}
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-3
          -top-3
          h-8
          w-8
          rounded-full
          bg-white/25
          blur-lg
        "
      />

      <span
        className={`
          relative
          font-serif
          font-semibold
          leading-none

          ${
            compact
              ? "text-lg"
              : "text-xl lg:text-[22px]"
          }
        `}
      >
        V
      </span>

      <span
        className="
          absolute
          bottom-[5px]
          right-[6px]
          text-[7px]
          text-[#F7E7C8]
        "
      >
        ✦
      </span>
    </div>
  );
}

/* =========================================================
   MOBILE ARROW
========================================================= */

function MobileArrow() {
  return (
    <svg
      className="
        h-4
        w-4
        shrink-0
        text-[#A19AA8]
      "
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
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

/* =========================================================
   LOGOUT ICON
========================================================= */

function LogoutIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 16l4-4m0 0-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
      />
    </svg>
  );
}

/* =========================================================
   HEADER
========================================================= */

export default function Header() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const accountMenuRef =
    useRef(null);

  /* =====================================================
     STATE
  ===================================================== */

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const [
    accountMenuOpen,
    setAccountMenuOpen,
  ] = useState(false);

  const [
    user,
    setUser,
  ] = useState(null);

  const [
    cartCount,
    setCartCount,
  ] = useState(0);

  /* =====================================================
     CLOSE MOBILE MENU
  ===================================================== */

  function closeMenu() {
    setMenuOpen(false);
  }

  /* =====================================================
     LOAD USER
  ===================================================== */

  function loadLoggedUser() {
    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const decoded =
        jwtDecode(token);

      if (
        decoded.exp &&
        decoded.exp *
          1000 <
          Date.now()
      ) {
        localStorage.removeItem(
          "token"
        );

        setUser(null);

        return;
      }

      setUser({
        firstName:
          decoded.firstName ||
          "",

        lastName:
          decoded.lastName ||
          "",

        email:
          decoded.email ||
          "",

        role:
          decoded.role ||
          "customer",

        img:
          decoded.img ||
          null,
      });
    } catch (error) {
      console.error(
        "Invalid authentication token:",
        error
      );

      localStorage.removeItem(
        "token"
      );

      setUser(null);
    }
  }

  /* =====================================================
     LOAD CART COUNT
  ===================================================== */

  function loadCartCount() {
    try {
      const storedCart =
        localStorage.getItem(
          "cart"
        );

      if (!storedCart) {
        setCartCount(0);
        return;
      }

      const cart =
        JSON.parse(
          storedCart
        );

      if (
        !Array.isArray(
          cart
        )
      ) {
        setCartCount(0);
        return;
      }

      const total =
        cart.reduce(
          (
            sum,
            item
          ) => {
            const quantity =
              Number(
                item.quantity
              ) || 1;

            return (
              sum +
              quantity
            );
          },
          0
        );

      setCartCount(
        total
      );
    } catch (error) {
      console.error(
        "Failed to read cart:",
        error
      );

      setCartCount(0);
    }
  }

  /* =====================================================
     ROUTE CHANGE
  ===================================================== */

  useEffect(() => {
    loadLoggedUser();
    loadCartCount();

    setMenuOpen(false);

    setAccountMenuOpen(
      false
    );
  }, [
    location.pathname,
  ]);

  /* =====================================================
     AUTH / CART EVENTS
  ===================================================== */

  useEffect(() => {
    function handleAuthUpdate() {
      loadLoggedUser();
    }

    function handleCartUpdate() {
      loadCartCount();
    }

    function handleStorage(
      event
    ) {
      if (
        event.key ===
        "token"
      ) {
        loadLoggedUser();
      }

      if (
        event.key ===
        "cart"
      ) {
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

  /* =====================================================
     OUTSIDE ACCOUNT CLICK
  ===================================================== */

  useEffect(() => {
    function handleOutsideClick(
      event
    ) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(
          event.target
        )
      ) {
        setAccountMenuOpen(
          false
        );
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

  /* =====================================================
     LOCK SCROLL FOR MOBILE MENU
  ===================================================== */

  useEffect(() => {
    if (menuOpen) {
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
  }, [menuOpen]);

  /* =====================================================
     ESCAPE KEY
  ===================================================== */

  useEffect(() => {
    function handleEscape(
      event
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setMenuOpen(
          false
        );

        setAccountMenuOpen(
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
     RESIZE
  ===================================================== */

  useEffect(() => {
    function handleResize() {
      if (
        window.innerWidth >=
        768
      ) {
        setMenuOpen(
          false
        );
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

    setUser(null);

    setCartCount(0);

    setAccountMenuOpen(
      false
    );

    setMenuOpen(false);

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
      "Signed out from Velmora"
    );

    navigate("/");
  }

  /* =====================================================
     USER TYPE
  ===================================================== */

  const isAdmin =
    user?.role ===
    "admin";

  const isCustomer =
    user &&
    !isAdmin;

  const userInitial =
    user?.firstName
      ?.charAt(0)
      ?.toUpperCase() ||
    "V";

  /* =====================================================
     DESKTOP NAVIGATION STYLE
  ===================================================== */

  const desktopNavLinkClass =
    ({
      isActive,
    }) => {
      const base =
        "relative px-3 lg:px-4 py-2.5 rounded-xl " +
        "text-[13px] lg:text-sm font-semibold " +
        "transition-all duration-300 " +
        "focus:outline-none focus-visible:ring-2 " +
        "focus-visible:ring-[#B8A1FF] focus-visible:ring-offset-2";

      if (isActive) {
        return (
          base +
          " bg-[#F2EDFF] text-[#6C5CE7]"
        );
      }

      return (
        base +
        " text-[#625C68] hover:bg-[#F8F5FF] hover:text-[#6C5CE7]"
      );
    };

  /* =====================================================
     MOBILE NAVIGATION STYLE
  ===================================================== */

  const mobileNavLinkClass =
    ({
      isActive,
    }) => {
      const base =
        "w-full min-h-[48px] flex items-center " +
        "px-4 py-3 rounded-xl text-sm font-semibold " +
        "transition-all duration-300";

      if (isActive) {
        return (
          base +
          " bg-[#F2EDFF] text-[#6C5CE7]"
        );
      }

      return (
        base +
        " text-[#544E59] hover:bg-[#F8F5FF] hover:text-[#6C5CE7]"
      );
    };

  /* =====================================================
     ADMIN MOBILE STYLE
  ===================================================== */

  const adminMobileLinkClass =
    ({
      isActive,
    }) => {
      const base =
        "w-full min-h-[48px] flex items-center justify-between " +
        "px-4 py-3 rounded-xl text-sm font-semibold " +
        "transition-all duration-300";

      if (isActive) {
        return (
          base +
          " bg-[#EEE9FF] text-[#6C5CE7]"
        );
      }

      return (
        base +
        " text-[#544E59] hover:bg-[#F8F5FF] hover:text-[#6C5CE7]"
      );
    };

  return (
    <header
      className="
        fixed
        left-0
        right-0
        top-0
        z-50
        w-full

        border-b
        border-[#ECE7F1]/90

        bg-white/90

        shadow-[0_4px_28px_rgba(60,45,82,0.055)]

        backdrop-blur-xl
      "
    >
      {/* =================================================
          MAIN HEADER
      ================================================= */}

      <div
        className="
          mx-auto
          flex
          h-[72px]
          max-w-[1440px]
          items-center
          justify-between
          gap-2

          px-3

          sm:gap-3
          sm:px-6

          md:h-[80px]

          lg:px-8
        "
      >
        {/* =================================================
            BRAND
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            navigate("/")
          }
          aria-label="Go to Velmora home page"
          className="
            flex
            shrink-0
            items-center
            gap-2.5
            rounded-xl

            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#B8A1FF]
            focus-visible:ring-offset-2

            sm:gap-3
          "
        >
          <BrandMark />

          <div
            className="
              hidden
              flex-col
              items-start

              sm:flex
            "
          >
            <span
              className="
                text-[15px]
                font-black
                leading-tight
                tracking-[0.17em]
                text-[#2F3136]

                lg:text-base
              "
            >
              VELMORA
            </span>

            <span
              className="
                mt-0.5
                text-[9px]
                font-medium
                uppercase
                tracking-[0.13em]
                text-[#9A929E]

                lg:text-[10px]
              "
            >
              Beauty ·
              Skincare ·
              Confidence
            </span>
          </div>
        </button>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav
          aria-label="Primary navigation"
          className="
            mx-2
            hidden
            flex-1
            items-center
            justify-center
            gap-0.5

            md:flex

            lg:mx-5
            lg:gap-1
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
            Collection
          </NavLink>

          <NavLink
            to="/search"
            className={
              desktopNavLinkClass
            }
          >
            Discover
          </NavLink>

          {!isAdmin && (
            <>
              <NavLink
                to="/about"
                className={
                  desktopNavLinkClass
                }
              >
                Our Story
              </NavLink>

              <NavLink
                to="/contacts"
                className={
                  desktopNavLinkClass
                }
              >
                Care
              </NavLink>
            </>
          )}

          {/* Guest */}

          {!user && (
            <>
              <NavLink
                to="/login"
                className={
                  desktopNavLinkClass
                }
              >
                Sign In
              </NavLink>

              <Link
                to="/signup"
                className="
                  ml-1
                  inline-flex
                  min-h-[42px]
                  items-center
                  justify-center

                  rounded-xl

                  bg-gradient-to-r
                  from-[#6C5CE7]
                  to-[#8D77E8]

                  px-4

                  text-[13px]
                  font-bold
                  text-white

                  shadow-[0_8px_20px_rgba(108,92,231,0.20)]

                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:shadow-[0_12px_26px_rgba(108,92,231,0.28)]

                  active:scale-[0.98]

                  lg:px-5
                  lg:text-sm
                "
              >
                Join Velmora
              </Link>
            </>
          )}

          {/* Admin */}

          {isAdmin && (
            <NavLink
              to="/admin/dashboard"
              className={
                desktopNavLinkClass
              }
            >
              Dashboard
            </NavLink>
          )}
        </nav>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2

            sm:gap-2.5
          "
        >
          {/* ===============================================
              DESKTOP ACCOUNT
          =============================================== */}

          {user && (
            <div
              ref={
                accountMenuRef
              }
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
                    (
                      previous
                    ) =>
                      !previous
                  )
                }
                aria-expanded={
                  accountMenuOpen
                }
                className="
                  flex
                  min-h-[44px]
                  items-center
                  gap-2
                  rounded-xl
                  px-2
                  py-1.5

                  transition-all
                  duration-300

                  hover:bg-[#F8F5FF]

                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#B8A1FF]

                  lg:px-3
                "
              >
                {user.img ? (
                  <img
                    src={
                      user.img
                    }
                    alt={`${user.firstName} profile`}
                    className="
                      h-9
                      w-9
                      rounded-full
                      border
                      border-[#E0D8EA]
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full

                      bg-gradient-to-br
                      from-[#6C5CE7]
                      to-[#B8A1FF]

                      text-sm
                      font-bold
                      text-white

                      shadow-[0_6px_15px_rgba(108,92,231,0.20)]
                    "
                  >
                    {
                      userInitial
                    }
                  </div>
                )}

                <div
                  className="
                    hidden
                    text-left

                    lg:block
                  "
                >
                  <p
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.08em]
                      text-[#A098A5]
                    "
                  >
                    {isAdmin
                      ? "Administrator"
                      : "Welcome back"}
                  </p>

                  <p
                    className="
                      mt-0.5
                      max-w-[105px]
                      truncate
                      text-sm
                      font-bold
                      text-[#38323D]
                    "
                  >
                    Hi,{" "}
                    {
                      user.firstName
                    }
                  </p>
                </div>

                <HiChevronDown
                  className={`
                    text-[#958E9A]

                    transition-transform
                    duration-300

                    ${
                      accountMenuOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </button>

              {/* =============================================
                  ACCOUNT DROPDOWN
              ============================================= */}

              {accountMenuOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-[calc(100%+10px)]
                    w-[290px]
                    max-h-[calc(100dvh-100px)]
                    overflow-y-auto

                    rounded-[22px]

                    border
                    border-[#EAE4F0]

                    bg-white

                    shadow-[0_24px_65px_rgba(55,41,75,0.16)]

                    animate-[desktopMenuIn_0.18s_ease-out]
                  "
                >
                  {/* USER */}

                  <div
                    className="
                      border-b
                      border-[#EEE9F2]
                      bg-gradient-to-br
                      from-[#FBF9FF]
                      to-[#FFF9FB]
                      px-4
                      py-4
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
                          src={
                            user.img
                          }
                          alt="Profile"
                          className="
                            h-12
                            w-12
                            rounded-full
                            border
                            border-white
                            object-cover
                            shadow-sm
                          "
                        />
                      ) : (
                        <div
                          className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-full

                            bg-gradient-to-br
                            from-[#6C5CE7]
                            to-[#B8A1FF]

                            font-bold
                            text-white
                          "
                        >
                          {
                            userInitial
                          }
                        </div>
                      )}

                      <div className="min-w-0">
                        <p
                          className="
                            truncate
                            text-sm
                            font-extrabold
                            text-[#332E37]
                          "
                        >
                          {
                            user.firstName
                          }{" "}
                          {
                            user.lastName
                          }
                        </p>

                        <p
                          className="
                            mt-0.5
                            truncate
                            text-xs
                            text-[#938C98]
                          "
                        >
                          {
                            user.email
                          }
                        </p>

                        <span
                          className={`
                            mt-2
                            inline-flex
                            rounded-full
                            px-2.5
                            py-1
                            text-[9px]
                            font-black
                            uppercase
                            tracking-[0.1em]

                            ${
                              isAdmin
                                ? "bg-[#EEE9FF] text-[#6C5CE7]"
                                : "bg-[#EDF7F2] text-[#428163]"
                            }
                          `}
                        >
                          {isAdmin
                            ? "Administrator"
                            : "Velmora Member"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CUSTOMER MENU */}

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
                          rounded-xl
                          px-4
                          py-3
                          text-sm
                          font-semibold
                          text-[#625C68]

                          transition-all
                          duration-200

                          hover:bg-[#F8F5FF]
                          hover:text-[#6C5CE7]
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
                          rounded-xl
                          px-4
                          py-3
                          text-sm
                          font-semibold
                          text-[#625C68]

                          transition-all
                          duration-200

                          hover:bg-[#F8F5FF]
                          hover:text-[#6C5CE7]
                        "
                      >
                        My Orders
                      </Link>

                      <Link
                        to="/cart"
                        onClick={() =>
                          setAccountMenuOpen(
                            false
                          )
                        }
                        className="
                          flex
                          items-center
                          justify-between
                          rounded-xl
                          px-4
                          py-3
                          text-sm
                          font-semibold
                          text-[#625C68]

                          transition-all
                          duration-200

                          hover:bg-[#F8F5FF]
                          hover:text-[#6C5CE7]
                        "
                      >
                        <span>
                          My Bag
                        </span>

                        {cartCount >
                          0 && (
                          <span
                            className="
                              flex
                              min-w-[22px]
                              h-[22px]
                              items-center
                              justify-center
                              rounded-full
                              bg-[#6C5CE7]
                              px-1.5
                              text-[9px]
                              font-bold
                              text-white
                            "
                          >
                            {cartCount >
                            99
                              ? "99+"
                              : cartCount}
                          </span>
                        )}
                      </Link>
                    </div>
                  )}

                  {/* ADMIN MENU */}

                  {isAdmin && (
                    <div
                      className="
                        flex
                        flex-col
                        gap-1
                        p-2
                      "
                    >
                      <p
                        className="
                          px-3
                          pb-1
                          pt-2
                          text-[9px]
                          font-black
                          uppercase
                          tracking-[0.18em]
                          text-[#8A75DC]
                        "
                      >
                        Velmora
                        Administration
                      </p>

                      {[
                        [
                          "/admin/dashboard",
                          "Dashboard",
                        ],
                        [
                          "/admin/products",
                          "Manage Products",
                        ],
                        [
                          "/admin/users",
                          "Manage Users",
                        ],
                        [
                          "/admin/orders",
                          "Manage Orders",
                        ],
                        [
                          "/admin/reviews",
                          "Manage Reviews",
                        ],
                      ].map(
                        ([
                          path,
                          title,
                        ]) => (
                          <Link
                            key={
                              path
                            }
                            to={
                              path
                            }
                            onClick={() =>
                              setAccountMenuOpen(
                                false
                              )
                            }
                            className="
                              rounded-xl
                              px-4
                              py-3
                              text-sm
                              font-semibold
                              text-[#625C68]

                              transition-all
                              duration-200

                              hover:bg-[#F2EDFF]
                              hover:text-[#6C5CE7]
                            "
                          >
                            {
                              title
                            }
                          </Link>
                        )
                      )}
                    </div>
                  )}

                  {/* LOGOUT */}

                  <div
                    className="
                      sticky
                      bottom-0
                      border-t
                      border-[#EEE9F2]
                      bg-white
                      p-2
                    "
                  >
                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      className="
                        flex
                        w-full
                        items-center
                        gap-2
                        rounded-xl
                        px-4
                        py-3
                        text-left
                        text-sm
                        font-semibold

                        text-[#B04E5C]

                        transition-all
                        duration-200

                        hover:bg-[#FFF2F4]
                      "
                    >
                      <LogoutIcon />

                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===============================================
              CART / BAG
          =============================================== */}

          {isCustomer && (
            <Link
              to="/cart"
              aria-label={`Open Velmora bag. ${cartCount} items`}
              className="
                relative
                flex
                h-[42px]
                w-[42px]
                items-center
                justify-center

                rounded-xl

                border
                border-[#E9E3EE]

                bg-[#FBF9FC]

                text-[#554E5A]

                transition-all
                duration-300

                hover:border-[#D7CCFA]
                hover:bg-[#F3EEFF]
                hover:text-[#6C5CE7]

                active:scale-95

                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#B8A1FF]

                md:h-[44px]
                md:w-[44px]
              "
            >
              <BsCart3
                className="
                  text-[20px]

                  md:text-[22px]
                "
              />

              {cartCount >
                0 && (
                <span
                  className="
                    absolute
                    -right-1.5
                    -top-1.5

                    flex
                    h-[20px]
                    min-w-[20px]
                    items-center
                    justify-center

                    rounded-full

                    border-2
                    border-white

                    bg-[#6C5CE7]

                    px-1

                    text-[9px]
                    font-bold
                    text-white

                    shadow-sm
                  "
                >
                  {cartCount >
                  99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>
          )}

          {/* ===============================================
              MOBILE MENU BUTTON
          =============================================== */}

          <button
            type="button"
            onClick={() =>
              setMenuOpen(
                (
                  previous
                ) =>
                  !previous
              )
            }
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={
              menuOpen
            }
            className="
              flex
              h-[42px]
              w-[42px]
              items-center
              justify-center

              rounded-xl

              border
              border-[#E9E3EE]

              bg-[#FBF9FC]

              text-[#4F4954]

              transition-all
              duration-300

              hover:border-[#D7CCFA]
              hover:bg-[#F3EEFF]
              hover:text-[#6C5CE7]

              active:scale-95

              md:hidden
            "
          >
            {menuOpen ? (
              <HiX className="text-[24px]" />
            ) : (
              <HiMenu className="text-[24px]" />
            )}
          </button>
        </div>
      </div>

      {/* =================================================
          MOBILE MENU
      ================================================= */}

      {menuOpen && (
        <div
          className="
            absolute
            left-0
            right-0
            top-full

            flex
            h-[calc(100dvh-72px)]
            flex-col
            overflow-hidden

            border-t
            border-[#ECE7F1]

            bg-[#FCFBFD]

            shadow-[0_20px_45px_rgba(56,42,76,0.13)]

            animate-[mobileMenuIn_0.22s_ease-out]

            md:hidden
          "
        >
          {/* =============================================
              SCROLLABLE CONTENT
          ============================================= */}

          <div
            className="
              min-h-0
              flex-1

              overflow-y-auto
              overscroll-contain

              px-3
              pb-5
              pt-4

              [scrollbar-width:thin]

              sm:px-6
            "
          >
            {/* ===========================================
                MOBILE BRAND STRIP
            =========================================== */}

            <div
              className="
                mb-4
                flex
                items-center
                justify-between
                rounded-2xl

                border
                border-[#EAE3F3]

                bg-gradient-to-r
                from-[#F5F1FF]
                via-white
                to-[#FFF3F7]

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
                <BrandMark
                  compact
                />

                <div>
                  <p
                    className="
                      text-[13px]
                      font-black
                      tracking-[0.17em]
                      text-[#2F3136]
                    "
                  >
                    VELMORA
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.13em]
                      text-[#9A929E]
                    "
                  >
                    Beauty ·
                    Confidence
                  </p>
                </div>
              </div>

              <span
                className="
                  rounded-full
                  border
                  border-[#DED5F5]
                  bg-white/70
                  px-2.5
                  py-1.5
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.11em]
                  text-[#6C5CE7]
                "
              >
                Luxury Beauty
              </span>
            </div>

            {/* ===========================================
                USER CARD
            =========================================== */}

            {user && (
              <div
                className="
                  mb-4
                  flex
                  items-center
                  gap-3

                  rounded-2xl

                  border
                  border-[#E8E1EF]

                  bg-white

                  p-4

                  shadow-sm
                "
              >
                {user.img ? (
                  <img
                    src={
                      user.img
                    }
                    alt={`${user.firstName} profile`}
                    className="
                      h-12
                      w-12
                      shrink-0
                      rounded-full
                      border
                      border-[#E5DEEB]
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center

                      rounded-full

                      bg-gradient-to-br
                      from-[#6C5CE7]
                      to-[#B8A1FF]

                      font-bold
                      text-white
                    "
                  >
                    {
                      userInitial
                    }
                  </div>
                )}

                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      font-extrabold
                      text-[#342F38]
                    "
                  >
                    Welcome,{" "}
                    {
                      user.firstName
                    }
                  </p>

                  <p
                    className="
                      mt-0.5
                      truncate
                      text-xs
                      text-[#968E9A]
                    "
                  >
                    {
                      user.email
                    }
                  </p>

                  <span
                    className={`
                      mt-1.5
                      inline-flex
                      rounded-full
                      px-2.5
                      py-1
                      text-[9px]
                      font-black
                      uppercase
                      tracking-[0.09em]

                      ${
                        isAdmin
                          ? "bg-[#EEE9FF] text-[#6C5CE7]"
                          : "bg-[#EDF7F2] text-[#428163]"
                      }
                    `}
                  >
                    {isAdmin
                      ? "Administrator"
                      : "Velmora Member"}
                  </span>
                </div>
              </div>
            )}

            {/* ===========================================
                WEBSITE
            =========================================== */}

            <div className="mb-4">
              <p
                className="
                  mb-1.5
                  px-3
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-[#A098A5]
                "
              >
                Discover
                Velmora
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
                  onClick={
                    closeMenu
                  }
                  className={
                    mobileNavLinkClass
                  }
                >
                  Home
                </NavLink>

                <NavLink
                  to="/products"
                  onClick={
                    closeMenu
                  }
                  className={
                    mobileNavLinkClass
                  }
                >
                  Collection
                </NavLink>

                <NavLink
                  to="/search"
                  onClick={
                    closeMenu
                  }
                  className={
                    mobileNavLinkClass
                  }
                >
                  Discover
                </NavLink>

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
                      Our Story
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
                      Customer
                      Care
                    </NavLink>
                  </>
                )}
              </nav>
            </div>

            {/* ===========================================
                GUEST
            =========================================== */}

            {!user && (
              <div
                className="
                  border-t
                  border-[#ECE7F1]
                  pt-4
                "
              >
                <p
                  className="
                    mb-1.5
                    px-3
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.18em]
                    text-[#A098A5]
                  "
                >
                  Your Account
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
                    Sign In
                  </NavLink>

                  <Link
                    to="/signup"
                    onClick={
                      closeMenu
                    }
                    className="
                      mt-2
                      flex
                      min-h-[50px]
                      w-full
                      items-center
                      justify-center

                      rounded-xl

                      bg-gradient-to-r
                      from-[#6C5CE7]
                      to-[#8D77E8]

                      px-4

                      text-sm
                      font-bold
                      text-white

                      shadow-[0_9px_22px_rgba(108,92,231,0.20)]

                      transition-all
                      duration-300

                      active:scale-[0.98]
                    "
                  >
                    Join Velmora
                  </Link>
                </div>
              </div>
            )}

            {/* ===========================================
                CUSTOMER
            =========================================== */}

            {isCustomer && (
              <div
                className="
                  border-t
                  border-[#ECE7F1]
                  pt-4
                "
              >
                <p
                  className="
                    mb-1.5
                    px-3
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.18em]
                    text-[#A098A5]
                  "
                >
                  My Velmora
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
                        w-full
                        items-center
                        justify-between
                      "
                    >
                      <span>
                        My Bag
                      </span>

                      {cartCount >
                        0 && (
                        <span
                          className="
                            flex
                            h-[22px]
                            min-w-[22px]
                            items-center
                            justify-center
                            rounded-full
                            bg-[#6C5CE7]
                            px-1.5
                            text-[9px]
                            font-bold
                            text-white
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

            {/* ===========================================
                ADMIN
            =========================================== */}

            {isAdmin && (
              <div
                className="
                  border-t
                  border-[#ECE7F1]
                  pt-4
                "
              >
                <p
                  className="
                    mb-1.5
                    px-3
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.18em]
                    text-[#8B74DA]
                  "
                >
                  Velmora
                  Administration
                </p>

                <nav
                  className="
                    flex
                    flex-col
                    gap-1
                  "
                >
                  {[
                    [
                      "/admin/dashboard",
                      "Dashboard",
                    ],
                    [
                      "/admin/products",
                      "Manage Products",
                    ],
                    [
                      "/admin/users",
                      "Manage Users",
                    ],
                    [
                      "/admin/orders",
                      "Manage Orders",
                    ],
                    [
                      "/admin/reviews",
                      "Manage Reviews",
                    ],
                  ].map(
                    ([
                      path,
                      title,
                    ]) => (
                      <NavLink
                        key={
                          path
                        }
                        to={
                          path
                        }
                        onClick={
                          closeMenu
                        }
                        className={
                          adminMobileLinkClass
                        }
                      >
                        <span>
                          {
                            title
                          }
                        </span>

                        <MobileArrow />
                      </NavLink>
                    )
                  )}
                </nav>
              </div>
            )}
          </div>

          {/* =============================================
              MOBILE LOGOUT
          ============================================= */}

          {user && (
            <div
              className="
                shrink-0

                border-t
                border-[#E8E2ED]

                bg-white

                px-3
                pt-3

                pb-[calc(0.75rem+env(safe-area-inset-bottom))]

                shadow-[0_-8px_30px_rgba(56,42,76,0.06)]

                sm:px-6
              "
            >
              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="
                  group
                  flex
                  min-h-[50px]
                  w-full
                  items-center
                  justify-between

                  rounded-xl

                  border
                  border-[#F0D9DE]

                  bg-[#FFF5F6]

                  px-4
                  py-3

                  text-sm
                  font-semibold
                  text-[#AE5362]

                  transition-all
                  duration-300

                  hover:border-[#E8BBC4]
                  hover:bg-[#FFF0F2]

                  active:scale-[0.98]
                "
              >
                <span
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <LogoutIcon />

                  Sign Out
                </span>

                <svg
                  className="
                    h-4
                    w-4

                    transition-transform
                    duration-300

                    group-hover:translate-x-1
                  "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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

      <style>{`
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

        @media (prefers-reduced-motion: reduce) {
          .animate-\\[mobileMenuIn_0\\.22s_ease-out\\],
          .animate-\\[desktopMenuIn_0\\.18s_ease-out\\] {
            animation: none !important;
          }
        }
      `}</style>
    </header>
  );
}
