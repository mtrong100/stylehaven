import axios from "../configs/axios";

export const getBrandsApi = async () => {
  const response = await axios.get("/brands");
  return response;
};

export const createBrandApi = async (data) => {
  const response = await axios.post("/brands/create", data);
  return response;
};

export const updateBrandApi = async (id, data) => {
  const response = await axios.put(`/brands/update/${id}`, data);
  return response;
};

export const deleteBrandApi = async (id) => {
  const response = await axios.delete(`/brands/delete/${id}`);
  return response;
};
