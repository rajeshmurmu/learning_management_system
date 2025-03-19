import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = async (file) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(file, {
      folder: "LMS/avatars",
    });

    if (uploadResult) {
      // console.log("uploadResult", uploadResult);
      fs.unlinkSync(file);
    }
    return uploadResult.secure_url;
  } catch (error) {
    console.log("uploadImageToCloudinary error", error);
  }
};

export const deleteImageFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy("LMS/avatars/" + publicId);
    // console.log(res);
  } catch (error) {
    console.log("deleteImageFromCloudinary error", error);
  }
};

export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy("LMS/videos/" + publicId);
    // console.log(res);
  } catch (error) {
    console.log("deleteImageFromCloudinary error", error);
  }
};

export const uploadVideoToCloudinary = async (fileBuffer) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "video", folder: "LMS/videos" },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );
      // uploadStream.write(buffer);
      uploadStream.end(fileBuffer);
    });

    const data = {
      videoUrl: result.secure_url,
      public_id: result.public_id,
    };

    return data;
  } catch (error) {
    console.log("Error while uploading video to cloudinary", error);
  }
};
