const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./service");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
  res.send("College Portal API is running ✅");
});

// Example: Get all students
app.get("/students", (req, res) => {
  db.query("SELECT * FROM student", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Example: Add a student
app.post("/students", (req, res) => {
  const { student_id, name, department_id, year_of_study, email, phone, password } = req.body;
  const sql = "INSERT INTO student VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [student_id, name, department_id, year_of_study, email, phone, password], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Student added successfully ✅" });
  });
});

// Fetch student exam timetable
app.get("/student/:id/timetable", (req, res) => {
  const student_id = req.params.id;

  const sql = `
    SELECT e.exam_id, e.course_id, e.exam_date, e.hall_id
    FROM enrollment en
    JOIN exam e ON en.course_id = e.course_id
    WHERE en.student_id = ?
  `;

  db.query(sql, [student_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Fetch student results
app.get("/student/:id/results", (req, res) => {
  const student_id = req.params.id;

  const sql = "SELECT course_id, grade FROM result WHERE student_id = ?";
  db.query(sql, [student_id], (err, results) => {
    if (err){
      console.error("SQL Error:", err); 
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Student login
app.post("/student_login", (req, res) => {
  const { student_id, password } = req.body;

  const sql = "SELECT * FROM student WHERE student_id = ? AND password = ?";
  db.query(sql, [student_id, password], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "DB error" });

    if (results.length > 0) {
      res.json({ success: true, student_id: student_id });
    } else {
      res.json({ success: false, message: "Invalid Student ID or Password" });
    }
  });
});

// Fetch all courses offered
app.get("/student/:id/courses", (req, res) => {
  const student_id = req.params.id;

  const sql = `
    SELECT c.course_id, c.course_name, c.department_id, f.faculty_name
    FROM enrollment e
    JOIN course c ON e.course_id = c.course_id
    JOIN faculty f ON c.faculty_id = f.faculty_id
    WHERE e.student_id = ?
  `;

  db.query(sql, [student_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Fetch enrollments
app.get("/student/:id/enrollments", (req, res) => {
  const student_id = req.params.id;
  const sql = `
    SELECT e.enrollment_id, c.course_name, e.semester
    FROM enrollment e
    JOIN course c ON e.course_id = c.course_id
    WHERE e.student_id = ?
  `;

  db.query(sql, [student_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Start server LAST
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
