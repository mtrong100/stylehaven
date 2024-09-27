import ReactDOM from "react-dom/client";
import App from "./App";
import { Toaster } from "react-hot-toast";
import { PrimeReactProvider } from "primereact/api";
import { BrowserRouter } from "react-router-dom";
import "primeicons/primeicons.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <PrimeReactProvider value={{ ripple: true }}>
      <App />
      <Toaster position="top-center" reverseOrder={false} />
    </PrimeReactProvider>
  </BrowserRouter>
);
