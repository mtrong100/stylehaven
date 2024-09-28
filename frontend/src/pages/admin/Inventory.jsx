import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import useDebounce from "../../hooks/useDebounce";
import toast from "react-hot-toast";
import { inventoryStatusBodyTemplate } from "../../utils/templates";
import { getInventoryApi } from "../../apis/inventoryApi";
import { Image } from "primereact/image";
import { Dropdown } from "primereact/dropdown";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);

  const filteredInventory = inventory.filter((item) => {
    const lowerCaseQuery = debounceQuery.toLowerCase();

    return (
      item.productId.name.toLowerCase().includes(lowerCaseQuery) ||
      item.quantity.toLowerCase().includes(lowerCaseQuery) ||
      item.status.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const fetchInventories = async () => {
    try {
      const response = await getInventoryApi({ status: filter });
      if (response) setInventory(response.results);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const productThumnailBodyTemplate = (rowData) => {
    return <Image src={rowData.productId.thumbnail} alt="Image" width="80" />;
  };

  const tableHeader = () => {
    return (
      <div className="flex items-center justify-between">
        <Dropdown
          value={filter}
          onChange={(e) => setFilter(e.value)}
          options={["In Stock", "Out of Stock", "Low Stock"]}
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
        <Button icon="pi pi-cart-plus" outlined onClick={() => {}} />
      </div>
    );
  };

  useEffect(() => {
    fetchInventories();
  }, [filter]);

  return (
    <div>
      <Heading>Quản lí kho hàng</Heading>

      <DataTable
        value={filteredInventory}
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
        <Column field="productId._id" header="Mã" sortable />
        <Column
          field="productId.thumbnail"
          header="Hình ảnh"
          body={productThumnailBodyTemplate}
        />
        <Column
          field="productId.name"
          header="Tên"
          sortable
          style={{
            maxWidth: "300px",
          }}
        />
        <Column field="productId.price" header="Giá tiền" sortable />
        <Column field="quantity" header="Tồn kho" sortable />
        <Column
          field="status"
          header="Trạng thái"
          sortable
          body={inventoryStatusBodyTemplate}
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

export default Inventory;
