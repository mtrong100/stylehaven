import React from "react";
import { userStore } from "../../zustand/userStore";

const Dashboard = () => {
  const currentUser = userStore((state) => state.currentUser);
  console.log("🚀 ~ Dashboard ~ currentUser:", currentUser);

  return <div>Dashboard</div>;
};

export default Dashboard;
