import axios from "../configs/axios";

export const getInventoryApi = async (params) => {
  const response = await axios.get("/inventory", { params });
  return response;
};
