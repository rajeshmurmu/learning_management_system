import mongoose from "mongoose";
import { Course, CourseProgress } from "../models/course.model.js";
import {
  deleteImageFromCloudinary,
  deleteVideoFromCloudinary,
  uploadImageToCloudinary,
  uploadVideoToCloudinary,
} from "../utils/cloudinary.js";
import { Lecture } from "../models/lecture.model.js";
import User from "../models/user.model.js";

export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    // console.log(req.body);

    if (!courseTitle || !category) {
      return res.status(400).json({
        success: false,
        message: "Course title and category are required",
      });
    }

    const course = await Course.create({
      courseTitle,
      category,
      creator: req.user._id,
    });

    if (!course) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course created successfully",
    });
  } catch (error) {
    console.log("Create course error", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
};

export const getAllCreatedCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const courses = await Course.find({ creator: userId });
    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.log("Get all courses error", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get courses",
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    const { course_id } = req.params;

    const course = await Course.findById(course_id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;

    let thumbnail;
    if (req.file) {
      const courseThumbnail = req.file;
      // console.log("course", courseThumbnail);
      if (courseThumbnail) {
        if (course.courseThumbnail) {
          thumbnail = course.courseThumbnail.split("/").pop().split(".")[0];
          await deleteImageFromCloudinary(thumbnail);
        }

        thumbnail = await uploadImageToCloudinary(courseThumbnail.path);
      }
    }

    if (thumbnail) course.courseThumbnail = thumbnail;

    if (courseTitle) {
      if (courseTitle !== course.courseTitle) course.courseTitle = courseTitle;
    }

    if (subTitle) {
      if (subTitle !== course.subTitle) course.subTitle = subTitle;
    }

    if (description) {
      if (description !== course.description) course.description = description;
    }

    if (courseLevel) {
      if (courseLevel !== course.courseLevel) course.courseLevel = courseLevel;
    }

    if (category) {
      if (category !== course.category) course.category = category;
    }

    if (coursePrice) {
      if (coursePrice !== course.coursePrice) course.coursePrice = coursePrice;
    }

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
    });
  } catch (error) {
    console.log("Edit course error", error);
    return res.status(500).json({
      success: false,
      message: "Failed to edit course",
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const course = await Course.findById(course_id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.lectures.length > 0) {
      // delete all lecture of this course
      return res.status(400).json({
        success: false,
        message: "Cannot delete course with lectures",
      });
    }

    if (course.courseThumbnail) {
      const thumbnail = course.courseThumbnail.split("/").pop().split(".")[0];
      await deleteImageFromCloudinary(thumbnail);
    }

    // const deletedCourse = await Course.findByIdAndDelete(course_id);
    const deletedCourse = await course.deleteOne();
    // console.log(deletedCourse);

    if (!deletedCourse) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete course",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.log("Delete course error", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { course_id } = req.params;

    // get user from req obj
    const user_id = req.user?._id;

    if (!course_id) {
      return res.status(404).json({
        success: false,
        message: "Invalid course details",
      });
    }

    const course = await Course.findById(course_id).populate(
      "creator lectures"
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // check that user is enrolled in this course or user is creator of this course

    if (
      course.creator?._id.toString() === user_id.toString() ||
      course.enrolledStudents.includes(user_id)
    ) {
      // make all lecture available
      // console.log("course", course);
      course.lectures.forEach((lecture) => {
        lecture.isPreviewFree = true;
      });
      return res.status(200).json({
        success: true,
        course,
        message: "Course fetched successfully",
      });
    }

    // console.log("course", course);

    // check if course is published
    // if (!course.isPublished) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Course is not published",
    //   });
    // }

    return res.status(200).json({
      success: true,
      course,
      message: "Course fetched successfully",
    });
  } catch (error) {
    console.log("Get course by id", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const togglePublishCourse = async (req, res) => {
  try {
    const { course_id } = req.params;

    if (!course_id) {
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

    course.isPublished = !course.isPublished;
    await course.save();

    return res.status(200).json({
      success: true,
      message: course.isPublished
        ? "Course published successfully"
        : "Course unpublished successfully",
      course,
    });
  } catch (error) {
    console.log("toggle publish course error", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name avatar",
    });

    if (!courses) {
      return res.status(404).json({
        success: false,
        message: "Courses not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Courses found successfully",
      courses,
    });
  } catch (error) {
    console.log("get published courses error", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getCourseProgress = async (req, res) => {
  try {
    const { course_id } = req.params;
    const user_id = req.user?._id;

    if (!course_id) {
      return res.status(400).json({
        success: false,
        message: "Invalid course details",
      });
    }

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const course = await Course.findOne({ _id: course_id }).populate(
      "lectures"
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Invalid course details",
      });
    }

    // fetch user course progress

    const userCourseProgress = await CourseProgress.findOne({
      course_id,
      user_id,
    });

    if (userCourseProgress) {
      if (userCourseProgress.viewedLectures.length === course.lectures.length) {
        userCourseProgress.isCourseCompleted = true;
        await userCourseProgress.save();
      }
      return res.status(200).json({
        success: true,
        message: "User course progress fetch successfully",
        userCourseProgress,
        course,
      });
    }

    // if course progress is not found create a new progress
    const newUserCourseProgress = await CourseProgress.create({
      course_id,
      user_id,
    });

    return res.status(200).json({
      success: true,
      message: "User course progress not found",
      userCourseProgress: newUserCourseProgress,
    });
  } catch (error) {
    console.log("get course progress error", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateCourseLectureProgress = async (req, res) => {
  try {
    const { course_id, lecture_id } = req.params;
    const user_id = req.user?._id;

    // console.log("====================================");
    // console.log("course_id", course_id);
    // console.log("lecture_id", lecture_id);
    // console.log("user_id", user_id);
    // console.log("====================================");

    if (!course_id) {
      return res.status(400).json({
        success: false,
        message: "Invalid course details",
      });
    }

    if (!lecture_id) {
      return res.status(400).json({
        success: false,
        message: "Invalid course details",
      });
    }

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // fetch the user course progress
    const userCourseProgress = await CourseProgress.findOne({
      course_id: course_id,
      user_id: user_id,
    });

    // console.log("userCourseProgress", userCourseProgress);

    if (!userCourseProgress) {
      const newUserCourseProgress = await CourseProgress.create({
        course_id,
        user_id,
        isCourseCompleted: false,
      });

      newUserCourseProgress.viewedLectures.push({
        lecture_id,
      });

      await newUserCourseProgress.save();

      return res.status(201).json({
        userCourseProgress: newUserCourseProgress,
        success: true,
        message: "User course progress fetch successfully",
      });
    }

    const isLectureAlreadyViewed = userCourseProgress?.viewedLectures?.some(
      (lecture) => lecture.lecture_id.toString() === lecture_id.toString()
    );

    // console.log(isLectureAlreadyViewed);

    if (isLectureAlreadyViewed) {
      return res.status(200).json({
        success: true,
        message: "lecture completed",
      });
    }

    userCourseProgress.viewedLectures.push({
      isCompleted: true,
      lecture_id,
    });

    await userCourseProgress.save();

    return res.status(200).json({
      success: true,
      message: "User course progress updated successfully",
      userCourseProgress,
    });
  } catch (error) {
    console.log("update course progress error", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const markLectureAsCompleted = async (req, res) => {
  try {
    const { course_id, lecture_id } = req.params;
    const user_id = req.user?._id;

    if (!course_id) {
      return res.status(400).json({
        success: false,
        message: "Invalid course details",
      });
    }

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // fetch the user course progress
    const userCourseProgress = await CourseProgress.findOne({
      course_id,
      user_id,
    });

    if (!userCourseProgress) {
      // if no progress found create a new progress
      const newProgress = await CourseProgress.create({
        course_id,
        user_id,
        lectureProgress: [lecture_id],
        isCompleted: false,
      });
    }

    // find the lecture progress in the course progress
    const lecture_index = userCourseProgress.lectureProgress.findIndex(
      (lecture) => lecture.toString() === lecture_id.toString()
    );

    if (lecture_index !== -1) {
      // if lecture already exist, update its status
      userCourseProgress.lectureProgress[lecture_index].isViewed = true;
    } else {
      // add new lecture progress
      userCourseProgress.lectureProgress.push(lecture_id);
    }

    // if all lecture is completed
    const lectureProgressLength = userCourseProgress.lectureProgress.filter(
      (lecture) => lecture.isViewed === true
    );

    const course = await Course.findById(course_id).populate("lectures");

    if (lectureProgressLength.length === course.lectures.length) {
      userCourseProgress.isCompleted = true;
    }

    await userCourseProgress.save();

    return res.status(200).json({
      success: true,
      message: "User course progress updated successfully",
    });
  } catch (error) {
    console.log("update course progress error", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
