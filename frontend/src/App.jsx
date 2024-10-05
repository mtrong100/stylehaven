import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import DashboardLayout from "./components/layouts/DashboardLayout";
import Admin from "./pages/admin/Admin";
import Login from "./pages/client/Login";
import Register from "./pages/client/Register";
import { ProgressSpinner } from "primereact/progressspinner";
import MainLayout from "./components/layouts/MainLayout";

const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Customer = lazy(() => import("./pages/admin/Customer"));
const Category = lazy(() => import("./pages/admin/Category"));
const SubCategory = lazy(() => import("./pages/admin/SubCategory"));
const Product = lazy(() => import("./pages/admin/Product"));
const Order = lazy(() => import("./pages/admin/Order"));
const Review = lazy(() => import("./pages/admin/Review"));
const Voucher = lazy(() => import("./pages/admin/Voucher"));
const Inventory = lazy(() => import("./pages/admin/Inventory"));
const Post = lazy(() => import("./pages/admin/Post"));
const Supplier = lazy(() => import("./pages/admin/Supplier"));
const Brand = lazy(() => import("./pages/admin/Brand"));
const CreateProduct = lazy(() => import("./pages/admin/CreateProduct"));
const ProductDetail = lazy(() => import("./pages/admin/ProductDetail"));
const UpdateProduct = lazy(() => import("./pages/admin/UpdateProduct"));
const StockEntry = lazy(() => import("./pages/admin/StockEntry"));
const StockEntryDetails = lazy(() => import("./pages/admin/StockEntryDetails"));
const ImportStock = lazy(() => import("./pages/admin/ImportStock"));
const CreatePost = lazy(() => import("./pages/admin/CreatePost"));
const UpdatePost = lazy(() => import("./pages/admin/UpdatePost"));

const Home = lazy(() => import("./pages/client/Home"));
const Cart = lazy(() => import("./pages/client/Cart"));
const Products = lazy(() => import("./pages/client/Products"));
const Profile = lazy(() => import("./pages/client/Profile"));
const Wishlist = lazy(() => import("./pages/client/Wishlist"));
const Checkout = lazy(() => import("./pages/client/Checkout"));
const ResetPassword = lazy(() => import("./pages/client/ResetPassword"));
const ProductDetails = lazy(() => import("./pages/client/ProductDetails"));
const MyOrder = lazy(() => import("./pages/client/MyOrder"));

const ADMIN_ROUTES = [
  { path: "/admin/dashboard", element: <Dashboard /> },
  { path: "/admin/customer", element: <Customer /> },
  { path: "/admin/category", element: <Category /> },
  { path: "/admin/sub-category", element: <SubCategory /> },
  { path: "/admin/product", element: <Product /> },
  { path: "/admin/product/:id", element: <ProductDetail /> },
  { path: "/admin/product/update/:id", element: <UpdateProduct /> },
  { path: "/admin/product/create", element: <CreateProduct /> },
  { path: "/admin/order", element: <Order /> },
  { path: "/admin/review", element: <Review /> },
  { path: "/admin/voucher", element: <Voucher /> },
  { path: "/admin/inventory", element: <Inventory /> },
  { path: "/admin/post", element: <Post /> },
  { path: "/admin/supplier", element: <Supplier /> },
  { path: "/admin/brand", element: <Brand /> },
  { path: "/admin/stock-entry", element: <StockEntry /> },
  { path: "/admin/stock-entry/:id", element: <StockEntryDetails /> },
  { path: "/admin/import-stock", element: <ImportStock /> },
  { path: "/admin/post/create", element: <CreatePost /> },
  { path: "/admin/post/update/:id", element: <UpdatePost /> },
];

const CLIENT_ROUTES = [
  { path: "/", element: <Home /> },
  { path: "/cart", element: <Cart /> },
  { path: "/product", element: <Products /> },
  { path: "/profile", element: <Profile /> },
  { path: "/wishlist", element: <Wishlist /> },
  { path: "/checkout", element: <Checkout /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/product/:id", element: <ProductDetails /> },
  { path: "/my-order", element: <MyOrder /> },
];

function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        {ADMIN_ROUTES.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Suspense fallback={<ProgressSpinner />}>
                {route.element}
              </Suspense>
            }
          />
        ))}
      </Route>

      <Route element={<MainLayout />}>
        {CLIENT_ROUTES.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Suspense fallback={<ProgressSpinner />}>
                {route.element}
              </Suspense>
            }
          />
        ))}
      </Route>

      <Route path="/admin" element={<Admin />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
    </Routes>
  );
}

export default App;
