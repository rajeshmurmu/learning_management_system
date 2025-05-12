import express from "express";
import {
  createCourse,
  deleteCourse,
  editCourse,
  getAllCreatedCourses,
  getCourseById,
  getCourseProgress,
  getPublishedCourses,
  markLectureAsCompleted,
  togglePublishCourse,
  updateCourseLectureProgress,
} from "../controllers/course.controller.js";
import { isAuthenticated } from "../middlewares/verifyAuth.js";
import { upload } from "../utils/multer.js";
import { authorization } from "../middlewares/authorization.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(isAuthenticated, authorization(["admin"]), getAllCreatedCourses);
router.route("/published").get(isAuthenticated, getPublishedCourses);
router
  .route("/create")
  .post(isAuthenticated, authorization(["admin"]), createCourse);
router
  .route("/:course_id")
  .delete(isAuthenticated, authorization(["admin"]), deleteCourse);
router
  .route("/edit/:course_id")
  .put(
    isAuthenticated,
    upload.single("courseThumbnail"),
    authorization(["admin"]),
    editCourse
  );

router.route("/:course_id").get(isAuthenticated, getCourseById);

router
  .route("/:course_id")
  .put(isAuthenticated, authorization(["admin"]), togglePublishCourse);

// course progress routes

router.route("/progress/:course_id").get(isAuthenticated, getCourseProgress);
router
  .route("/progress/:course_id/lecture/:lecture_id")
  .post(isAuthenticated, updateCourseLectureProgress);

router
  .route("/progress/:course_id/lecture/:lecture_id")
  .put(isAuthenticated, markLectureAsCompleted);
export default router;
