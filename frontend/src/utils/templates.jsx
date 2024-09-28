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
      value={rowData.status}
      severity={rowData.status === "Active" ? "success" : "danger"}
    />
  );
};

export const inventoryStatusBodyTemplate = (rowData) => {
  return (
    <Badge
      value={rowData.status}
      severity={
        rowData.status === "In Stock"
          ? "success"
          : rowData.status === "Low Stock"
          ? "warning"
          : "danger"
      }
    />
  );
};
