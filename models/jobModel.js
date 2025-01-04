import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
    },

    status: {
      type: String,
      enum: ["pending", "reject", "interview"],
      default: "pending",
    },

    workType: {
      type: String,
      enum: ["full-time", "part-time", "contaract", "internship"],
      default: "full-time",
    },

    position: {
      type: String,
      required: [true, "Position is required"],
      maxLength: 100,
    },
    jobLocation: {
      type: String,
      default: "Pune",
      required: [true, "Job location is required"],
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("job", jobSchema);
