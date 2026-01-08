import express from "express";
import { protect } from "../../middlewares/auth/authMiddleware.js";

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.get("/dashboard",protect, (req, res) => {
  res.render("college/dashboard");
});

export default router;