import express from "express";
import {protect} from "../../middlewares/auth/authMiddleware.js";
import { addSkill, getProfile, updateEmail } from "../../controllers/student/studentController.js";


const router = express.Router();


router.get("/profile",protect,getProfile);
router.post("/skills",protect,addSkill);








export default router;
