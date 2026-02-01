import studentModel from "../models/students.js";
import jobModel from "../models/jobs.js";
import companyModel from "../models/companies.js";
import applicationModel from "../models/applications.js";
import collegeModel from "../models/colleges.js";

export const collegeStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const college = await collegeModel.findOne({ userId });
        if (!college) {
            return res.status(400).json({ success: false, message: "College not found" });
        }

        const students = await studentModel.countDocuments({ collegeId: college._id });
        const placedStudents = await studentModel.countDocuments({
            collegeId: college._id,
            isPlaced: true
        });

        return res.status(200).json({
            success: true,
            students,
            placedStudents
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const companyStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const company = await companyModel.findOne({ userId });
        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        const applications = await applicationModel.countDocuments({ companyId: company._id });
        const shortlistedStudents = await applicationModel.countDocuments({
            companyId: company._id,
            status: "SHORTLISTED"
        });

        return res.status(200).json({
            success: true,
            applications,
            shortlistedStudents
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const studentStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const student = await studentModel.findOne({ userId });
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const jobs = await jobModel.countDocuments({ collegeId: student.collegeId ,status:"APPROVED"});
        const myApplications = await applicationModel.countDocuments({ studentId: student._id });
        const pendingApplications = await applicationModel.countDocuments({
            studentId: student._id,
            status: "APPLIED"
        });
        const shortlistedApplications = await applicationModel.countDocuments({
            studentId: student._id,
            status: "SHORTLISTED"
        });

        return res.status(200).json({
            success: true,
            jobs,
            myApplications,
            pendingApplications,
            shortlistedApplications
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
