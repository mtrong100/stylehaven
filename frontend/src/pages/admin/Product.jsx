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
  productThumnailBodyTemplate,
} from "../../utils/templates";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { deleteProductApi, getProductsApi } from "../../apis/productApi";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await getProductsApi();
      if (response) setProducts(response.results);
    } catch (error) {
      console.log("Error fetching products", error.message);
      toast.error(error.message);
    }
  };

  const filteredProducts = products.filter((product) => {
    const lowerCaseQuery = debounceQuery.toLowerCase();

    return (
      product._id.toLowerCase().includes(lowerCaseQuery) ||
      product.name.toLowerCase().includes(lowerCaseQuery) ||
      product.price.toString().includes(lowerCaseQuery) ||
      product.salePrice.toString().includes(lowerCaseQuery)
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
          const res = await deleteProductApi(itemId);
          if (res) Swal.fire("Đã xoá!", "Dữ liệu đã được xóa.", "success");
        } catch (error) {
          console.log("Đã xảy ra sự cố khi xoá: ", error);
          Swal.fire("Lỗi!", `${error.message}`, "error");
        } finally {
          fetchProducts();
        }
      }
    });
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2">
        <Button
          icon="pi pi-eye"
          outlined
          severity="success"
          onClick={() => navigate(`/admin/product/${rowData._id}`)}
        />
        <Button
          icon="pi pi-pencil"
          outlined
          onClick={() => navigate(`/admin/product/update/${rowData._id}`)}
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
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading>Quản lí sản phẩm</Heading>
        <Button
          icon="pi pi-plus"
          label="Tạo mới"
          onClick={() => navigate("/admin/product/create")}
        />
      </div>

      <DataTable
        value={filteredProducts}
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
        {/* <Column field="_id" header="Mã" sortable /> */}
        <Column
          field="thumbnail"
          header="Hình ảnh"
          sortable
          body={productThumnailBodyTemplate}
        />
        <Column field="name" header="Tên" sortable />
        <Column field="price" header="Giá gốc" sortable />
        <Column field="salePrice" header="Giá giảm" sortable />
        <Column field="categoryId.name" header="Danh mục" sortable />
        <Column field="subCategoryId.name" header="Danh mục con" sortable />
        <Column field="brandId.name" header="Thương hiệu" sortable />
        <Column field="averageRating" header="Đánh giá trung bình" sortable />
        <Column field="totalReviews" header="Tổng đánh giá" sortable />
        <Column field="flashSale" header="FlashSale" sortable />
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

export default Product;
