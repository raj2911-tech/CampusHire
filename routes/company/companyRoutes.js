import express from "express";
import {protect} from "../../middlewares/auth/authMiddleware.js";
import { getRegisteredColleges } from "../../services/getCollegeNames.js";
import { createJob, getJobs, getProfile, updateProfile, deleteJob,editJob ,getJob} from "../../controllers/company/companyController.js";

const router = express.Router();


router.get("/public", getRegisteredColleges); // PUBLIC (no auth needed)
router.get("/profile",protect ,getProfile);
router.post("/profile/update",protect ,updateProfile);
router.post("/job/create",protect,createJob);
router.get("/jobs",protect ,getJobs);
router.get("/jobs/:id",protect, getJob);
router.post("/jobs/:id/delete",protect, deleteJob);
router.post("/jobs/:id/edit",protect, editJob);


export default router;
