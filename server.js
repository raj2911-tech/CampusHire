import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./config/db.js";

dotenv.config();

await connectDB(); //  DB first

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
