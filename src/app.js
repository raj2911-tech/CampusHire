import express from "express";
import cors from "cors";

const app = express();

/* -------------------- MIDDLEWARES -------------------- */

// Parse JSON body
app.use(express.json());

// Enable CORS
app.use(cors());

/* -------------------- HEALTH CHECK -------------------- */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Campus Management API is running"
  });
});

/* -------------------- ROUTES -------------------- */



/* -------------------- ERROR HANDLER -------------------- */

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

export default app;
