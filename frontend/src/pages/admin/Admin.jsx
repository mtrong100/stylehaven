import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FieldInput from "../../components/FieldInput";
import { Button } from "primereact/button";
import { loginUserSchema } from "../../validators/userValidator";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loginUserApi } from "../../apis/userApi";
import { userStore } from "../../zustand/userStore";

const Admin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onchange",
    resolver: yupResolver(loginUserSchema),
    defaultValues: {
      email: "admin123@gmail.com",
      password: "admin123@",
    },
  });

  const navigate = useNavigate();
  const setCurrentUser = userStore((state) => state.setCurrentUser);

  const onLogin = async (values) => {
    try {
      const response = await loginUserApi({ ...values });
      if (response) {
        setCurrentUser(response.results);
        toast.success(response.message);
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.log("Error login user", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_650px] h-screen w-full place-items-center">
      <div className="max-w-xl w-full">
        <h1 className="font-bold text-4xl text-center">Trang Admin Quản Trị</h1>

        <form onSubmit={handleSubmit(onLogin)} className="mt-6 space-y-5">
          <FieldInput
            label="Email"
            type="email"
            name="email"
            register={register}
            placeholder="Nhập email"
            errorMessage={errors?.email?.message}
          />
          <FieldInput
            label="Mật khẩu"
            type="password"
            name="password"
            register={register}
            placeholder="Nhập mật khẩu"
            errorMessage={errors?.password?.message}
          />
          <Button
            className="w-full"
            type="submit"
            label="Đăng nhập"
            disabled={isSubmitting}
            loading={isSubmitting}
          />
        </form>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 text-white gap-5 flex-col px-20 to-pink-500 h-screen w-full flex items-center justify-center">
        <h1 className="text-7xl font-semibold ">StyleHaven</h1>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet
          similique soluta in illum impedit ratione nostrum beatae minima, iste
          repellat ducimus quae vero, deserunt eligendi deleniti excepturi unde
          modi voluptatem!
        </p>
      </div>
    </div>
  );
};

export default Admin;
