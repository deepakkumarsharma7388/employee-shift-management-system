import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
{
  employee_id: {
    type: String,
    required: true
  },

  from_date: {
    type: Date,
    required: true
  },

  to_date: {
    type: Date,
    required: true
  },

  reason: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
},
{ timestamps: true }
);

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;