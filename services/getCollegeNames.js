import collegeModel from "../models/colleges.js";

export const getRegisteredColleges = async (req, res) => {
  try {
    const colleges = await collegeModel.find({}, { name: 1 });
    // returns: [{ _id, name }]

    return res.json({
      success: true,
      colleges
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
