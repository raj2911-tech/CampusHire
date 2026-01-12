import collegeModel from "../../models/colleges.js";
import studentModel from "../../models/students.js";

export const getProfile = async (req, res) => {
  const  id  = req.user.id;
  const email= req.user.email;

  try {
    const profile = await collegeModel.findOne({ userId: id });

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

export const viewStudents = async (req, res) => {
    const userId = req.user.id;
    
    try {
      const college= await collegeModel.findOne({userId});
      
      if(!college){
        return res.status(404).json({
          success: false,
          message: "College not found"
        });
      }
      const collegeId=college._id.toString();
      const students = await studentModel.find({ collegeId },{enrollment_no:1, name:2, blacklistedBy:3});

        res.json({
            success: true,
            count: students.length,
            students
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const blackList = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const college = await collegeModel.findOne({ userId });
    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found"
      });
    }

    const student = await studentModel.findByIdAndUpdate(
      id,
      { $addToSet: { blacklistedBy: college._id } }, 
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
      blacklistedBy: student.blacklistedBy 
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const unBlackList = async (req, res) => {
  const { id } = req.params; // studentId
  const userId = req.user.id;

  try {
    const college = await collegeModel.findOne({ userId });
    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found"
      });
    }

    const student = await studentModel.findByIdAndUpdate(
      id,
      { $pull: { blacklistedBy: college._id } }, 
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
      blacklistedBy: student.blacklistedBy
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getStudent = async (req,res) =>{
  const {id}= req.params;
  try {
    const student= await studentModel.findById(id);
    if(!student){
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }
    res.status(200).json({
      success: true,
      student
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
