import express from "express";
import { upload, uploadBuffer } from "../utils/multer.js";
import { v2 as cloudinary } from "cloudinary";
import { uploadVideoToCloudinary } from "../utils/cloudinary.js";

const router = express.Router();

router
  .route("/upload-video")
  .post(uploadBuffer.single("lecture"), async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded." });
      }

      const data = await uploadVideoToCloudinary(file.buffer);

      if (!data) {
        return res
          .status(500)
          .json({ success: false, message: "Something went wrong" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Video uploaded successfully.", data });
    } catch (error) {
      console.log("file upload error", error);
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    }
  });

export default router;
