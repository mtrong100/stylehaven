import { useState } from "react";
import { getSubCategoriesApi } from "../apis/subCategoryApi";
import toast from "react-hot-toast";

export default function useGetActiveSubCategories() {
  const [activeSubCategories, setActiveSubCategories] = useState([]);

  const fetchActiveSubCategories = async () => {
    try {
      const response = await getSubCategoriesApi({ status: "Active" });
      if (response) setActiveSubCategories(response.results);
    } catch (error) {
      console.error("Error fetching active sub categories:", error);
      toast.error(error.message);
    }
  };

  return { fetchActiveSubCategories, activeSubCategories };
}
