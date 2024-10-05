import React from "react";
import { FaTshirt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userStore } from "../../zustand/userStore";
import { Button } from "primereact/button";
import { NAV_LINKS } from "../../utils/constant";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = userStore((state) => state.currentUser);

  return (
    <header className="z-50 sticky top-0">
      <div className="h-max max-w-full rounded-none p-3 bg-indigo-600">
        <section className="page-container">
          <div className="flex items-center justify-between text-white text-sm">
            <p>Call: +0123 456 789</p>
            <div className="flex items-center gap-5">
              <i className="pi pi-facebook"></i>
              <i className="pi pi-linkedin"></i>
              <i className="pi pi-tiktok"></i>
              <i className="pi pi-youtube"></i>
            </div>
          </div>

          <div className="flex items-center justify-between mt-5">
            <Link
              to="/"
              className="text-center text-white text-3xl font-semibold flex items-center gap-2 justify-center"
            >
              <FaTshirt size={30} />
              StyleHaven
            </Link>

            {currentUser ? (
              <div className="flex items-center gap-5">
                <p className="text-white">
                  Xin chào!{" "}
                  <strong className="text-lg">{currentUser?.name}</strong>
                </p>

                <div
                  onClick={() => navigate("/cart")}
                  className="relative cursor-pointer"
                >
                  <i className="pi pi-shopping-cart text-white text-2xl"></i>
                  <span className="absolute -top-2 -right-3 h-5 w-5 flex items-center justify-center bg-red-500  rounded-full text-xs text-white font-bold pointer-events-none">
                    {10}
                  </span>
                </div>

                <div
                  onClick={() => navigate("/wishlist")}
                  className="relative cursor-pointer"
                >
                  <i className="pi pi-heart text-white text-2xl"></i>
                  <span className="absolute -top-2 -right-3 h-5 w-5 flex items-center justify-center bg-red-500  rounded-full text-xs text-white font-bold pointer-events-none">
                    {5}
                  </span>
                </div>
              </div>
            ) : (
              <Button
                label="Đăng nhập"
                raised
                outlined
                icon="pi pi-sign-in"
                className="bg-white text-slate-900"
                onClick={() => navigate("/login")}
              />
            )}
          </div>
        </section>
      </div>
      <div className="h-[50px] bg-blue-100 flex items-center  ">
        <div className="page-container flex items-center justify-center">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((item) => {
              const isActive = item.link === location.pathname;

              if (item.link === "/profile" && !currentUser) {
                return null;
              }

              return (
                <Link
                  className={`${
                    isActive
                      ? "text-indigo-600 font-semibold"
                      : "hover:text-indigo-600"
                  }  transition-all font-semibold`}
                  to={item.link}
                  key={item.name}
                >
                  {item.name}
                </Link>
              );
            })}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
