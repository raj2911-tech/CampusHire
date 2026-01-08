import express from "express";
import { getRegisteredColleges } from "../../services/getCollegeNames.js";
import {getProfile, updateProfile, viewStudents} from "../../controllers/college/collegeController.js"
import {protect} from "../../middlewares/auth/authMiddleware.js";

const router = express.Router();


router.get("/public", getRegisteredColleges); // PUBLIC (no auth needed)
router.get("/profile",protect ,getProfile);
router.post("/profile/update", protect, updateProfile);
router.get("/students", protect, viewStudents);





export default router;
