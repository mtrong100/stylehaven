import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateOtpCode, generateTokenAndSetCookie } from "../utils/helper.js";
import { sendOtpToEmail } from "../utils/nodemailer.js";
import { uploadImagesCloudinary } from "../utils/uploadImagesCloudinary.js";

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments();

    if (!users || users.length === 0)
      return res.status(404).json({ message: "Users not found" });

    const userData = users.map((user) => {
      return {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        address: user.address,
        phone: user.phone,
        role: user.role,
        provider: user.provider,
        createdAt: user.createdAt,
      };
    });

    return res.status(200).json({
      message: "Users fetched successfully",
      results: userData,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    console.log("Error getting users", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      role: user.role,
      provider: user.provider,
      createdAt: user.createdAt,
    };

    return res
      .status(200)
      .json({ message: "User fetched successfully", results: userData });
  } catch (error) {
    console.log("Error getting user details", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { email, name, password, confirmPassword } = req.body;

    const userExisted = await User.findOne({ email });

    if (userExisted)
      return res.status(400).json({ message: "User already existed" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const userData = await User.findById(newUser._id)
      .select(
        "_id name avatar email address phone vouchers rewardPoints isEmailVerified createdAt"
      )
      .lean();

    return res.status(201).json({ message: "User created", results: userData });
  } catch (error) {
    console.log("Error registering user", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    const payload = { userId: user._id };

    generateTokenAndSetCookie(payload, res);

    const userData = await User.findById(user._id)
      .select(
        "_id name avatar email address phone vouchers rewardPoints isEmailVerified createdAt"
      )
      .lean();

    return res
      .status(200)
      .json({ message: "Login successful", results: userData });
  } catch (error) {
    console.log("Error logging in user", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("TOKEN");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error logging out user", error.message);
    return res.status(400).json({ message: error.message });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtpCode();

    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendOtpToEmail(email, "Your OTP Code for Account Verification", otp);

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.log("Error sending OTP", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, avatar, email, address, phone } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    let avatarUrl = user.avatar;

    if (avatar) {
      const uploadedImage = await uploadImagesCloudinary(avatar);
      avatarUrl = uploadedImage.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.address = address || user.address;
    user.phone = phone || user.phone;
    user.avatar = avatarUrl;

    await user.save();

    return res
      .status(200)
      .json({ message: "User profile updated successfully", results: user });
  } catch (error) {
    console.log("Error updating user profile", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (otp !== user.resetPasswordOtp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (Date.now() > user.resetPasswordExpires)
      return res.status(400).json({ message: "OTP expired" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const hashedPassword = bcrypt.hashSync(password, 10);

    user.password = hashedPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log("Error resetting password", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, avatar, address, phone } = req.body;

    const userExisted = await User.findOne({ email });

    if (userExisted) return res.status(400).json({ message: "User existed" });

    const hashedPassword = bcrypt.hashSync(password, 10);

    const uploadedImage = await uploadImagesCloudinary(avatar);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
      avatar: uploadedImage.secure_url,
    });

    const userData = await User.findById(newUser._id)
      .select(
        "_id name avatar email address phone vouchers rewardPoints isEmailVerified createdAt"
      )
      .lean();

    return res
      .status(200)
      .json({ message: "User created successfully", results: userData });
  } catch (error) {
    console.log("Error creating user", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, phone, avatar } = req.body;

    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (avatar) {
      const uploadedImage = await uploadImagesCloudinary(avatar);
      user.avatar = uploadedImage.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.address = address || user.address;
    user.phone = phone || user.phone;

    await user.save();

    const userData = await User.findById(user._id)
      .select(
        "_id name avatar email address phone vouchers rewardPoints isEmailVerified createdAt"
      )
      .lean();

    return res
      .status(200)
      .json({ message: "User updated successfully", results: userData });
  } catch (error) {
    console.log("Error updating user", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Error deleting user", error.message);
    return res.status(500).json({ message: error.message });
  }
};
