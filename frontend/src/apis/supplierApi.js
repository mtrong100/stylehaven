import axios from "../configs/axios";

export const getSuppliersApi = async () => {
  const response = await axios.get("/suppliers");
  return response;
};

export const createSupplierApi = async (data) => {
  const response = await axios.post("/suppliers/create", data);
  return response;
};

export const updateSupplierApi = async (id, data) => {
  const response = await axios.put(`/suppliers/update/${id}`, data);
  return response;
};

export const deleteSupplierApi = async (id) => {
  const response = await axios.delete(`/suppliers/delete/${id}`);
  return response;
};
