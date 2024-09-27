import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import toast from "react-hot-toast";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import { clothingColors } from "../../utils/constant";
import useGetActiveCategories from "../../hooks/useGetActiveCategories";
import useGetActiveSubCategories from "../../hooks/useGetActiveSubCategories";
import useGetActiveBrands from "../../hooks/useGetActiveBrands";
import { Editor } from "primereact/editor";
import { createProductApi } from "../../apis/productApi";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const navigate = useNavigate();
  const { fetchActiveCategories, activeCategories } = useGetActiveCategories();
  const { fetchActiveSubCategories, activeSubCategories } =
    useGetActiveSubCategories();
  const { fetchActiveBrands, activeBrands } = useGetActiveBrands();
  const [form, setForm] = useState({
    name: "",
    description: "",
    about: "",
    price: 0,
    salePrice: 0,
    sizes: "",
    colors: "",
    thumbnail: "",
    images: [],
    categoryId: "",
    subCategoryId: "",
    brandId: "",
  });

  const onCreate = async () => {
    if (form.price <= 0) {
      toast.error("Price must be greater than 0.");
      return;
    }

    if (form.salePrice > form.price) {
      toast.error("Sale price cannot be greater than the original price.");
      return;
    }

    try {
      const response = await createProductApi({ ...form });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Error create new product", error.message);
      toast.error(error.message);
    } finally {
      setForm({
        name: "",
        description: "",
        about: "",
        price: 0,
        salePrice: 0,
        sizes: "",
        colors: "",
        thumbnail: "",
        images: [],
        categoryId: "",
        subCategoryId: "",
        brandId: "",
      });
    }
  };

  const onUploadThumbnail = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, thumbnail: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onUploadImages = (event) => {
    const files = event.target.files;

    if (files.length > 5) {
      toast.error("Tối đa 4 hình ảnh");
      return;
    }

    if (files) {
      const newImages = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();

        reader.onloadend = () => {
          newImages.push(reader.result);

          if (newImages.length === files.length) {
            setForm((prev) => ({ ...prev, images: newImages }));
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  useEffect(() => {
    fetchActiveCategories();
    fetchActiveSubCategories();
    fetchActiveBrands();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading>Tạo mới sản phẩm</Heading>
        <div className="flex items-center gap-3">
          <Button
            label="Quay về"
            icon="pi pi-arrow-left"
            severity="secondary"
            onClick={() => navigate("/admin/product")}
          />
          <Button
            label="Tạo mới sản phẩm"
            icon="pi pi-save"
            onClick={onCreate}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mt-6">
        <div className="space-y-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Tên sản phẩm</label>
            <InputText
              id="name"
              placeholder="Nhập tên  sản phẩm"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="capitalize">thương hiệu</label>
            <Dropdown
              value={form.brandId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, brandId: e.value }))
              }
              options={activeBrands}
              optionValue="_id"
              optionLabel="name"
              placeholder="Chọn thương hiệu"
              scrollHeight="400px"
            />
          </div>

          <section className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              <label className="capitalize" htmlFor="price">
                Giá
              </label>
              <InputText
                id="price"
                type="number"
                placeholder="Nhập giá"
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, price: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="capitalize" htmlFor="salePrice">
                Giá giảm
              </label>
              <InputText
                id="salePrice"
                type="number"
                placeholder="Nhập giá"
                value={form.salePrice}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, salePrice: e.target.value }))
                }
              />
            </div>
          </section>

          <section className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              <label className="capitalize">size</label>
              <MultiSelect
                value={form.sizes}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, sizes: e.value }))
                }
                options={["XS", "S", "M", "L", "XL", "XXL"]}
                placeholder="Chọn size"
                maxSelectedLabels={6}
                className="w-full md:w-20rem"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="capitalize">Màu</label>
              <MultiSelect
                value={form.colors}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, colors: e.value }))
                }
                options={clothingColors}
                placeholder="Chọn màu"
                maxSelectedLabels={6}
                className="w-full md:w-20rem"
              />
            </div>
          </section>

          <section className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              <label className="capitalize">Danh mục</label>
              <Dropdown
                value={form.categoryId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, categoryId: e.value }))
                }
                options={activeCategories}
                optionValue="_id"
                optionLabel="name"
                placeholder="Chọn danh mục"
                scrollHeight="400px"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="capitalize">Danh mục con</label>
              <Dropdown
                value={form.subCategoryId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, subCategoryId: e.value }))
                }
                options={activeSubCategories}
                optionValue="_id"
                optionLabel="name"
                placeholder="Chọn danh mục con"
                scrollHeight="400px"
              />
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="description">Mô tả</label>
            <InputTextarea
              id="description"
              placeholder="Nhập mô tả "
              rows={5}
              cols={30}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-2">
              <label>Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                onChange={onUploadThumbnail}
              />
            </div>

            {form.thumbnail && (
              <img
                src={form.thumbnail}
                alt="product-thumbnail"
                className="w-full h-[100px] object-contain"
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label>Hình ảnh</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onUploadImages}
            />
            <div className="grid grid-cols-5 gap-1">
              {form.images.length > 0 &&
                form.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="product-image"
                    className="aspect-square"
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Editor
          value={form.about}
          onTextChange={(e) =>
            setForm((prev) => ({ ...prev, about: e.htmlValue }))
          }
          style={{ height: "900px" }}
        />
      </div>
    </div>
  );
};

export default CreateProduct;
