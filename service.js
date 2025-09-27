const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // replace with your MySQL username
  password: "root",       // replace with your MySQL password
  database: "college_portal"
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database ✅");
  }
});

module.exports = db;
