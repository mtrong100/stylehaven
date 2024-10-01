import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import DashboardLayout from "./components/layouts/DashboardLayout";
import Admin from "./pages/admin/Admin";
import { ProgressSpinner } from "primereact/progressspinner";

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

      <Route path="/admin" element={<Admin />}></Route>
    </Routes>
  );
}

export default App;
