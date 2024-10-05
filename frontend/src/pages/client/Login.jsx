import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Banner from "../../assets/banner2.jpg";
import FieldInput from "../../components/FieldInput";
import { Button } from "primereact/button";
import toast from "react-hot-toast";
import { loginUserApi } from "../../apis/userApi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../zustand/userStore";

const loginSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
    .max(20, "Mật khẩu phải có nhiều nhất 20 ký tự.")
    .required("Mật khẩu là bắt buộc."),
  email: yup
    .string()
    .email("Định dạng email không hợp lệ.")
    .required("Email là bắt buộc.")
    .lowercase("Email phải ở dạng chữ thường."),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onchange",
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
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
        navigate("/");
      }
    } catch (error) {
      console.log("Error login user", error);
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
          <form onSubmit={handleSubmit(onLogin)} className="w-full max-w-xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Đăng nhập</h1>
            <div className="space-y-5">
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
            </div>

            <Button
              className="w-full mt-5"
              type="submit"
              label="Đăng nhập"
              disabled={isSubmitting}
              loading={isSubmitting}
            />
            <div className="flex items-center gap-2 mt-5">
              <p>
                Chưa có tài khoản ?{" "}
                <Link
                  className="text-blue-700 hover:underline font-medium"
                  to="/register"
                >
                  Đăng kí tài khoản
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
