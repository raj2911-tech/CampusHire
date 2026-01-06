import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",                 // reference → users._id
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    about: {
      type: String,
      required: true
    },

    website: {
      type: String,
      trim: true
    },

    foundedYear: {
      type: Number
    },

    industry: {
      type: String,
      required: true
    },

    specialties: {
      type: [String],
      default: []
    },

    companySize: {
      type: String
    },

    headquarters: {
      type: String
    },

    contactPerson: {
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

const Company = mongoose.model("Company", companySchema);
export default Company;
