import express from "express";
import { getRegisteredColleges } from "../../services/getCollegeNames.js";
import {blackList, getJobs, getProfile, getStudent, jobAction, unBlackList, updateProfile, viewStudents, getJob} from "../../controllers/college/collegeController.js"
import {protect,authorize} from "../../middlewares/auth/authMiddleware.js";
import { generatePlacementReport } from "../../services/reportService.js";
import { collegeStats } from "../../services/statistics.js";

const router = express.Router();


router.get("/public", getRegisteredColleges); // PUBLIC (no auth needed)
router.get("/stats",protect,authorize("COLLEGE"), collegeStats);
router.get("/profile",protect,authorize("COLLEGE") ,getProfile);
router.post("/profile/update", protect,authorize("COLLEGE"), updateProfile);
router.get("/students", protect, authorize("COLLEGE"),viewStudents);
router.post("/blacklist/:id",protect,authorize("COLLEGE"),blackList);
router.post("/unblacklist/:id",protect,authorize("COLLEGE"),unBlackList);
router.get("/student/:id", protect,authorize("COLLEGE"), getStudent);
router.get("/jobs", protect, authorize("COLLEGE"),getJobs);
router.get("/jobs/:jobId", protect, authorize("COLLEGE"),getJob);
router.post("/jobs/:id/:status", protect, authorize("COLLEGE"),jobAction);
router.get("/reports/placement/pdf",protect,authorize("COLLEGE"),generatePlacementReport);








export default router;
