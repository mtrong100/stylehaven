import {
  BookText,
  Folder,
  FolderClosed,
  Hexagon,
  LayoutDashboard,
  Shirt,
  ShoppingCart,
  Star,
  Ticket,
  UserPlus,
  Users,
  Warehouse,
} from "lucide-react";

export const SIDEBAR_LINKS = [
  {
    name: "Quản lí chung",
    link: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  { name: "Khách hàng", link: "/admin/customer", icon: <Users /> },
  {
    name: "Danh mục",
    link: "/admin/category",
    icon: <Folder />,
  },
  {
    name: "Danh mục con",
    link: "/admin/sub-category",
    icon: <FolderClosed />,
  },
  { name: "Sản phẩm", link: "/admin/product", icon: <Shirt /> },
  { name: "Thương hiệu", link: "/admin/brand", icon: <Hexagon /> },
  { name: "Đơn hàng", link: "/admin/order", icon: <ShoppingCart /> },
  { name: "Đánh giá", link: "/admin/review", icon: <Star /> },
  { name: "Khuyến mãi", link: "/admin/voucher", icon: <Ticket /> },
  { name: "Kho", link: "/admin/inventory", icon: <Warehouse /> },
  { name: "Bài viết", link: "/admin/post", icon: <BookText /> },
  { name: "Nhà cung cấp", link: "/admin/supplier", icon: <UserPlus /> },
];
