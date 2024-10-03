import { useState } from "react";
import toast from "react-hot-toast";
import { getPostDetailsApi } from "../apis/postApi";

export default function useGetPostDetails() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPostDetails = async (postId) => {
    try {
      setLoading(true);
      const response = await getPostDetailsApi(postId);
      if (response) setPost(response.results);
    } catch (error) {
      console.log("Error fetching post details", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { post, fetchPostDetails, loading };
}
