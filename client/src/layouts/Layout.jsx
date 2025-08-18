import Navbar from "@/components/Navbar";
import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <main className="min-h-screen px-5 sm:px-10 xl:px-50">
        {/* header */}
        {/* <Navbar/> */}
        {/* body */}
        <Outlet />
      </main>
      {/* footer */}
      {/* <div className="p-10 text-center mt-10 bg-gray-800">Made by nishanth</div> */}
    </div>
  );
};

export default Layout;
