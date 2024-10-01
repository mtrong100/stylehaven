import axios from "../configs/axios";

export const getVouchersApi = async (params) => {
  const response = await axios.get("/vouchers", { params });
  return response;
};

export const createVoucherApi = async (data) => {
  const response = await axios.post("/vouchers/create", data);
  return response;
};

export const updateVoucherApi = async (id, data) => {
  const response = await axios.put(`/vouchers/update/${id}`, data);
  return response;
};

export const deleteVoucherApi = async (id) => {
  const response = await axios.delete(`/vouchers/delete/${id}`);
  return response;
};
