import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../shared/Header";

const MainLayout = () => {
  return (
    <div>
      <Header />
      <main className="w-full max-w-[1170px] px-5 mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
