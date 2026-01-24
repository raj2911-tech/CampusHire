import companyModel from "../../models/companies.js";


export const getProfile = async (req, res) => {
    const  id  = req.user.id;
    const email= req.user.email;
  
    try {
      const profile = await companyModel.findOne({ userId: id });
  
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Profile not found"
        });
      }
  
      return res.json({
        success: true,
        profile,
        email
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

export const updateProfile = async (req, res) => {
    const id = req.user.id;
    const {
      name,
      about,
      foundedYear,
      industry,
      specialties,
      contactPerson
    } = req.body;
  
    try {
      // required field check (adjust if you already enforce this elsewhere)
      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Missing company details"
        });
      }
  
      const result = await companyModel.updateOne(
        { userId: id }, // filter by logged-in company
        {
          $set: {
            name,
            about,
            foundedYear,
            industry,
            specialties,
            contactPerson
          }
        }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Company not found"
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Company profile updated successfully"
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

