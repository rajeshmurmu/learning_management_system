import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

import jwt from "jsonwebtoken";
import {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} from "../utils/cloudinary.js";

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "all fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "password must be at least 6 characters long",
      });
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res
        .status(400)
        .json({ success: false, error: "invalid email format" });
    }

    // find existed user in db
    await User.findOne({ email })
      .then((user) => {
        if (user) {
          return res
            .status(400)
            .json({ success: true, error: "User already exists" });
        }
      })
      .catch((error) => {
        console.log("signup error", error);
        return res
          .status(500)
          .json({ success: false, error: "internal server error" });
      });

    const hashedPassword = await bcryptjs.hash(password, 10);

    // create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    return res
      .status(201)
      .json({ success: true, user, message: "User created successfully" });
  } catch (error) {
    console.log("signup error", error);
    // return res
    //   .status(500)
    //   .json({ success: false, error: "internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "all fields are required" });
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res
        .status(400)
        .json({ success: false, error: "invalid email format" });
    }

    // find existed user in db
    await User.findOne({ email })
      .then(async (user) => {
        if (!user) {
          return res
            .status(400)
            .json({ success: false, error: "invalid credentials" });
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
          return res
            .status(400)
            .json({ success: false, error: "Invalid credentials" });
        }

        const access_token = await generateAccessToken(user);
        const refresh_token = await generateRefreshToken(user);

        user.refreshToken = refresh_token;
        user.active = true;
        await user.save();
        user.password = undefined;

        return res
          .status(200)
          .cookie("access_token", access_token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1d
          })
          .cookie("refresh_token", refresh_token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30d
          })
          .json({
            success: true,
            user,
            message: "Login successful",
            access_token: access_token,
          });
      })
      .catch((error) => {
        // console.log("login error", error);
        return res
          .status(500)
          .json({ success: false, error: "internal server error" });
      });
  } catch (error) {
    console.log("login error", error);
    // return res
    //   .status(500)
    //   .json({ success: false, error: "internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    const { access_token } = req.cookies;

    const authToken =
      access_token ||
      req.headers.authorization?.split(" ")[1] ||
      req.query?.token;

    if (!authToken) {
      return res
        .status(400)
        .json({ success: false, error: "Unauthorized access" });
    }

    const verifiedUser = await jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await User.findById(verifiedUser.userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "Unauthorized request" });
    }

    user.refreshAccessToken = "";
    user.active = false;
    await user.save();

    return (
      res
        .status(200)
        .clearCookie("access_token")
        //   .clearCookie("refresh_token")
        .json({ success: true, message: "Logout successful" })
    );
  } catch (error) {
    console.log("logout error", error);
    // return res
    //   .status(500)
    //   .json({ success: false, error: "internal server error" });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId)
      .select("-password")
      .populate("coursesEnrolled");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("getUser error", error);
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { name, email } = req.body;
    let avatarLocalStorage;

    if (req.file) {
      avatarLocalStorage = req.file;
    }

    const user = await User.findById({ _id: userId });
    // console.log(user);

    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "internal server error" });
    }

    let avatar;

    if (avatarLocalStorage) {
      if (user.avatar) {
        const publicId = user.avatar.split("/").pop().split(".")[0];
        // console.log(publicId);
        await deleteImageFromCloudinary(publicId);
      }

      const avatarLocalStoragePath = avatarLocalStorage?.path;
      // console.log(avatarLocalStoragePath);

      avatar = await uploadImageToCloudinary(avatarLocalStoragePath);
      if (!avatar) {
        return res
          .status(404)
          .json({ success: false, message: "failed to upload avatar" });
      }
    }

    user.avatar = avatar;
    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();

    user.password = undefined;
    return res
      .status(200)
      .json({ success: true, user, message: "User update successfully" });
  } catch (error) {
    console.log("updateUser error", error);
  }
};

export { signup, login, logout, getUser, updateUser };
