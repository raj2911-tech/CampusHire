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

export const applyJob = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
  
    try {
      const student = await studentModel.findOne({ userId });
      if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
      }
  
      const job = await jobModel.findById(id);
      if (!job) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }
  
      if (student.blacklistedBy && student.blacklistedBy.length > 0) {
        return res.status(403).json({
          success: false,
          message: "You are blacklisted and cannot apply for jobs"
        });
      }
  
      if (student.academics.cgpa < job.eligibility.minCGPA) {
        return res.status(400).json({
          success: false,
          message: "Your CGPA does not meet the minimum requirement"
        });
      }

      if (student.isPlaced){
        return res.status(400).json({
          success: false,
          message: "Your are already placed and cannot apply for jobs"
        });
      }
  
      const alreadyApplied = await applicationModel.findOne({
        studentId: student._id,
        jobId: job._id
      });
  
      if (alreadyApplied) {
        return res.status(400).json({
          success: false,
          message: "You have already applied for this job"
        });
      }
  
      const application = new applicationModel({
        studentId: student._id,
        jobId: job._id
      });
  
      await application.save();
  
      return res.status(201).json({
        success: true,
        message: "Job applied successfully"
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

export const getApplications = async (req, res) => {
    const userId = req.user.id;
  
    try {
      // 1. Find student
      const student = await studentModel.findOne({ userId });
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found"
        });
      }
  
      // 2. Fetch applications with minimal data
      const applications = await applicationModel
        .find({ studentId: student._id })
        .select("jobId status appliedAt")
        .populate({
          path: "jobId",
          select: "title salary deadline companyId",
          populate: {
            path: "companyId",
            select: "name"
          }
        })
        .sort({ appliedAt: -1 })
        .lean();
  
      // 3. Format response (exact fields only)
      const formattedApplications = applications.map(app => ({
        jobId: app.jobId?._id,
        title: app.jobId?.title,
        companyName: app.jobId?.companyId?.name,
        salary: app.jobId?.salary,
        deadline: app.jobId?.deadline,
        appliedOn: app.appliedAt,
        status: app.status
      }));
  
      // 4. Send response
      return res.status(200).json({
        success: true,
        count: formattedApplications.length,
        applications: formattedApplications
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  
      

