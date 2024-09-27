import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import useDebounce from "../../hooks/useDebounce";
import toast from "react-hot-toast";
import { createdAtBodyTemplate } from "../../utils/templates";
import Swal from "sweetalert2";
import {
  createSupplierApi,
  deleteSupplierApi,
  getSuppliersApi,
  updateSupplierApi,
} from "../../apis/supplierApi";

const Supplier = () => {
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);
  const [details, setDetails] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const fetchSupppliers = async () => {
    try {
      const response = await getSuppliersApi();
      if (response) setSuppliers(response.results);
    } catch (error) {
      console.log("Error fetching suppliers", error.message);
      toast.error(error.message);
    }
  };

  const filterdSuppliers = suppliers.filter((supplier) => {
    const lowerCaseQuery = debounceQuery.toLowerCase();

    return (
      supplier._id.toLowerCase().includes(lowerCaseQuery) ||
      supplier.name.toLowerCase().includes(lowerCaseQuery) ||
      supplier.email.toLowerCase().includes(lowerCaseQuery) ||
      supplier.phone.toLowerCase().includes(lowerCaseQuery) ||
      supplier.address.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const onCreate = async () => {
    try {
      const { name, email, phone, address } = form;
      if (!name || !email || !phone || !address) return;
      const response = await createSupplierApi({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Error create new supplier", error.message);
      toast.error(error.message);
    } finally {
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
      setVisible(false);
      fetchSupppliers();
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
          const res = await deleteSupplierApi(itemId);
          if (res) Swal.fire("Đã xoá!", "Dữ liệu đã được xóa.", "success");
        } catch (error) {
          console.log("Đã xảy ra sự cố khi xoá: ", error);
          Swal.fire("Lỗi!", `${error.message}`, "error");
        } finally {
          fetchSupppliers();
        }
      }
    });
  };

  const onUpdate = async () => {
    try {
      const { name, email, phone, address } = form;
      if (!name || !email || !phone || !address) return;
      const response = await updateSupplierApi(details._id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Error update supplier", error.message);
      toast.error(error.message);
    } finally {
      setVisible2(false);
      fetchSupppliers();
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
    fetchSupppliers();
  }, []);

  useEffect(() => {
    if (details) {
      setForm({
        name: details.name,
        email: details.email,
        phone: details.phone,
        address: details.address,
      });
    }
  }, [details]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading>Quản lí nhà cung cấp</Heading>
        <Button
          icon="pi pi-plus"
          label="Tạo mới"
          onClick={() => setVisible(true)}
        />
      </div>

      <DataTable
        value={filterdSuppliers}
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
        <Column field="name" header="Thương hiệu" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="phone" header="SDT" sortable />
        <Column field="address" header="Địa chỉ" sortable />
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
        header="Tạo mới nhà cung cấp"
        visible={visible}
        style={{ width: "30vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="category">Nhà cung cấp</label>
            <InputText
              id="category"
              placeholder="Nhập tên nhà cung cấp"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              placeholder="Nhập Email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone">SDT</label>
            <InputText
              id="phone"
              type="number"
              placeholder="Nhập SDT"
              value={form.phone}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="address">địa chỉ</label>
            <InputText
              id="address"
              placeholder="Nhập địa chỉ"
              value={form.address}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, address: e.target.value }))
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
        header="Cập nhật nhà cung cấp"
        visible={visible2}
        style={{ width: "30vw" }}
        onHide={() => {
          if (!visible2) return;
          setVisible2(false);
        }}
      >
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="category">Nhà cung cấp</label>
            <InputText
              id="category"
              placeholder="Nhập tên nhà cung cấp"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              placeholder="Nhập Email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone">SDT</label>
            <InputText
              id="phone"
              type="number"
              placeholder="Nhập SDT"
              value={form.phone}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="address">địa chỉ</label>
            <InputText
              id="address"
              placeholder="Nhập địa chỉ"
              value={form.address}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, address: e.target.value }))
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

export default Supplier;
