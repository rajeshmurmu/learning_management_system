import express from "express";
import {
  createLecture,
  getLectureById,
  getLectures,
  removeLecture,
  updateLecture,
} from "../controllers/lecture.controller.js";
import { isAuthenticated } from "../middlewares/verifyAuth.js";
import { uploadBuffer } from "../utils/multer.js";

const router = express.Router({ mergeParams: true });

router
  .route("/:course_id")
  .post(isAuthenticated, uploadBuffer.single("lecture"), createLecture);

router.route("/:course_id").get(isAuthenticated, getLectures);
router
  .route("/:lecture_id/courses/:course_id")
  .put(isAuthenticated, updateLecture);

router
  .route("/:lecture_id/courses/:course_id")
  .delete(isAuthenticated, removeLecture);

router
  .route("/:lecture_id/courses/:course_id")
  .get(isAuthenticated, getLectureById);

export default router;
