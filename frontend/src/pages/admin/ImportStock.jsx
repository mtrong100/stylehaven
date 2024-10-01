import React, { useEffect, useMemo, useState } from "react";
import Heading from "../../components/Heading";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import toast from "react-hot-toast";
import { productThumnailBodyTemplate } from "../../utils/templates";
import { Dropdown } from "primereact/dropdown";
import { createStockEntryApi } from "../../apis/stockEntryApi";
import { useNavigate } from "react-router-dom";
import useGetSuppliers from "../../hooks/useGetSuppliers";
import useGetProducts from "../../hooks/useGetProducts";
import { MultiSelect } from "primereact/multiselect";
import { Divider } from "primereact/divider";
import { formatCurrencyVND } from "../../utils/helper";

const ImportStock = () => {
  const navigate = useNavigate();
  const { suppliers, fetchSupppliers } = useGetSuppliers();
  const { products, fetchProducts } = useGetProducts();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [processedProducts, setProcessedProducts] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [loading, setLoading] = useState(false);

  const totalCost = useMemo(() => {
    return processedProducts.reduce((acc, item) => {
      return acc + item.quantity * item.price;
    }, 0);
  }, [processedProducts]);

  const onCreate = async () => {
    if (!selectedSupplierId) {
      toast.error("Vui lòng chọn nhà cung cấp");
      return;
    }

    if (processedProducts.length === 0) {
      toast.error("Vui lòng chọn sản phẩm");
      return;
    }

    setLoading(true);

    try {
      const products = processedProducts.map((item) => {
        return {
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
        };
      });

      const body = {
        supplierId: selectedSupplierId,
        products,
        totalCost,
      };

      const response = await createStockEntryApi(body);
      if (response) toast.success("Nhập hàng hoàn tất");
    } catch (error) {
      console.log("Error create new stock import", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setProcessedProducts([]);
      setSelectedSupplierId("");
      setSelectedProducts([]);
    }
  };

  const onIncreaseQuantity = (id) => {
    const index = processedProducts.findIndex((item) => item._id === id);
    const newProducts = [...processedProducts];

    if (index !== -1) {
      newProducts[index].quantity += 1;
      setProcessedProducts(newProducts);
    }
  };

  const onDecreaseQuantity = (id) => {
    const index = processedProducts.findIndex((item) => item._id === id);
    const newProducts = [...processedProducts];

    if (index !== -1) {
      if (newProducts[index].quantity > 1) {
        newProducts[index].quantity -= 1;
        setProcessedProducts(newProducts);
      }
    }
  };

  const productTemplate = (option) => {
    return (
      <div className="flex items-center gap-5">
        <img alt={option.name} src={option.thumbnail} className="w-10 h-10" />
        <div className="w-[450px] truncate">{option.name}</div>
      </div>
    );
  };

  const quantityBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-5 ">
        <Button
          onClick={() => onDecreaseQuantity(rowData._id)}
          icon="pi pi-minus"
          rounded
          outlined
        />
        <div className="font-semibold text-lg">{rowData.quantity}</div>
        <Button
          onClick={() => onIncreaseQuantity(rowData._id)}
          icon="pi pi-plus"
          rounded
          outlined
        />
      </div>
    );
  };

  const priceTemplate = (rowData) => {
    return (
      <div>{formatCurrencyVND(Number(rowData.price * rowData.quantity))}</div>
    );
  };

  useEffect(() => {
    setProcessedProducts(
      selectedProducts.map((item) => ({
        _id: item._id,
        quantity: 1,
        price: item.price,
        name: item.name,
        thumbnail: item.thumbnail,
      }))
    );
  }, [selectedProducts]);

  useEffect(() => {
    fetchSupppliers();
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading>Nhập hàng hóa</Heading>
        <div className="flex items-center gap-3">
          <Button
            label="Quay về"
            icon="pi pi-arrow-left"
            severity="secondary"
            onClick={() => navigate("/admin/stock-entry")}
          />
          <Button
            icon="pi pi-save"
            label="Nhập hàng"
            onClick={onCreate}
            loading={loading}
            disabled={loading}
          />
        </div>
      </div>

      <div className="mt-10 space-y-8">
        <div className="space-y-5 w-full max-w-3xl mx-auto">
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
            <label className="capitalize">Sản phẩm</label>
            <MultiSelect
              value={selectedProducts}
              filter
              onChange={(e) => setSelectedProducts(e.value)}
              options={products}
              optionLabel="name"
              placeholder="Chọn sản phẩm"
              itemTemplate={productTemplate}
              maxSelectedLabels={10}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">
            Danh sách mặt hàng cần nhập
          </h1>
          <DataTable value={processedProducts}>
            <Column field="_id" header="Mã"></Column>
            <Column
              field="thumbnail"
              header="Hình ảnh"
              body={productThumnailBodyTemplate}
            ></Column>
            <Column
              field="name"
              header="Tên"
              style={{ maxWidth: "20rem" }}
            ></Column>
            <Column
              field="quantity"
              header="Số lượng"
              body={quantityBodyTemplate}
            />
            <Column
              field="price"
              header="Đơn giá"
              body={priceTemplate}
            ></Column>
          </DataTable>
          <Divider />
          <div className="text-2xl font-semibold">
            Tổng tiền: {formatCurrencyVND(totalCost)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportStock;
