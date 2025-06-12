import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  createCourse,
  createLecture,
  editCourse,
  editLecture,
  getCourseById,
  getCourseLecture,
  getCreatorCourses,
  getPublishedCourse,
  removeCourse,
  removeLecture,
  togglePublishedCourse
} from "../controllers/course.controller.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

// Courses
router.post("/", isAuthenticated, createCourse);
router.get("/creator", isAuthenticated, getCreatorCourses);
router.get("/published", getPublishedCourse); // ✅ Moved above dynamic route
router.get("/:courseId", isAuthenticated, getCourseById);
router.put("/:courseId", isAuthenticated, singleUpload, editCourse);
router.delete("/:courseId", isAuthenticated, removeCourse);
router.patch("/:courseId", isAuthenticated, togglePublishedCourse);

// Lectures
router.post("/:courseId/lecture", isAuthenticated, createLecture);
router.put("/:courseId/lecture/:lectureId", isAuthenticated, editLecture);
router.get("/:courseId/lecture", isAuthenticated, getCourseLecture);
router.delete("/lecture/:lectureId", isAuthenticated, removeLecture);

export default router;




