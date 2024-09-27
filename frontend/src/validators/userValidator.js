import * as yup from "yup";

export const loginUserSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
    .max(20, "Mật khẩu chỉ được tối đa 20 ký tự.")
    .required("Mật khẩu là bắt buộc."),
  email: yup
    .string()
    .email("Định dạng email không hợp lệ.")
    .required("Email là bắt buộc.")
    .lowercase("Email phải ở dạng chữ thường."),
});

export const createUserSchema = yup.object().shape({
  name: yup
    .string()
    .required("Tên là bắt buộc")
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được vượt quá 50 ký tự"),
  email: yup
    .string()
    .email("Email phải là một địa chỉ email hợp lệ")
    .required("Email là bắt buộc"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(20, "Mật khẩu không được vượt quá 20 ký tự"),
  address: yup.string().nullable(),
  phone: yup.string().nullable(),
});

export const updateUserSchema = yup.object().shape({
  name: yup
    .string()
    .required("Tên là bắt buộc")
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được vượt quá 50 ký tự"),
  email: yup
    .string()
    .email("Email phải là một địa chỉ email hợp lệ")
    .required("Email là bắt buộc"),
  address: yup.string().nullable(),
  phone: yup.string().nullable(),
});
