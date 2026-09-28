import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BsCart3 } from "react-icons/bs";
import { HiMenu, HiX } from "react-icons/hi";

export default function Header() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  const navLinkClass = ({ isActive }) => {
    const base =
      "relative px-3 lg:px-4 py-2.5 rounded-xl text-sm font-semibold " +
      "transition-all duration-200 focus:outline-none " +
      "focus-visible:ring-2 focus-visible:ring-red-400 " +
      "focus-visible:ring-offset-2";

    if (isActive) {
      return base + " text-red-500 bg-red-50";
    }

    return base + " text-gray-600 hover:text-red-500 hover:bg-red-50";
  };

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
      {/* MAIN HEADER */}
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
        {/* LOGO */}
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
              e.currentTarget.style.display = "none";
            }}
          />

          {/* BRAND */}
          <div className="hidden sm:flex flex-col items-start">
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

            <span className="text-[11px] text-gray-400">
              Beauty & Care
            </span>
          </div>
        </button>

        {/* DESKTOP NAVIGATION */}
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
            xl:gap-3

            mx-3
            lg:mx-6
          "
        >
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          <NavLink to="/contacts" className={navLinkClass}>
            Contact
          </NavLink>

          <NavLink to="/login" className={navLinkClass}>
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

              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-red-400
              focus-visible:ring-offset-2
            "
          >
            Sign Up
          </Link>
        </nav>

        {/* RIGHT SIDE */}
        <div
          className="
            flex
            items-center

            gap-2
            sm:gap-3

            shrink-0
          "
        >
          {/* CART */}
          <Link
            to="/cart"
            aria-label="Open shopping cart"
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
              hover:shadow-sm

              active:scale-95

              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-red-400
              focus-visible:ring-offset-2
            "
          >
            <BsCart3
              aria-hidden="true"
              className="text-[21px] md:text-[23px]"
            />

            {/* CART COUNT */}
            <span
              className="
                absolute
                -top-1.5
                -right-1.5

                min-w-[20px]
                h-[20px]

                px-1

                flex
                items-center
                justify-center

                rounded-full

                bg-red-500

                border-2
                border-white

                text-white
                text-[10px]
                font-bold
              "
            >
              3
            </span>
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="
              md:hidden

              w-[42px]
              h-[42px]

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

              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-red-400
              focus-visible:ring-offset-2
            "
          >
            {menuOpen ? (
              <HiX
                aria-hidden="true"
                className="text-[24px]"
              />
            ) : (
              <HiMenu
                aria-hidden="true"
                className="text-[24px]"
              />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        id="mobile-navigation"
        className={`
          md:hidden

          overflow-hidden

          bg-white

          border-t
          border-gray-100

          transition-all
          duration-300
          ease-in-out

          ${
            menuOpen
              ? "max-h-[520px] opacity-100"
              : "max-h-0 opacity-0"
          }
        `}
      >
        <nav
          aria-label="Mobile navigation"
          className="
            px-4
            sm:px-6

            py-4

            flex
            flex-col

            gap-1
          "
        >
          <NavLink
            to="/"
            onClick={closeMenu}
            className={navLinkClass}
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            onClick={closeMenu}
            className={navLinkClass}
          >
            Products
          </NavLink>

          <NavLink
            to="/about"
            onClick={closeMenu}
            className={navLinkClass}
          >
            About
          </NavLink>

          <NavLink
            to="/contacts"
            onClick={closeMenu}
            className={navLinkClass}
          >
            Contact
          </NavLink>

          <NavLink
            to="/login"
            onClick={closeMenu}
            className={navLinkClass}
          >
            Login
          </NavLink>

          <Link
            to="/signup"
            onClick={closeMenu}
            className="
              mt-2

              w-full

              text-center

              px-4
              py-3

              rounded-xl

              bg-red-500
              text-white

              font-semibold

              shadow-sm

              transition-all
              duration-200

              hover:bg-red-600

              active:scale-[0.98]

              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-red-400
              focus-visible:ring-offset-2
            "
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}