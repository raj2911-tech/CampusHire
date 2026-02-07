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
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job"
        }
      },
      { $unwind: "$job" },
      

      {
        $project: {
          name: "$student.name",
          enrollment: "$student.enrollment_no",
          branch: "$student.academics.branch",
          company: "$company.name",
          jobRole: "$job.title",
          salary: "$offeredSalary"
        }
      }
    ]);

    // ================= PDF GENERATION =================

const doc = new PDFDocument({ margin: 50, size: "A4" });
const fileName = `Placement_Report_${college.name}_${year}.pdf`;

res.setHeader("Content-Type", "application/pdf");
res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
doc.pipe(res);

// Helper functions
const drawLine = () => {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .stroke();
  doc.moveDown();
};

const sectionTitle = (title) => {
  doc.moveDown(1);
  doc.fontSize(14).fillColor("#003366").text(title, { bold: true });
  doc.moveDown(0.3);
  drawLine();
  doc.fillColor("black");
};

// ================= HEADER =================

doc
  .fontSize(22)
  .fillColor("#003366")
  .text(college.name, { align: "center" });

doc
  .fontSize(14)
  .fillColor("#555")
  .text(`Placement Report - ${year}`, { align: "center" });

doc.moveDown(1.5);
drawLine();

// ================= SUMMARY =================

sectionTitle("Placement Summary");

doc.fontSize(12);
doc.text(`Total Students: ${totalStudents}`);
doc.text(`Placed Students: ${placedStudentsCount}`);
doc.text(`Unplaced Students: ${totalStudents - placedStudentsCount}`);
doc.text(`Companies Visited: ${companiesVisited.length}`);

doc.moveDown();

// ================= BRANCH WISE =================

sectionTitle("Branch Wise Placement");

branchStats.forEach(b => {
  const percentage = ((b.placed / b.total) * 100).toFixed(1);
  doc
    .fontSize(12)
    .text(
      `${b._id.padEnd(1)} : ${b.placed}/${b.total} placed (${percentage}%)`
    );
});

doc.moveDown();

// ================= PLACED STUDENTS TABLE =================

sectionTitle("Placed Students Details");

// Column config
const tableTop = doc.y;
const rowHeight = 20;

const columns = [
  { label: "No", x: 50, width: 30 },
  { label: "Name", x: 85, width: 110 },
  { label: "Branch", x: 200, width: 50 },
  { label: "Company", x: 255, width: 90 },
  { label: "Role", x: 350, width: 120 },
  { label: "Salary", x: 475, width: 70 }
];

// ===== HEADER =====
doc.rect(50, tableTop, 495, rowHeight).fill("#003366");

doc.fillColor("white").fontSize(11);
columns.forEach(col => {
  doc.text(col.label, col.x, tableTop + 5, { width: col.width, align: "left" });
});

doc.fillColor("black");

let y = tableTop + rowHeight;

// ===== ROWS =====
placedStudents.forEach((s, i) => {
  // Page break
  if (y > 750) {
    doc.addPage();
    y = 50;
  }

  const rowData = [
    String(i + 1),
    s.name,
    s.branch,
    s.company,
    s.jobRole,
    String(s.salary)
  ];

  // Calculate max row height
  let maxHeight = rowHeight;

  rowData.forEach((text, index) => {
    const h = doc.heightOfString(text, {
      width: columns[index].width
    });
    maxHeight = Math.max(maxHeight, h + 8);
  });

  // Draw row borders
  doc.rect(50, y, 495, maxHeight).stroke("#dddddd");

  // Draw cells
  rowData.forEach((text, index) => {
    doc.text(text, columns[index].x, y + 5, {
      width: columns[index].width,
      align: "left"
    });
  });

  y += maxHeight;
});


// ================= FOOTER =================

doc.moveDown(2);
drawLine();

doc
  .fontSize(9)
  .fillColor("#666")
  .text(
    `Generated on ${new Date().toLocaleDateString()} | ${college.name}`,
    { align: "center" }
  );

doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const generateRecruitmentReport = async (req, res) => {
  try {
    const { year } = req.query;   // 👈 year from UI
    const userId = req.user.id;

    const company = await companyModel.findOne({ userId });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const companyId = new mongoose.Types.ObjectId(company._id);

    // ================= SUMMARY COUNTS (YEAR FILTER) =================

    const summary = await applicationModel.aggregate([
      { $match: { companyId } },

      // Join students to filter by graduation year
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: "$student" },

      { $match: { "student.academics.graduationYear": Number(year) } },

      {
        $group: {
          _id: null,
          totalApplied: { $sum: 1 },
          shortlisted: {
            $sum: { $cond: [{ $eq: ["$status", "SHORTLISTED"] }, 1, 0] }
          },
          hired: {
            $sum: { $cond: [{ $eq: ["$status", "HIRED"] }, 1, 0] }
          }
        }
      }
    ]);

    const stats = summary[0] || {
      totalApplied: 0,
      shortlisted: 0,
      hired: 0
    };

    // ================= COLLEGE-WISE =================

    const collegeStats = await applicationModel.aggregate([
      { $match: { companyId } },

      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: "$student" },

      { $match: { "student.academics.graduationYear": Number(year) } },

      {
        $group: {
          _id: "$collegeId",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "colleges",
          localField: "_id",
          foreignField: "_id",
          as: "college"
        }
      },
      { $unwind: "$college" },

      {
        $project: {
          collegeName: "$college.name",
          count: 1
        }
      }
    ]);

    // ================= HIRED STUDENTS LIST =================

    const hiredStudents = await applicationModel.aggregate([
      { $match: { companyId, status: "HIRED" } },

      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: "$student" },

      { $match: { "student.academics.graduationYear": Number(year) } },

      {
        $lookup: {
          from: "colleges",
          localField: "collegeId",
          foreignField: "_id",
          as: "college"
        }
      },
      { $unwind: "$college" },

      {
        $project: {
          name: "$student.name",
          email: "$student.email",
          branch: "$student.academics.branch",
          college: "$college.name"
        }
      }
    ]);

    // ================= PDF =================



