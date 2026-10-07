import axios from "axios";

import {
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaGoogle,
} from "react-icons/fa";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";

import {
  useGoogleLogin,
} from "@react-oauth/google";

/*
=========================================================
VELMORA LOGIN EXPERIENCE
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
Luxury Beauty
Quiet Elegance
Premium Ecommerce
Soft Confidence
=========================================================
*/

/* =========================================================
   LUXURY PRODUCT VISUAL
========================================================= */

function VelmoraLoginVisual() {
  return (
    <div
      className="
        relative

        mx-auto

        aspect-square

        w-full
        max-w-[470px]
      "
    >
      {/* =============================================
          BACKGROUND GLASS
      ============================================= */}

      <div
        className="
          absolute
          inset-[3%]

          overflow-hidden

          rounded-[42px]

          border
          border-white/30

          bg-white/10

          shadow-[0_35px_100px_rgba(24,18,38,0.20)]

          backdrop-blur-xl
        "
      >
        <div
          className="
            pointer-events-none

            absolute
            -left-20
            -top-20

            h-64
            w-64

            rounded-full

            bg-[#B8A1FF]/25

            blur-[80px]
          "
        />

        <div
          className="
            pointer-events-none

            -bottom-24
            -right-20

            absolute

            h-72
            w-72

            rounded-full

            bg-[#F2B8C6]/20

            blur-[90px]
          "
        />

        <div
          className="
            pointer-events-none

            absolute
            right-[10%]
            top-[10%]

            h-40
            w-40

            rounded-full

            bg-[#EADBC8]/20

            blur-[55px]
          "
        />
      </div>

      {/* =============================================
          DECORATIVE RINGS
      ============================================= */}

      <div
        className="
          absolute
          inset-[12%]

          rounded-full

          border
          border-white/15
        "
      />

      <div
        className="
          absolute
          inset-[22%]

          rounded-full

          border
          border-[#EADBC8]/20
        "
      />

      {/* =============================================
          PRODUCT PLATFORM
      ============================================= */}

      <div
        className="
          absolute

          bottom-[11%]
          left-1/2

          h-[15%]
          w-[66%]

          -translate-x-1/2

          rounded-[50%]

          bg-gradient-to-b
          from-white/85
          to-[#D9D0E1]/75

          shadow-[0_24px_35px_rgba(20,16,30,0.22)]
        "
      />

      {/* =============================================
          SERUM
      ============================================= */}

      <div
        className="
          absolute

          bottom-[23%]
          left-[18%]

          h-[46%]
          w-[22%]

          transition-all
          duration-700

          hover:-translate-y-2
          hover:rotate-[-2deg]
        "
      >
        {/* Top */}

        <div
          className="
            absolute

            left-1/2
            top-0

            h-[16%]
            w-[42%]

            -translate-x-1/2

            rounded-t-xl
            rounded-b-md

            bg-gradient-to-b
            from-[#E0C896]
            via-[#B9955B]
            to-[#96703E]

            shadow-lg
          "
        />

        {/* Neck */}

        <div
          className="
            absolute

            left-1/2
            top-[13%]

            h-[9%]
            w-[31%]

            -translate-x-1/2

            bg-[#EADBC8]
          "
        />

        {/* Bottle */}

        <div
          className="
            absolute

            bottom-0

            h-[80%]
            w-full

            overflow-hidden

            rounded-t-[28%]
            rounded-b-[22%]

            border
            border-white/60

            bg-gradient-to-br
            from-white/90
            via-[#DCD2FF]/80
            to-[#9E88E5]/85

            shadow-[0_20px_36px_rgba(28,22,43,0.26)]
          "
        >
          <div
            className="
              absolute

              bottom-0

              h-[58%]
              w-full

              bg-gradient-to-t
              from-[#866DD3]/70
              to-transparent
            "
          />

          <div
            className="
              absolute

              left-[12%]
              top-[7%]

              h-[72%]
              w-[11%]

              rounded-full

              bg-white/38
            "
          />

          <div
            className="
              absolute

              left-1/2
              top-[38%]

              w-[72%]

              -translate-x-1/2

              rounded-md

              bg-white/90

              px-1
              py-2

              text-center
            "
          >
            <p
              className="
                text-[7px]
                font-black
                tracking-[0.17em]

                text-[#6C5CE7]
              "
            >
              VELMORA
            </p>

            <p
              className="
                mt-1

                text-[5px]
                uppercase
                tracking-[0.12em]

                text-[#8E8494]
              "
            >
              radiance
            </p>
          </div>
        </div>
      </div>

      {/* =============================================
          CREAM JAR
      ============================================= */}

      <div
        className="
          absolute

          bottom-[21%]
          left-[41%]

          h-[26%]
          w-[29%]

          transition-all
          duration-700

          hover:-translate-y-2
        "
      >
        {/* Body */}

        <div
          className="
            absolute

            bottom-0

            h-[68%]
            w-full

            overflow-hidden

            rounded-[34%]

            border
            border-white/70

            bg-gradient-to-br
            from-white
            via-[#FFF0F5]
            to-[#EDC5D2]

            shadow-[0_18px_34px_rgba(29,23,42,0.20)]
          "
        >
          <div
            className="
              absolute

              left-1/2
              top-[35%]

              -translate-x-1/2

              text-center
            "
          >
            <p
              className="
                text-[7px]
                font-black
                tracking-[0.14em]

                text-[#6C5CE7]
              "
            >
              VELMORA
            </p>

            <p
              className="
                mt-1

                text-[5px]
                uppercase

                text-[#998E99]
              "
            >
              velvet
            </p>
          </div>
        </div>

        {/* Lid */}

        <div
          className="
            absolute

            left-[3%]
            top-[14%]

            h-[29%]
            w-[94%]

            rounded-[40%]

            bg-gradient-to-br
            from-[#D9CDFF]
            via-[#B8A1FF]
            to-[#8169CF]

            shadow-lg
          "
        />
      </div>

      {/* =============================================
          PERFUME
      ============================================= */}

      <div
        className="
          absolute

          bottom-[23%]
          right-[14%]

          h-[39%]
          w-[21%]

          transition-all
          duration-700

          hover:-translate-y-2
          hover:rotate-[2deg]
        "
      >
        {/* Cap */}

        <div
          className="
            absolute

            left-1/2
            top-0

            h-[18%]
            w-[48%]

            -translate-x-1/2

            rounded-md

            bg-[#25242A]

            shadow-lg
          "
        />

        {/* Gold neck */}

        <div
          className="
            absolute

            left-1/2
            top-[15%]

            h-[9%]
            w-[30%]

            -translate-x-1/2

            bg-gradient-to-r
            from-[#B58B4F]
            via-[#E0C389]
            to-[#A67942]
          "
        />

        {/* Bottle */}

        <div
          className="
            absolute

            bottom-0

            h-[79%]
            w-full

            overflow-hidden

            rounded-[18%]

            border
            border-white/65

            bg-gradient-to-br
            from-white/88
            via-[#F2D5DF]/78
            to-[#D28DA6]/82

            shadow-[0_20px_35px_rgba(28,22,42,0.22)]
          "
        >
          <div
            className="
              absolute

              left-[12%]
              top-[7%]

              h-[65%]
              w-[10%]

              rounded-full

              bg-white/35
            "
          />

          <div
            className="
              absolute

              left-1/2
              top-[41%]

              -translate-x-1/2

              text-center
            "
          >
            <p
              className="
                text-[7px]
                font-black
                tracking-[0.15em]

                text-[#583E67]
              "
            >
              VELMORA
            </p>

            <p
              className="
                mt-1

                text-[5px]
                uppercase

                text-[#77666F]
              "
            >
              essence
            </p>
          </div>
        </div>
      </div>

      {/* =============================================
          FLOATING CARDS
      ============================================= */}

      <div
        className="
          absolute

          left-[0%]
          top-[18%]

          rounded-2xl

          border
          border-white/20

          bg-white/12

          px-4
          py-3

          text-white

          shadow-xl

          backdrop-blur-xl
        "
      >
        <p
          className="
            text-[9px]
            font-black
            uppercase
            tracking-[0.16em]

            text-[#E0D6FF]
          "
        >
          ✦ Curated
        </p>

        <p
          className="
            mt-1

            text-[10px]
            font-semibold

            text-white/70
          "
        >
          Beauty essentials
        </p>
      </div>

      <div
        className="
          absolute

          right-[1%]
          top-[22%]

          rounded-2xl

          border
          border-white/20

          bg-white/12

          px-4
          py-3

          text-white

          shadow-xl

          backdrop-blur-xl
        "
      >
        <p
          className="
            text-[9px]
            font-black
            uppercase
            tracking-[0.16em]

            text-[#F4C7D5]
          "
        >
          ♡ Personal
        </p>

        <p
          className="
            mt-1

            text-[10px]
            font-semibold

            text-white/70
          "
        >
          Your ritual
        </p>
      </div>

      <div
        className="
          absolute

          bottom-[2%]
          left-[28%]

          rounded-full

          border
          border-white/20

          bg-white/12

          px-4
          py-2

          text-[9px]
          font-black
          uppercase
          tracking-[0.17em]

          text-[#EADBC8]

          shadow-lg

          backdrop-blur-xl
        "
      >
        Beauty · Confidence
      </div>
    </div>
  );
}

/* =========================================================
   LOGIN PAGE
========================================================= */

export default function LoginPage() {
  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const navigate =
    useNavigate();

  /* =====================================================
     GOOGLE LOGIN
  ===================================================== */

  const googleLogin =
    useGoogleLogin({
      onSuccess:
        async (
          response
        ) => {
          try {
            const accessToken =
              response.access_token;

            const result =
              await axios.post(
                import.meta
                  .env
                  .VITE_BACKEND_URL +
                  "/api/user/login/google",
                {
                  accessToken:
                    accessToken,
                }
              );

            localStorage.setItem(
              "token",
              result.data
                .token
            );

            toast.success(
              "Welcome to Velmora!"
            );

            if (
              result.data
                .role ===
              "admin"
            ) {
              navigate(
                "/admin/"
              );
            } else {
              navigate(
                "/"
              );
            }
          } catch (error) {
            console.error(
              "Google login error:",
              error.response
                ?.data ||
                error.message
            );

            toast.error(
              error.response
                ?.data
                ?.message ||
                "Google sign-in failed"
            );
          }
        },

      onError: () => {
        console.error(
          "Google Login Failed"
        );

        toast.error(
          "Google sign-in failed"
        );
      },
    });

  /* =====================================================
     NORMAL LOGIN
  ===================================================== */

  async function handleLogin(
    event
  ) {
    event.preventDefault();

    if (
      !email.trim()
    ) {
      toast.error(
        "Please enter your email"
      );

      return;
    }

    if (
      !password.trim()
    ) {
      toast.error(
        "Please enter your password"
      );

      return;
    }

    try {
      setIsLoading(
        true
      );

      const res =
        await axios.post(
          import.meta.env
            .VITE_BACKEND_URL +
            "/api/user/login",
          {
            // Preserve the user's
            // email casing.
            email:
              email.trim(),

            password:
              password,
          }
        );

      localStorage.setItem(
        "token",
        res.data.token
      );

      toast.success(
        "Welcome back to Velmora!"
      );

      if (
        res.data.role ===
        "admin"
      ) {
        navigate(
          "/admin"
        );
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      if (
        error.response
      ) {
        toast.error(
          error.response.data
            ?.message ||
            "Sign in failed"
        );
      } else {
        toast.error(
          "Unable to connect to Velmora. Please try again."
        );
      }
    } finally {
      setIsLoading(
        false
      );
    }
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <main
      className="
        relative

        flex
        min-h-screen
        w-full

        overflow-hidden

        bg-[#FAF9F7]

        pt-[72px]

        md:pt-[80px]
      "
    >
      {/* ===================================================
          PAGE DECORATION
      =================================================== */}

      <div
        className="
          pointer-events-none

          absolute
          -left-36
          -top-20

          h-[420px]
          w-[420px]

          rounded-full

          bg-[#B8A1FF]/15

          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none

          absolute
          -bottom-40
          right-[-130px]

          h-[460px]
          w-[460px]

          rounded-full

          bg-[#F2B8C6]/14

          blur-[130px]
        "
      />

      {/* ===================================================
          MAIN LAYOUT
      =================================================== */}

      <div
        className="
          relative
          z-10

          grid
          w-full
          grid-cols-1

          lg:grid-cols-[1.03fr_0.97fr]
        "
      >
        {/* =================================================
            LEFT LUXURY BRAND EXPERIENCE
        ================================================= */}

        <section
          className="
            relative

            hidden

            min-h-[calc(100vh-80px)]

            overflow-hidden

            bg-[#302C3C]

            lg:flex
            lg:flex-col
            lg:justify-center
          "
        >
          {/* Lavender light */}

          <div
            className="
              pointer-events-none

              absolute
              -left-36
              -top-32

              h-[480px]
              w-[480px]

              rounded-full

              bg-[#6C5CE7]/30

              blur-[130px]
            "
          />

          {/* Rose light */}

          <div
            className="
              pointer-events-none

              absolute
              -bottom-40
              right-[-100px]

              h-[480px]
              w-[480px]

              rounded-full

              bg-[#F2B8C6]/15

              blur-[130px]
            "
          />

          {/* Champagne line */}

          <div
            className="
              pointer-events-none

              absolute
              left-0
              top-0

              h-full
              w-px

              bg-gradient-to-b
              from-transparent
              via-[#EADBC8]/25
              to-transparent
            "
          />

          <div
            className="
              relative

              mx-auto

              grid
              w-full
              max-w-[900px]
              grid-cols-[0.82fr_1.18fr]
              items-center

              gap-8

              px-10
              py-12

              xl:px-14
            "
          >
            {/* BRAND CONTENT */}

            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2

                  rounded-full

                  border
                  border-white/10

                  bg-white/8

                  px-4
                  py-2

                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.24em]

                  text-[#D7CAFF]

                  backdrop-blur-xl
                "
              >
                <span
                  className="
                    text-[#EADBC8]
                  "
                >
                  ✦
                </span>

                Welcome to
                Velmora
              </div>

              <h1
                className="
                  mt-6

                  text-4xl
                  font-extrabold
                  leading-[1.04]
                  tracking-[-0.045em]

                  text-white

                  xl:text-[52px]
                "
              >
                Return to your{" "}

                <span
                  className="
                    font-serif
                    font-medium
                    italic

                    bg-gradient-to-r
                    from-[#D7C9FF]
                    via-[#E9C4D0]
                    to-[#EADBC8]

                    bg-clip-text
                    text-transparent
                  "
                >
                  beauty ritual.
                </span>
              </h1>

              <p
                className="
                  mt-5

                  max-w-[430px]

                  text-sm
                  leading-7

                  text-white/60

                  xl:text-base
                  xl:leading-8
                "
              >
                Sign in to
                continue
                exploring your
                Velmora
                collection,
                manage orders
                and return to
                beauty
                favourites
                selected for
                your routine.
              </p>

              {/* BENEFITS */}

              <div
                className="
                  mt-8

                  space-y-3
                "
              >
                {[
                  "Continue your shopping journey",
                  "Manage your Velmora orders",
                  "Return to your beauty favourites",
                ].map(
                  (item) => (
                    <div
                      key={
                        item
                      }
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >
                      <div
                        className="
                          flex
                          h-7
                          w-7
                          shrink-0
                          items-center
                          justify-center

                          rounded-full

                          border
                          border-[#B8A1FF]/30

                          bg-[#B8A1FF]/10

                          text-xs
                          text-[#D9CEFF]
                        "
                      >
                        <FiCheck />
                      </div>

                      <p
                        className="
                          text-xs
                          font-medium

                          text-white/65

                          xl:text-sm
                        "
                      >
                        {
                          item
                        }
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* SIGNATURE */}

              <div
                className="
                  mt-10

                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    h-px
                    w-10

                    bg-[#EADBC8]/60
                  "
                />

                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.22em]

                    text-white/45
                  "
                >
                  Beauty ·
                  Skincare ·
                  Confidence
                </p>
              </div>
            </div>

            {/* LUXURY PRODUCTS */}

            <VelmoraLoginVisual />
          </div>
        </section>

        {/* =================================================
            LOGIN AREA
        ================================================= */}

        <section
          className="
            relative

            flex
            min-h-[calc(100vh-72px)]
            items-center
            justify-center

            px-3
            py-6

            sm:px-6
            sm:py-10

            md:min-h-[calc(100vh-80px)]

            lg:px-8
            lg:py-12

            xl:px-12
          "
        >
          {/* Mobile top decoration */}

          <div
            className="
              pointer-events-none

              absolute
              left-1/2
              top-0

              h-[280px]
              w-[330px]

              -translate-x-1/2

              rounded-full

              bg-[#B8A1FF]/14

              blur-[90px]

              lg:hidden
            "
          />

          <div
            className="
              relative

              w-full
              max-w-[500px]

              overflow-hidden

              rounded-[28px]

              border
              border-[#E9E2F1]

              bg-white/88

              px-5
              py-7

              shadow-[0_28px_90px_rgba(64,49,87,0.11)]

              backdrop-blur-2xl

              sm:rounded-[34px]
              sm:px-8
              sm:py-9

              md:px-10

              lg:rounded-[36px]
            "
          >
            {/* Card decorations */}

            <div
              className="
                pointer-events-none

                absolute
                -right-20
                -top-20

                h-52
                w-52

                rounded-full

                bg-[#B8A1FF]/12

                blur-3xl
              "
            />

            <div
              className="
                pointer-events-none

                absolute
                -bottom-20
                -left-20

                h-48
                w-48

                rounded-full

                bg-[#F2B8C6]/10

                blur-3xl
              "
            />

            <div
              className="
                relative
                z-10
              "
            >
              {/* =========================================
                  MOBILE BRAND
              ========================================= */}

              <div
                className="
                  mb-7

                  flex
                  items-center
                  justify-between

                  lg:hidden
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
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center

                      rounded-2xl

                      bg-gradient-to-br
                      from-[#6C5CE7]
                      to-[#B8A1FF]

                      text-lg
                      text-white

                      shadow-[0_10px_22px_rgba(108,92,231,0.25)]
                    "
                  >
                    ✦
                  </div>

                  <div>
                    <p
                      className="
                        text-[15px]
                        font-black
                        tracking-[0.18em]

                        text-[#2F3136]
                      "
                    >
                      VELMORA
                    </p>

                    <p
                      className="
                        mt-0.5

                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.13em]

                        text-[#9A8FA0]
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
                    border-[#DDD4F1]

                    bg-[#F8F5FF]

                    px-2.5
                    py-1.5

                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.12em]

                    text-[#6C5CE7]
                  "
                >
                  Sign In
                </span>
              </div>

              {/* =========================================
                  HEADING
              ========================================= */}

              <div>
                <p
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.22em]

                    text-[#6C5CE7]

                    sm:text-[11px]
                  "
                >
                  Welcome Back
                </p>

                <h2
                  className="
                    mt-2

                    text-[30px]
                    font-extrabold
                    leading-[1.08]
                    tracking-[-0.035em]

                    text-[#2F3136]

                    sm:text-[36px]
                  "
                >
                  Sign in to
                  Velmora.
                </h2>

                <p
                  className="
                    mt-3

                    text-sm
                    leading-6

                    text-[#77717C]

                    sm:text-[15px]
                    sm:leading-7
                  "
                >
                  Continue your
                  beauty journey,
                  manage your
                  account and
                  return to your
                  favourite
                  selections.
                </p>
              </div>

              {/* =========================================
                  FORM
              ========================================= */}

              <form
                onSubmit={
                  handleLogin
                }
                className="
                  mt-7
                  space-y-5

                  sm:mt-8
                "
              >
                {/* =====================================
                    EMAIL
                ===================================== */}

                <div>
                  <label
                    htmlFor="email"
                    className="
                      mb-2
                      block

                      text-sm
                      font-bold

                      text-[#4B4550]
                    "
                  >
                    Email address
                  </label>

                  <div
                    className="
                      relative
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
                      <FiMail
                        aria-hidden="true"
                        className="
                          text-[17px]
                        "
                      />
                    </div>

                    <input
                      id="email"
                      type="email"
                      value={
                        email
                      }
                      autoComplete="email"
                      placeholder="Enter your email address"
                      onChange={(
                        event
                      ) =>
                        setEmail(
                          event
                            .target
                            .value
                        )
                      }
                      className="
                        min-h-[56px]
                        w-full

                        rounded-2xl

                        border
                        border-[#E2DCE7]

                        bg-[#FFFEFF]

                        pl-[58px]
                        pr-4

                        text-[15px]
                        text-[#2F3136]

                        outline-none

                        transition-all
                        duration-300

                        placeholder:text-[#AAA3AE]

                        hover:border-[#D4CADD]

                        focus:border-[#B8A1FF]
                        focus:ring-4
                        focus:ring-[#B8A1FF]/15

                        sm:min-h-[58px]
                        sm:text-base
                      "
                      required
                    />
                  </div>
                </div>

                {/* =====================================
                    PASSWORD
                ===================================== */}

                <div>
                  <div
                    className="
                      mb-2

                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <label
                      htmlFor="password"
                      className="
                        text-sm
                        font-bold

                        text-[#4B4550]
                      "
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/forget"
                        )
                      }
                      className="
                        rounded-md

                        text-xs
                        font-bold

                        text-[#6C5CE7]

                        transition-colors

                        hover:text-[#5847C9]
                        hover:underline

                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-[#B8A1FF]
                        focus-visible:ring-offset-2

                        sm:text-sm
                      "
                    >
                      Forgot
                      password?
                    </button>
                  </div>

                  <div
                    className="
                      relative
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
                      <FiLock
                        aria-hidden="true"
                        className="
                          text-[17px]
                        "
                      />
                    </div>

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        password
                      }
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      onChange={(
                        event
                      ) =>
                        setPassword(
                          event
                            .target
                            .value
                        )
                      }
                      className="
                        min-h-[56px]
                        w-full

                        rounded-2xl

                        border
                        border-[#E2DCE7]

                        bg-[#FFFEFF]

                        pl-[58px]
                        pr-[58px]

                        text-[15px]
                        text-[#2F3136]

                        outline-none

                        transition-all
                        duration-300

                        placeholder:text-[#AAA3AE]

                        hover:border-[#D4CADD]

                        focus:border-[#B8A1FF]
                        focus:ring-4
                        focus:ring-[#B8A1FF]/15

                        sm:min-h-[58px]
                        sm:text-base
                      "
                      required
                    />

                    {/* SHOW / HIDE */}

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="
                        absolute
                        right-3
                        top-1/2

                        flex
                        h-10
                        w-10
                        -translate-y-1/2
                        items-center
                        justify-center

                        rounded-xl

                        text-[#918A96]

                        transition-all
                        duration-200

                        hover:bg-[#F2EDFF]
                        hover:text-[#6C5CE7]

                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-[#B8A1FF]
                      "
                    >
                      {showPassword ? (
                        <FiEyeOff
                          aria-hidden="true"
                          className="
                            text-lg
                          "
                        />
                      ) : (
                        <FiEye
                          aria-hidden="true"
                          className="
                            text-lg
                          "
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* =====================================
                    LOGIN BUTTON
                ===================================== */}

                <button
                  type="submit"
                  disabled={
                    isLoading
                  }
                  className="
                    flex
                    min-h-[56px]
                    w-full
                    items-center
                    justify-center
                    gap-2

                    rounded-2xl

                    bg-gradient-to-r
                    from-[#6C5CE7]
                    to-[#927EF1]

                    px-6

                    text-[15px]
                    font-bold

                    text-white

                    shadow-[0_12px_28px_rgba(108,92,231,0.24)]

                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:shadow-[0_17px_36px_rgba(108,92,231,0.32)]

                    active:scale-[0.99]

                    focus:outline-none
                    focus-visible:ring-4
                    focus-visible:ring-[#B8A1FF]/30

                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    disabled:hover:translate-y-0

                    sm:text-base
                  "
                >
                  {isLoading ? (
                    <>
                      <span
                        className="
                          h-5
                          w-5

                          animate-spin

                          rounded-full

                          border-2
                          border-white/35
                          border-t-white
                        "
                      />

                      Signing in...
                    </>
                  ) : (
                    <>
                      Continue to
                      Velmora

                      <FiArrowRight />
                    </>
                  )}
                </button>

                {/* =====================================
                    DIVIDER
                ===================================== */}

                <div
                  className="
                    flex
                    items-center
                    gap-3

                    py-1
                  "
                >
                  <span
                    className="
                      h-px
                      flex-1

                      bg-[#ECE7F0]
                    "
                  />

                  <span
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.14em]

                      text-[#AAA3AE]
                    "
                  >
                    or
                  </span>

                  <span
                    className="
                      h-px
                      flex-1

                      bg-[#ECE7F0]
                    "
                  />
                </div>

                {/* =====================================
                    GOOGLE
                ===================================== */}

                <button
                  type="button"
                  onClick={
                    googleLogin
                  }
                  className="
                    flex
                    min-h-[56px]
                    w-full
                    items-center
                    justify-center
                    gap-3

                    rounded-2xl

                    border
                    border-[#DFD9E5]

                    bg-white

                    px-6

                    text-sm
                    font-bold

                    text-[#514B57]

                    shadow-sm

                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:border-[#CFC4DA]
                    hover:bg-[#FCFAFD]
                    hover:shadow-md

                    active:scale-[0.99]

                    focus:outline-none
                    focus-visible:ring-4
                    focus-visible:ring-[#B8A1FF]/15

                    sm:text-base
                  "
                >
                  <FaGoogle
                    className="
                      text-lg
                      text-[#6C5CE7]
                    "
                  />

                  Continue with
                  Google
                </button>
              </form>

              {/* =========================================
                  CREATE ACCOUNT
              ========================================= */}

              <div
                className="
                  mt-7

                  border-t
                  border-[#ECE7F0]

                  pt-6

                  text-center
                "
              >
                <p
                  className="
                    text-sm
                    leading-6

                    text-[#7C7581]
                  "
                >
                  New to
                  Velmora?{" "}

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/signup"
                      )
                    }
                    className="
                      rounded-md

                      font-bold

                      text-[#6C5CE7]

                      transition-colors

                      hover:text-[#5847C9]
                      hover:underline

                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#B8A1FF]
                      focus-visible:ring-offset-2
                    "
                  >
                    Create your
                    account
                  </button>
                </p>
              </div>

              {/* =========================================
                  BOTTOM TRUST
              ========================================= */}

              <div
                className="
                  mt-6

                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <span
                  className="
                    h-px
                    w-6

                    bg-[#EADBC8]
                  "
                />

                <p
                  className="
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.18em]

                    text-[#A39AA7]

                    sm:text-[9px]
                  "
                >
                  Secure Velmora
                  Access
                </p>

                <span
                  className="
                    h-px
                    w-6

                    bg-[#EADBC8]
                  "
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}