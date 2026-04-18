import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  department: {
    type: String,
    required: true
  },

  branch: {
    type: String,
    required: true
  },

  designation: {
    type: String,
    required: true
  },

  joining_date: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

  manager_id: {
    type: String
  }
},
{ timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;