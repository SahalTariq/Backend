import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Home from "../pages/Home";
import { useState } from "react";



export default function Layout() {

const [search, setSearch] = useState("");
  return (
  
    // Example Layout.jsx or App.jsx
<div className="flex min-h-screen bg-gray-950 text-white">

  {/* SIDEBAR */}
  <Sidebar />

  {/* RIGHT SIDE */}
  <div className="flex-1 md:ml-56">

    {/* TOPBAR */}
    <div className="fixed top-0 left-0 md:left-56 right-0 z-30 bg-bg2 border-b border-border">
      <Topbar
        search={search}
        setSearch={setSearch} />
    </div>

    {/* PAGE CONTENT */}
    <main className="pt-16 p-4 overflow-x-hidden
    scrollbar-thin
            scrollbar-thumb-zinc-600
            scrollbar-track-transparent

            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-zinc-600
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-zinc-500
    ">
      <Home search={search} />
      

    </main>
  </div>
</div>

  );
}