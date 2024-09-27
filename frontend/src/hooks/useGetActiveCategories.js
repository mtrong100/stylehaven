import { useState } from "react";
import { getActiveCategoriesApi } from "../apis/categoryApi";
import toast from "react-hot-toast";

export default function useGetActiveCategories() {
  const [activeCategories, setActiveCategories] = useState([]);

  const fetchActiveCategories = async () => {
    try {
      const response = await getActiveCategoriesApi();
      if (response) setActiveCategories(response.results);
    } catch (error) {
      console.error("Error fetching active categories:", error);
      toast.error(error.message);
    }
  };

  return { fetchActiveCategories, activeCategories };
}
