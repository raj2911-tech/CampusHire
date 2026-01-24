import express from "express";
import { protect } from "../../middlewares/auth/authMiddleware.js";

const router = express.Router();

// <<<------------------------------------Auth Routes------------------------------------------------>>>

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

// <<<------------------------------------College Routes------------------------------------------------>>>

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

router.get("/college/student/:id", protect, (req, res) => {
  res.render("college/studentDetails");
});
// <<<------------------------------------Company Routes------------------------------------------------>>>

router.get("/company/dashboard", protect, (req, res) => {
  res.render("company/dashboard");
});

router.get("/company/profile", protect, (req, res) => {
  res.render("company/profile");
});

router.get("/company/profile/edit", protect, (req, res) => {
  res.render("company/editProfile");
});
export default router;