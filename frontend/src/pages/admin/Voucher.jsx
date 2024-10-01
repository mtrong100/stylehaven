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
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import {
  createVoucherApi,
  deleteVoucherApi,
  getVouchersApi,
  updateVoucherApi,
} from "../../apis/voucherApi";
import { formatCurrencyVND, formatDate } from "../../utils/helper";

const Voucher = () => {
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);
  const [details, setDetails] = useState(null);
  const [form, setForm] = useState({
    code: "",
    discountValue: 10000,
    pointsRequired: 50,
    expirationDate: null,
    status: "Active",
  });

  const fetchVouchers = async () => {
    try {
      const response = await getVouchersApi();
      if (response) setVouchers(response.results);
    } catch (error) {
      console.log("Error fetching vouchers", error.message);
      toast.error(error.message);
    }
  };

  const filteredVoucher = vouchers.filter((voucher) => {
    const lowerCaseQuery = debounceQuery.toLowerCase();

    return (
      voucher.code.toLowerCase().includes(lowerCaseQuery) ||
      voucher.status.toLowerCase().includes(lowerCaseQuery) ||
      voucher.discountValue.toString().includes(lowerCaseQuery) ||
      voucher.pointsRequired.toString().includes(lowerCaseQuery) ||
      voucher.expirationDate.toString().includes(lowerCaseQuery)
    );
  });

  const onCreate = async () => {
    try {
      const { code, discountValue, pointsRequired, expirationDate, status } =
        form;

      if (
        !code ||
        !discountValue ||
        !pointsRequired ||
        !expirationDate ||
        !status
      ) {
        toast.error("Vui lòng nhập đầy đủ các trường!");
        return;
      }

      const response = await createVoucherApi({ ...form });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Error create new voucher", error.message);
      toast.error(error.message);
    } finally {
      setForm({
        code: "",
        discountValue: 10000,
        pointsRequired: 50,
        expirationDate: null,
        status: "Active",
      });
      setVisible(false);
      fetchVouchers();
    }
  };

  const onUpdate = async () => {
    try {
      const { code, discountValue, pointsRequired, expirationDate, status } =
        form;

      if (
        !code ||
        !discountValue ||
        !pointsRequired ||
        !expirationDate ||
        !status
      ) {
        toast.error("Vui lòng nhập đầy đủ các trường!");
        return;
      }

      console.log(form);

      const response = await updateVoucherApi(details._id, { ...form });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Error update voucher", error.message);
      toast.error(error.message);
    } finally {
      setForm({
        code: "",
        discountValue: 10000,
        pointsRequired: 50,
        expirationDate: null,
        status: "Active",
      });
      setVisible2(false);
      fetchVouchers();
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
          const res = await deleteVoucherApi(itemId);
          if (res) Swal.fire("Đã xoá!", "Dữ liệu đã được xóa.", "success");
        } catch (error) {
          console.log("Đã xảy ra sự cố khi xoá: ", error);
          Swal.fire("Lỗi!", `${error.message}`, "error");
        } finally {
          fetchVouchers();
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

  const expirationDateTenplate = (rowData) => {
    return <div>{formatDate(rowData.expirationDate)}</div>;
  };

  const discountValueTemplate = (rowData) => {
    return <div>{formatCurrencyVND(rowData.discountValue)}</div>;
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  useEffect(() => {
    if (details) {
      setForm({
        code: details.code,
        discountValue: details.discountValue,
        pointsRequired: details.pointsRequired,
        expirationDate: new Date(details.expirationDate),
        status: details.status,
      });
    }
  }, [details]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading>Quản lí voucher</Heading>
        <Button
          icon="pi pi-plus"
          label="Tạo mới"
          onClick={() => setVisible(true)}
        />
      </div>

      <DataTable
        value={filteredVoucher}
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
        <Column field="code" header="Code" sortable />
        <Column
          field="discountValue"
          header="Già trị"
          sortable
          body={discountValueTemplate}
        />
        <Column field="pointsRequired" header="Số điểm quy đổi" sortable />
        <Column
          field="expirationDate"
          header="Ngày hết hạn"
          sortable
          body={expirationDateTenplate}
        />
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
        header="Tạo mới voucher"
        visible={visible}
        style={{ width: "35vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="code">Code</label>
            <InputText
              id="code"
              placeholder="Nhập Code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="discountValue">Giá trị</label>
            <InputNumber
              id="discountValue"
              placeholder="Nhập giá trị"
              value={form.discountValue}
              onValueChange={(e) =>
                setForm({ ...form, discountValue: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="pointsRequired">Số điểm</label>
            <InputNumber
              id="pointsRequired"
              placeholder="Nhập số điểm"
              value={form.pointsRequired}
              onValueChange={(e) =>
                setForm({ ...form, pointsRequired: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="expirationDate">Ngày hết hạn</label>
            <Calendar
              id="expirationDate"
              placeholder="Nhập ngày hết hạn"
              value={form.expirationDate}
              onChange={(e) => setForm({ ...form, expirationDate: e.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Trạng thái</label>
            <Dropdown
              options={["Active", "Inactive"]}
              placeholder="Chọn trạng thái"
              scrollHeight="400px"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.value })}
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
        header="CẬp nhật voucher"
        visible={visible2}
        style={{ width: "35vw" }}
        onHide={() => {
          if (!visible2) return;
          setVisible2(false);
        }}
      >
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="code">Code</label>
            <InputText
              id="code"
              placeholder="Nhập Code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="discountValue">Giá trị</label>
            <InputNumber
              id="discountValue"
              placeholder="Nhập giá trị"
              value={form.discountValue}
              onValueChange={(e) =>
                setForm({ ...form, discountValue: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="pointsRequired">Số điểm</label>
            <InputNumber
              id="pointsRequired"
              placeholder="Nhập số điểm"
              value={form.pointsRequired}
              onValueChange={(e) =>
                setForm({ ...form, pointsRequired: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="expirationDate">Ngày hết hạn</label>
            <Calendar
              id="expirationDate"
              placeholder="Nhập ngày hết hạn"
              value={form.expirationDate}
              onChange={(e) => setForm({ ...form, expirationDate: e.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Trạng thái</label>
            <Dropdown
              options={["Active", "Inactive"]}
              placeholder="Chọn trạng thái"
              scrollHeight="400px"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.value })}
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

export default Voucher;
