import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStockEntryDetailsApi } from "../../apis/stockEntryApi";
import toast from "react-hot-toast";
import { ProgressSpinner } from "primereact/progressspinner";
import Heading from "../../components/Heading";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const StockEntryDetails = () => {
  const navigate = useNavigate();
  const { id: stockEntryId } = useParams();
  const [details, setDetails] = useState();
  const [loading, setLoading] = useState(true);

  const fetchStockEntryDetails = async () => {
    setLoading(true);
    try {
      const response = await getStockEntryDetailsApi(stockEntryId);
      if (response) setDetails(response.results);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockEntryDetails();
  }, []);

  const stockEntryData = [
    { field: "Mã", data: details?._id },
    { field: "Nhà cung cấp", data: details?.supplierId?.name },
    { field: "Tổng tiền", data: details?.totalCost },
    { field: "Ngày nhập hàng", data: details?.entryDate },
    { field: "Trạng thái", data: details?.status },
    { field: "Ngày lập phiếu", data: details?.createdAt },
  ];

  const productThumnailBodyTemplate = (rowData) => {
    return <Image src={rowData.productId.thumbnail} alt="Image" width="80" />;
  };

  if (loading) {
    return (
      <div className="flex items-center h-screen justify-center">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading>Chi tiết phiếu nhập hàng hóa</Heading>
        <Button
          label="Quay về"
          icon="pi pi-arrow-left"
          severity="secondary"
          onClick={() => navigate("/admin/stock-entry")}
        />
      </div>

      <table className="w-full border-collapse my-5">
        <tbody>
          {stockEntryData.map((item, index) => (
            <tr key={index} className="border-b border-gray-300">
              <th className="bg-gray-100 p-3 text-left align-top w-1/4 border-r border-gray-300">
                {item.field}
              </th>
              <td className="p-3">{item.data || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1 className="text-xl font-bold">Danh sách sản phẩm</h1>
      <DataTable
        value={details?.products}
        paginator
        rows={5}
        paginatorLeft
        rowsPerPageOptions={[5, 10, 25, 50]}
        scrollable
        stripedRows
        showGridlines
        emptyMessage="Không tìm thấy dữ liệu"
        className="bg-white border rounded-md mt-5"
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
        <Column field="quantity" header="Số lượng" sortable />
        <Column field="price" header="Đơn giá" sortable />
        <Column field="total" header="Tổng tiền" sortable />
      </DataTable>
    </div>
  );
};

export default StockEntryDetails;
