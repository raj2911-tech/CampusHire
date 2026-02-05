import express from "express";
import {protect, authorize} from "../../middlewares/auth/authMiddleware.js";
import { addSkill, applyJob, getApplications, getCompanyProfile, getJob, getJobs, getProfile} from "../../controllers/student/studentController.js";
import { studentStats } from "../../services/statistics.js";


const router = express.Router();

router.get("/stats",protect,authorize("STUDENT"),studentStats);
router.get("/profile",protect,authorize("STUDENT"),getProfile);
router.post("/skills",protect,authorize("STUDENT"),addSkill);
router.get("/jobs",protect,authorize("STUDENT"),getJobs);
router.get("/applications",protect,authorize("STUDENT"),getApplications);
router.get("/jobs/:id",protect,authorize("STUDENT"),getJob);
router.post("/jobs/:id/apply",protect,authorize("STUDENT"),applyJob);
router.get("/jobs/:id/profile",protect,authorize("STUDENT"),getCompanyProfile);





export default router;
