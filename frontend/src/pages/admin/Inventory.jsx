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
import { getStockApi } from "../../apis/inventoryApi";
import { Image } from "primereact/image";
import { Dropdown } from "primereact/dropdown";
import { createStockEntryApi } from "../../apis/stockEntryApi";
import { useNavigate } from "react-router-dom";
import useGetSuppliers from "../../hooks/useGetSuppliers";

const Inventory = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(null);
  const { suppliers, fetchSupppliers } = useGetSuppliers();
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

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
      const response = await getStockApi({ status: filter });
      if (response) setInventory(response.results);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const selectedProductData = [
    { field: "Mã", data: details?.productId?._id },
    { field: "Hình ảnh", data: details?.productId?.thumbnail },
    { field: "Tên", data: details?.productId?.name },
    { field: "Giá", data: details?.productId?.price },
    { field: "Danh mục", data: details?.productId?.categoryId?.name },
    { field: "Danh mục con", data: details?.productId?.subCategoryId?.name },
    { field: "Thương hiệu", data: details?.productId?.brandId?.name },
    {
      field: "Size",
      data: Array.isArray(details?.productId?.sizes)
        ? details?.productId.sizes.join(", ")
        : details?.productId?.sizes,
    },
    {
      field: "Màu sắc",
      data: Array.isArray(details?.productId?.colors)
        ? details?.productId.colors.join(", ")
        : details?.productId?.colors,
    },
  ];

  const productThumnailBodyTemplate = (rowData) => {
    return <Image src={rowData.productId.thumbnail} alt="Image" width="80" />;
  };

  const onImportProduct = async () => {
    if (!selectedSupplierId) {
      toast.error("Vui lý chọn nha cung cấp");
      return;
    }

    setLoading(true);
    try {
      const body = {
        supplierId: selectedSupplierId,
        products: [
          {
            productId: details.productId._id,
            quantity: Number(quantity),
            price: details.productId.price,
            total: details.productId.price * quantity,
          },
        ],
        totalCost: details.productId.price * quantity,
      };

      const response = await createStockEntryApi(body);
      if (response) toast.success("Nhập hàng hoàn tất");
    } catch (error) {
      console.log("Error importing product:", error);
      toast.error(error.message);
    } finally {
      setQuantity(1);
      setSelectedSupplierId("");
      setLoading(false);
      setVisible(false);
      fetchInventories();
    }
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
        <Button
          icon="pi pi-cart-plus"
          outlined
          onClick={() => {
            setVisible(true);
            setDetails(rowData);
          }}
        />
      </div>
    );
  };

  useEffect(() => {
    fetchInventories();
  }, [filter]);

  useEffect(() => {
    fetchSupppliers();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading>Quản lí tồn kho</Heading>
        <Button
          icon="pi pi-cart-arrow-down"
          label="Nhập thêm hàng hóa"
          onClick={() => navigate("/admin/inventory/create")}
        />
      </div>

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

      <Dialog
        header="Lập phiếu nhập thêm hàng hóa"
        visible={visible}
        style={{ width: "40vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="space-y-5">
          <div className="flex flex-col gap-2">
            <label>Nhà cung cấp</label>
            <Dropdown
              options={suppliers}
              optionValue="_id"
              optionLabel="name"
              placeholder="Chọn nhà cung cấp"
              scrollHeight="400px"
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="quantity">Số lượng</label>
            <InputText
              id="quantity"
              type="number"
              placeholder="Nhập số lượng"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {details && (
            <div>
              <label>Thông tin sản phẩm</label>
              <table className="w-full border-collapse mt-3">
                <tbody>
                  {selectedProductData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-300">
                      <th className="bg-gray-100 p-3 text-left align-top w-1/4 border-r border-gray-300">
                        {item.field}
                      </th>
                      <td className="p-3">
                        {item.field === "Hình ảnh" ? (
                          <img
                            src={item.data}
                            alt={item.data}
                            className="w-20 h-20 object-cover"
                          />
                        ) : (
                          <span>{item.data}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              label="Hủy"
              severity="danger"
              icon="pi pi-times"
              onClick={() => setVisible(false)}
            />
            <Button
              icon="pi pi-cart-arrow-down"
              label="Nhập hàng"
              loading={loading}
              disabled={loading}
              onClick={onImportProduct}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Inventory;
