import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGetProductDetails from "../../hooks/useGetProductDetails";
import { ProgressSpinner } from "primereact/progressspinner";
import Heading from "../../components/Heading";
import { Image } from "primereact/image";
import parse from "html-react-parser";
import { Button } from "primereact/button";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const { product, fetchProductDetails, loading } = useGetProductDetails();

  useEffect(() => {
    if (productId) fetchProductDetails(productId);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center h-screen justify-center">
        <ProgressSpinner />
      </div>
    );
  }

  const productData = [
    { field: "Mã", data: product?._id },
    { field: "Tên", data: product?.name },
    { field: "Mô tả", data: product?.description },
    { field: "Giá gốc", data: product?.price },
    { field: "Giá giảm", data: product?.salePrice },
    {
      field: "Size",
      data: Array.isArray(product?.sizes)
        ? product.sizes.join(", ")
        : product?.sizes,
    },
    {
      field: "Màu sắc",
      data: Array.isArray(product?.colors)
        ? product.colors.join(", ")
        : product?.colors,
    },
    { field: "Danh mục", data: product?.categoryId?.name },
    { field: "Danh mục con", data: product?.subCategoryId?.name },
    { field: "Thương hiệu", data: product?.brandId?.name },
    { field: "Đánh giá trung bình", data: product?.avgRating },
    { field: "Tổng đánh giá", data: product?.totalRating },
    { field: "Flashsale", data: product?.isFlashSale ? "Yes" : "No" },
    { field: "Ngày tạo", data: product?.createdAt },
  ];
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading>Chi tiết sản phẩm</Heading>
        <Button
          label="Quay về"
          icon="pi pi-arrow-left"
          severity="secondary"
          onClick={() => navigate("/admin/product")}
        />
      </div>

      <div className="mt-5 space-y-5">
        <div className="flex flex-col gap-3">
          <label className="font-semibold">Ảnh thumbnail</label>
          <Image src={product?.thumbnail} alt="Image" width="250" />
        </div>

        <div className="flex flex-col gap-3">
          <label className="font-semibold">Ảnh chi tiết</label>
          <div className="flex flex-wrap gap-4">
            {product?.images?.map((item, index) => (
              <Image key={index} src={item} alt="Image" width="250" />
            ))}
          </div>
        </div>
      </div>

      <table className="w-full border-collapse my-5">
        <tbody>
          {productData.map((item, index) => (
            <tr key={index} className="border-b border-gray-300">
              <th className="bg-gray-100 p-3 text-left align-top w-1/4 border-r border-gray-300">
                {item.field}
              </th>
              <td className="p-3">{item.data || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col gap-3">
        <label className="font-bold text-3xl text-slate-900">
          Chi tiết về sản phẩm này
        </label>
        <div>{parse(product?.about || "")}</div>
      </div>
    </div>
  );
};

export default ProductDetail;
