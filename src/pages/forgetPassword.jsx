import {
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  Link,
  useNavigate,
} from "react-router-dom";

/*
=========================================================
VELMORA PASSWORD RECOVERY
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
Error            #D95C5C

Direction:
Quiet Luxury
Modern Beauty
Secure + Calm
Premium Ecommerce
Mobile-first
=========================================================
*/

/* =========================================================
   ICONS
========================================================= */

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />

      <path d="m3 7 9 6 9-6" />
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
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
      />

      <path d="M8 10V7a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 3 5 6v5c0 4.7 2.7 8 7 10 4.3-2 7-5.3 7-10V6l-7-3Z" />

      <path d="m9.5 12 1.7 1.7 3.5-4" />
    </svg>
  );
}

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
        <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
        <path d="M9.9 4.2A10 10 0 0 1 12 4c5.5 0 9 8 9 8a15 15 0 0 1-2.1 3.2" />
        <path d="M6.2 6.2C4.1 8 3 12 3 12s3.5 8 9 8a9.7 9.7 0 0 0 4.1-.9" />
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
      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />

      <circle
        cx="12"
        cy="12"
        r="3"
      />
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

function BackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

/* =========================================================
   BRAND MARK
========================================================= */

function BrandMark() {
  return (
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

        border
        border-[#D9CEF6]

        bg-gradient-to-br
        from-[#6C5CE7]
        via-[#907AE9]
        to-[#B8A1FF]

        text-white

        shadow-[0_10px_26px_rgba(108,92,231,0.25)]
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-4
          -top-4
          h-10
          w-10
          rounded-full
          bg-white/20
          blur-lg
        "
      />

      <span
        className="
          relative
          font-serif
          text-xl
          font-semibold
        "
      >
        V
      </span>

      <span
        className="
          absolute
          bottom-[5px]
          right-[6px]
          text-[7px]
          text-[#F6E3C0]
        "
      >
        ✦
      </span>
    </div>
  );
}

/* =========================================================
   LUXURY VISUAL
========================================================= */

function RecoveryVisual() {
  return (
    <div
      className="
        relative
        mx-auto
        aspect-square
        w-full
        max-w-[430px]
      "
    >
      {/* Glass panel */}

      <div
        className="
          absolute
          inset-[4%]
          overflow-hidden

          rounded-[42px]

          border
          border-white/20

          bg-white/10

          shadow-[0_40px_100px_rgba(18,14,30,0.25)]

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
            bg-[#F2B8C6]/18
            blur-[90px]
          "
        />

        <div
          className="
            absolute
            right-[12%]
            top-[8%]
            h-40
            w-40
            rounded-full
            bg-[#EADBC8]/18
            blur-[60px]
          "
        />
      </div>

      {/* Rings */}

      <div
        className="
          absolute
          inset-[13%]
          rounded-full
          border
          border-white/14
        "
      />

      <div
        className="
          absolute
          inset-[23%]
          rounded-full
          border
          border-[#EADBC8]/18
        "
      />

      {/* Center security card */}

      <div
        className="
          absolute
          inset-[25%]

          flex
          items-center
          justify-center

          rounded-[34%]

          border
          border-white/20

          bg-white/12

          shadow-[0_25px_65px_rgba(15,12,25,0.25)]

          backdrop-blur-xl
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center

              rounded-[26px]

              bg-gradient-to-br
              from-[#6C5CE7]
              to-[#B8A1FF]

              text-3xl
              text-white

              shadow-[0_16px_38px_rgba(108,92,231,0.32)]
            "
          >
            <ShieldIcon />
          </div>

          <p
            className="
              mt-5
              text-[9px]
              font-black
              uppercase
              tracking-[0.24em]
              text-[#D8CDFF]
            "
          >
            VELMORA
          </p>

          <p
            className="
              mt-2
              text-lg
              font-extrabold
              text-white
            "
          >
            Secure Recovery
          </p>

          <p
            className="
              mx-auto
              mt-2
              max-w-[150px]
              text-[10px]
              leading-5
              text-white/50
            "
          >
            Restore access to your beauty account securely.
          </p>
        </div>
      </div>

      {/* Floating cards */}

      <div
        className="
          absolute
          left-[0%]
          top-[20%]

          rounded-2xl

          border
          border-white/20

          bg-white/12

          px-4
          py-3

          shadow-xl

          backdrop-blur-xl
        "
      >
        <p
          className="
            text-[9px]
            font-black
            uppercase
            tracking-[0.15em]
            text-[#DED4FF]
          "
        >
          01 · Verify
        </p>

        <p
          className="
            mt-1
            text-[10px]
            font-medium
            text-white/60
          "
        >
          Email security
        </p>
      </div>

      <div
        className="
          absolute
          right-[0%]
          top-[24%]

          rounded-2xl

          border
          border-white/20

          bg-white/12

          px-4
          py-3

          shadow-xl

          backdrop-blur-xl
        "
      >
        <p
          className="
            text-[9px]
            font-black
            uppercase
            tracking-[0.15em]
            text-[#F3CAD7]
          "
        >
          02 · Restore
        </p>

        <p
          className="
            mt-1
            text-[10px]
            font-medium
            text-white/60
          "
        >
          New password
        </p>
      </div>

      <div
        className="
          absolute
          bottom-[3%]
          left-1/2
          -translate-x-1/2

          whitespace-nowrap

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

          backdrop-blur-xl
        "
      >
        Secure · Simple · Velmora
      </div>
    </div>
  );
}

/* =========================================================
   FORGOT PASSWORD
========================================================= */

export default function ForgetPassword() {
  const navigate =
    useNavigate();

  const [
    otpSend,
    setOtpSend,
  ] = useState(false);

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    otp,
    setOtp,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
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

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    messageType,
    setMessageType,
  ] = useState("");

  const [
    resetComplete,
    setResetComplete,
  ] = useState(false);

  /* =====================================================
     PASSWORD STRENGTH
  ===================================================== */

  const passwordStrength =
    useMemo(() => {
      let score = 0;

      if (
        newPassword.length >=
        8
      ) {
        score++;
      }

      if (
        /[a-z]/.test(
          newPassword
        )
      ) {
        score++;
      }

      if (
        /[A-Z]/.test(
          newPassword
        )
      ) {
        score++;
      }

      if (
        /[0-9]/.test(
          newPassword
        )
      ) {
        score++;
      }

      if (
        /[^A-Za-z0-9]/.test(
          newPassword
        )
      ) {
        score++;
      }

      return score;
    }, [newPassword]);

  function strengthLabel() {
    if (!newPassword) {
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

  function strengthBar(
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
      return "bg-[#C29A5B]";
    }

    return "bg-[#4F9D7A]";
  }

  /* =====================================================
     SEND OTP
  ===================================================== */

  async function sendOtp() {
    if (
      email.trim() ===
      ""
    ) {
      setMessage(
        "Please enter your email address."
      );

      setMessageType(
        "error"
      );

      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(
        email.trim()
      )
    ) {
      setMessage(
        "Please enter a valid email address."
      );

      setMessageType(
        "error"
      );

      return;
    }

    try {
      setLoading(true);

      setMessage("");

      setMessageType(
        ""
      );

      const response =
        await axios.post(
          `${
            import.meta.env
              .VITE_BACKEND_URL
          }/api/user/send-otp`,
          {
            // Trim only.
            // Email casing is preserved.
            email:
              email.trim(),
          }
        );

      console.log(
        response.data
      );

      setOtpSend(
        true
      );

      setMessage(
        "Verification code sent. Please check your email."
      );

      setMessageType(
        "success"
      );
    } catch (error) {
      console.error(
        error
      );

      setMessage(
        error.response
          ?.data
          ?.message ||
          "We couldn't send the verification code. Please try again."
      );

      setMessageType(
        "error"
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  /* =====================================================
     RESET PASSWORD
  ===================================================== */

  async function resetPassword() {
    if (
      otp.trim() ===
      ""
    ) {
      setMessage(
        "Please enter your verification code."
      );

      setMessageType(
        "error"
      );

      return;
    }

    if (
      otp.length !==
      6
    ) {
      setMessage(
        "Please enter the complete 6-digit verification code."
      );

      setMessageType(
        "error"
      );

      return;
    }

    if (
      newPassword ===
      ""
    ) {
      setMessage(
        "Please enter your new password."
      );

      setMessageType(
        "error"
      );

      return;
    }

    if (
      newPassword.length <
      8
    ) {
      setMessage(
        "Your new password must contain at least 8 characters."
      );

      setMessageType(
        "error"
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setMessage(
        "Passwords do not match."
      );

      setMessageType(
        "error"
      );

      return;
    }

    try {
      setLoading(true);

      setMessage("");

      setMessageType(
        ""
      );

      const otpInNumber =
        parseInt(
          otp,
          10
        );

      const response =
        await axios.post(
          `${
            import.meta.env
              .VITE_BACKEND_URL
          }/api/user/reset-password`,
          {
            email:
              email.trim(),

            otp:
              otpInNumber,

            newPassword:
              newPassword,
          }
        );

      console.log(
        response.data
      );

      setResetComplete(
        true
      );

      setMessage(
        "Your Velmora password has been reset successfully."
      );

      setMessageType(
        "success"
      );
    } catch (error) {
      console.error(
        error
      );

      setMessage(
        error.response
          ?.data
          ?.message ||
          "We couldn't reset your password. Please try again."
      );

      setMessageType(
        "error"
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  /* =====================================================
     OTP INPUT
  ===================================================== */

  function handleOtpChange(
    event
  ) {
    const value =
      event.target.value
        .replace(
          /\D/g,
          ""
        )
        .slice(
          0,
          6
        );

    setOtp(value);

    setMessage("");
    setMessageType("");
  }

  /* =====================================================
     CHANGE EMAIL
  ===================================================== */

  function changeEmail() {
    setOtpSend(false);

    setOtp("");

    setNewPassword("");

    setConfirmPassword("");

    setResetComplete(
      false
    );

    setMessage("");

    setMessageType(
      ""
    );
  }

  /* =====================================================
     MATCH STATE
  ===================================================== */

  const passwordsMatch =
    confirmPassword.length >
      0 &&
    newPassword ===
      confirmPassword;

  const passwordsDifferent =
    confirmPassword.length >
      0 &&
    newPassword !==
      confirmPassword;

  /* =====================================================
     BASE INPUT
  ===================================================== */

  const inputClass = `
    min-h-[56px]
    w-full

    rounded-2xl

    border
    border-[#E1DBE7]

    bg-[#FFFEFF]

    px-4

    text-[15px]
    text-[#2F3136]

    outline-none

    transition-all
    duration-300

    placeholder:text-[#ABA4AF]

    hover:border-[#D3C9DC]

    focus:border-[#B8A1FF]
    focus:ring-4
    focus:ring-[#B8A1FF]/15

    disabled:cursor-not-allowed
    disabled:bg-[#F6F3F7]
    disabled:text-[#8F8793]

    sm:min-h-[58px]
    sm:text-base
  `;

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <main
      className="
        relative

        min-h-screen
        w-full

        overflow-x-hidden

        bg-[#FAF9F7]

        pt-[72px]

        md:pt-[80px]
      "
    >
      {/* ===================================================
          BACKGROUND ATMOSPHERE
      =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-[-100px]

          h-[480px]
          w-[480px]

          rounded-full

          bg-[#B8A1FF]/14

          blur-[130px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          right-[-130px]

          h-[480px]
          w-[480px]

          rounded-full

          bg-[#F2B8C6]/13

          blur-[130px]
        "
      />

      {/* ===================================================
          DESKTOP + FORM GRID
      =================================================== */}

      <div
        className="
          relative
          z-10

          grid
          min-h-[calc(100vh-72px)]
          grid-cols-1

          md:min-h-[calc(100vh-80px)]

          lg:grid-cols-[0.95fr_1.05fr]
        "
      >
        {/* =================================================
            LEFT BRAND PANEL
        ================================================= */}

        <section
          className="
            relative

            hidden

            min-h-[calc(100vh-80px)]

            overflow-hidden

            bg-[#302C3C]

            lg:flex
            lg:items-center
            lg:justify-center
          "
        >
          {/* Atmospheric lighting */}

          <div
            className="
              pointer-events-none
              absolute
              -left-40
              -top-36

              h-[520px]
              w-[520px]

              rounded-full

              bg-[#6C5CE7]/28

              blur-[140px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-40
              right-[-120px]

              h-[500px]
              w-[500px]

              rounded-full

              bg-[#F2B8C6]/14

              blur-[140px]
            "
          />

          <div
            className="
              relative

              mx-auto

              grid
              w-full
              max-w-[850px]
              grid-cols-[0.9fr_1.1fr]
              items-center

              gap-5

              px-10
              py-12

              xl:px-14
            "
          >
            {/* TEXT */}

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
                  tracking-[0.22em]

                  text-[#D8CDFF]

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

                Velmora Security
              </div>

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
                Restore your
                beauty{" "}

                <span
                  className="
                    font-serif
                    font-medium
                    italic

                    bg-gradient-to-r
                    from-[#D8CBFF]
                    via-[#EDC6D2]
                    to-[#EADBC8]

                    bg-clip-text
                    text-transparent
                  "
                >
                  journey.
                </span>
              </h1>

              <p
                className="
                  mt-5

                  max-w-[400px]

                  text-sm
                  leading-7

                  text-white/58

                  xl:text-base
                  xl:leading-8
                "
              >
                Your Velmora
                account is part
                of your personal
                beauty
                experience.
                Recover access
                securely in two
                simple steps.
              </p>

              {/* STEPS */}

              <div
                className="
                  mt-8
                  space-y-3
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
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center

                      rounded-full

                      border
                      border-[#B8A1FF]/30

                      bg-[#B8A1FF]/10

                      text-[10px]
                      font-black
                      text-[#DED5FF]
                    "
                  >
                    01
                  </div>

                  <p
                    className="
                      text-sm
                      text-white/65
                    "
                  >
                    Verify your
                    registered
                    email
                  </p>
                </div>

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
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center

                      rounded-full

                      border
                      border-[#F2B8C6]/30

                      bg-[#F2B8C6]/10

                      text-[10px]
                      font-black
                      text-[#F4CBD7]
                    "
                  >
                    02
                  </div>

                  <p
                    className="
                      text-sm
                      text-white/65
                    "
                  >
                    Set a new
                    secure
                    password
                  </p>
                </div>
              </div>

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
                    bg-[#EADBC8]/55
                  "
                />

                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.2em]
                    text-white/40
                  "
                >
                  Beauty ·
                  Security ·
                  Confidence
                </p>
              </div>
            </div>

            <RecoveryVisual />
          </div>
        </section>

        {/* =================================================
            RIGHT RECOVERY AREA
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
          "
        >
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
              max-w-[520px]

              overflow-hidden

              rounded-[28px]

              border
              border-[#E8E1EF]

              bg-white/90

              px-5
              py-7

              shadow-[0_28px_90px_rgba(63,48,85,0.11)]

              backdrop-blur-2xl

              sm:rounded-[34px]
              sm:px-8
              sm:py-9

              md:px-10
            "
          >
            {/* decorative lights */}

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
                  gap-3

                  lg:hidden
                "
              >
                <Link
                  to="/"
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <BrandMark />

                  <div>
                    <p
                      className="
                        text-[14px]
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
                        tracking-[0.12em]

                        text-[#9A929E]
                      "
                    >
                      Secure
                      Recovery
                    </p>
                  </div>
                </Link>

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
                    tracking-[0.11em]

                    text-[#6C5CE7]
                  "
                >
                  Account Care
                </span>
              </div>

              {/* =========================================
                  HEADING
              ========================================= */}

              {!resetComplete ? (
                <>
                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center

                      rounded-2xl

                      bg-gradient-to-br
                      from-[#F0EAFF]
                      to-[#FFF1F5]

                      text-[#6C5CE7]

                      shadow-sm
                    "
                  >
                    {otpSend ? (
                      <LockIcon />
                    ) : (
                      <ShieldIcon />
                    )}
                  </div>

                  <p
                    className="
                      mt-6

                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.22em]

                      text-[#6C5CE7]

                      sm:text-[11px]
                    "
                  >
                    {otpSend
                      ? "Step 02 · Restore Access"
                      : "Step 01 · Verify Account"}
                  </p>

                  <h1
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
                    {otpSend
                      ? "Create your new password."
                      : "Recover your Velmora account."}
                  </h1>

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
                    {otpSend
                      ? "Enter the verification code sent to your email and choose a secure new password."
                      : "Enter the email linked to your Velmora account and we'll send you a verification code."}
                  </p>
                </>
              ) : (
                /* =====================================
                   SUCCESS HEADER
                ===================================== */

                <>
                  <div
                    className="
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center

                      rounded-2xl

                      bg-[#EDF7F2]

                      text-[#4F9D7A]

                      shadow-sm
                    "
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-8 w-8"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  </div>

                  <p
                    className="
                      mt-6
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.22em]
                      text-[#4F9D7A]
                    "
                  >
                    Recovery
                    Complete
                  </p>

                  <h1
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
                    Welcome back
                    to Velmora.
                  </h1>

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-7
                      text-[#77717C]

                      sm:text-[15px]
                    "
                  >
                    Your password
                    has been
                    updated
                    successfully.
                    You can now
                    sign in using
                    your new
                    password.
                  </p>
                </>
              )}

              {/* =========================================
                  PROGRESS
              ========================================= */}

              {!resetComplete && (
                <div
                  className="
                    my-7

                    flex
                    items-center
                  "
                >
                  <div
                    className="
                      flex
                      min-w-0
                      flex-1
                      items-center
                    "
                  >
                    {/* STEP 1 */}

                    <div
                      className="
                        flex
                        flex-col
                        items-center
                      "
                    >
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
                          to-[#927EF1]

                          text-xs
                          font-bold
                          text-white

                          shadow-[0_7px_16px_rgba(108,92,231,0.20)]
                        "
                      >
                        {otpSend ? (
                          <CheckIcon />
                        ) : (
                          "1"
                        )}
                      </div>

                      <p
                        className="
                          mt-2
                          text-[9px]
                          font-bold
                          text-[#6C5CE7]
                        "
                      >
                        Verify
                      </p>
                    </div>

                    {/* CONNECTOR */}

                    <div
                      className="
                        mx-2
                        h-1
                        min-w-0
                        flex-1
                        overflow-hidden
                        rounded-full
                        bg-[#ECE8EF]

                        sm:mx-3
                      "
                    >
                      <div
                        className={`
                          h-full
                          rounded-full

                          bg-gradient-to-r
                          from-[#6C5CE7]
                          to-[#B8A1FF]

                          transition-all
                          duration-500

                          ${
                            otpSend
                              ? "w-full"
                              : "w-0"
                          }
                        `}
                      />
                    </div>

                    {/* STEP 2 */}

                    <div
                      className="
                        flex
                        flex-col
                        items-center
                      "
                    >
                      <div
                        className={`
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center

                          rounded-full

                          text-xs
                          font-bold

                          transition-all
                          duration-300

                          ${
                            otpSend
                              ? "bg-gradient-to-br from-[#6C5CE7] to-[#927EF1] text-white shadow-[0_7px_16px_rgba(108,92,231,0.20)]"
                              : "bg-[#ECE8EF] text-[#A29BA7]"
                          }
                        `}
                      >
                        2
                      </div>

                      <p
                        className={`
                          mt-2
                          text-[9px]
                          font-bold

                          ${
                            otpSend
                              ? "text-[#6C5CE7]"
                              : "text-[#A29BA7]"
                          }
                        `}
                      >
                        Restore
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================
                  SUCCESS SCREEN
              ========================================= */}

              {resetComplete ? (
                <div
                  className="
                    mt-8
                  "
                >
                  <div
                    className="
                      rounded-2xl

                      border
                      border-[#D6EADF]

                      bg-[#F2F9F5]

                      p-4

                      text-sm
                      leading-6
                      text-[#417D61]
                    "
                  >
                    <div
                      className="
                        flex
                        items-start
                        gap-3
                      "
                    >
                      <div
                        className="
                          mt-0.5
                          flex
                          h-6
                          w-6
                          shrink-0
                          items-center
                          justify-center

                          rounded-full

                          bg-[#4F9D7A]

                          text-white
                        "
                      >
                        <CheckIcon />
                      </div>

                      <span>
                        {
                          message
                        }
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/login"
                      )
                    }
                    className="
                      mt-5

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

                      text-sm
                      font-bold
                      text-white

                      shadow-[0_12px_28px_rgba(108,92,231,0.24)]

                      transition-all
                      duration-300

                      hover:-translate-y-0.5
                      hover:shadow-[0_17px_36px_rgba(108,92,231,0.31)]

                      active:scale-[0.99]

                      sm:text-base
                    "
                  >
                    Continue to
                    Sign In

                    <span>
                      →
                    </span>
                  </button>
                </div>
              ) : (
                /* =====================================
                   FORM
                ===================================== */

                <div
                  className="
                    space-y-5
                  "
                >
                  {/* ===============================
                      EMAIL
                  =============================== */}

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
                        htmlFor="email"
                        className="
                          text-sm
                          font-bold
                          text-[#4B4550]
                        "
                      >
                        Email
                        address
                      </label>

                      {otpSend && (
                        <button
                          type="button"
                          onClick={
                            changeEmail
                          }
                          disabled={
                            loading
                          }
                          className="
                            text-xs
                            font-bold
                            text-[#6C5CE7]

                            transition-colors

                            hover:text-[#5544C6]
                            hover:underline

                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >
                          Change
                          email
                        </button>
                      )}
                    </div>

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
                        disabled={
                          otpSend
                        }
                        autoComplete="email"
                        placeholder="Enter your email address"
                        onChange={(
                          event
                        ) => {
                          setEmail(
                            event
                              .target
                              .value
                          );

                          setMessage(
                            ""
                          );

                          setMessageType(
                            ""
                          );
                        }}
                        className={`
                          ${inputClass}
                          pl-[58px]
                        `}
                      />
                    </div>

                    {otpSend && (
                      <p
                        className="
                          mt-2
                          text-[10px]
                          leading-5
                          text-[#98919D]

                          sm:text-xs
                        "
                      >
                        Your code
                        was sent to{" "}

                        <span
                          className="
                            break-all
                            font-bold
                            text-[#6C5CE7]
                          "
                        >
                          {
                            email
                          }
                        </span>
                      </p>
                    )}
                  </div>

                  {/* ===============================
                      SEND OTP
                  =============================== */}

                  {!otpSend && (
                    <button
                      type="button"
                      onClick={
                        sendOtp
                      }
                      disabled={
                        loading
                      }
                      className="
                        group

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

                        text-sm
                        font-bold
                        text-white

                        shadow-[0_12px_28px_rgba(108,92,231,0.24)]

                        transition-all
                        duration-300

                        hover:-translate-y-0.5
                        hover:shadow-[0_17px_36px_rgba(108,92,231,0.31)]

                        active:scale-[0.99]

                        focus:outline-none
                        focus-visible:ring-4
                        focus-visible:ring-[#B8A1FF]/25

                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        disabled:hover:translate-y-0

                        sm:text-base
                      "
                    >
                      {loading ? (
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

                          Sending
                          Code...
                        </>
                      ) : (
                        <>
                          Send
                          Verification
                          Code

                          <span
                            className="
                              transition-transform
                              duration-300

                              group-hover:translate-x-1
                            "
                          >
                            →
                          </span>
                        </>
                      )}
                    </button>
                  )}

                  {/* ===============================
                      OTP / PASSWORD
                  =============================== */}

                  {otpSend && (
                    <>
                      {/* OTP */}

                      <div>
                        <label
                          htmlFor="otp"
                          className="
                            mb-2
                            block
                            text-sm
                            font-bold
                            text-[#4B4550]
                          "
                        >
                          Verification
                          code
                        </label>

                        <input
                          id="otp"
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          placeholder="••••••"
                          value={
                            otp
                          }
                          maxLength={
                            6
                          }
                          onChange={
                            handleOtpChange
                          }
                          className="
                            min-h-[58px]
                            w-full

                            rounded-2xl

                            border
                            border-[#E1DBE7]

                            bg-[#FFFEFF]

                            px-4

                            text-center
                            text-xl
                            font-extrabold
                            tracking-[0.35em]

                            text-[#3A3440]

                            outline-none

                            transition-all
                            duration-300

                            placeholder:text-[#C8C1CC]
                            placeholder:tracking-[0.2em]

                            hover:border-[#D3C9DC]

                            focus:border-[#B8A1FF]
                            focus:ring-4
                            focus:ring-[#B8A1FF]/15

                            sm:text-2xl
                            sm:tracking-[0.45em]
                          "
                        />

                        <p
                          className="
                            mt-2
                            text-[10px]
                            text-[#9A929E]

                            sm:text-xs
                          "
                        >
                          Enter the
                          6-digit
                          code from
                          your
                          Velmora
                          email.
                        </p>
                      </div>

                      {/* NEW PASSWORD */}

                      <div>
                        <label
                          htmlFor="new-password"
                          className="
                            mb-2
                            block
                            text-sm
                            font-bold
                            text-[#4B4550]
                          "
                        >
                          New
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
                            id="new-password"
                            type={
                              showPassword
                                ? "text"
                                : "password"
                            }
                            value={
                              newPassword
                            }
                            autoComplete="new-password"
                            placeholder="Create a new password"
                            onChange={(
                              event
                            ) => {
                              setNewPassword(
                                event
                                  .target
                                  .value
                              );

                              setMessage(
                                ""
                              );

                              setMessageType(
                                ""
                              );
                            }}
                            className={`
                              ${inputClass}
                              pl-[58px]
                              pr-[58px]
                            `}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword(
                                (
                                  previous
                                ) =>
                                  !previous
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

                        {/* strength */}

                        {newPassword && (
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

                                      ${strengthBar(
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
                                  text-[#9C95A0]
                                "
                              >
                                8+
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
                                  strengthLabel()
                                }
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CONFIRM PASSWORD */}

                      <div>
                        <label
                          htmlFor="confirm-password"
                          className="
                            mb-2
                            block
                            text-sm
                            font-bold
                            text-[#4B4550]
                          "
                        >
                          Confirm
                          new
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
                            id="confirm-password"
                            type={
                              showConfirmPassword
                                ? "text"
                                : "password"
                            }
                            value={
                              confirmPassword
                            }
                            autoComplete="new-password"
                            placeholder="Confirm your new password"
                            onChange={(
                              event
                            ) => {
                              setConfirmPassword(
                                event
                                  .target
                                  .value
                              );

                              setMessage(
                                ""
                              );

                              setMessageType(
                                ""
                              );
                            }}
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

                              placeholder:text-[#ABA4AF]

                              sm:min-h-[58px]
                              sm:text-base

                              ${
                                passwordsDifferent
                                  ? "border-[#E5A6A6] focus:border-[#D95C5C] focus:ring-4 focus:ring-[#D95C5C]/10"
                                  : passwordsMatch
                                  ? "border-[#A7D4BF] focus:border-[#4F9D7A] focus:ring-4 focus:ring-[#4F9D7A]/10"
                                  : "border-[#E1DBE7] hover:border-[#D3C9DC] focus:border-[#B8A1FF] focus:ring-4 focus:ring-[#B8A1FF]/15"
                              }
                            `}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(
                                (
                                  previous
                                ) =>
                                  !previous
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
                            Passwords
                            do not
                            match.
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

                      {/* RESET */}

                      <button
                        type="button"
                        onClick={
                          resetPassword
                        }
                        disabled={
                          loading
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

                          text-sm
                          font-bold
                          text-white

                          shadow-[0_12px_28px_rgba(108,92,231,0.24)]

                          transition-all
                          duration-300

                          hover:-translate-y-0.5
                          hover:shadow-[0_17px_36px_rgba(108,92,231,0.31)]

                          active:scale-[0.99]

                          disabled:cursor-not-allowed
                          disabled:opacity-60
                          disabled:hover:translate-y-0

                          sm:text-base
                        "
                      >
                        {loading ? (
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

                            Updating
                            Password...
                          </>
                        ) : (
                          <>
                            Reset
                            Password

                            <span>
                              →
                            </span>
                          </>
                        )}
                      </button>

                      {/* RESEND */}

                      <div
                        className="
                          text-center
                        "
                      >
                        <p
                          className="
                            text-xs
                            leading-6
                            text-[#8E8792]

                            sm:text-sm
                          "
                        >
                          Didn't
                          receive
                          your
                          code?{" "}

                          <button
                            type="button"
                            onClick={
                              sendOtp
                            }
                            disabled={
                              loading
                            }
                            className="
                              font-bold
                              text-[#6C5CE7]

                              transition-colors

                              hover:text-[#5544C6]
                              hover:underline

                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                          >
                            Send
                            again
                          </button>
                        </p>
                      </div>
                    </>
                  )}

                  {/* ===================================
                      MESSAGE
                  =================================== */}

                  {message && (
                    <div
                      className={`
                        rounded-2xl

                        border

                        px-4
                        py-3.5

                        text-sm
                        leading-6

                        ${
                          messageType ===
                          "success"
                            ? "border-[#D3E8DD] bg-[#F2F9F5] text-[#417D61]"
                            : "border-[#F0D8D8] bg-[#FFF6F6] text-[#B15454]"
                        }
                      `}
                    >
                      <div
                        className="
                          flex
                          items-start
                          gap-2
                        "
                      >
                        <span
                          className="
                            mt-[2px]
                            shrink-0
                          "
                        >
                          {messageType ===
                          "success"
                            ? "✓"
                            : "!"}
                        </span>

                        <span>
                          {
                            message
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* =========================================
                  BACK TO LOGIN
              ========================================= */}

              {!resetComplete && (
                <div
                  className="
                    mt-7

                    border-t
                    border-[#ECE7F0]

                    pt-6

                    text-center
                  "
                >
                  <Link
                    to="/login"
                    className="
                      inline-flex
                      min-h-[42px]
                      items-center
                      justify-center
                      gap-2

                      rounded-xl

                      px-3

                      text-sm
                      font-bold
                      text-[#625C68]

                      transition-all
                      duration-200

                      hover:bg-[#F8F5FF]
                      hover:text-[#6C5CE7]

                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#B8A1FF]
                    "
                  >
                    <BackIcon />

                    Back to
                    Sign In
                  </Link>
                </div>
              )}

              {/* =========================================
                  SECURITY MICROCOPY
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
                  Account
                  Recovery
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