const doc = new PDFDocument({ margin: 50, size: "A4" });
const fileName = `Recruitment_Report_${company.name}_${year}.pdf`;

res.setHeader("Content-Type", "application/pdf");
res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
doc.pipe(res);

// ---------- Helpers ----------
const drawLine = () => {
  doc.moveDown(0.3);
  doc.strokeColor("#aaaaaa")
     .lineWidth(1)
     .moveTo(50, doc.y)
     .lineTo(545, doc.y)
     .stroke();
  doc.moveDown();
};

const sectionTitle = (title) => {
  doc.moveDown(1);
  doc.fontSize(14).fillColor("#003366").text(title);
  drawLine();
  doc.fillColor("black");
};

// ---------- Header ----------
doc.fontSize(22).fillColor("#003366").text(company.name, { align: "center" });
doc.fontSize(14).fillColor("#555").text(`Recruitment Report - ${year}`, { align: "center" });

doc.moveDown(1.5);
drawLine();

// ---------- Summary ----------
sectionTitle("Recruitment Summary");

doc.fontSize(12);
doc.text(`Total Applications : ${stats.totalApplied}`);
doc.text(`Shortlisted : ${stats.shortlisted}`);
doc.text(`Hired : ${stats.hired}`);

// ---------- College-wise Table ----------
sectionTitle("College-wise Applications");

const collegeColumns = [
  { label: "No", x: 60, width: 40 },
  { label: "College Name", x: 110, width: 300 },
  { label: "Applications", x: 420, width: 100 }
];

let y = doc.y;
const rowHeight = 22;

// Header
doc.rect(50, y, 495, rowHeight).fill("#003366");
doc.fillColor("white").fontSize(11);

collegeColumns.forEach(col => {
  doc.text(col.label, col.x, y + 6, { width: col.width });
});

doc.fillColor("black");
y += rowHeight;

// Rows
collegeStats.forEach((c, i) => {
  if (y > 750) {
    doc.addPage();
    y = 50;
  }

  doc.rect(50, y, 495, rowHeight).stroke("#dddddd");

  doc.fontSize(11);
  doc.text(i + 1, collegeColumns[0].x, y + 6);
  doc.text(c.collegeName, collegeColumns[1].x, y + 6, { width: collegeColumns[1].width });
  doc.text(c.count, collegeColumns[2].x, y + 6);

  y += rowHeight;
});

// ---------- Hired Students Table ----------
doc.addPage();
sectionTitle("Hired Students Details");

const studentColumns = [
  { label: "No", x: 50, width: 30 },
  { label: "Name", x: 85, width: 120 },
  { label: "College", x: 210, width: 150 },
  { label: "Branch", x: 365, width: 60 },
  { label: "Email", x: 430, width: 110 }
];

y = doc.y;

// Header
doc.rect(50, y, 495, rowHeight).fill("#003366");
doc.fillColor("white").fontSize(11);

studentColumns.forEach(col => {
  doc.text(col.label, col.x, y + 6, { width: col.width });
});

doc.fillColor("black");
y += rowHeight;

// Rows
hiredStudents.forEach((s, i) => {
  if (y > 750) {
    doc.addPage();
    y = 50;
  }

  const rowData = [
    String(i + 1),
    s.name,
    s.college,
    s.branch,
    s.email
  ];

  let maxHeight = rowHeight;

  rowData.forEach((text, idx) => {
    const h = doc.heightOfString(text, {
      width: studentColumns[idx].width
    });
    maxHeight = Math.max(maxHeight, h + 8);
  });

  doc.rect(50, y, 495, maxHeight).stroke("#dddddd");

  rowData.forEach((text, idx) => {
    doc.text(text, studentColumns[idx].x, y + 6, {
      width: studentColumns[idx].width
    });
  });

  y += maxHeight;
});

// ---------- Footer ----------
doc.moveDown(2);
drawLine();
doc.fontSize(9).fillColor("#666")
   .text(`Generated on ${new Date().toLocaleDateString()}`, { align: "center" });

doc.end();


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};