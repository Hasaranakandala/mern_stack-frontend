import { useState } from "react";
import axios from "axios";

export default function ForgetPassword() {
  const [otpSend, setOtpSend] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ============================================
  // SEND OTP
  // ============================================

  async function sendOtp() {
    if (email.trim() === "") {
      setMessage("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/send-otp`,
        {
          email: email,
        }
      );

      console.log(response.data);

      setOtpSend(true);

      setMessage(
        "OTP sent successfully. Please check your email."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================================
  // RESET PASSWORD
  // ============================================

  async function resetPassword() {
    if (otp.trim() === "") {
      setMessage("Please enter the OTP");
      return;
    }

    if (newPassword === "") {
      setMessage("Please enter a new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const otpInNumber = parseInt(otp, 10);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/reset-password`,
        {
          email: email,
          otp: otpInNumber,
          newPassword: newPassword,
        }
      );

      console.log(response.data);

      setMessage("Password reset successfully.");
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="
        relative
        w-full
        min-h-screen

        bg-[url('/login.jpg')]
        bg-cover
        bg-center
        bg-no-repeat

        flex
        items-center
        justify-center

        px-4
        sm:px-6
        lg:px-8

        py-6
        sm:py-8
      "
    >
      {/* ============================================
          BACKGROUND OVERLAY
      ============================================ */}

      <div
        className="
          absolute
          inset-0

          bg-black/30
          lg:bg-black/20
        "
      />

      {/* ============================================
          RESET PASSWORD CARD
      ============================================ */}

      <div
        className="
          relative
          z-10

          w-full
          max-w-[460px]
        "
      >
        <div
          className="
            overflow-hidden

            rounded-[24px]
            sm:rounded-[28px]

            border
            border-white/40

            bg-white/90
            backdrop-blur-xl

            shadow-[0_25px_70px_rgba(0,0,0,0.25)]
          "
        >
          {/* TOP DECORATION */}

          <div className="h-2 bg-red-500" />

          <div
            className="
              px-5
              sm:px-8
              md:px-10

              py-7
              sm:py-9
              md:py-10
            "
          >
            {/* ============================================
                ICON
            ============================================ */}

            <div className="mb-5 sm:mb-6 flex justify-center">
              <div
                className="
                  w-14
                  h-14

                  sm:w-16
                  sm:h-16

                  flex
                  items-center
                  justify-center

                  rounded-2xl

                  bg-red-50
                  text-red-500

                  shadow-sm
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="
                    w-7
                    h-7

                    sm:w-8
                    sm:h-8
                  "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 5.25a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0v.75h-15v-.75Zm13.5-8.25 1.5 1.5m0 0 1.5 1.5m-1.5-1.5-1.5 1.5m1.5-1.5 1.5-1.5"
                  />
                </svg>
              </div>
            </div>

            {/* ============================================
                HEADING
            ============================================ */}

            <div className="mb-6 sm:mb-8 text-center">
              <p
                className="
                  text-sm
                  font-semibold
                  text-red-500

                  mb-2
                "
              >
                Account Recovery
              </p>

              <h1
                className="
                  text-2xl
                  sm:text-3xl

                  font-bold
                  tracking-tight

                  text-[#2F3542]
                "
              >
                Forgot Password?
              </h1>

              <p
                className="
                  mt-2
                  sm:mt-3

                  text-sm
                  sm:text-base

                  leading-6

                  text-gray-500
                "
              >
                {otpSend
                  ? "Enter the OTP sent to your email and create your new password."
                  : "Enter your email address and we'll send you a verification code."}
              </p>
            </div>

            {/* ============================================
                PROGRESS
            ============================================ */}

            <div
              className="
                mb-6
                sm:mb-8

                flex
                items-center
                justify-center
              "
            >
              <div className="flex items-center">
                <div
                  className="
                    w-8
                    h-8

                    flex
                    items-center
                    justify-center

                    rounded-full

                    bg-red-500

                    text-xs
                    font-semibold
                    text-white
                  "
                >
                  1
                </div>

                <div
                  className={`
                    h-1

                    w-12
                    sm:w-20

                    ${
                      otpSend
                        ? "bg-red-500"
                        : "bg-gray-200"
                    }
                  `}
                />

                <div
                  className={`
                    w-8
                    h-8

                    flex
                    items-center
                    justify-center

                    rounded-full

                    text-xs
                    font-semibold

                    transition-colors

                    ${
                      otpSend
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }
                  `}
                >
                  2
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {/* ============================================
                  EMAIL
              ============================================ */}

              <div>
                <label
                  htmlFor="email"
                  className="
                    mb-2
                    block

                    text-sm
                    font-semibold

                    text-gray-700
                  "
                >
                  Email Address
                </label>

                <div className="relative">
                  <div
                    className="
                      pointer-events-none

                      absolute
                      inset-y-0
                      left-0

                      flex
                      items-center

                      pl-4

                      text-gray-400
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.7}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5A2.25 2.25 0 0 1 19.5 19.5h-15a2.25 2.25 0 0 1-2.25-2.25V6.75M21.75 6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0-8.659 5.77a2.25 2.25 0 0 1-2.496 0L2.25 6.75"
                      />
                    </svg>
                  </div>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    disabled={otpSend}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="
                      w-full
                      h-[52px]

                      rounded-xl

                      border
                      border-gray-200

                      bg-white

                      pl-12
                      pr-4

                      text-sm
                      text-gray-800

                      placeholder:text-gray-400

                      outline-none

                      transition-all
                      duration-200

                      hover:border-gray-300

                      focus:border-red-400
                      focus:ring-4
                      focus:ring-red-100

                      disabled:cursor-not-allowed
                      disabled:bg-gray-100
                      disabled:text-gray-500
                    "
                  />
                </div>
              </div>

              {/* ============================================
                  SEND OTP
              ============================================ */}

              {!otpSend && (
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={loading}
                  className="
                    w-full
                    min-h-[52px]

                    flex
                    items-center
                    justify-center

                    rounded-xl

                    bg-red-500
                    text-white

                    text-sm
                    sm:text-base

                    font-bold

                    shadow-md

                    transition-all
                    duration-200

                    hover:bg-red-600
                    hover:shadow-lg
                    hover:-translate-y-[1px]

                    active:scale-[0.98]

                    focus:outline-none
                    focus-visible:ring-4
                    focus-visible:ring-red-200

                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    disabled:hover:translate-y-0
                  "
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <span
                        className="
                          w-4
                          h-4

                          animate-spin

                          rounded-full

                          border-2
                          border-white/30
                          border-t-white
                        "
                      />

                      Sending OTP...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Send OTP

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              )}

              {/* ============================================
                  OTP STEP
              ============================================ */}

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
                        font-semibold

                        text-gray-700
                      "
                    >
                      Verification Code
                    </label>

                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      maxLength={6}
                      onChange={(e) =>
                        setOtp(e.target.value)
                      }
                      className="
                        w-full
                        h-[52px]

                        rounded-xl

                        border
                        border-gray-200

                        bg-white

                        px-4

                        text-center

                        text-base
                        sm:text-lg

                        font-semibold

                        tracking-[0.22em]
                        sm:tracking-[0.4em]

                        text-gray-800

                        outline-none

                        transition-all
                        duration-200

                        placeholder:text-sm
                        placeholder:font-normal
                        placeholder:tracking-normal
                        placeholder:text-gray-400

                        focus:border-red-400
                        focus:ring-4
                        focus:ring-red-100
                      "
                    />
                  </div>

                  {/* NEW PASSWORD */}

                  <div>
                    <label
                      htmlFor="new-password"
                      className="
                        mb-2
                        block

                        text-sm
                        font-semibold

                        text-gray-700
                      "
                    >
                      New Password
                    </label>

                    <input
                      id="new-password"
                      type="password"
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        h-[52px]

                        rounded-xl

                        border
                        border-gray-200

                        bg-white

                        px-4

                        text-sm
                        text-gray-800

                        placeholder:text-gray-400

                        outline-none

                        transition-all
                        duration-200

                        hover:border-gray-300

                        focus:border-red-400
                        focus:ring-4
                        focus:ring-red-100
                      "
                    />
                  </div>

                  {/* CONFIRM PASSWORD */}

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="
                        mb-2
                        block

                        text-sm
                        font-semibold

                        text-gray-700
                      "
                    >
                      Confirm Password
                    </label>

                    <input
                      id="confirm-password"
                      type="password"
                      placeholder="Re-enter your new password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        h-[52px]

                        rounded-xl

                        border
                        border-gray-200

                        bg-white

                        px-4

                        text-sm
                        text-gray-800

                        placeholder:text-gray-400

                        outline-none

                        transition-all
                        duration-200

                        hover:border-gray-300

                        focus:border-red-400
                        focus:ring-4
                        focus:ring-red-100
                      "
                    />
                  </div>

                  {/* RESET BUTTON */}

                  <button
                    type="button"
                    onClick={resetPassword}
                    disabled={loading}
                    className="
                      w-full
                      min-h-[52px]

                      flex
                      items-center
                      justify-center

                      rounded-xl

                      bg-red-500
                      text-white

                      text-sm
                      sm:text-base

                      font-bold

                      shadow-md

                      transition-all
                      duration-200

                      hover:bg-red-600
                      hover:shadow-lg
                      hover:-translate-y-[1px]

                      active:scale-[0.98]

                      focus:outline-none
                      focus-visible:ring-4
                      focus-visible:ring-red-200

                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      disabled:hover:translate-y-0
                    "
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <span
                          className="
                            w-4
                            h-4

                            animate-spin

                            rounded-full

                            border-2
                            border-white/30
                            border-t-white
                          "
                        />

                        Resetting Password...
                      </div>
                    ) : (
                      "Reset Password"
                    )}
                  </button>

                  {/* RESEND OTP */}

                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Didn't receive the code?{" "}

                      <button
                        type="button"
                        onClick={sendOtp}
                        disabled={loading}
                        className="
                          font-semibold
                          text-red-500

                          transition-colors

                          hover:text-red-600
                          hover:underline

                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        Resend OTP
                      </button>
                    </p>
                  </div>
                </>
              )}

              {/* ============================================
                  MESSAGE
              ============================================ */}

              {message && (
                <div
                  className={`
                    rounded-xl

                    border

                    px-4
                    py-3

                    text-sm

                    ${
                      message
                        .toLowerCase()
                        .includes("success")
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }
                  `}
                >
                  <div className="flex items-start gap-2">
                    <span>{message}</span>
                  </div>
                </div>
              )}
            </div>

            {/* ============================================
                BACK TO LOGIN
            ============================================ */}

            <div
              className="
                mt-7
                sm:mt-8

                border-t
                border-gray-200

                pt-5
                sm:pt-6

                text-center
              "
            >
              <a
                href="/login"
                className="
                  inline-flex
                  items-center

                  gap-2

                  text-sm
                  font-semibold

                  text-gray-600

                  transition-colors

                  hover:text-red-500
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>

                Back to Login
              </a>
            </div>
          </div>
        </div>

        <p
          className="
            mt-4
            sm:mt-6

            text-center

            text-xs

            text-white/70
          "
        >
          Secure password recovery
        </p>
      </div>
    </main>
  );
}