import companyModel from "../../models/companies.js";
import collegeModel from "../../models/colleges.js";
import jobModel from "../../models/jobs.js";
import applicationModel from "../../models/applications.js";
import studentModel from "../../models/students.js"


export const getProfile = async (req, res) => {
  const id = req.user.id;
  const email = req.user.email;

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
    headquarters,
    website,
    contactPerson,
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
          headquarters,
          website,
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

export const createJob = async (req, res) => {
  const userId = req.user.id;
  const { collegeId, title, description, salary, deadline, eligibility } = req.body;

  if (!collegeId || !title || !description || !salary || !deadline || !eligibility) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  try {
    // Find company
    const company = await companyModel.findOne({ userId });
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    // Validate college
    const college = await collegeModel.findById(collegeId);
    if (!college) {
      return res.status(400).json({ success: false, message: "Invalid college" });
    }

    const job = await jobModel.create({
      companyId: company._id,
      collegeId,
      title,
      description,
      salary: Number(salary),
      deadline: new Date(deadline),
      eligibility,
      status: "PENDING"
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobs = async (req, res) => {
  const userId = req.user.id;

  try {

    const profile = await companyModel.findOne({ userId });


    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    const companyId = profile._id;

    const jobs = await jobModel.find({ companyId }).sort({createdAt: -1 }).exec();

    if (!jobs) {
      return res.status(404).json({
        success: false,
        message: "Jobs not found"
      });
    }

    return res.json({
      success: true,
      count: jobs.length,
      jobs
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }

};

export const getJob = async (req, res) => {
  const {id} = req.params;

  try {

    const job = await jobModel.findOne({ _id:id}).populate("collegeId", "name");


    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    return res.json({
      success: true,
      job
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }

};

export const deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedJob = await jobModel.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const editJob = async (req, res) => {
  const { id } = req.params;
  const { collegeId, title, description, salary, deadline, eligibility } = req.body;
  try {


    if (!collegeId || !title || !description || !salary || !deadline || !eligibility) {
      return res.status(400).json({ success: false, message: "Missing details" });
    }

    const result = await jobModel.updateOne(
      { _id: id }, // filter by logged-in company
      {
        $set: {
          collegeId,
          title,
          description,
          salary,
          deadline,
          eligibility
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job Details updated successfully"
    });


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }


};

export const getJobApplications = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const company = await companyModel.findOne({ userId });
    if (!company) return res.status(404).json({ message: "Company not found" });


    // Ensure job belongs to company
    const job = await jobModel.findOne({ _id: id, companyId: company._id });
 

    if (!job) return res.status(403).json({ message: "Unauthorized job access" });

    const applications = await applicationModel
      .find({ jobId:id })
      .populate("studentId", "name enrollment_no academics.cgpa academics.branch")
      .sort({ appliedAt: -1 });

    res.json({ success: true, applications });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  

  const allowed = ["SHORTLISTED", "REJECTED", "HIRED"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const app = await applicationModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  
  if(status === "HIRED"){
    const student = await studentModel.findByIdAndUpdate(
      app.studentId,
      {isPlaced:true},
      {new: true}
    );
  
    if(!student){
      return res.status(400).json({ message: "Student not found" });
    }
  }
 

  res.json({ success: true, app });
};
