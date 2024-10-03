import { useState } from "react";
import { getCategoriesApi } from "../apis/categoryApi";
import toast from "react-hot-toast";

export default function useGetActiveCategories() {
  const [activeCategories, setActiveCategories] = useState([]);

  const fetchActiveCategories = async () => {
    try {
      const response = await getCategoriesApi({ status: "Active" });
      if (response) setActiveCategories(response.results);
    } catch (error) {
      console.error("Error fetching active categories:", error);
      toast.error(error.message);
    }
  };

  return { fetchActiveCategories, activeCategories };
}
