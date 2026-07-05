import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/authSlice.js";
import { useNavigate } from "react-router-dom";


export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  const [emailError, setEmailError] = useState("");


  //  for resetting file inputs
  const [formKey, setFormKey] = useState(Date.now());
  
  // email validation
const validateEmail = (email) => {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

  //  handle input changes
  const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (files) {
    setForm((prev) => ({
      ...prev,
      [name]: files[0],
    }));
    return;
  }

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));

  // Validate email while typing
  if (name === "email") {
    if (value === "") {
      setEmailError("");
    } else if (!validateEmail(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  }
};


  //  submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateEmail(form.email)) {
  setEmailError("Please enter a valid email address.");
  return;
}
    

    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("username", form.username);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("avatar", form.avatar);

    if (form.coverImage) {
      formData.append("coverImage", form.coverImage);
    }

    dispatch(registerUser(formData));
  };

  //  reset form after success
  useEffect(() => {
    let timer;
    if (success) {
      setForm({
        fullName: "",
        username: "",
        email: "",
        password: "",
        avatar: null,
        coverImage: null,
      });

      setFormKey(Date.now()); //  reset file inputs
      // navigate("/login");
      timer = setTimeout(()=>{
        navigate("/login")
      },3000)
    }
    return () => clearTimeout(timer)
  }, [success,navigate]);

 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl p-8">
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h2>

        <form
          key={formKey}
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Full Name */}
          <input
            name="fullName"
            value={form.fullName}
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Username */}
          <input
            name="username"
            value={form.username}
            placeholder="Username"
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Email */}
          <input
            name="email"
            value={form.email}
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {emailError && (
            <p className="text-red-400 text-sm mt-1">
              {emailError}
            </p>
          )}

          {/* Password */}
          <input
            name="password"
            type="password"
            value={form.password}
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Avatar */}
          <div className="space-y-2">
            <label className="text-gray-400 text-sm">Avatar</label>
            <input
              type="file"
              name="avatar"
              onChange={handleChange}
              className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 
              file:rounded-lg file:border-0 file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <label className="text-gray-400 text-sm">
              Cover Image (Optional)
            </label>
            <input
              type="file"
              name="coverImage"
              onChange={handleChange}
              className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 
              file:rounded-lg file:border-0 file:text-sm file:font-semibold
              file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white 
            bg-blue-600 hover:bg-blue-700 transition duration-200 
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* Success */}
          {success && (
            <p className="text-green-400 text-sm text-center">
              Account created successfully 🎉
            </p>
          )}
        </form>

        {/* Footer */}
        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <span
          onClick={() => navigate("/login")}
           className="text-blue-400 cursor-pointer hover:underline">
            Login
          </span>
        </p>

        
      </div>
    </div>
  );
}