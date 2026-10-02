import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();


  // adding google through  login
const googleLogin = useGoogleLogin({
  onSuccess: async (response) => {
    try {
      const accessToken = response.access_token;

      const result = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/user/login/google",
        {
          accessToken: accessToken
        }
      );

    toast.success("login successfully !");
      const token =result.data.token
      localStorage.setItem("token",token)
      if(result.data.role=="admin"){
        navigate("/admin/");

      }
      else{
        navigate("/");

      }

    } catch (error) {
      console.log(
        "Google login error:",
        error.response?.data || error.message
      );
    }
  },

  onError: () => {
    console.log("Google Login Failed");
  }
});
  async function handleLogin(e) {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    try {
      setIsLoading(true);

      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/user/login",
        {
          email: email,
          password: password,
        }
      );

      toast.success("Login successful!");

      localStorage.setItem("token", res.data.token);

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error);

      if (error.response) {
        toast.error(
          error.response.data?.message || "Login failed"
        );
      } else {
        toast.error("Server connection failed");
      }
    } finally {
      setIsLoading(false);
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
        lg:justify-end

        px-4
        sm:px-6
        lg:px-16
        xl:px-24

        py-8
      "
    >
      {/* Background Overlay */}
      <div
        className="
          absolute
          inset-0
          bg-black/30
          lg:bg-black/20
        "
      />

      {/* ================= LEFT CONTENT ================= */}

      <section
        className="
          hidden
          lg:flex

          relative
          z-10

          w-1/2
          min-h-[600px]

          flex-col
          justify-center

          pr-12

          text-white
        "
      >
        <div className="max-w-[520px]">
          <p
            className="
              text-sm
              font-semibold
              uppercase
              tracking-[0.25em]

              text-white/80

              mb-4
            "
          >
            Welcome Back
          </p>

          <h1
            className="
              text-4xl
              xl:text-5xl

              font-bold
              leading-tight

              drop-shadow-md
            "
          >
            Login and continue your shopping journey.
          </h1>

          <p
            className="
              mt-5

              text-base
              xl:text-lg

              text-white/85

              leading-relaxed

              max-w-[470px]
            "
          >
            Access your account, manage your orders and
            continue shopping from where you stopped.
          </p>
        </div>
      </section>

      {/* ================= LOGIN CARD ================= */}

      <section
        className="
          relative
          z-10

          w-full
          lg:w-1/2

          flex
          justify-center
          lg:justify-end
        "
      >
        <div
          className="
            w-full
            max-w-[460px]

            bg-white/90
            backdrop-blur-xl

            border
            border-white/40

            rounded-[28px]

            shadow-[0_25px_70px_rgba(0,0,0,0.25)]

            px-5
            sm:px-8
            md:px-10

            py-8
            sm:py-10
          "
        >
          {/* Heading */}
          <div className="mb-8">
            <p
              className="
                text-sm
                font-semibold

                text-red-500

                mb-2
              "
            >
              Welcome back
            </p>

            <h2
              className="
                text-3xl
                sm:text-[34px]

                font-bold

                text-[#2F3542]

                leading-tight
              "
            >
              Login to your account
            </h2>

            <p
              className="
                mt-2

                text-sm
                sm:text-base

                text-gray-500

                leading-relaxed
              "
            >
              Enter your email and password to continue.
            </p>
          </div>

          {/* ================= FORM ================= */}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="
                  block

                  text-sm
                  font-semibold

                  text-gray-700

                  mb-2
                "
              >
                Email Address
              </label>

              <div className="relative">
                <FiMail
                  aria-hidden="true"
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2

                    text-gray-400
                    text-[19px]
                  "
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  autoComplete="email"
                  placeholder="Enter your email"
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="
                    w-full
                    h-[52px]

                    pl-12
                    pr-4

                    rounded-xl

                    bg-white

                    border
                    border-gray-200

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
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="
                  block

                  text-sm
                  font-semibold

                  text-gray-700

                  mb-2
                "
              >
                Password
              </label>

              <div className="relative">
                <FiLock
                  aria-hidden="true"
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2

                    text-gray-400
                    text-[19px]
                  "
                />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="
                    w-full
                    h-[52px]

                    pl-12
                    pr-12

                    rounded-xl

                    bg-white

                    border
                    border-gray-200

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
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
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
                    -translate-y-1/2

                    w-9
                    h-9

                    flex
                    items-center
                    justify-center

                    rounded-lg

                    text-gray-400

                    transition-all
                    duration-200

                    hover:bg-gray-100
                    hover:text-gray-700

                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-red-400
                  "
                >
                  {showPassword ? (
                    <FiEyeOff
                      aria-hidden="true"
                    />
                  ) : (
                    <FiEye
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full
                min-h-[52px]

                rounded-xl

                bg-red-500
                text-white

                font-bold
                text-base

                shadow-md

                flex
                items-center
                justify-center

                transition-all
                duration-200

                hover:bg-red-600
                hover:shadow-lg
                hover:-translate-y-[1px]

                active:scale-[0.98]

                focus:outline-none
                focus-visible:ring-4
                focus-visible:ring-red-200

                disabled:opacity-60
                disabled:cursor-not-allowed
                disabled:hover:translate-y-0
              "
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <span
                    className="
                      w-5
                      h-5

                      border-2
                      border-white/40
                      border-t-white

                      rounded-full

                      animate-spin
                    "
                  />

                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </button>
            <button
  type="button"
  className="
    w-full
    min-h-[52px]
    mt-3

    rounded-xl

    bg-white
    text-gray-700

    font-semibold
    text-base

    border
    border-gray-300

    flex
    items-center
    justify-center
    gap-3

    shadow-sm

    transition-all
    duration-200

    hover:bg-gray-50
    hover:border-gray-400
    hover:shadow-md

    active:scale-[0.98]

    focus:outline-none
    focus-visible:ring-4
    focus-visible:ring-gray-200
  "
  onClick={googleLogin}
>
  <FaGoogle className="text-xl" />
  Continue with Google
</button>
          </form>

          {/* ================= SIGN UP ================= */}

          <div
            className="
              mt-7
              pt-6

              border-t
              border-gray-200

              text-center
            "
          >
            <p
              className="
                text-sm
                text-gray-500
              "
            >
              Don't have an account?

              <button
                type="button"
                onClick={() =>
                  navigate("/signup")
                }
                className="
                  ml-1

                  font-semibold

                  text-red-500

                  transition-colors

                  hover:text-red-600
                  hover:underline

                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-red-400

                  rounded
                "
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

