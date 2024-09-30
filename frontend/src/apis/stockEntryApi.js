import axios from "../configs/axios";

export const getStockEntriesApi = async (params) => {
  const response = await axios.get("/stock-entries", { params });
  return response;
};

export const getStockEntryDetailsApi = async (id) => {
  const response = await axios.get(`/stock-entries/${id}`);
  return response;
};

export const createStockEntryApi = async (data) => {
  const response = await axios.post("/stock-entries/create", data);
  return response;
};

export const updateStockEntryApi = async (id, data) => {
  const response = await axios.put(`/stock-entries/update/${id}`, data);
  return response;
};

export const deleteStockEntryApi = async (id) => {
  const response = await axios.delete(`/stock-entries/delete/${id}`);
  return response;
};
