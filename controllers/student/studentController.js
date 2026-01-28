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

export const getJobs = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const student= await studentModel.findOne({userId});
        if(!student){
          return res.status(404).json({ success: false, message: "Student not found" });
        }
  
        const jobs = await jobModel.find({
          collegeId: student.collegeId,
          status: "APPROVED",
          "eligibility.allowedBranches": { $in: [student.academics.branch] }
        })
        .populate("companyId", "name");
        
  
      return res.json({
        success: true,
        count: jobs.length,
        jobs
      });
  
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

export const getJob = async (req, res) => {
    const userId = req.user.id;
    const {id}=req.params;
  
    try {
      const student= await studentModel.findOne({userId});
        if(!student){
          return res.status(404).json({ success: false, message: "Student not found" });
        }
  
      const jobs = await jobModel
        .find({ _id: id, status:"APPROVED"})
        .populate("companyId", "name");
  
      return res.json({
        success: true,
        jobs
      });
  
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

export const applyJob = async (req,res) =>{
  const userId= req.user.id;
  const {id}=req.params;

  try {

    const student= await studentModel.findOne({userId});
    if(!student){
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const job= await jobModel.findOne({_id:id});
    if(!job){
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if(student.blacklistedBy.length>0){
      return res.status(500).json({ success: false, message: "You are blacklisted. you can not apply for job" });
    }

    if(student.academics.cgpa<job.eligibility.minCGPA){
      return res.status(500).json({ success: false, message: "Your CGPA is less than minimum required CGPA" });
    }

    const application=new applicationModel({userId:user._id, name, placementOfficer});
            await college.save();
    
    

    
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    
  }
}