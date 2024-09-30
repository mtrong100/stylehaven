import toast from "react-hot-toast";
import { getSuppliersApi } from "../apis/supplierApi";
import { useState } from "react";

export default function useGetSuppliers() {
  const [suppliers, setSuppliers] = useState([]);

  const fetchSupppliers = async () => {
    try {
      const response = await getSuppliersApi();
      if (response) setSuppliers(response.results);
    } catch (error) {
      console.log("Error fetching suppliers", error.message);
      toast.error(error.message);
    }
  };

  return { suppliers, fetchSupppliers };
}
