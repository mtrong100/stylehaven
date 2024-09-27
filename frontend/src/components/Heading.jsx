import React from "react";

const Heading = ({ children }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-[15px] h-[30px] rounded-lg bg-indigo-600"></div>
      <h1 className="text-3xl font-bold text-gray-800">{children}</h1>
    </div>
  );
};

export default Heading;
