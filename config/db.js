import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ MongoDB connected");
  }
  
  catch (error) {
    console.error("❌ MongoDB connection failed");
    console.error(error.message);
    process.exit(1); // stop app if DB fails
  }
};

export default connectDB;
