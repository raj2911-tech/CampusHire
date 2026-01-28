import express from "express";
import {protect} from "../../middlewares/auth/authMiddleware.js";
import { addSkill, getJob, getJobs, getProfile} from "../../controllers/student/studentController.js";


const router = express.Router();


router.get("/profile",protect,getProfile);
router.post("/skills",protect,addSkill);
router.get("/jobs",protect,getJobs);
router.get("/jobs/:id",protect,getJob);










export default router;
