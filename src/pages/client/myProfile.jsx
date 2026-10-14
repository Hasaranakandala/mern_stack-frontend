import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  jwtDecode,
} from "jwt-decode";

import toast from "react-hot-toast";

import {
  FiUser,
  FiMail,
  FiShield,
  FiShoppingBag,
  FiArrowRight,
  FiLogOut,
} from "react-icons/fi";

/*
=========================================================
VELMORA MY PROFILE
=========================================================

Primary Violet   #6C5CE7
Lavender         #B8A1FF
Soft Rose        #F2B8C6
Champagne        #EADBC8
Warm Ivory       #FAF9F7
Charcoal         #2F3136
Muted            #6B7280
Success          #4F9D7A
=========================================================
*/

export default function MyProfile() {
  const navigate =
    useNavigate();

  const [
    user,
    setUser,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  /* =====================================================
     LOAD USER FROM JWT
  ===================================================== */

  useEffect(() => {
    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      toast.error(
        "Please sign in to view your profile"
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

        navigate(
          "/login",
          {
            replace: true,
          }
        );

        return;
      }

      if (
        decoded.role ===
        "admin"
      ) {
        navigate(
          "/admin/dashboard",
          {
            replace: true,
          }
        );

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
        "PROFILE TOKEN ERROR:",
        error
      );

      localStorage.removeItem(
        "token"
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
    } finally {
      setLoading(false);
    }
  }, [navigate]);

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
      "Signed out from Velmora"
    );

    navigate("/");
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#FAF9F7]
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto
              h-12
              w-12

              animate-spin

              rounded-full

              border-4
              border-[#EEE9F8]
              border-t-[#6C5CE7]
            "
          />

          <p
            className="
              mt-4
              text-sm
              font-medium
              text-[#7E7783]
            "
          >
            Preparing your
            Velmora profile...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const fullName =
    `${user.firstName} ${user.lastName}`.trim() ||
    "Velmora Customer";

  const initial =
    user.firstName
      ?.charAt(0)
      ?.toUpperCase() ||
    "V";

  return (
    <main
      className="
        relative

        min-h-screen
        w-full

        overflow-hidden

        bg-[#FAF9F7]

        pb-16
        pt-[92px]

        sm:pb-20

        md:pt-[104px]
      "
    >
      {/* ================================================
          BACKGROUND DECORATION
      ================================================ */}

      <div
        className="
          pointer-events-none

          absolute
          -left-28
          top-28

          h-[320px]
          w-[320px]

          rounded-full

          bg-[#B8A1FF]/[0.12]

          blur-[100px]
        "
      />

      <div
        className="
          pointer-events-none

          absolute
          -right-24
          top-[420px]

          h-[300px]
          w-[300px]

          rounded-full

          bg-[#F2B8C6]/[0.12]

          blur-[100px]
        "
      />

      <div
        className="
          relative
          z-10

          mx-auto
          w-full
          max-w-[1180px]

          px-4

          sm:px-6

          lg:px-8
        "
      >
        {/* ================================================
            PAGE HEADER
        ================================================ */}

        <section
          className="
            mb-6

            sm:mb-8
          "
        >
          <div
            className="
              inline-flex
              items-center
              gap-2

              rounded-full

              border
              border-[#DED4FF]

              bg-[#F7F3FF]

              px-3
              py-1.5

              text-[10px]
              font-black
              uppercase
              tracking-[0.16em]

              text-[#6C5CE7]
            "
          >
            <span>
              ✦
            </span>

            Velmora Member
          </div>

          <h1
            className="
              mt-4

              text-3xl
              font-extrabold
              tracking-[-0.04em]

              text-[#2F3136]

              sm:text-4xl

              lg:text-[44px]
            "
          >
            Your Velmora
            Profile
          </h1>

          <p
            className="
              mt-3

              max-w-2xl

              text-sm
              leading-7
              text-[#77717C]

              sm:text-base
            "
          >
            Your personal
            space for account
            information,
            orders and your
            Velmora shopping
            journey.
          </p>
        </section>

        {/* ================================================
            MAIN GRID
        ================================================ */}

        <div
          className="
            grid
            grid-cols-1
            gap-5

            lg:grid-cols-[0.78fr_1.22fr]
            lg:gap-7
          "
        >
          {/* ==============================================
              PROFILE CARD
          ============================================== */}

          <section
            className="
              relative

              overflow-hidden

              rounded-[28px]

              border
              border-[#EAE3F2]

              bg-white

              p-5

              shadow-[0_20px_60px_rgba(60,45,82,0.07)]

              sm:p-7
            "
          >
            <div
              className="
                pointer-events-none

                absolute
                -right-16
                -top-16

                h-48
                w-48

                rounded-full

                bg-[#B8A1FF]/[0.14]

                blur-3xl
              "
            />

            <div
              className="
                relative

                flex
                flex-col
                items-center

                text-center
              "
            >
              {/* AVATAR */}

              {user.img ? (
                <img
                  src={
                    user.img
                  }
                  alt={
                    fullName
                  }
                  className="
                    h-28
                    w-28

                    rounded-full

                    border-4
                    border-white

                    object-cover

                    shadow-[0_14px_35px_rgba(108,92,231,0.18)]
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-28
                    w-28
                    items-center
                    justify-center

                    rounded-full

                    border-4
                    border-white

                    bg-gradient-to-br
                    from-[#6C5CE7]
                    to-[#B8A1FF]

                    text-4xl
                    font-black
                    text-white

                    shadow-[0_14px_35px_rgba(108,92,231,0.20)]
                  "
                >
                  {
                    initial
                  }
                </div>
              )}

              <p
                className="
                  mt-5

                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.18em]

                  text-[#9A79E8]
                "
              >
                Velmora
                Customer
              </p>

              <h2
                className="
                  mt-2

                  break-words

                  text-2xl
                  font-extrabold

                  text-[#302B34]
                "
              >
                {
                  fullName
                }
              </h2>

              <p
                className="
                  mt-1

                  break-all

                  text-sm
                  text-[#88818D]
                "
              >
                {
                  user.email
                }
              </p>

              <span
                className="
                  mt-4

                  inline-flex
                  items-center
                  gap-1.5

                  rounded-full

                  bg-[#EDF7F2]

                  px-3
                  py-1.5

                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.08em]

                  text-[#438164]
                "
              >
                <span
                  className="
                    h-2
                    w-2

                    rounded-full

                    bg-[#4F9D7A]
                  "
                />

                Active Member
              </span>
            </div>

            {/* DIVIDER */}

            <div
              className="
                my-6
                h-px

                bg-gradient-to-r
                from-transparent
                via-[#E9E3EF]
                to-transparent
              "
            />

            {/* QUICK BUTTONS */}

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/orders"
                )
              }
              className="
                group

                flex
                min-h-[54px]
                w-full
                items-center
                justify-between

                rounded-2xl

                border
                border-[#E8E1F0]

                bg-[#FCFAFF]

                px-4

                text-left

                transition-all
                duration-300

                hover:border-[#CEC0F6]
                hover:bg-[#F5F1FF]
              "
            >
              <span
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center

                    rounded-xl

                    bg-[#EEE9FF]

                    text-[#6C5CE7]
                  "
                >
                  <FiShoppingBag />
                </span>

                <span>
                  <span
                    className="
                      block
                      text-sm
                      font-bold
                      text-[#423C47]
                    "
                  >
                    My Orders
                  </span>

                  <span
                    className="
                      block
                      text-xs
                      text-[#96909A]
                    "
                  >
                    View your
                    purchases
                  </span>
                </span>
              </span>

              <FiArrowRight
                className="
                  text-[#968E9B]

                  transition-transform
                  duration-300

                  group-hover:translate-x-1
                  group-hover:text-[#6C5CE7]
                "
              />
            </button>

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="
                mt-3

                flex
                min-h-[50px]
                w-full
                items-center
                justify-center
                gap-2

                rounded-2xl

                border
                border-[#F0D7DC]

                bg-[#FFF5F7]

                text-sm
                font-bold
                text-[#B45462]

                transition-all
                duration-300

                hover:border-[#B45462]
                hover:bg-[#B45462]
                hover:text-white

                active:scale-[0.98]
              "
            >
              <FiLogOut />

              Sign Out
            </button>
          </section>

          {/* ==============================================
              ACCOUNT INFORMATION
          ============================================== */}

          <section
            className="
              rounded-[28px]

              border
              border-[#EAE3F2]

              bg-white

              p-5

              shadow-[0_20px_60px_rgba(60,45,82,0.06)]

              sm:p-7

              lg:p-8
            "
          >
            <div
              className="
                flex
                flex-col
                gap-2

                border-b
                border-[#F0EBF4]

                pb-5
              "
            >
              <p
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.18em]

                  text-[#9A79E8]
                "
              >
                Account
                Details
              </p>

              <h2
                className="
                  text-xl
                  font-extrabold
                  text-[#2F3136]

                  sm:text-2xl
                "
              >
                Personal
                Information
              </h2>

              <p
                className="
                  text-sm
                  leading-6
                  text-[#85808A]
                "
              >
                Information
                associated with
                your current
                Velmora account.
              </p>
            </div>

            <div
              className="
                mt-6

                grid
                grid-cols-1
                gap-4

                sm:grid-cols-2
              "
            >
              <InfoCard
                icon={
                  <FiUser />
                }
                label="First Name"
                value={
                  user.firstName ||
                  "Not provided"
                }
              />

              <InfoCard
                icon={
                  <FiUser />
                }
                label="Last Name"
                value={
                  user.lastName ||
                  "Not provided"
                }
              />

              <div className="sm:col-span-2">
                <InfoCard
                  icon={
                    <FiMail />
                  }
                  label="Email Address"
                  value={
                    user.email ||
                    "Not provided"
                  }
                  allowWrap
                />
              </div>

              <InfoCard
                icon={
                  <FiShield />
                }
                label="Account Type"
                value="Velmora Member"
              />

              <InfoCard
                icon={
                  <FiShield />
                }
                label="Account Status"
                value="Active"
                success
              />
            </div>

            {/* BRAND MESSAGE */}

            <div
              className="
                relative

                mt-7

                overflow-hidden

                rounded-[22px]

                bg-[#302C3C]

                p-5

                text-white

                sm:p-6
              "
            >
              <div
                className="
                  pointer-events-none

                  absolute
                  -right-12
                  -top-12

                  h-36
                  w-36

                  rounded-full

                  bg-[#B8A1FF]/20

                  blur-3xl
                "
              />

              <div className="relative">
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.2em]

                    text-[#CFC1FF]
                  "
                >
                  The Velmora
                  Experience
                </p>

                <h3
                  className="
                    mt-2

                    text-lg
                    font-bold

                    sm:text-xl
                  "
                >
                  Beauty,
                  thoughtfully
                  personal.
                </h3>

                <p
                  className="
                    mt-2

                    max-w-xl

                    text-sm
                    leading-6

                    text-white/65
                  "
                >
                  Your account
                  keeps your
                  Velmora
                  shopping
                  experience
                  connected,
                  personal and
                  easy to
                  revisit.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  icon,
  label,
  value,
  allowWrap = false,
  success = false,
}) {
  return (
    <div
      className="
        flex
        min-h-[88px]
        items-start
        gap-3

        rounded-2xl

        border
        border-[#EEE8F3]

        bg-[#FCFBFD]

        p-4
      "
    >
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center

          rounded-xl

          bg-[#F1ECFF]

          text-[#6C5CE7]
        "
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-[0.12em]

            text-[#9D96A1]
          "
        >
          {label}
        </p>

        <p
          className={`
            mt-1

            text-sm
            font-bold

            ${
              success
                ? "text-[#438164]"
                : "text-[#403A44]"
            }

            ${
              allowWrap
                ? "break-all"
                : "truncate"
            }
          `}
        >
          {value}
        </p>
      </div>
    </div>
  );
}