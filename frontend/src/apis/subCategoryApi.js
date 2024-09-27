import axios from "../configs/axios";

export const getSubCategoriesApi = async (params) => {
  const response = await axios.get("/sub-categories", { params });
  return response;
};

export const getActiveSubCategoriesApi = async () => {
  const response = await axios.get("/sub-categories/active");
  return response;
};

export const createSubCategoryApi = async (data) => {
  const response = await axios.post("/sub-categories/create", data);
  return response;
};

export const updateSubCategoryApi = async (id, data) => {
  const response = await axios.put(`/sub-categories/update/${id}`, data);
  return response;
};

export const deleteSubCategoryApi = async (id) => {
  const response = await axios.delete(`/sub-categories/delete/${id}`);
  return response;
};
