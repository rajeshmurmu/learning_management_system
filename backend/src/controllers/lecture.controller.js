import mongoose from "mongoose";
import { Course } from "../models/course.model.js";
import {
  deleteImageFromCloudinary,
  deleteVideoFromCloudinary,
  uploadImageToCloudinary,
  uploadVideoToCloudinary,
} from "../utils/cloudinary.js";
import { Lecture } from "../models/lecture.model.js";

export const createLecture = async (req, res) => {
  try {
    const { course_id } = req.params;
    const video = req.file;
    const { lectureTitle, lectureDescription } = req.body;
    // console.log(lectureTitle, lectureDescription, req.file, course_id);

    if (!course_id || !lectureTitle) {
      return res.status(400).json({
        success: false,
        message: "Invalid course details",
      });
    }

    const course = await Course.findById(course_id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (video) {
      const videoData = await uploadVideoToCloudinary(video.buffer);
      const newLecture = await Lecture.create({
        lectureTitle,
        lectureDescription,
        videoUrl: videoData.videoUrl,
        publicId: videoData.public_id,
        courseId: course_id,
      });
      if (!newLecture) {
        return res.status(500).json({
          success: false,
          message: "Failed to create lecture",
        });
      }

      course.lectures.push(newLecture?._id);
      await course.save();

      return res.status(201).json({
        success: true,
        message: "Lecture created successfully",
      });
    } else {
      const newLecture = await Lecture.create({
        lectureTitle,
        lectureDescription,
        courseId: course_id,
      });
      if (!newLecture) {
        return res.status(500).json({
          success: false,
          message: "Failed to create lecture",
        });
      }

      course.lectures.push(newLecture?._id);
      await course.save();

      return res.status(201).json({
        success: true,
        message: "Lecture created successfully",
      });
    }
  } catch (error) {
    console.log("create lecture error", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getLectures = async (req, res) => {
  try {
    const { course_id } = req.params;
    const course = await Course.findById(course_id).populate("lectures").lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // console.log(course);
    return res.status(200).json({
      success: true,
      lectures: course.lectures,
    });
  } catch (error) {
    console.log("get lecture error", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateLecture = async (req, res) => {
  try {
    const { course_id, lecture_id } = req.params;
    const { lectureTitle, lectureDescription, isPreviewFree, videoInfo } =
      req.body;
    console.log(videoInfo);
    if (!course_id || !lecture_id || !lectureTitle || !videoInfo) {
      return res.status(400).json({
        success: false,
        message: "Invalid course details",
      });
    }

    const course = await Course.findById(course_id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const lecture = await Lecture.findById(lecture_id);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    lecture.lectureTitle = lectureTitle;
    lecture.lectureDescription = lectureDescription;
    lecture.isPreviewFree = isPreviewFree;
    lecture.videoUrl = videoInfo.videoUrl;
    lecture.publicId = videoInfo.public_id;
    // await lecture.save();

    // course.lectures.push(lecture?._id);
    await lecture.save();

    return res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
      lecture,
    });
  } catch (error) {
    console.log("update lecture error", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const removeLecture = async (req, res) => {
  try {
    const { course_id, lecture_id } = req.params;

    if (!course_id || !lecture_id) {
      return res.status(400).json({
        success: false,
        message: "Invalid course details",
      });
    }

    const lecture = await Lecture.findById(lecture_id);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    const deletedLecture = await Lecture.findByIdAndDelete(lecture_id);

    if (deletedLecture.videoUrl || deletedLecture.publicId) {
      const cldResponse = await deleteVideoFromCloudinary(
        deletedLecture.publicId
      );

      if (!cldResponse) {
        return res.status(500).json({
          success: false,
          message: "Failed to delete lecture",
        });
      }
    }

    const course = await Course.findByIdAndUpdate(
      { _id: course_id },
      { $pull: { lectures: lecture_id } }
    );

    if (!course) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete lecture",
      });
    }

    // course.lectures = course.lectures.filter(
    //   (lecture) => lecture.toString() !== lecture_id
    // );
    // await course.save();

    return res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    console.log("remove lecture error", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getLectureById = async (req, res) => {
  try {
    const { course_id, lecture_id } = req.params;

    if (!course_id || !lecture_id) {
      return res.status(400).json({
        success: false,
        message: "Invalid course details",
      });
    }

    const course = await Course.findById(course_id).populate("lectures").lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const lecture = course.lectures.find((lecture) => {
      return lecture._id.toString() === lecture_id;
    });

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lecture found successfully",
      lecture,
    });
  } catch (error) {
    console.log("get lecture by id error", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
