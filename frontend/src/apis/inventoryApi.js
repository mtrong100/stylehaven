import axios from "../configs/axios";

export const getStockApi = async (params) => {
  const response = await axios.get("/stocks", { params });
  return response;
};
