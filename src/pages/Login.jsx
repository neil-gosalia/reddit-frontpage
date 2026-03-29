import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo.svg" alt="Logo" className="h-10" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">
          Log In
        </h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          Welcome back! Please enter your details.
        </p>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors active:scale-95 duration-150 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-orange-500 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;