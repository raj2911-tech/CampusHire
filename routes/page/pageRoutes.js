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

router.get("/college/jobs", protect, (req, res) => {
  res.render("college/jobs");
});

router.get("/college/jobs/:jobId", protect, (req, res) => {
  res.render("college/jobDetails",{ jobId: req.params.jobId });
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

router.get("/company/jobs/create", protect, (req, res) => {
  res.render("company/createJob");
});

router.get("/company/jobs", protect, (req, res) => {
  res.render("company/jobs");
});

router.get("/company/jobs/:id/edit", protect, (req, res) => {
  res.render("company/editJob",{ jobId: req.params.id });
});


router.get("/company/jobs/:id", protect, (req, res) => {
  res.render("company/jobDetails",{ jobId: req.params.id });
});

// <<<------------------------------------Student Routes------------------------------------------------>>>

router.get("/student/dashboard", protect, (req, res) => {
  res.render("student/dashboard");
});

router.get("/student/profile", protect, (req, res) => {
  res.render("student/profile");
});

router.get("/student/jobs", protect, (req, res) => {
  res.render("student/jobs");
});

router.get("/student/jobs/:id", protect, (req, res) => {
  res.render("student/job");
});

router.get("/student/applications", protect, (req, res) => {
  res.render("student/applications");
});

export default router;