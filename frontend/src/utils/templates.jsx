import { formatDate } from "./helper";
import { Badge } from "primereact/badge";
import { Image } from "primereact/image";

export const createdAtBodyTemplate = (rowData) => {
  return <div>{formatDate(rowData.createdAt)}</div>;
};

export const startDateBodyTemplate = (rowData) => {
  return <div>{formatDate(rowData.startDate)}</div>;
};

export const endDateBodyTemplate = (rowData) => {
  return <div>{formatDate(rowData.endDate)}</div>;
};

export const userAvatarBodyTemplate = (rowData) => {
  return (
    <div>
      <img
        src={rowData.avatar}
        alt={rowData.name}
        className="w-[50px] h-[50px] rounded-full object-cover"
      />
    </div>
  );
};

export const brandImageBodyTemplate = (rowData) => {
  return <Image src={rowData.image} alt="Image" width="80" />;
};

export const productThumnailBodyTemplate = (rowData) => {
  return <Image src={rowData.thumbnail} alt="Image" width="80" />;
};

export const statusBodyTemplate = (rowData) => {
  return (
    <Badge
      value={rowData.status === "Active" ? "Hoạt động" : "Ngưng hoạt động"}
      severity={rowData.status === "Active" ? "success" : "danger"}
    />
  );
};

export const inventoryStatusBodyTemplate = (rowData) => {
  const statusLabel =
    rowData.status === "In Stock"
      ? "Còn hàng"
      : rowData.status === "Low Stock"
      ? "Còn ít hàng"
      : "Hết hàng";

  const statusSeverity =
    rowData.status === "In Stock"
      ? "success"
      : rowData.status === "Low Stock"
      ? "warning"
      : "danger";

  return <Badge value={statusLabel} severity={statusSeverity} />;
};

export const stockEntryStatusTemplate = (rowData) => {
  const statusLabel =
    rowData.status === "Pending"
      ? "Chờ xử lí"
      : rowData.status === "Completed"
      ? "Thành công"
      : "Hủy";

  const statusSeverity =
    rowData.status === "Completed"
      ? "success"
      : rowData.status === "Pending"
      ? "warning"
      : "danger";

  return <Badge value={statusLabel} severity={statusSeverity} />;
};

export const entryDateBodyTemplate = (rowData) => {
  return <div>{formatDate(rowData.entryDate)}</div>;
};

export const stockEntryAmount = (rowData) => {
  return <div>{rowData.products.length || 0}</div>;
};
