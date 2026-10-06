import axios from "axios";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Link,
  useNavigate,
} from "react-router-dom";

export default function RegisterPage() {

  /* =====================================================
     STATE
  ===================================================== */

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

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

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();


  /* =====================================================
     PASSWORD STRENGTH
  ===================================================== */

  const passwordStrength = useMemo(() => {

    let score = 0;

    if (password.length >= 8) {
      score++;
    }

    if (/[a-z]/.test(password)) {
      score++;
    }

    if (/[A-Z]/.test(password)) {
      score++;
    }

    if (/[0-9]/.test(password)) {
      score++;
    }

    if (
      /[^A-Za-z0-9]/.test(password)
    ) {
      score++;
    }

    return score;

  }, [password]);


  function getPasswordStrengthText() {

    if (!password) {
      return "";
    }

    if (passwordStrength <= 2) {
      return "Weak";
    }

    if (passwordStrength <= 4) {
      return "Good";
    }

    return "Strong";
  }


  function getPasswordStrengthColor(
    index
  ) {

    if (
      passwordStrength <= index
    ) {
      return "bg-[#E5E7EB]";
    }

    if (
      passwordStrength <= 2
    ) {
      return "bg-[#FF303D]";
    }

    if (
      passwordStrength <= 4
    ) {
      return "bg-[#F4B942]";
    }

    return "bg-[#48B69C]";
  }


  /* =====================================================
     VALIDATION
  ===================================================== */

  function validateForm() {

    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      email.trim() === "" ||
      password === "" ||
      confirmPassword === ""
    ) {

      toast.error(
        "Please fill in all fields."
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


    if (password.length < 8) {

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


    if (!validateForm()) {
      return;
    }


    try {

      setLoading(true);

      console.log(
        "REGISTER REQUEST STARTED"
      );


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

            email:
              email
                .trim()
                .toLowerCase(),

            password:
              password,
          },
          {
            timeout: 15000,
          }
        );


      console.log(
        "REGISTER RESPONSE:",
        response.data
      );


      toast.success(
        "Account created successfully!"
      );


      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");


      setTimeout(() => {

        navigate("/login");

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
          "Request timed out. Please try again."
        );

        return;
      }


      if (error.response) {

        toast.error(
          error.response.data
            ?.message ||
          "Registration failed."
        );

      } else if (
        error.request
      ) {

        toast.error(
          "Unable to connect to the server."
        );

      } else {

        toast.error(
          "Something went wrong."
        );
      }

    } finally {

      setLoading(false);

    }
  }


  /* =====================================================
     PASSWORD MATCH STATE
  ===================================================== */

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword;


  const passwordsDifferent =
    confirmPassword.length > 0 &&
    password !== confirmPassword;


  /* =====================================================
     EYE ICON
  ===================================================== */

  function EyeIcon({ visible }) {

    if (visible) {

      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
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


  /* =====================================================
     INPUT BASE STYLE
  ===================================================== */

  const inputStyle = `
    h-[52px]
    w-full
    rounded-xl
    border
    border-[#DDE3E6]
    bg-white
    px-4
    text-[14px]
    text-[#303541]
    outline-none
    transition-all
    duration-200

    placeholder:text-[#98A2B3]

    hover:border-[#B8CFCC]

    focus:border-[#79CFC5]
    focus:ring-4
    focus:ring-[#BFE9E4]/40
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

        bg-[url('/login.jpg')]
        bg-cover
        bg-center
        bg-no-repeat
      "
    >

      {/* ================================================
          GLOBAL IMAGE OVERLAY
      ================================================ */}

      <div
        className="
          absolute
          inset-0
          bg-[#183D3A]/10
        "
      />


      {/* ================================================
          SUBTLE BACKGROUND LIGHTS
      ================================================ */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-10
          h-[350px]
          w-[350px]
          rounded-full
          bg-[#BFE9E4]/20
          blur-[100px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          bottom-10
          h-[400px]
          w-[400px]
          rounded-full
          bg-[#FF303D]/10
          blur-[120px]
        "
      />


      {/* ================================================
          MAIN WRAPPER
      ================================================ */}

      <main
        className="
          relative
          z-10

          flex
          min-h-screen
          w-full

          items-center
          justify-center

          px-4
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
            max-w-[1250px]

            overflow-hidden

            rounded-[28px]

            border
            border-white/40

            shadow-[0_30px_100px_rgba(15,23,42,0.20)]

            lg:min-h-[720px]
            lg:grid-cols-2
          "
        >

          {/* ============================================
              LEFT IMAGE / BRAND SECTION
          ============================================ */}

          <section
            className="
              relative
              hidden
              overflow-hidden

              lg:flex
              lg:flex-col
              lg:justify-between

              lg:p-12

              xl:p-14
            "
          >

            {/* LEFT OVERLAY */}

            <div
              className="
                absolute
                inset-0

                bg-gradient-to-r

                from-[#173C3A]/65
                via-[#234F4C]/35
                to-[#234F4C]/10
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

                  rounded-full

                  border
                  border-white/30

                  bg-white/15

                  text-xl
                  text-white

                  backdrop-blur-md
                "
              >
                ✦
              </div>


              <div>

                <p
                  className="
                    text-lg
                    font-bold
                    text-white
                  "
                >
                  Beauty Store
                </p>

                <p
                  className="
                    text-xs
                    text-white/65
                  "
                >
                  Beauty & Care
                </p>

              </div>

            </Link>


            {/* LEFT MAIN CONTENT */}

            <div
              className="
                relative
                z-10

                max-w-[530px]
              "
            >

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.28em]
                  text-white/85
                "
              >
                Join Beauty Store
              </p>


              <h1
                className="
                  mt-7

                  text-5xl
                  font-black
                  leading-[1.16]
                  tracking-[-0.03em]
                  text-white

                  xl:text-[58px]
                "
              >

                Create your account

                <span
                  className="
                    block
                    text-[#CFF5F0]
                  "
                >
                  and discover your beauty.
                </span>

              </h1>


              <p
                className="
                  mt-7

                  max-w-[500px]

                  text-base
                  leading-8
                  text-white/80
                "
              >
                Join our beauty community,
                discover products you love,
                manage your orders and enjoy
                a personalized shopping
                experience.
              </p>


              {/* FEATURES */}

              <div
                className="
                  mt-10

                  grid
                  grid-cols-3

                  gap-3
                "
              >

                <div
                  className="
                    rounded-2xl

                    border
                    border-white/20

                    bg-white/10

                    p-4

                    backdrop-blur-md
                  "
                >

                  <span
                    className="
                      text-xl
                      text-[#CFF5F0]
                    "
                  >
                    ✓
                  </span>

                  <p
                    className="
                      mt-3
                      text-sm
                      font-bold
                      text-white
                    "
                  >
                    Secure
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-white/60
                    "
                  >
                    Account
                  </p>

                </div>


                <div
                  className="
                    rounded-2xl

                    border
                    border-white/20

                    bg-white/10

                    p-4

                    backdrop-blur-md
                  "
                >

                  <span
                    className="
                      text-xl
                      text-[#FFD4D7]
                    "
                  >
                    ♡
                  </span>

                  <p
                    className="
                      mt-3
                      text-sm
                      font-bold
                      text-white
                    "
                  >
                    Personal
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-white/60
                    "
                  >
                    Experience
                  </p>

                </div>


                <div
                  className="
                    rounded-2xl

                    border
                    border-white/20

                    bg-white/10

                    p-4

                    backdrop-blur-md
                  "
                >

                  <span
                    className="
                      text-xl
                      text-[#CFF5F0]
                    "
                  >
                    ✦
                  </span>

                  <p
                    className="
                      mt-3
                      text-sm
                      font-bold
                      text-white
                    "
                  >
                    Simple
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-white/60
                    "
                  >
                    Shopping
                  </p>

                </div>

              </div>

            </div>


            {/* FOOTER */}

            <p
              className="
                relative
                z-10

                text-xs
                text-white/55
              "
            >
              © 2026 Beauty Store.
              All rights reserved.
            </p>

          </section>


          {/* ============================================
              RIGHT FORM
          ============================================ */}

          <section
            className="
              flex
              items-center
              justify-center

              bg-[#FAF9F7]/95

              px-5
              py-8

              backdrop-blur-xl

              sm:px-8
              sm:py-10

              lg:px-10
              lg:py-10

              xl:px-14
            "
          >

            <div
              className="
                w-full
                max-w-[470px]
              "
            >

              {/* MOBILE BRAND */}

              <Link
                to="/"
                className="
                  mb-7

                  flex
                  items-center
                  gap-3

                  lg:hidden
                "
              >

                <div
                  className="
                    flex
                    h-11
                    w-11

                    items-center
                    justify-center

                    rounded-full

                    bg-[#FF303D]

                    text-lg
                    text-white

                    shadow-lg
                    shadow-red-200
                  "
                >
                  ✦
                </div>


                <div>

                  <p
                    className="
                      font-bold
                      text-[#303541]
                    "
                  >
                    Beauty Store
                  </p>

                  <p
                    className="
                      text-xs
                      text-[#98A2B3]
                    "
                  >
                    Beauty & Care
                  </p>

                </div>

              </Link>


              {/* TITLE */}

              <div>

                <p
                  className="
                    text-sm
                    font-medium
                    text-[#FF303D]
                  "
                >
                  Join us
                </p>


                <h2
                  className="
                    mt-2

                    text-3xl
                    font-bold
                    tracking-tight
                    text-[#303541]

                    sm:text-[36px]
                  "
                >
                  Create your account
                </h2>


                <p
                  className="
                    mt-3

                    text-sm
                    leading-6
                    text-[#667085]

                    sm:text-base
                  "
                >
                  Enter your information
                  below to get started.
                </p>

              </div>


              {/* ========================================
                  FORM
              ======================================== */}

              <form
                onSubmit={
                  handleRegister
                }
                className="
                  mt-7
                  space-y-4
                "
              >

                {/* FIRST + LAST NAME */}

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-4

                    sm:grid-cols-2
                  "
                >

                  {/* FIRST NAME */}

                  <div>

                    <label
                      htmlFor="firstName"
                      className="
                        mb-2
                        block

                        text-sm
                        font-semibold
                        text-[#344054]
                      "
                    >
                      First Name
                    </label>


                    <input
                      id="firstName"
                      type="text"
                      value={
                        firstName
                      }
                      autoComplete="given-name"
                      placeholder="First name"
                      onChange={(e) =>
                        setFirstName(
                          e.target.value
                        )
                      }
                      className={
                        inputStyle
                      }
                    />

                  </div>


                  {/* LAST NAME */}

                  <div>

                    <label
                      htmlFor="lastName"
                      className="
                        mb-2
                        block

                        text-sm
                        font-semibold
                        text-[#344054]
                      "
                    >
                      Last Name
                    </label>


                    <input
                      id="lastName"
                      type="text"
                      value={
                        lastName
                      }
                      autoComplete="family-name"
                      placeholder="Last name"
                      onChange={(e) =>
                        setLastName(
                          e.target.value
                        )
                      }
                      className={
                        inputStyle
                      }
                    />

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
                      font-semibold
                      text-[#344054]
                    "
                  >
                    Email Address
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
                        left-4
                        top-1/2

                        -translate-y-1/2

                        text-[#98A2B3]
                      "
                    >

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
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

                    </div>


                    <input
                      id="email"
                      type="email"
                      value={email}
                      autoComplete="email"
                      placeholder="Enter your email"
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      className={`
                        ${inputStyle}
                        pl-12
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
                      font-semibold
                      text-[#344054]
                    "
                  >
                    Password
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
                        left-4
                        top-1/2

                        -translate-y-1/2

                        text-[#98A2B3]
                      "
                    >

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
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
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      className={`
                        ${inputStyle}
                        pl-12
                        pr-12
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
                        right-4
                        top-1/2

                        -translate-y-1/2

                        text-[#98A2B3]

                        transition-colors

                        hover:text-[#FF303D]
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

                    <div
                      className="
                        mt-3
                      "
                    >

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
                          (index) => (

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

                          text-xs
                        "
                      >

                        <span
                          className="
                            text-[#98A2B3]
                          "
                        >
                          Minimum 8 characters
                        </span>


                        <span
                          className={`
                            font-semibold

                            ${
                              passwordStrength <= 2
                                ? "text-[#FF303D]"
                                : passwordStrength <= 4
                                ? "text-[#D99A24]"
                                : "text-[#30977F]"
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
                      font-semibold
                      text-[#344054]
                    "
                  >
                    Confirm Password
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
                        left-4
                        top-1/2

                        -translate-y-1/2

                        text-[#98A2B3]
                      "
                    >

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
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
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      className={`
                        h-[52px]
                        w-full

                        rounded-xl

                        border

                        bg-white

                        pl-12
                        pr-12

                        text-[14px]
                        text-[#303541]

                        outline-none

                        transition-all

                        placeholder:text-[#98A2B3]

                        focus:ring-4

                        ${
                          passwordsDifferent
                            ? `
                              border-red-300
                              focus:border-[#FF303D]
                              focus:ring-red-100
                            `
                            : passwordsMatch
                            ? `
                              border-[#79CFC5]
                              focus:border-[#79CFC5]
                              focus:ring-[#BFE9E4]/40
                            `
                            : `
                              border-[#DDE3E6]
                              hover:border-[#B8CFCC]
                              focus:border-[#79CFC5]
                              focus:ring-[#BFE9E4]/40
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
                        right-4
                        top-1/2

                        -translate-y-1/2

                        text-[#98A2B3]

                        transition-colors

                        hover:text-[#FF303D]
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
                        font-medium
                        text-[#FF303D]
                      "
                    >
                      Passwords do not match.
                    </p>

                  )}


                  {passwordsMatch && (

                    <p
                      className="
                        mt-2
                        text-xs
                        font-medium
                        text-[#30977F]
                      "
                    >
                      ✓ Passwords match
                    </p>

                  )}

                </div>


                {/* REGISTER BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group
                    relative

                    mt-2

                    flex
                    h-[54px]
                    w-full

                    items-center
                    justify-center

                    overflow-hidden

                    rounded-xl

                    bg-[#FF303D]

                    px-6

                    text-[15px]
                    font-bold
                    text-white

                    shadow-[0_12px_28px_rgba(255,48,61,0.23)]

                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:bg-[#E82734]

                    hover:shadow-[0_18px_36px_rgba(255,48,61,0.30)]

                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    disabled:hover:translate-y-0
                  "
                >

                  {/* BUTTON LIGHT */}

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

                      Creating Account...

                    </span>

                  ) : (

                    <span
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >

                      Create Account

                      <span
                        className="
                          transition-transform

                          group-hover:translate-x-1
                        "
                      >
                        →
                      </span>

                    </span>

                  )}

                </button>

              </form>


              {/* DIVIDER */}

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
                    bg-[#E4E7EC]
                  "
                />

                <span
                  className="
                    text-xs
                    text-[#98A2B3]
                  "
                >
                  Already registered?
                </span>

                <div
                  className="
                    h-px
                    flex-1
                    bg-[#E4E7EC]
                  "
                />

              </div>


              {/* LOGIN */}

              <p
                className="
                  text-center
                  text-sm
                  text-[#667085]
                "
              >

                Already have an account?

                <button
                  type="button"
                  onClick={() =>
                    navigate("/login")
                  }
                  className="
                    ml-1.5

                    font-bold
                    text-[#FF303D]

                    transition-colors

                    hover:text-[#E82734]
                    hover:underline
                  "
                >
                  Login
                </button>

              </p>


              {/* MOBILE FOOTER */}

              <p
                className="
                  mt-7

                  text-center
                  text-[11px]
                  text-[#98A2B3]

                  lg:hidden
                "
              >
                © 2026 Beauty Store.
                All rights reserved.
              </p>

            </div>

          </section>

        </div>

      </main>

    </div>

  );
}