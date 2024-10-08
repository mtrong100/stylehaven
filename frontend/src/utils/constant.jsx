import {
  BaggageClaim,
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
  { name: "Tồn kho", link: "/admin/inventory", icon: <Warehouse /> },
  { name: "Nhập hàng hóa", link: "/admin/stock-entry", icon: <BaggageClaim /> },
  { name: "Nhà cung cấp", link: "/admin/supplier", icon: <UserPlus /> },
  { name: "Bài viết", link: "/admin/post", icon: <BookText /> },
];

export const clothingColors = [
  "Đen",
  "Trắng",
  "Xám",
  "Xanh navy",
  "Đỏ",
  "Xanh dương",
  "Xanh lá",
  "Vàng",
  "Tím",
  "Hồng",
  "Nâu",
  "Be",
  "Xanh olive",
  "Đỏ burgundy",
  "Cam",
  "Xanh ngọc",
  "Xanh teal",
  "Vàng gold",
  "Bạc",
  "San hô",
  "Oải hương",
  "Khaki",
  "Xám đậm",
  "Ngà",
  "Xanh bạc hà",
  "Đỏ mận",
  "Vàng mù tạt",
  "Cam đào",
  "Tím lilac",
  "Xanh lơ",
];

export const postCategories = [
  "Xu hướng",
  "Mẹo phối đồ",
  "Chọn trang phục",
  "Bảo quản quần áo",
  "Phong cách sao",
  "Mua sắm thông minh",
  "Khuyến mãi",
  "Hậu trường thời trang",
];

export const NAV_LINKS = [
  {
    name: "Trang chủ",
    link: "/",
  },
  {
    name: "Sản phẩm",
    link: "/product",
  },
  {
    name: "Yêu thích",
    link: "/wishlist",
  },
  {
    name: "Tài khoản",
    link: "/profile",
  },
];
