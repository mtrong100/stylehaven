import { useState } from "react";
import { getProductDetailsApi } from "../apis/productApi";
import toast from "react-hot-toast";

export default function useGetProductDetails() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProductDetails = async (productId) => {
    try {
      setLoading(true);
      const response = await getProductDetailsApi(productId);
      if (response) setProduct(response.results);
    } catch (error) {
      console.log("Error fetching product details", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { product, fetchProductDetails, loading };
}
