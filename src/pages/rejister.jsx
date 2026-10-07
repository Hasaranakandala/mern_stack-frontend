import axios from "axios";

import {
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  Link,
  useNavigate,
} from "react-router-dom";

/*
=========================================================
VELMORA REGISTER EXPERIENCE
=========================================================

Primary Violet   #6C5CE7
Soft Lavender    #B8A1FF
Soft Rose        #F2B8C6
Champagne        #EADBC8
Warm Ivory       #FAF9F7
Surface White    #FFFFFF
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
   SMALL ICONS
========================================================= */

function EyeIcon({
  visible,
}) {
  if (visible) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M3 3l18 18" />

        <path d="M10.6 10.7a2 2 0 002.7 2.7" />

        <path d="M9.9 4.2A10 10 0 0112 4c5.5 0 9 8 9 8a15 15 0 01-2.1 3.2" />

        <path d="M6.2 6.2C4.1 8 3 12 3 12s3.5 8 9 8a9.7 9.7 0 004.1-.9" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />

      <circle
        cx="12"
        cy="12"
        r="3"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />

      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
      />

      <path d="M8 10V7a4 4 0 118 0v3" />
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
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
      />

      <path d="M4.5 20c.8-4 3.3-6 7.5-6s6.7 2 7.5 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

/* =========================================================
   LUXURY BRAND VISUAL
========================================================= */

function VelmoraRegisterVisual() {
  return (
    <div
      className="
        relative
        mx-auto
        aspect-square
        w-full
        max-w-[460px]
      "
    >
      {/* Glass background */}

      <div
        className="
          absolute
          inset-[3%]
          overflow-hidden
          rounded-[42px]
          border
          border-white/20
          bg-white/10
          shadow-[0_35px_100px_rgba(20,16,35,0.22)]
          backdrop-blur-xl
        "
      >
        <div
          className="
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
            absolute
            -bottom-24
            -right-20
            h-72
            w-72
            rounded-full
            bg-[#F2B8C6]/20
            blur-[90px]
          "
        />

        <div
          className="
            absolute
            right-[15%]
            top-[10%]
            h-40
            w-40
            rounded-full
            bg-[#EADBC8]/18
            blur-[55px]
          "
        />
      </div>

      {/* Decorative circles */}

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
          inset-[23%]
          rounded-full
          border
          border-[#EADBC8]/20
        "
      />

      {/* Platform */}

      <div
        className="
          absolute
          bottom-[11%]
          left-1/2
          h-[15%]
          w-[67%]
          -translate-x-1/2
          rounded-[50%]
          bg-gradient-to-b
          from-white/85
          to-[#D9D0E1]/75
          shadow-[0_25px_36px_rgba(20,16,30,0.24)]
        "
      />

      {/* Serum */}

      <div
        className="
          absolute
          bottom-[23%]
          left-[17%]
          h-[47%]
          w-[22%]
          transition-all
          duration-700
          hover:-translate-y-2
          hover:rotate-[-2deg]
        "
      >
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
            shadow-[0_20px_36px_rgba(28,22,43,0.27)]
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

      {/* Cream */}

      <div
        className="
          absolute
          bottom-[21%]
          left-[41%]
          h-[27%]
          w-[29%]
          transition-all
          duration-700
          hover:-translate-y-2
        "
      >
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

      {/* Perfume */}

      <div
        className="
          absolute
          bottom-[23%]
          right-[13%]
          h-[40%]
          w-[21%]
          transition-all
          duration-700
          hover:-translate-y-2
          hover:rotate-[2deg]
        "
      >
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

      {/* Floating cards */}

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
          ✦ Discover
        </p>

        <p
          className="
            mt-1
            text-[10px]
            font-semibold
            text-white/65
          "
        >
          Your beauty ritual
        </p>
      </div>

      <div
        className="
          absolute
          right-[0%]
          top-[20%]
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
            text-[#F5C9D6]
          "
        >
          ♡ Personal
        </p>

        <p
          className="
            mt-1
            text-[10px]
            font-semibold
            text-white/65
          "
        >
          Beauty for you
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
          tracking-[0.18em]
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
   REGISTER PAGE
========================================================= */

export default function RegisterPage() {
  /* =====================================================
     STATE
  ===================================================== */

  const [
    firstName,
    setFirstName,
  ] = useState("");

  const [
    lastName,
    setLastName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const navigate =
    useNavigate();

  /* =====================================================
     PASSWORD STRENGTH
  ===================================================== */

  const passwordStrength =
    useMemo(() => {
      let score = 0;

      if (
        password.length >=
        8
      ) {
        score++;
      }

      if (
        /[a-z]/.test(
          password
        )
      ) {
        score++;
      }

      if (
        /[A-Z]/.test(
          password
        )
      ) {
        score++;
      }

      if (
        /[0-9]/.test(
          password
        )
      ) {
        score++;
      }

      if (
        /[^A-Za-z0-9]/.test(
          password
        )
      ) {
        score++;
      }

      return score;
    }, [password]);

  function getPasswordStrengthText() {
    if (!password) {
      return "";
    }

    if (
      passwordStrength <=
      2
    ) {
      return "Weak";
    }

    if (
      passwordStrength <=
      4
    ) {
      return "Good";
    }

    return "Strong";
  }

  function getPasswordStrengthColor(
    index
  ) {
    if (
      passwordStrength <=
      index
    ) {
      return "bg-[#EAE6ED]";
    }

    if (
      passwordStrength <=
      2
    ) {
      return "bg-[#D95C5C]";
    }

    if (
      passwordStrength <=
      4
    ) {
      return "bg-[#C7A565]";
    }

    return "bg-[#4F9D7A]";
  }

  /* =====================================================
     VALIDATION
  ===================================================== */

  function validateForm() {
    if (
      firstName.trim() ===
        "" ||
      lastName.trim() ===
        "" ||
      email.trim() === "" ||
      password === "" ||
      confirmPassword ===
        ""
    ) {
      toast.error(
        "Please complete all fields."
      );

      return false;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(
        email.trim()
      )
    ) {
      toast.error(
        "Please enter a valid email address."
      );

      return false;
    }

    if (
      password.length <
      8
    ) {
      toast.error(
        "Password must contain at least 8 characters."
      );

      return false;
    }

    if (
      password !==
      confirmPassword
    ) {
      toast.error(
        "Passwords do not match."
      );

      return false;
    }

    return true;
  }

  /* =====================================================
     REGISTER
  ===================================================== */

  async function handleRegister(
    event
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (
      !validateForm()
    ) {
      return;
    }

    try {
      setLoading(true);

      const response =
        await axios.post(
          `${
            import.meta.env
              .VITE_BACKEND_URL
          }/api/user`,
          {
            firstName:
              firstName.trim(),

            lastName:
              lastName.trim(),

            // Keep original
            // email casing.
            email:
              email.trim(),

            password:
              password,
          },
          {
            timeout:
              15000,
          }
        );

      console.log(
        "REGISTER RESPONSE:",
        response.data
      );

      toast.success(
        "Welcome to Velmora! Your account has been created."
      );

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate(
          "/login"
        );
      }, 600);
    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      if (
        error.code ===
        "ECONNABORTED"
      ) {
        toast.error(
          "The request took too long. Please try again."
        );

        return;
      }

      if (
        error.response
      ) {
        toast.error(
          error.response.data
            ?.message ||
            "Unable to create your account."
        );
      } else if (
        error.request
      ) {
        toast.error(
          "Unable to connect to Velmora. Please try again."
        );
      } else {
        toast.error(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(
        false
      );
    }
  }

  /* =====================================================
     PASSWORD MATCH
  ===================================================== */

  const passwordsMatch =
    confirmPassword.length >
      0 &&
    password ===
      confirmPassword;

  const passwordsDifferent =
    confirmPassword.length >
      0 &&
    password !==
      confirmPassword;

  /* =====================================================
     BASE INPUT STYLE
  ===================================================== */

  const inputStyle = `
    min-h-[56px]
    w-full

    rounded-2xl

    border
    border-[#E2DCE7]

    bg-[#FFFEFF]

    px-4

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
  `;

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
      "
    >
      {/* ===================================================
          BACKGROUND LIGHTS
      =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-36
          -top-24
          h-[430px]
          w-[430px]
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
          h-[470px]
          w-[470px]
          rounded-full
          bg-[#F2B8C6]/14
          blur-[130px]
        "
      />

      <main
        className="
          relative
          z-10
          flex
          min-h-screen
          w-full
          items-center
          justify-center
          px-3
          py-5

          sm:px-6
          sm:py-8

          lg:px-8
        "
      >
        <div
          className="
            grid
            w-full
            max-w-[1320px]
            overflow-hidden
            rounded-[28px]
            border
            border-[#E9E2F1]
            bg-white
            shadow-[0_30px_100px_rgba(59,45,80,0.13)]

            sm:rounded-[34px]

            lg:min-h-[760px]
            lg:grid-cols-[1.03fr_0.97fr]
            lg:rounded-[40px]
          "
        >
          {/* =================================================
              LEFT BRAND SIDE
          ================================================= */}

          <section
            className="
              relative
              hidden
              overflow-hidden
              bg-[#302C3C]

              lg:flex
              lg:flex-col
              lg:justify-between
              lg:p-12

              xl:p-14
            "
          >
            {/* atmosphere */}

            <div
              className="
                pointer-events-none
                absolute
                -left-32
                -top-28
                h-[470px]
                w-[470px]
                rounded-full
                bg-[#6C5CE7]/30
                blur-[130px]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-36
                right-[-100px]
                h-[470px]
                w-[470px]
                rounded-full
                bg-[#F2B8C6]/15
                blur-[130px]
              "
            />

            {/* BRAND */}

            <Link
              to="/"
              className="
                relative
                z-10
                inline-flex
                w-fit
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-[#6C5CE7]
                  to-[#B8A1FF]
                  text-lg
                  text-white
                  shadow-[0_10px_25px_rgba(108,92,231,0.28)]
                "
              >
                ✦
              </div>

              <div>
                <p
                  className="
                    text-lg
                    font-black
                    tracking-[0.18em]
                    text-white
                  "
                >
                  VELMORA
                </p>

                <p
                  className="
                    mt-0.5
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-white/45
                  "
                >
                  Beauty ·
                  Skincare ·
                  Confidence
                </p>
              </div>
            </Link>

            {/* MAIN BRAND CONTENT */}

            <div
              className="
                relative
                z-10
                grid
                grid-cols-[0.84fr_1.16fr]
                items-center
                gap-6
              "
            >
              <div>
                <p
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.25em]
                    text-[#D6CAFF]
                  "
                >
                  Begin Your
                  Velmora Journey
                </p>

                <h1
                  className="
                    mt-6
                    text-[42px]
                    font-extrabold
                    leading-[1.04]
                    tracking-[-0.045em]
                    text-white

                    xl:text-[52px]
                  "
                >
                  Create a
                  beauty space
                  that feels{" "}

                  <span
                    className="
                      font-serif
                      font-medium
                      italic
                      bg-gradient-to-r
                      from-[#D8CBFF]
                      via-[#ECC5D2]
                      to-[#EADBC8]
                      bg-clip-text
                      text-transparent
                    "
                  >
                    yours.
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
                  Join Velmora
                  to discover
                  thoughtfully
                  curated beauty,
                  manage your
                  orders and
                  build a
                  shopping
                  experience
                  around your
                  personal
                  routine.
                </p>

                <div
                  className="
                    mt-8
                    space-y-3
                  "
                >
                  {[
                    "Discover curated beauty essentials",
                    "Manage your orders with ease",
                    "Return to products you love",
                  ].map(
                    (
                      item
                    ) => (
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
                            text-[#DED5FF]
                          "
                        >
                          <CheckIcon />
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
              </div>

              <VelmoraRegisterVisual />
            </div>

            {/* FOOTER */}

            <p
              className="
                relative
                z-10
                text-[10px]
                text-white/35
              "
            >
              © 2026 Velmora.
              Beauty • Skincare •
              Confidence
            </p>
          </section>

          {/* =================================================
              RIGHT FORM
          ================================================= */}

          <section
            className="
              relative
              flex
              items-center
              justify-center
              bg-[#FAF9F7]
              px-4
              py-7

              sm:px-8
              sm:py-10

              lg:px-10
              lg:py-10

              xl:px-14
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                right-[-80px]
                top-[-80px]
                h-56
                w-56
                rounded-full
                bg-[#B8A1FF]/12
                blur-3xl
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                bottom-[-80px]
                left-[-80px]
                h-56
                w-56
                rounded-full
                bg-[#F2B8C6]/10
                blur-3xl
              "
            />

            <div
              className="
                relative
                z-10
                w-full
                max-w-[510px]
              "
            >
              {/* =========================================
                  MOBILE BRAND
              ========================================= */}

              <Link
                to="/"
                className="
                  mb-7
                  flex
                  items-center
                  justify-between
                  gap-4

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
                  Join
                </span>
              </Link>

              {/* =========================================
                  TITLE
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
                  Welcome to
                  Velmora
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
                  Create your
                  account.
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
                  Begin your
                  Velmora beauty
                  journey and
                  make every
                  discovery feel
                  more personal.
                </p>
              </div>

              {/* =========================================
                  FORM
              ========================================= */}

              <form
                onSubmit={
                  handleRegister
                }
                className="
                  mt-7
                  space-y-4

                  sm:mt-8
                "
              >
                {/* FIRST + LAST */}

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-4

                    sm:grid-cols-2
                  "
                >
                  {/* FIRST */}

                  <div>
                    <label
                      htmlFor="firstName"
                      className="
                        mb-2
                        block
                        text-sm
                        font-bold
                        text-[#4B4550]
                      "
                    >
                      First name
                    </label>

                    <div className="relative">
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
                        <UserIcon />
                      </div>

                      <input
                        id="firstName"
                        type="text"
                        value={
                          firstName
                        }
                        autoComplete="given-name"
                        placeholder="First name"
                        onChange={(
                          event
                        ) =>
                          setFirstName(
                            event
                              .target
                              .value
                          )
                        }
                        className={`
                          ${inputStyle}
                          pl-[58px]
                        `}
                      />
                    </div>
                  </div>

                  {/* LAST */}

                  <div>
                    <label
                      htmlFor="lastName"
                      className="
                        mb-2
                        block
                        text-sm
                        font-bold
                        text-[#4B4550]
                      "
                    >
                      Last name
                    </label>

                    <div className="relative">
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
                        <UserIcon />
                      </div>

                      <input
                        id="lastName"
                        type="text"
                        value={
                          lastName
                        }
                        autoComplete="family-name"
                        placeholder="Last name"
                        onChange={(
                          event
                        ) =>
                          setLastName(
                            event
                              .target
                              .value
                          )
                        }
                        className={`
                          ${inputStyle}
                          pl-[58px]
                        `}
                      />
                    </div>
                  </div>
                </div>

                {/* EMAIL */}

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

                  <div className="relative">
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
                      <MailIcon />
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
                      className={`
                        ${inputStyle}
                        pl-[58px]
                      `}
                    />
                  </div>
                </div>

                {/* PASSWORD */}

                <div>
                  <label
                    htmlFor="password"
                    className="
                      mb-2
                      block
                      text-sm
                      font-bold
                      text-[#4B4550]
                    "
                  >
                    Password
                  </label>

                  <div className="relative">
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
                      <LockIcon />
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
                      autoComplete="new-password"
                      placeholder="Create a password"
                      onChange={(
                        event
                      ) =>
                        setPassword(
                          event
                            .target
                            .value
                        )
                      }
                      className={`
                        ${inputStyle}
                        pl-[58px]
                        pr-[58px]
                      `}
                    />

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
                      <EyeIcon
                        visible={
                          showPassword
                        }
                      />
                    </button>
                  </div>

                  {/* PASSWORD STRENGTH */}

                  {password && (
                    <div className="mt-3">
                      <div
                        className="
                          flex
                          gap-1.5
                        "
                      >
                        {[
                          0,
                          1,
                          2,
                          3,
                          4,
                        ].map(
                          (
                            index
                          ) => (
                            <div
                              key={
                                index
                              }
                              className={`
                                h-1.5
                                flex-1
                                rounded-full
                                transition-all
                                duration-300

                                ${getPasswordStrengthColor(
                                  index
                                )}
                              `}
                            />
                          )
                        )}
                      </div>

                      <div
                        className="
                          mt-2
                          flex
                          items-center
                          justify-between
                          gap-3
                          text-[10px]

                          sm:text-xs
                        "
                      >
                        <span
                          className="
                            text-[#9B94A0]
                          "
                        >
                          Use 8+
                          characters,
                          uppercase,
                          number &
                          symbol
                        </span>

                        <span
                          className={`
                            shrink-0
                            font-bold

                            ${
                              passwordStrength <=
                              2
                                ? "text-[#D95C5C]"
                                : passwordStrength <=
                                  4
                                ? "text-[#A17A43]"
                                : "text-[#4F9D7A]"
                            }
                          `}
                        >
                          {
                            getPasswordStrengthText()
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* CONFIRM PASSWORD */}

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="
                      mb-2
                      block
                      text-sm
                      font-bold
                      text-[#4B4550]
                    "
                  >
                    Confirm
                    password
                  </label>

                  <div className="relative">
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
                      <LockIcon />
                    </div>

                    <input
                      id="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        confirmPassword
                      }
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      onChange={(
                        event
                      ) =>
                        setConfirmPassword(
                          event
                            .target
                            .value
                        )
                      }
                      className={`
                        min-h-[56px]
                        w-full
                        rounded-2xl
                        border
                        bg-[#FFFEFF]
                        pl-[58px]
                        pr-[58px]
                        text-[15px]
                        text-[#2F3136]
                        outline-none
                        transition-all
                        duration-300

                        placeholder:text-[#AAA3AE]

                        sm:min-h-[58px]
                        sm:text-base

                        ${
                          passwordsDifferent
                            ? `
                              border-[#E5A6A6]
                              focus:border-[#D95C5C]
                              focus:ring-4
                              focus:ring-[#D95C5C]/10
                            `
                            : passwordsMatch
                            ? `
                              border-[#A7D4BF]
                              focus:border-[#4F9D7A]
                              focus:ring-4
                              focus:ring-[#4F9D7A]/10
                            `
                            : `
                              border-[#E2DCE7]
                              hover:border-[#D4CADD]
                              focus:border-[#B8A1FF]
                              focus:ring-4
                              focus:ring-[#B8A1FF]/15
                            `
                        }
                      `}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      aria-label={
                        showConfirmPassword
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
                      <EyeIcon
                        visible={
                          showConfirmPassword
                        }
                      />
                    </button>
                  </div>

                  {passwordsDifferent && (
                    <p
                      className="
                        mt-2
                        text-xs
                        font-semibold
                        text-[#D15C5C]
                      "
                    >
                      Passwords do
                      not match.
                    </p>
                  )}

                  {passwordsMatch && (
                    <p
                      className="
                        mt-2
                        flex
                        items-center
                        gap-1.5
                        text-xs
                        font-semibold
                        text-[#4F9D7A]
                      "
                    >
                      <CheckIcon />

                      Passwords
                      match
                    </p>
                  )}
                </div>

                {/* REGISTER */}

                <button
                  type="submit"
                  disabled={
                    loading
                  }
                  className="
                    group
                    relative
                    mt-2
                    flex
                    min-h-[56px]
                    w-full
                    items-center
                    justify-center
                    overflow-hidden
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
                  {/* Luxury shine */}

                  <span
                    className="
                      pointer-events-none
                      absolute
                      inset-y-0
                      -left-16
                      w-12
                      rotate-12
                      bg-white/25
                      blur-md
                      transition-all
                      duration-700
                      group-hover:left-[110%]
                    "
                  />

                  {loading ? (
                    <span
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >
                      <span
                        className="
                          h-5
                          w-5
                          animate-spin
                          rounded-full
                          border-2
                          border-white/40
                          border-t-white
                        "
                      />

                      Creating your
                      Velmora
                      account...
                    </span>
                  ) : (
                    <span
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      Begin Your
                      Velmora
                      Journey

                      <span
                        className="
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                      >
                        →
                      </span>
                    </span>
                  )}
                </button>
              </form>

              {/* =========================================
                  DIVIDER
              ========================================= */}

              <div
                className="
                  my-6
                  flex
                  items-center
                  gap-4
                "
              >
                <div
                  className="
                    h-px
                    flex-1
                    bg-[#E8E2EC]
                  "
                />

                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.13em]
                    text-[#A49DA8]
                  "
                >
                  Already part
                  of Velmora?
                </span>

                <div
                  className="
                    h-px
                    flex-1
                    bg-[#E8E2EC]
                  "
                />
              </div>

              {/* LOGIN */}

              <p
                className="
                  text-center
                  text-sm
                  leading-6
                  text-[#77717C]
                "
              >
                Already have an
                account?{" "}

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/login"
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
                  Sign in
                </button>
              </p>

              {/* MOBILE FOOTER */}

              <p
                className="
                  mt-7
                  text-center
                  text-[10px]
                  text-[#A39CA7]

                  lg:hidden
                "
              >
                © 2026 Velmora.
                Beauty •
                Skincare •
                Confidence
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}