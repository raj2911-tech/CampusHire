import express from "express";
import { getRegisteredColleges } from "../../services/getCollegeNames.js";
import {blackList, getJobs, getProfile, getStudent, jobAction, unBlackList, updateProfile, viewStudents, getJob} from "../../controllers/college/collegeController.js"
import {protect} from "../../middlewares/auth/authMiddleware.js";
import { generatePlacementReport } from "../../services/reportService.js";

const router = express.Router();


router.get("/public", getRegisteredColleges); // PUBLIC (no auth needed)
router.get("/profile",protect ,getProfile);
router.post("/profile/update", protect, updateProfile);
router.get("/students", protect, viewStudents);
router.post("/blacklist/:id",protect,blackList);
router.post("/unblacklist/:id",protect,unBlackList);
router.get("/student/:id", protect, getStudent);
router.get("/jobs", protect, getJobs);
router.get("/jobs/:jobId", protect, getJob);
router.post("/jobs/:id/:status", protect, jobAction);
router.get("/reports/placement/pdf",protect,generatePlacementReport);








export default router;
