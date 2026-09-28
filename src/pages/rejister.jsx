 
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export default function RegisterPage() {

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  async function handleRegister() {

    console.log("1. REGISTER BUTTON CLICKED");
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Email:", email);

    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {

      console.log("2. SENDING REGISTER REQUEST");

      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/user",
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password
        }
      );

      console.log("3. RESPONSE RECEIVED");

      console.log("Status:", res.status);

      console.log("Response:", res.data);

      toast.success("Registration successful!");

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      navigate("/login");

    } catch (error) {

      console.log("4. ERROR OCCURRED");
      console.log("Full error:", error);

      if (error.response) {

        console.log("Status:", error.response.status);
        console.log("Response:", error.response.data);

        toast.error(
          error.response.data.message || "Registration failed"
        );

      } else {

        console.log("Error message:", error.message);

        toast.error("Server connection failed");

      }
    }
  }

  return (

    <div className="w-full h-screen bg-[url('/login.jpg')] bg-cover bg-center bg-no-repeat flex justify-evenly items-center">

      <div className="w-[50%] h-full">

      </div>

      <div className="w-[50%] h-full flex justify-center items-center">

        <div className="w-[500px] min-h-[650px] backdrop-blur-md rounded-[20px] shadow-xl flex flex-col justify-center items-center">

          <h1 className="text-[35px] font-bold text-white mb-[30px]">

            Create Account
            
          </h1>

          <input
            value={firstName}
            placeholder="First Name"
            className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] mb-[20px] px-[20px] outline-none"
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />

          <input
            value={lastName}
            placeholder="Last Name"
            className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] mb-[20px] px-[20px] outline-none"
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />

          <input
            value={email}
            type="email"
            placeholder="Email"
            className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] mb-[20px] px-[20px] outline-none"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <input
            value={password}
            type="password"
            placeholder="Password"
            className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] mb-[20px] px-[20px] outline-none"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <input
            value={confirmPassword}
            type="password"
            placeholder="Confirm Password"
            className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] mb-[20px] px-[20px] outline-none"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />

          <button
            onClick={handleRegister}
            className="w-[300px] h-[50px] bg-[#ce3fe9] rounded-[20px] text-[20px] font-bold text-white mb-[20px] cursor-pointer"
          >

            Register
           
          </button>

          <p className="text-white">
            Already have an account?
            <span
              onClick={() => navigate("/login")}
              className="ml-[5px] text-[#c3efe9] font-bold cursor-pointer"
            >

              Login

            </span>

          </p>

        </div>

      </div>

    </div>

  );

}
