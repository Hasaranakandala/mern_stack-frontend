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

  // Send OTP
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

      setMessage("OTP sent successfully. Please check your email.");
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

  // Reset Password
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
      const otpInNumber=parseInt(otp,10);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/95 shadow-2xl shadow-black/30 backdrop-blur-xl">
            {/* Top decoration */}
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

            <div className="px-6 py-8 sm:px-8 sm:py-10">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="h-8 w-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 5.25a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0v.75h-15v-.75Zm13.5-8.25 1.5 1.5m0 0 1.5 1.5m-1.5-1.5-1.5 1.5m1.5-1.5 1.5-1.5"
                    />
                  </svg>
                </div>
              </div>

              {/* Heading */}
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Forgot Password?
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {otpSend
                    ? "Enter the OTP sent to your email and create your new password."
                    : "Enter your email address and we'll send you a verification code."}
                </p>
              </div>

              {/* Progress */}
              <div className="mb-8 flex items-center justify-center">
                <div className="flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                    1
                  </div>

                  <div
                    className={`h-1 w-16 sm:w-20 ${
                      otpSend ? "bg-indigo-600" : "bg-slate-200"
                    }`}
                  />

                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                      otpSend
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    2
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.7}
                        stroke="currentColor"
                        className="h-5 w-5"
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
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>
                </div>

                {!otpSend && (
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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
                          className="h-4 w-4"
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

                {/* OTP Step */}
                {otpSend && (
                  <>
                    {/* OTP */}
                    <div>
                      <label
                        htmlFor="otp"
                        className="mb-2 block text-sm font-semibold text-slate-700"
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
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-center text-lg font-semibold tracking-[0.4em] text-slate-900 outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>

                    {/* New Password */}
                    <div>
                      <label
                        htmlFor="new-password"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        New Password
                      </label>

                      <input
                        id="new-password"
                        type="password"
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Confirm Password
                      </label>

                      <input
                        id="confirm-password"
                        type="password"
                        placeholder="Re-enter your new password"
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>

                    {/* Reset button */}
                    <button
                      type="button"
                      onClick={resetPassword}
                      disabled={loading}
                      className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Resetting Password...
                        </div>
                      ) : (
                        "Reset Password"
                      )}
                    </button>

                    {/* Resend */}
                    <div className="text-center">
                      <p className="text-sm text-slate-500">
                        Didn't receive the code?{" "}
                        <button
                          type="button"
                          onClick={sendOtp}
                          disabled={loading}
                          className="font-semibold text-indigo-600 transition hover:text-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Resend OTP
                        </button>
                      </p>
                    </div>
                  </>
                )}

                {/* Message */}
                {message && (
                  <div
                    className={`rounded-xl border px-4 py-3 text-sm ${
                      message.toLowerCase().includes("success")
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        {message.toLowerCase().includes("success") ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4.5 12.75 6 6 9-13.5"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.052 3.38c.866-1.5 3.03-1.5 3.896 0l7.355 12.746ZM12 15.75h.008v.008H12v-.008Z"
                            />
                          </svg>
                        )}
                      </div>

                      <span>{message}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Back to login */}
              <div className="mt-8 border-t border-slate-100 pt-6 text-center">
                <a
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="h-4 w-4"
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

          <p className="mt-6 text-center text-xs text-slate-400">
            Secure password recovery
          </p>
        </div>
      </div>
    </div>
  );
}