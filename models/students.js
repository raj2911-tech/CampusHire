import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",                 // reference → users collection
      required: true,
      unique: true
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",              // reference → colleges collection
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    enrollment_no: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    academics: {
      cgpa: {
        type: Number,
        min: 0,
        max: 10,
        required: true
      },

      branch: {
        type: String,
        required: true
      },

      graduationYear: {
        type: Number,
        required: true
      },

      skills: {
        type: [String],
        default: []
      }
    },

    isPlaced: {
      type: Boolean,
      default: false
    },

    blacklistedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "College"              // array of collegeIds
      }
    ]
  },
  {
    timestamps: true
  }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
