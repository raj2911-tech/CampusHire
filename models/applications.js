import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",              // reference → students._id
      required: true
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",                  // reference → jobs._id
      required: true
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",                  // reference → colleges._id
      required: true
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",                  // reference → comppanies._id
      required: true
    },

    status: {
      type: String,
      enum: ["APPLIED", "SHORTLISTED", "REJECTED", "HIRED"],
      default: "APPLIED"
    },

    offeredSalary: {
      type:Number,
      required:true
    },

    appliedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false
  }
);

// Prevent same student applying twice to same job
applicationSchema.index(
    { studentId: 1, jobId: 1 },
     { unique: true }
);

const Application = mongoose.model("Application", applicationSchema);
export default Application;
