import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
  try {
    // console.log("cookies", req.cookies);
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

    const isValid = await jwt.verify(authToken, process.env.JWT_SECRET);

    // console.log("isValid", isValid);

    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, error: "Unauthorized access" });
    }

    // const verifiedUser = await User.findById(isValid.userId);
    // if (!verifiedUser) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "User not found" });
    // }

    // req.user = verifiedUser;
    const user = {
      _id: isValid.userId,
      role: isValid.role,
    };
    req.user = user;
    next();
  } catch (error) {
    console.log("verifyAuth error", error);
  }
};

export { isAuthenticated };
