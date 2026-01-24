import express from "express";
import {protect} from "../../middlewares/auth/authMiddleware.js";
import { getRegisteredColleges } from "../../services/getCollegeNames.js";
import { createJob, getProfile, updateProfile } from "../../controllers/company/companyController.js";

const router = express.Router();


router.get("/public", getRegisteredColleges); // PUBLIC (no auth needed)
router.get("/profile",protect ,getProfile);
router.post("/profile/update",protect ,updateProfile);
router.post("/job/create",protect,createJob);









export default router;
