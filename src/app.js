import express from "express";
import cors from "cors";
import authRouter from "../routes/auth/authRoutes.js";
import pageRoutes from "../routes/page/pageRoutes.js";
import collegeRoutes from "../routes/college/collegeRoutes.js";

const app = express();

/* -------------------- MIDDLEWARES -------------------- */

// Parse JSON body
app.use(express.json());

// Enable CORS
app.use(cors());
// EJS
app.set("view engine", "ejs");

/* -------------------- HEALTH CHECK -------------------- */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Campus Management API is running"
  });
});

/* -------------------- ROUTES -------------------- */
app.use("/", pageRoutes);
app.use('/api/auth',authRouter);
app.use("/api/colleges", collegeRoutes);



/* -------------------- ERROR HANDLER -------------------- */

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

export default app;
