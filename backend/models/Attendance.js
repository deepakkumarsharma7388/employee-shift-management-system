import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
{
  employee_id: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  },

  checkin: {
    type: Date
  },

  checkout: {
    type: Date
  },

  working_hours: {
    type: Number,
    default: 0
  }
},
{ timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;