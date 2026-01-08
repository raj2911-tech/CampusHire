import collegeModel from "../../models/colleges.js";

export const getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const profile = await collegeModel.findById(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    return res.json({
      success: true,
      profile
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateProfile = async (req, res) => {
    const { id } = req.params;
    const { name, placementOfficer } = req.body;
  
    try {
      if (!name || !placementOfficer) {
        return res.status(400).json({
          success: false,
          message: "Missing college details"
        });
      }
  
      const result = await collegeModel.updateOne(
        { _id: id },                 // filter
        { $set: { name, placementOfficer } } // update
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "College not found"
        });
      }
  
      return res.json({
        success: true,
        message: "Profile updated successfully"
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  