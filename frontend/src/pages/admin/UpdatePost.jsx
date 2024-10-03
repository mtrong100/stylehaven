import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import toast from "react-hot-toast";
import { Dropdown } from "primereact/dropdown";
import { useNavigate, useParams } from "react-router-dom";
import { postCategories } from "../../utils/constant";
import { Editor } from "primereact/editor";
import { updatePostApi } from "../../apis/postApi";
import useGetPostDetails from "../../hooks/useGetProductDetails";
import { ProgressSpinner } from "primereact/progressspinner";

const UpdatePost = () => {
  const navigate = useNavigate();
  const { id: postId } = useParams();
  const [loading, setLoading] = useState(false);
  const { post, fetchPostDetails, loading: pending } = useGetPostDetails();
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    image: "",
  });

  const onUpdate = async () => {
    const { title, content, category, image } = form;

    if (!title || !content || !category || !image) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await updatePostApi(postId, {
        ...form,
      });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Error update post", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails(postId);
  }, []);

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title,
        content: post.content,
        category: post.category,
        image: post.image,
      });
    }
  }, [post]);

  if (pending) {
    return <ProgressSpinner />;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading>cập nhật bài viết</Heading>
        <div className="flex items-center gap-3">
          <Button
            label="Quay về"
            icon="pi pi-arrow-left"
            severity="secondary"
            onClick={() => navigate("/admin/post")}
          />
          <Button
            label="cập nhật bài viết"
            icon="pi pi-save"
            loading={loading}
            disabled={loading}
            onClick={onUpdate}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <section className="space-y-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="title">tiêu đề</label>
            <InputText
              id="title"
              placeholder="Nhập tiêu đề"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="image">link hình ảnh</label>
            <InputText
              id="image"
              placeholder="Nhập link hình ảnh"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>danh mục bài viết</label>
            <Dropdown
              options={postCategories}
              placeholder="Chọn danh mục bài viết"
              scrollHeight="400px"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.value })}
            />
          </div>
        </section>

        <div className="space-y-3">
          <label>Nội dung bài viết</label>
          <Editor
            value={form.content}
            onTextChange={(e) =>
              setForm((prev) => ({ ...prev, content: e.htmlValue }))
            }
            style={{ height: "800px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdatePost;
