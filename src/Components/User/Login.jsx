import { useState } from "react";
import axiosInstance from "../../../api/axiosConfig";
import Navigation from "../Nav/Navigation";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock } from "lucide-react";
import background from '../../img/bg-image.jpg'

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axiosInstance.post(
            "api/auth/login",
            { email, password },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Navigate based on user role
        if (user.role === 1) {
            navigate("/dashboard");
        } else if (user.role === 2) {
            navigate("/healthworker");
        }
    } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
    }
};

  return (
    <>
      <Navigation />
      <h1 className="text-5xl m-10 font-extrabold text-gray-800 text-center">Vaccination Record Management System for Infant of Barangay Canlandog</h1>
      <div
        className="overflow-hidden h-screen flex items-start justify-center bg-cover bg-center p-4 pt-16"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">Login</h2>
          {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">Email</label>
              <div className="flex items-center rounded-lg border border-gray-300 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
                <User className="ml-3 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email"
                  className="w-full p-3 bg-transparent focus:outline-none"
                />
              </div>
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">Password</label>
              <div className="flex items-center rounded-lg border border-gray-300 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
                <Lock className="ml-3 text-gray-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="w-full p-3 bg-transparent focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
            <p className="text-center text-gray-600 mt-4">
              Not registered yet?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Register now
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
