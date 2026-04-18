import Attendance from "../models/Attendance.js";

/* Check In */
export const checkIn = async (req, res) => {
  try {
    const { employee_id } = req.body;

    const today = new Date().toDateString();

    const already = await Attendance.findOne({
      employee_id
    });

    if (already && new Date(already.date).toDateString() === today) {
      return res.status(400).json({
        message: "Already Checked In Today"
      });
    }

    const attendance = await Attendance.create({
      employee_id,
      checkin: new Date()
    });

    res.status(201).json({
      message: "Check In Successful",
      attendance
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* Check Out */
export const checkOut = async (req, res) => {
  try {
    const { employee_id } = req.body;

    const record = await Attendance.findOne({
      employee_id
    }).sort({ createdAt: -1 });

    if (!record) {
      return res.status(400).json({
        message: "Please Check In First"
      });
    }

    if (record.checkout) {
      return res.status(400).json({
        message: "Already Checked Out"
      });
    }

    record.checkout = new Date();

    const diff =
      (record.checkout - record.checkin) / (1000 * 60 * 60);

    record.working_hours = diff.toFixed(2);

    await record.save();

    res.status(200).json({
      message: "Check Out Successful",
      record
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* History */
export const getAttendance = async (req, res) => {
  try {
    const data = await Attendance.find();

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};