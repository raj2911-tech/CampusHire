import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    placementOfficer: {
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
      },
      mobile: {
        type: String,
        required: true
      }
    }
  },
  {
    timestamps: true
  }
);

const College = mongoose.model("College", collegeSchema);
export default College;
