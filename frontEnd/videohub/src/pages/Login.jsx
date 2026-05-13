import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser,clearAuthState } from "../features/authSlice.js";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user, success } = useSelector((state) => state.auth);

  

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Don't submit if already loading
    if (loading) return;
    
    dispatch(loginUser(formData));
    
  };

  // Reset form function
  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
    });
  };

  useEffect(() => {
  dispatch(clearAuthState());
}, [dispatch]);

  // Handle successful login
  useEffect(() => {
    if (success && user) {

      // Reset form fields
      resetForm();
      
     
      
        navigate("/", { replace: true }); // Use replace to prevent going back to login
      
      
  
    }
  }, [success, user, navigate]);

  
  useEffect(() => {
    return () => {
      // Optional: Clear any pending states when component unmounts
      if (!success) {
        dispatch(clearAuthState());
      }
    };
  }, [dispatch, success]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-md bg-gray-900/80 border border-gray-700 rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Login
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 mb-4">
            <p className="text-green-400 text-sm text-center">
              Login successful! Redirecting...
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
              disabled={loading || success}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Password"
              onChange={handleChange}
              disabled={loading || success}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            disabled={loading}
            className="text-blue-400 hover:text-blue-300 cursor-pointer transition disabled:opacity-50"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;