import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import useDebounce from "../../hooks/useDebounce";
import toast from "react-hot-toast";
import {
  brandImageBodyTemplate,
  createdAtBodyTemplate,
  statusBodyTemplate,
} from "../../utils/templates";
import Swal from "sweetalert2";
import { Dropdown } from "primereact/dropdown";
import {
  createBrandApi,
  deleteBrandApi,
  getBrandsApi,
  updateBrandApi,
} from "../../apis/brandApi";

const Brand = () => {
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [brands, setBrands] = useState([]);
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);
  const [details, setDetails] = useState(null);
  const [form, setForm] = useState({
    name: "",
    country: "",
    image: "",
    status: "",
  });

  const fetchBrands = async () => {
    try {
      const response = await getBrandsApi();
      if (response) setBrands(response.results);
    } catch (error) {
      console.log("Error fetching brands", error.message);
      toast.error(error.message);
    }
  };

  const filterdBrands = brands.filter((brand) => {
    const lowerCaseQuery = debounceQuery.toLowerCase();

    return (
      brand._id.toLowerCase().includes(lowerCaseQuery) ||
      brand.name.toLowerCase().includes(lowerCaseQuery) ||
      brand.country.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const onCreate = async () => {
    try {
      const { name, country, image } = form;
      if (!name || !country || !image) return;
      const response = await createBrandApi({
        name: name.trim(),
        country: country.trim(),
        image: image.trim(),
      });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Error create new brand", error.message);
      toast.error(error.message);
    } finally {
      setForm({
        name: "",
        country: "",
        image: "",
        status: "",
      });
      setVisible(false);
      fetchBrands();
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
          const res = await deleteBrandApi(itemId);
          if (res) Swal.fire("Đã xoá!", "Dữ liệu đã được xóa.", "success");
        } catch (error) {
          console.log("Đã xảy ra sự cố khi xoá: ", error);
          Swal.fire("Lỗi!", `${error.message}`, "error");
        } finally {
          fetchBrands();
        }
      }
    });
  };

  const onUpdate = async () => {
    try {
      const { name, country, image, status } = form;
      if (!name || !country || !image || !status) return;
      const response = await updateBrandApi(details._id, {
        name: name.trim(),
        country: country.trim(),
        image: image.trim(),
        status: status.trim(),
      });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Error updating category", error.message);
      toast.error(error.message);
    } finally {
      setVisible2(false);
      fetchBrands();
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
    fetchBrands();
  }, []);

  useEffect(() => {
    if (details) {
      setForm({
        name: details.name,
        country: details.country,
        image: details.image,
        status: details.status,
      });
    }
  }, [details]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading>Quản lí thương hiệu</Heading>
        <Button
          icon="pi pi-plus"
          label="Tạo mới"
          onClick={() => setVisible(true)}
        />
      </div>

      <DataTable
        value={filterdBrands}
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
        <Column
          field="image"
          header="Hình ảnh"
          sortable
          body={brandImageBodyTemplate}
        />
        <Column field="name" header="Thương hiệu" sortable />
        <Column field="country" header="Quốc gia" sortable />
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
        header="Tạo mới thương hiệu"
        visible={visible}
        style={{ width: "30vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="category">Thương hiệu</label>
            <InputText
              id="category"
              placeholder="Nhập thương hiệu"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="country">Quốc gia</label>
            <InputText
              id="country"
              placeholder="Nhập quốc gia"
              value={form.country}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, country: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="image">hình ảnh</label>
            <InputText
              id="image"
              placeholder="Nhập link hình ảnh"
              value={form.image}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, image: e.target.value }))
              }
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
        header="Cập nhật thương hiệu"
        visible={visible2}
        style={{ width: "30vw" }}
        onHide={() => {
          if (!visible2) return;
          setVisible2(false);
        }}
      >
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="category">Thương hiệu</label>
            <InputText
              id="category"
              placeholder="Nhập thương hiệu"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="country">Quốc gia</label>
            <InputText
              id="country"
              placeholder="Nhập quốc gia"
              value={form.country}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, country: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="image">hình ảnh</label>
            <InputText
              id="image"
              placeholder="Nhập link hình ảnh"
              value={form.image}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, image: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Trạng thái</label>
            <Dropdown
              options={["Active", "Inactive"]}
              placeholder="Chọn trạng thái"
              scrollHeight="400px"
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.value }))
              }
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

export default Brand;
