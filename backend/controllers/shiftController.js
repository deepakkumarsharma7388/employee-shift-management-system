import Shift from "../models/Shift.js";
import Employee from "../models/Employee.js";

/* Create Shift */
export const createShift = async (req, res) => {
  try {
    const { employee_id, shift_date, start_time, end_time, branch } = req.body;

    const employee = await Employee.findById(employee_id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    if (employee.status === "inactive") {
      return res.status(400).json({
        message: "Inactive employee cannot get shift"
      });
    }

    const existingShift = await Shift.findOne({
      employee_id,
      shift_date
    });

    if (existingShift) {
      return res.status(400).json({
        message: "Shift already assigned on this date"
      });
    }

    const shift = await Shift.create(req.body);

    res.status(201).json({
      message: "Shift Created",
      shift
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* Get Shifts */
export const getShifts = async (req, res) => {
  try {
    const shifts = await Shift.find();

    res.status(200).json(shifts);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};