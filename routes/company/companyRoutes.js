import express from "express";
import {protect, authorize} from "../../middlewares/auth/authMiddleware.js";
import { getRegisteredColleges } from "../../services/getCollegeNames.js";
import { createJob, getJobs, getProfile, updateProfile, deleteJob,editJob ,getJob, getJobApplications, updateApplicationStatus} from "../../controllers/company/companyController.js";
import { generateRecruitmentReport } from "../../services/reportService.js";

const router = express.Router();


router.get("/public",authorize("COMPANY"), getRegisteredColleges); // PUBLIC (no auth needed)
router.get("/profile",protect,authorize("COMPANY"),getProfile);
router.post("/profile/update",protect ,authorize("COMPANY"),updateProfile);
router.post("/job/create",protect,authorize("COMPANY"),createJob);
router.get("/jobs",protect ,authorize("COMPANY"),getJobs);
router.get("/jobs/:id",protect,authorize("COMPANY"), getJob);
router.post("/jobs/:id/delete",protect,authorize("COMPANY"), deleteJob);
router.post("/jobs/:id/edit",protect,authorize("COMPANY"), editJob);
router.get("/jobs/:id/applications",protect,authorize("COMPANY"), getJobApplications);
router.post("/applications/:id/status",protect,authorize("COMPANY"), updateApplicationStatus);
router.get("/reports/recruitment/pdf",protect ,authorize("COMPANY"),generateRecruitmentReport);




export default router;
