import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const autoGeneratePassword = () => {
  const generatedPassword =
    Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

  return generatedPassword;
};

export const generateTokenAndSetCookie = (payload, res) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("TOKEN", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
};

export const generateOtpCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
