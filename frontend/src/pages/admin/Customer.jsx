import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
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
import {
  createUserApi,
  deleteUserApi,
  getUsersApi,
  updateUserApi,
} from "../../apis/userApi";

const PROFILE_PICTURE =
  "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg";

const Customer = () => {
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);
  const [details, setDetails] = useState(null);
  const [updatedValue, setUpdatedValue] = useState("");
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
  });

  const fetchUsers = async () => {
    try {
      const response = await getUsersApi();
      if (response) setCustomers(response.results);
    } catch (error) {
      console.log("Error fetching users", error.message);
    }
  };

  const filterdUsers = customers.filter((user) => {
    const lowerCaseQuery = debounceQuery.toLowerCase();

    return (
      user._id.toLowerCase().includes(lowerCaseQuery) ||
      user.name.toLowerCase().includes(lowerCaseQuery) ||
      user.email.toLowerCase().includes(lowerCaseQuery) ||
      user.phone.toLowerCase().includes(lowerCaseQuery) ||
      user.address.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const onCreate = async () => {
    try {
      const { name, email, phone, password } = form;

      if (phone && phone.length !== 10) {
        toast.error("Vui lý điền đầy đủ số điện thoại");
        return;
      }

      if (!name || !email || !phone || !password) {
        toast.error("Vui lý điền đầy đủ thông tin");
        return;
      }

      const response = await createUserApi({ ...form });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Error create new user", error.message);
      toast.error(error.message);
    } finally {
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        address: "",
      });
      setVisible(false);
      fetchUsers();
    }
  };

  const onUpdate = async () => {
    try {
      const { name, email, phone } = form;

      if (phone && phone.length !== 10) {
        toast.error("Vui lý điền đầy đủ 10 số điện thoại");
        return;
      }

      if (!name || !email || !phone) {
        toast.error("Vui lý điền đầy đủ thông tin");
        return;
      }

      const response = await updateUserApi(details._id, { ...form });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Error update user", error.message);
      toast.error(error.message);
    } finally {
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        address: "",
      });
      setVisible2(false);
      fetchUsers();
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
          const res = await deleteUserApi(itemId);
          if (res) Swal.fire("Đã xoá!", "Dữ liệu đã được xóa.", "success");
        } catch (error) {
          console.log("Đã xảy ra sự cố khi xoá: ", error);
          Swal.fire("Lỗi!", `${error.message}`, "error");
        } finally {
          fetchUsers();
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

  const avatarTemplate = (rowData) => {
    return (
      <img
        src={rowData.avatar || PROFILE_PICTURE}
        alt={rowData.name}
        className="w-[50px] h-[50px] rounded-full"
      />
    );
  };

  useEffect(() => {
    fetchUsers();
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
        <Heading>Quản lí khách hàng</Heading>
        <Button
          icon="pi pi-plus"
          label="Tạo mới"
          onClick={() => setVisible(true)}
        />
      </div>

      <DataTable
        value={filterdUsers}
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
          field="avatar"
          header="Hình ảnh"
          sortable
          body={avatarTemplate}
        />
        <Column field="name" header="Tên" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="phone" header="SDT" sortable />
        <Column
          field="address"
          header="Địa chỉ"
          sortable
          style={{ maxWidth: "300px" }}
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
        header="Tạo mới khách hàng"
        visible={visible}
        style={{ width: "30vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Tên</label>
            <InputText
              id="name"
              placeholder="Nhập tên"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              placeholder="Nhập Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone">SDT</label>
            <InputText
              id="phone"
              placeholder="Nhập SDT"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="address">địa chỉ</label>
            <InputText
              id="address"
              placeholder="Nhập địa chỉ"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Mật khẩu</label>
            <InputText
              id="password"
              placeholder="Nhập Mật khẩu"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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
        header="Cập nhật thông tin khách hàng"
        visible={visible2}
        style={{ width: "30vw" }}
        onHide={() => {
          if (!visible2) return;
          setVisible2(false);
        }}
      >
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Tên</label>
            <InputText
              id="name"
              placeholder="Nhập tên"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              placeholder="Nhập Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone">SDT</label>
            <InputText
              id="phone"
              placeholder="Nhập SDT"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="address">địa chỉ</label>
            <InputText
              id="address"
              placeholder="Nhập địa chỉ"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Mật khẩu</label>
            <InputText
              id="password"
              placeholder="Nhập Mật khẩu"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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

export default Customer;
