import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Banner from "../../assets/banner1.jpg";
import FieldInput from "../../components/FieldInput";
import { Button } from "primereact/button";
import toast from "react-hot-toast";
import { registerUserApi } from "../../apis/userApi";
import { Link } from "react-router-dom";

const registerSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Tên người dùng phải có ít nhất 3 ký tự.")
    .max(20, "Tên người dùng phải có nhiều nhất 20 ký tự.")
    .required("Tên người dùng là bắt buộc."),
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
    .max(20, "Mật khẩu phải có nhiều nhất 20 ký tự.")
    .required("Mật khẩu là bắt buộc."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Mật khẩu phải khớp")
    .required("Xác nhận mật khẩu là bắt buộc."),
  email: yup
    .string()
    .email("Định dạng email không hợp lệ.")
    .required("Email là bắt buộc.")
    .lowercase("Email phải ở dạng chữ thường."),
});

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onchange",
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onRegister = async (values) => {
    try {
      const response = await registerUserApi({ ...values });
      if (response) toast.success(response.message);
    } catch (error) {
      console.log("Error registering user", error);
      toast.error(error.message);
    } finally {
      reset();
    }
  };

  return (
    <section className="min-h-screen flex">
      <div className="flex flex-1">
        <div className="w-1/2">
          <img
            src={Banner}
            alt="banner-login"
            className="h-screen w-full object-cover"
          />
        </div>

        <div className="w-1/2 flex items-center justify-center p-8 bg-white">
          <form onSubmit={handleSubmit(onRegister)} className="w-full max-w-xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Đăng kí tài khoản
            </h1>
            <div className="space-y-5">
              <FieldInput
                label="Tên"
                name="name"
                register={register}
                errorMessage={errors?.name?.message}
                placeholder="Tên người dùng"
              />

              <FieldInput
                label="Email"
                type="email"
                name="email"
                register={register}
                errorMessage={errors?.email?.message}
                placeholder="Email"
              />

              <FieldInput
                label="Mật khẩu"
                type="password"
                name="password"
                register={register}
                errorMessage={errors?.password?.message}
                placeholder="Mật khẩu"
              />

              <FieldInput
                label="Xác nhận mật khẩu"
                type="password"
                name="confirmPassword"
                register={register}
                errorMessage={errors?.confirmPassword?.message}
                placeholder="Xác nhận mật khẩu"
              />
            </div>

            <Button
              className="w-full mt-5"
              type="submit"
              label="Đăng kí tài khoản"
              disabled={isSubmitting}
              loading={isSubmitting}
            />
            <div className="flex items-center gap-2 mt-5">
              <p>
                Đã có tài khoản ?{" "}
                <Link
                  className="text-blue-700 hover:underline font-medium"
                  to="/login"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
