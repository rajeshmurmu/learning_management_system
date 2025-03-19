import express from "express";
import {
  getUser,
  login,
  logout,
  signup,
  updateUser,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/verifyAuth.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);

// update routes
router.route("/profile").get(isAuthenticated, getUser);
router
  .route("/profile/update")
  .put(isAuthenticated, upload.single("avatar"), updateUser);

export default router;
