

import { useDispatch, useSelector } from "react-redux";
import { setActive } from "../features/uiSlice";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
// import { useDispatch as useReduxDispatch } from "react-redux"; // Rename to avoid conflict
import { getLikedVideos } from "../features/likeSlice.js"; // Add this import

export default function Sidebar() {
  const dispatch = useDispatch();
  // const reduxDispatch = useReduxDispatch(); // For like actions
  const navigate = useNavigate(); // Add navigation
  const active = useSelector((state) => state.ui?.active);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { id: "discover", label: "Discover", icon: "🏠", dimmed: true, clickable: false },
    { id: "home", label: "Home", icon: "🏠" },
    { id: "trending", label: "Trending", icon: "🔥" },
    { id: "subscriptions", label: "Subscriptions", icon: "📡" },
    { separator: true },
    { id: "youHeader", label: "You", isHeader: true },
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "watchHistory", label: "Watch History", icon: "🕑" },
    { id: "playlists", label: "Playlists", icon: "🎵" },
    { id: "likedVideos", label: "Liked Videos", icon: "❤️" },
    { separator: true },
    { id: "community", label: "Community", icon: "💬", dimmed: true, clickable: false },
    { id: "tweetsPosts", label: "Tweets / Posts", icon: "📝" },
    { separator: true },
    { id: "account", label: "Account", icon: "👤", dimmed: true, clickable: false },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  // Handle click on menu items
  const handleMenuItemClick = async (item) => {
    // Special handling for Liked Videos
    if (item.id === "likedVideos") {
      navigate("/liked-videos");
      dispatch(setActive(item.id));
      if (isMobile) setIsSidebarOpen(false);
      return;
    }

    // For other clickable items
    if (!item.dimmed && item.clickable !== false) {
      dispatch(setActive(item.id));
      if (isMobile) setIsSidebarOpen(false);
      // Add navigation for other items if needed
      if (item.id === "home") navigate("/");
      if (item.id === "trending") navigate("/trending");
      if (item.id === "subscriptions") navigate("/subscriptions");
      if (item.id === "playlists") navigate("/playlists");
      if (item.id === "profile") navigate("/profile");
      if (item.id === "watchHistory") navigate("/history");
      if(item.id === "comments") navigate("/allcomments")
    }
  };

  // Mobile sidebar toggle button
  const MobileToggle = () => (
    <button
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      className="fixed top-1 left-0 z-50 md:hidden bg-bg2 p-2 rounded-lg shadow-lg border border-border"
    >
      <span className="text-2xl">☰</span>
    </button>
  );

  // Mobile overlay
  const MobileOverlay = () => (
    isSidebarOpen && (
      <div
        onClick={() => setIsSidebarOpen(false)}
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
      />
    )
  );

  return (
    <>
      <MobileToggle />
      <MobileOverlay />

      {/* Sidebar */}
      <div
        className={`
          fixed  top-0 left-0 h-screen
          bg-bg2 border-r border-border
          transition-all duration-300 ease-in-out
          z-40 overflow-y-auto overflow-x-hidden
          ${isMobile ? 'w-64' : 'w-56'}
          ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          md:translate-x-0
          hide-scrollbar
        `}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="p-4">
          {/* Logo Section - Responsive */}
          <div className="flex items-center justify-between ml-8 mb-6">
            <h2 className={`
              font-bold
              ${isMobile ? 'text-xl' : 'text-lg'}
              ${isMobile && !isSidebarOpen ? 'hidden' : 'block'}
            `}>
              VideoHub
            </h2>
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden text-2xl"
              >
                ✕
              </button>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {menuItems.map((item, index) => {
              if (item.separator) {
                return (
                  <div 
                    key={`sep-${index}`} 
                    className="h-px bg-border my-3 mx-2" 
                  />
                );
              }

              if (item.isHeader) {
                return (
                  <div
                    key={item.id}
                    className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-2"
                  >
                    {item.label}
                  </div>
                );
              }

              if (item.dimmed && !item.clickable) {
                return (
                  <div
                    key={item.id}
                    className={`
                      flex items-center gap-3 rounded-lg
                      ${isMobile ? 'py-3 px-2' : 'py-2 px-2'}
                      opacity-50 cursor-default
                    `}
                  >
                    <span className={`
                      ${isMobile ? 'text-xl' : 'text-lg'}
                      transition-all duration-200
                      opacity-0
                    `}>
                      {item.icon}
                    </span>
                    <span className={`
                      ${isMobile ? 'text-base' : 'text-sm'}
                      whitespace-nowrap
                      ${isMobile && !isSidebarOpen ? 'hidden' : 'block'}
                    `}>
                      {item.label}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  onClick={() => handleMenuItemClick(item)} // Changed to use handleMenuItemClick
                  className={`
                    flex items-center gap-3 rounded-lg cursor-pointer 
                    transition-all duration-200
                    ${active === item.id 
                      ? "bg-bg3 scale-[1.02]" 
                      : "hover:bg-bg3/50 hover:scale-[1.01]"
                    }
                    ${isMobile ? 'py-3 px-2' : 'py-2 px-2'}
                  `}
                  title={isMobile && !isSidebarOpen ? item.label : ""}
                >
                  <span className={`
                    ${isMobile ? 'text-xl' : 'text-lg'}
                    transition-all duration-200
                  `}>
                    {item.icon}
                  </span>
                  <span className={`
                    ${isMobile ? 'text-base' : 'text-sm'}
                    whitespace-nowrap
                    ${isMobile && !isSidebarOpen ? 'hidden' : 'block'}
                  `}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Spacer for fixed sidebar on desktop - reduced width */}
      <div className="hidden md:block w-0" />
    </>
  );
}