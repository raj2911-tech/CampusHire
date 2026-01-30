import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import studentModel from "../models/students.js";
import jobModel from "../models/jobs.js";
import companyModel from "../models/companies.js";
import applicationModel from "../models/applications.js";
import collegeModel from "../models/colleges.js";

export const generatePlacementReport = async (req, res) => {
  try {
    const { year } = req.query;
    const userId = req.user.id;

    const college = await collegeModel.findOne({ userId });
    if (!college) return res.status(404).json({ message: "College not found" });

    const collegeId = new mongoose.Types.ObjectId(college._id);

    // ================= SUMMARY =================

    const totalStudents = await studentModel.countDocuments({
      collegeId,
      "academics.graduationYear": Number(year)
    });

    const placedStudentsCount = await studentModel.countDocuments({
      collegeId,
      "academics.graduationYear": Number(year),
      isPlaced: true
    });

    // Companies visited (unique)
    const companiesVisited = await applicationModel.distinct("companyId", {
      collegeId,
      status: "HIRED"
    });

    // ================= BRANCH WISE STATS =================

    const branchStats = await studentModel.aggregate([
      {
        $match: {
          collegeId,
          "academics.graduationYear": Number(year)
        }
      },
      {
        $group: {
          _id: "$academics.branch",
          total: { $sum: 1 },
          placed: { $sum: { $cond: ["$isPlaced", 1, 0] } }
        }
      }
    ]);

    // ================= PLACED STUDENTS FULL LIST =================

    const placedStudents = await applicationModel.aggregate([
      { $match: { status: "HIRED", collegeId } },

      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: "$student" },

      {
        $lookup: {
          from: "companies",
          localField: "companyId",
          foreignField: "_id",
          as: "company"
        }
      },
      { $unwind: "$company" },

      {
        $project: {
          name: "$student.name",
          enrollment: "$student.enrollment_no",
          branch: "$student.academics.branch",
          company: "$company.name",
          salary: "$offeredSalary"
        }
      }
    ]);

    // ================= PDF GENERATION =================

    const doc = new PDFDocument({ margin: 40 });
    const fileName = `Placement_Report_${college.name}_${year}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    doc.pipe(res);

    // Title
    doc.fontSize(20).text(`${college.name} Placement Report ${year}`, { align: "center" });
    doc.moveDown();

    // Summary Section
    doc.fontSize(14).text("PLACEMENT SUMMARY");
    doc.fontSize(12).text(`Total Students: ${totalStudents}`);
    doc.text(`Placed Students: ${placedStudentsCount}`);
    doc.text(`Unplaced Students: ${totalStudents - placedStudentsCount}`);
    doc.text(`Companies Visited: ${companiesVisited.length}`);
    doc.moveDown();

    // Branch Stats
    doc.fontSize(14).text("BRANCH WISE PLACEMENT");
    branchStats.forEach(b => {
      doc.fontSize(12).text(`${b._id}: ${b.placed}/${b.total} placed`);
    });
    doc.moveDown();

    // Placed Students Table
    doc.fontSize(14).text("PLACED STUDENTS LIST");
    doc.moveDown();

    placedStudents.forEach((s, i) => {
      doc.fontSize(10).text(
        `${i + 1}. ${s.name} | ${s.enrollment} | ${s.branch} | ${s.company} | ₹${s.salary}`
      );
    });

    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
