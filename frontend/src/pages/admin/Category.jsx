import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import toast from "react-hot-toast";
import {
  createCategoryApi,
  deleteCategoryApi,
  getCategoriesApi,
  updateCategoryApi,
} from "../../apis/categoryApi";
import useDebounce from "../../hooks/useDebounce";
import {
  createdAtBodyTemplate,
  statusBodyTemplate,
} from "../../utils/templates";
import Swal from "sweetalert2";
import { Dropdown } from "primereact/dropdown";

const Category = () => {
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);
  const [details, setDetails] = useState(null);
  const [updatedValue, setUpdatedValue] = useState("");
  const [status, setStatus] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await getCategoriesApi();
      if (response) setCategories(response.results);
    } catch (error) {
      console.log("Error fetching categories", error.message);
      toast.error(error.message);
    }
  };

  const filterCategories = categories.filter((category) => {
    const lowerCaseQuery = debounceQuery.toLowerCase();

    return (
      category.name.toLowerCase().includes(lowerCaseQuery) ||
      category._id.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const onCreate = async () => {
    try {
      if (!newValue.trim()) return;
      const response = await createCategoryApi({ name: newValue });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Error create new category", error.message);
      toast.error(error.message);
    } finally {
      setVisible(false);
      setNewValue("");
      fetchCategories();
    }
  };

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
          const res = await deleteCategoryApi(itemId);
          if (res) Swal.fire("Đã xoá!", "Dữ liệu đã được xóa.", "success");
        } catch (error) {
          console.log("Đã xảy ra sự cố khi xoá: ", error);
          Swal.fire("Lỗi!", `${error.message}`, "error");
        } finally {
          fetchCategories();
        }
      }
    });
  };

  const onUpdate = async () => {
    try {
      if (!updatedValue.trim()) return;
      const response = await updateCategoryApi(details._id, {
        name: updatedValue,
        status,
      });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Error updating category", error.message);
      toast.error(error.message);
    } finally {
      setUpdatedValue("");
      setDetails(null);
      setVisible2(false);
      fetchCategories();
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2">
        <Button
          icon="pi pi-pencil"
          outlined
          onClick={() => {
            setVisible2(true);
            setDetails(rowData);
          }}
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

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (details) {
      setUpdatedValue(details.name);
      setStatus(details.status);
    }
  }, [details]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading>Quản lí danh mục</Heading>
        <Button
          icon="pi pi-plus"
          label="Tạo mới"
          onClick={() => setVisible(true)}
        />
      </div>

      <DataTable
        value={filterCategories}
        paginator
        rows={5}
        paginatorLeft
        rowsPerPageOptions={[5, 10, 25, 50]}
        scrollable
        stripedRows
        showGridlines
        emptyMessage="Không tìm thấy dữ liệu"
        className="bg-white border rounded-md mt-5"
        header={
          <div className="p-inputgroup max-w-md flex ml-auto">
            <InputText
              placeholder="Tìm kiếm..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button icon="pi pi-search" />
          </div>
        }
      >
        <Column field="_id" header="Mã" sortable />
        <Column field="name" header="Danh mục" sortable />
        <Column field="productCount" header="Sản phẩm" sortable />
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

      <Dialog
        header="Tạo mới danh mục"
        visible={visible}
        style={{ width: "30vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="category">Tên</label>
            <InputText
              id="category"
              placeholder="Nhập tên"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              label="Hủy"
              severity="danger"
              icon="pi pi-times"
              onClick={() => setVisible(false)}
            />
            <Button label="Lưu" icon="pi pi-save" onClick={onCreate} />
          </div>
        </div>
      </Dialog>

      <Dialog
        header="Cập nhật danh mục"
        visible={visible2}
        style={{ width: "30vw" }}
        onHide={() => {
          if (!visible2) return;
          setVisible2(false);
        }}
      >
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="category">Tên</label>
            <InputText
              id="category"
              placeholder="Nhập tên"
              value={updatedValue}
              onChange={(e) => setUpdatedValue(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Trạng thái</label>
            <Dropdown
              options={["Active", "Inactive"]}
              placeholder="Chọn trạng thái"
              scrollHeight="400px"
              value={status}
              onChange={(e) => setStatus(e.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              label="Hủy"
              severity="danger"
              icon="pi pi-times"
              onClick={() => setVisible2(false)}
            />
            <Button label="Lưu" icon="pi pi-save" onClick={onUpdate} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Category;
