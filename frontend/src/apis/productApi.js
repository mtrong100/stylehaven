import axios from "../configs/axios";

export const getProductsApi = async (params) => {
  const response = await axios.get("/products", { params });
  return response;
};

export const getProductDetailsApi = async (id) => {
  const response = await axios.get(`/products/${id}`);
  return response;
};

export const createProductApi = async (data) => {
  const response = await axios.post("/products/create", data);
  return response;
};

export const updateProductApi = async (id, data) => {
  const response = await axios.put(`/products/update/${id}`, data);
  return response;
};

export const deleteProductApi = async (id) => {
  const response = await axios.delete(`/products/delete/${id}`);
  return response;
};
