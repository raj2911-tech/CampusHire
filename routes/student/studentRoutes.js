import express from "express";
import {protect} from "../../middlewares/auth/authMiddleware.js";
import { addSkill, applyJob, getApplications, getJob, getJobs, getProfile} from "../../controllers/student/studentController.js";


const router = express.Router();


router.get("/profile",protect,getProfile);
router.post("/skills",protect,addSkill);
router.get("/jobs",protect,getJobs);
router.get("/applications",protect,getApplications);
router.get("/jobs/:id",protect,getJob);
router.post("/jobs/:id/apply",protect,applyJob);




export default router;
