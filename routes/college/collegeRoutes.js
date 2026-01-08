import express from "express";
import { getRegisteredColleges } from "../../services/getCollegeNames.js";
import {getProfile, updateProfile} from "../../controllers/college/collegeController.js"

const router = express.Router();


router.get("/public", getRegisteredColleges); // PUBLIC (no auth needed)
router.get("/profile/:id", getProfile);
router.post("/profile/update/:id", updateProfile);





export default router;
