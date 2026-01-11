import express from "express";
import { protect } from "../../middlewares/auth/authMiddleware.js";

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.get("/college/dashboard", protect, (req, res) => {
  res.render("college/dashboard");
});

router.get("/college/profile", protect, (req, res) => {
  res.render("college/profile");
});

router.get("/college/students", protect, (req, res) => {
  res.render("college/students");
});

router.get("/college/profile/edit", protect, (req, res) => {
    res.render("college/editProfile");
});

export default router;