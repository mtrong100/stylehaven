import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import useDebounce from "../../hooks/useDebounce";
import toast from "react-hot-toast";
import {
  createdAtBodyTemplate,
  entryDateBodyTemplate,
  stockEntryAmount,
  stockEntryStatusTemplate,
} from "../../utils/templates";
import { Dropdown } from "primereact/dropdown";
import {
  deleteStockEntryApi,
  getStockEntriesApi,
  updateStockEntryApi,
} from "../../apis/stockEntryApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Dialog } from "primereact/dialog";
import { formatCurrencyVND } from "../../utils/helper";

const StockEntry = () => {
  const navigate = useNavigate();
  const [stockEntry, setStockEntry] = useState([]);
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(null);
  const [status, setStatus] = useState("");

  const fetchStockEntry = async () => {
    try {
      const response = await getStockEntriesApi({ status: filter });
      if (response) setStockEntry(response.results);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const filteredStockEntry = stockEntry.filter((item) => {
    const lowerCaseQuery = debounceQuery.toLowerCase();

    return (
      item._id.toLowerCase().includes(lowerCaseQuery) ||
      item.supplierId.name.toLowerCase().includes(lowerCaseQuery) ||
      item.entryDate.toLowerCase().includes(lowerCaseQuery)
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
          const res = await deleteStockEntryApi(itemId);
          if (res) Swal.fire("Đã xoá!", "Dữ liệu đã được xóa.", "success");
        } catch (error) {
          console.log("Đã xảy ra sự cố khi xoá: ", error);
          Swal.fire("Lỗi!", `${error.message}`, "error");
        } finally {
          fetchStockEntry();
        }
      }
    });
  };

  const onUpdate = async () => {
    try {
      const response = await updateStockEntryApi(details._id, { status });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Error updating stock entry", error.message);
      toast.error(error.message);
    } finally {
      setVisible(false);
      fetchStockEntry();
    }
  };

  const tableHeader = () => {
    return (
      <div className="flex items-center justify-between">
        <Dropdown
          value={filter}
          onChange={(e) => setFilter(e.value)}
          options={["Pending", "Completed", "Cancelled"]}
          placeholder="Chọn trạng thái"
          scrollHeight="400px"
        />
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

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2">
        <Button
          icon="pi pi-eye"
          outlined
          severity="success"
          onClick={() => navigate(`/admin/stock-entry/${rowData._id}`)}
        />
        <Button
          icon="pi pi-pencil"
          outlined
          onClick={() => {
            setVisible(true);
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

  const totalCostTemplate = (rowData) => {
    return <div>{formatCurrencyVND(rowData.totalCost)}</div>;
  };

  useEffect(() => {
    fetchStockEntry();
  }, [filter]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading>Quản lí nhập hàng hóa</Heading>
        <Button
          icon="pi pi-cart-arrow-down"
          label="Lập phiếu nhập hàng hóa"
          onClick={() => navigate("/admin/import-stock")}
        />
      </div>

      <DataTable
        value={filteredStockEntry}
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
        <Column field="supplierId.name" header="Nhà cung cấp" sortable />
        <Column header="Số lượng" sortable body={stockEntryAmount} />
        <Column
          field="totalCost"
          header="Tổng tiền"
          sortable
          body={totalCostTemplate}
        />
        <Column
          field="entryDate"
          header="Ngày nhập"
          sortable
          body={entryDateBodyTemplate}
        />
        <Column
          field="status"
          header="Trạng thái"
          sortable
          body={stockEntryStatusTemplate}
        />
        <Column
          field="createdAt"
          header="Ngày lập"
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
        header="Cập nhật trạng thái phiếu nhập hàng hóa"
        visible={visible}
        style={{ width: "30vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <label>Trạng thái</label>
            <Dropdown
              options={["Pending", "Completed", "Cancelled"]}
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
              onClick={() => setVisible(false)}
            />
            <Button label="Lưu" icon="pi pi-save" onClick={onUpdate} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default StockEntry;
