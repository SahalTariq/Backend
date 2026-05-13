
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useState } from "react";
import { logoutUserApi } from "../features/authSlice.js";
import { useDispatch } from "react-redux";
import {clearUser} from "../features/authSlice.js"



export default function Topbar({search,setSearch}) {
  
   
  const { user } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch();

  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();



  const handleUploadClick = ()=>{
    navigate("/upload")
  }

 const handleLogout = async () => {
  try {
    await logoutUserApi();

    localStorage.removeItem("token");

    dispatch(clearUser()); // ✅ CLEAR REDUX USER

    setShowDropdown(false);

    navigate("/login");

  } catch (error) {
    console.log("Logout failed:", error);
  }
};
 

  return (
    <div className="h-14 bg-bg2 border-b border-border flex items-center px-6 gap-4">
      {/* <div className="font-bold">▶ VideoHub</div> */}

      <div className="flex-1 flex justify-center">
        <div className="flex items-center bg-bg3 border border-border rounded-full px-4 py-1 w-full max-w-md">
          <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm flex-1"
              placeholder="Search videos..."
          />
          <button className="text-text2 text-xs">Search</button>
        </div>
      </div>

      <div className="flex items-center gap-3 relative">

  {/* Upload Button */}
  <div
    className="w-8 h-8 bg-bg3 rounded-full flex items-center justify-center cursor-pointer"
    onClick={handleUploadClick}
  >
    +
  </div>

 {/* IF USER NOT LOGIN */}
  {!user ? (
    <button
      onClick={() => navigate("/login")}
      className="
        px-4 py-1.5 rounded-full
        bg-accent text-white text-sm
        hover:opacity-90 transition
      "
    >
      Login
    </button>
  ) : (
    <>
      {/* Avatar */}
      <div
        onClick={() => setShowDropdown(!showDropdown)}
        className="
          w-9 h-9 rounded-full overflow-hidden
          flex items-center justify-center
          cursor-pointer bg-accent border border-border
        "
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <FaUser className="text-white text-sm" />
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="
            absolute right-0 top-12
            w-40 bg-bg2 border border-border
            rounded-xl shadow-xl overflow-hidden z-50
          "
        >
          <button
            onClick={handleLogout}
            className="
              w-full text-left px-4 py-3
              text-sm text-red-400
              hover:bg-red-500/10
              hover:text-red-300
              transition duration-200
              flex items-center gap-2
            "
          >
            🚪 Logout
          </button>
        </div>
      )}
    </>
  )}
</div>
    </div>
  );
}