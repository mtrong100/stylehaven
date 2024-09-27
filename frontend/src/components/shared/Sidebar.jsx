import React from "react";
import { Divider } from "primereact/divider";
import { Link, useLocation } from "react-router-dom";
import { FaTshirt } from "react-icons/fa";
import { SIDEBAR_LINKS } from "../../utils/constant";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-[300px] overflow-y-auto sticky top-0 left-0  border-right h-screen p-3 shadow-sm flex-shrink-0 bg-indigo-700 text-white z-10">
      <h1 className="text-center text-3xl font-semibold flex items-center gap-2 justify-center">
        <FaTshirt size={30} />
        StyleHaven
      </h1>

      <Divider />

      <ul className="space-y-1">
        {SIDEBAR_LINKS.map((link) => {
          const activeLink = location.pathname === link.link;

          return (
            <Link
              key={link.name}
              to={link.link}
              className={`${
                activeLink
                  ? "bg-white/20 font-semibold"
                  : "hover:bg-white/10 font-medium"
              } flex cursor-pointer items-center gap-3 px-5 rounded-md h-[45px] transition-all`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          );
        })}
      </ul>

      <Divider />

      <div className="flex cursor-pointer items-center gap-3 px-5 rounded-md h-[45px] hover:bg-white/10 font-medium">
        <i className="pi pi-sign-out"></i>
        <span>Đăng xuất</span>
      </div>
    </div>
  );
};

export default Sidebar;
