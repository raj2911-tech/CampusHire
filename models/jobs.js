import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",              // reference → companies._id
      required: true
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",              // reference → colleges._id
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    salary: {
      type: Number,
      required: true
    },

    deadline: {
      type: Date,
      required: true
    },

    eligibility: {
      minCGPA: {
        type: Number,
        required: true
      },

      allowedBranches: {
        type: [String],
        required: true
      },

      graduationYear: {
        type: Number,
        required: true
      }
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING"
    }
  },
  {
    timestamps: true
  }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
