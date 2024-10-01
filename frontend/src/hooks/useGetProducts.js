import { useState } from "react";
import { getProductsApi } from "../apis/productApi";
import toast from "react-hot-toast";

export default function useGetProducts() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await getProductsApi();
      if (response) setProducts(response.results);
    } catch (error) {
      console.log("Error fetching products", error.message);
      toast.error(error.message);
    }
  };

  return { products, fetchProducts };
}
