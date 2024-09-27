import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import useDebounce from "../../hooks/useDebounce";
import toast from "react-hot-toast";
import { createdAtBodyTemplate } from "../../utils/templates";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);
  const [details, setDetails] = useState(null);
  const navigate = useNavigate();

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
    </div>
  );
};

export default Product;
