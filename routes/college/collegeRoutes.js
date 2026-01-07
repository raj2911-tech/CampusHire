import express from "express";
import { getRegisteredColleges } from "../../controllers/college/collegeController.js";

const router = express.Router();

// PUBLIC (no auth needed)
router.get("/public", getRegisteredColleges);

export default router;
