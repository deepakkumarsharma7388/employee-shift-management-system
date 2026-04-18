import Leave from "../models/Leave.js";

/* Apply Leave */
export const applyLeave = async (req, res) => {
  try {
    const leave = await Leave.create(req.body);

    res.status(201).json({
      message: "Leave Applied Successfully",
      leave
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* Get All Leaves */
export const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find();

    res.status(200).json(leaves);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* Approve Leave */
export const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    res.status(200).json({
      message: "Leave Approved",
      leave
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* Reject Leave */
export const rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    res.status(200).json({
      message: "Leave Rejected",
      leave
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};