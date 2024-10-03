import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import toast from "react-hot-toast";
import useDebounce from "../../hooks/useDebounce";
import {
  createdAtBodyTemplate,
  statusBodyTemplate,
} from "../../utils/templates";
import Swal from "sweetalert2";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { deletePostApi, getPostsApi } from "../../apis/postApi";
import { postCategories } from "../../utils/constant";

const Post = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);
  const [filter, setFilter] = useState({
    category: "",
    status: "",
  });

  const fetchPosts = async () => {
    try {
      const response = await getPostsApi({
        category: filter.category,
        status: filter.status,
      });
      if (response) setPosts(response.results);
    } catch (error) {
      console.log("Error fetching posts", error.message);
      toast.error(error.message);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const lowerCaseQuery = debounceQuery.toLowerCase();

    return (
      post._id.toLowerCase().includes(lowerCaseQuery) ||
      post.title.toLowerCase().includes(lowerCaseQuery) ||
      post.category.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const onDelete = async (itemId) => {
    Swal.fire({
      title: "Bạn có chắc chắn?",
      text: `Bạn có muốn xoá dữ liệu này?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có, xoá nó!",
      cancelButtonText: "Không, giữ lại",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deletePostApi(itemId);
          if (res) Swal.fire("Đã xoá!", "Dữ liệu đã được xóa.", "success");
        } catch (error) {
          console.log("Đã xảy ra sự cố khi xoá: ", error);
          Swal.fire("Lỗi!", `${error.message}`, "error");
        } finally {
          fetchPosts();
        }
      }
    });
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2">
        <Button
          icon="pi pi-pencil"
          outlined
          onClick={() => navigate(`/admin/post/update/${rowData._id}`)}
        />
        <Button
          icon="pi pi-trash"
          outlined
          severity="danger"
          onClick={() => onDelete(rowData._id)}
        />
      </div>
    );
  };

  const tableHeader = () => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Dropdown
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.value })}
            options={postCategories}
            placeholder="Chọn danh mục"
            scrollHeight="400px"
          />
          <Dropdown
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.value })}
            options={["Active", "Inactive"]}
            placeholder="Chọn trạng thái"
            scrollHeight="400px"
          />
        </div>
        <div className="p-inputgroup max-w-md flex ml-auto">
          <InputText
            placeholder="Tìm kiếm..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button icon="pi pi-search" />
        </div>
      </div>
    );
  };

  const imageTemplate = (rowData) => {
    return (
      <img
        src={rowData.image}
        alt={rowData.image}
        className="w-24 h-24 object-cover"
      />
    );
  };

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading>Quản lí bài viết</Heading>
        <Button
          icon="pi pi-plus"
          label="Tạo mới"
          onClick={() => navigate("/admin/post/create")}
        />
      </div>

      <DataTable
        value={filteredPosts}
        paginator
        rows={5}
        paginatorLeft
        rowsPerPageOptions={[5, 10, 25, 50]}
        scrollable
        stripedRows
        showGridlines
        emptyMessage="Không tìm thấy dữ liệu"
        className="bg-white border rounded-md mt-5"
        header={tableHeader}
      >
        <Column field="_id" header="Mã" sortable />
        <Column field="image" header="Hình ảnh" body={imageTemplate} />
        <Column field="title" header="tiêu đề" sortable />
        <Column field="category" header="Danh mục" sortable />
        <Column
          field="status"
          header="Trạng thái"
          sortable
          body={statusBodyTemplate}
        />
        <Column
          field="createdAt"
          header="Ngày tạo"
          sortable
          body={createdAtBodyTemplate}
        />
        <Column
          body={actionBodyTemplate}
          exportable={false}
          header="Thao tác"
        />
      </DataTable>
    </div>
  );
};

export default Post;
