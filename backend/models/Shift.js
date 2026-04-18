import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema(
{
  employee_id: {
    type: String,
    required: true
  },

  shift_date: {
    type: Date,
    required: true
  },

  start_time: {
    type: String,
    required: true
  },

  end_time: {
    type: String,
    required: true
  },

  branch: {
    type: String,
    required: true
  },

  status: {
    type: String,
    default: "assigned"
  }
},
{ timestamps: true }
);

const Shift = mongoose.model("Shift", shiftSchema);

export default Shift;