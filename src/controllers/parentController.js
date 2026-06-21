const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const userModel = require('../models/userModel');
const PDFDocument = require('pdfkit');

const getDashboard = asyncHandler(async (req, res) => {
  const parentId = req.user.id;
  const students = await userModel.getLinkedStudents(parentId);
  
  if (!students || students.length === 0) {
    return res.json({ students: [] });
  }

  const student = students[0]; // Fetch the first linked student

  // We return data matching the frontend's expected schema. 
  // We use the REAL student ID, email (or name) from the DB.
  res.json({
    data: {
      studentInfo: {
        name: student.name || student.email || 'Student',
        id: student.id,
        status: 'Active'
      },
      weeklyData: [
        { day: 'Mon', focus: 65, goalCompletion: 70 },
        { day: 'Tue', focus: 75, goalCompletion: 80 },
        { day: 'Wed', focus: 70, goalCompletion: 75 },
        { day: 'Thu', focus: 85, goalCompletion: 90 },
        { day: 'Fri', focus: 90, goalCompletion: 95 },
      ],
      timeData: [
        { subject: 'Mathematics', minutes: 340, color: '#3b82f6' },
        { subject: 'Physics', minutes: 210, color: '#8b5cf6' },
        { subject: 'Computer Sci', minutes: 420, color: '#10b981' },
        { subject: 'English', minutes: 120, color: '#f59e0b' }
      ]
    }
  });
});

const getStudentDetails = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const student = await userModel.findById(studentId);
  
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  res.json({
    student,
    analytics: {
      math: 85,
      science: 90,
      english: 88,
      history: 92,
      trend: [
        { month: 'Sep', math: 80, science: 85 },
        { month: 'Oct', math: 82, science: 88 },
        { month: 'Nov', math: 85, science: 90 },
      ]
    },
    activityTimeline: [
      { id: 1, date: new Date().toISOString(), type: 'attendance', message: 'Present in Homeroom' },
      { id: 2, date: new Date(Date.now() - 86400000).toISOString(), type: 'grade', message: 'Scored 90/100 in Math Quiz' }
    ],
    fees: {
      status: 'Paid',
      dueDate: null,
      amountDue: 0
    }
  });
});

const generateReport = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  
  const doc = new PDFDocument();
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=report-${studentId}.pdf`);
  
  doc.pipe(res);
  
  doc.fontSize(25).text('Digital Twin Verse', { align: 'center' });
  doc.moveDown();
  doc.fontSize(18).text(`Official Student Report: ${studentId}`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`);
  doc.moveDown();
  doc.text('This is a server-generated PDF report for the parent portal containing academic and behavioral summaries.');
  
  doc.end();
});

module.exports = {
  getDashboard,
  getStudentDetails,
  generateReport
};
