import companyModel from "../../models/companies.js";
import collegeModel from "../../models/colleges.js";
import jobModel from "../../models/jobs.js";
import studentModel from "../../models/students.js"
import applicationModel from "../../models/applications.js"

export const getProfile = async (req, res) =>{
    const userId=req.user.id;

    try {

    const profile = await studentModel.findOne({ userId}).populate("collegeId", "name");

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

export const updateEmail = async (req, res) => {
    const id = req.user.id;
    const { email } = req.body;
  
    try {
      // required field check (adjust if you already enforce this elsewhere)
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Missing company details"
        });
      }
  
      const result = await studentModel.updateOne(
        { userId: id }, // filter by logged-in 
        {
          $set: { email }
        }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Student not found"
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Student email updated successfully"
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

export const addSkill = async (req, res) => {
    const id = req.user.id;
    const {skills} = req.body;   // expecting array
  
    try {
      if (!skills || !Array.isArray(skills)) {
        return res.status(400).json({
          success: false,
          message: "Skills must be an array"
        });
      }
  
      const student = await studentModel.findOneAndUpdate(
        { userId: id },
        { $addToSet: { "academics.skills": { $each: skills } } },
        { new: true }
      );
      
  
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found"
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Skills updated successfully",
        skills: student.skills
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  