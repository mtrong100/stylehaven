import { useState } from "react";
import { getActiveBrandsApi } from "../apis/brandApi";
import toast from "react-hot-toast";

export default function useGetActiveBrands() {
  const [activeBrands, setActiveBrands] = useState([]);

  const fetchActiveBrands = async () => {
    try {
      const response = await getActiveBrandsApi();
      if (response) setActiveBrands(response.results);
    } catch (error) {
      console.error("Error fetching active brands:", error);
      toast.error(error.message);
    }
  };

  return { fetchActiveBrands, activeBrands };
}
