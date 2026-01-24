export const updateProfile = async (req, res) => {
    const  id  = req.user.id;
    const { name, placementOfficer } = req.body;

 
  
    try {
      if (!name || !placementOfficer) {
        return res.status(400).json({
          success: false,
          message: "Missing college details"
        });
      }
  
      const result = await collegeModel.updateOne(
        { userId: id },                 // filter
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