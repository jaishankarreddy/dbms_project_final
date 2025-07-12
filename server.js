const express = require("express");
const mysql = require("mysql");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Replace with your MySQL username
  password: "root", // Replace with your MySQL password
  database: "hospitalapp", // Replace with your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Handle form submissions

app.post("/submit-form", (req, res) => {
  console.log("Received data:", req.body);
  const { firstName, lastName, email, address, age, date } = req.body;

  // Ensure the date is in the correct format (YYYY-MM-DD)
  const formattedDate = new Date(date).toISOString().split("T")[0];
  console.log("Formatted date:", formattedDate);

  // SQL query to insert data into the database
  const query =
    "INSERT INTO users (firstName, lastName, email, address, age, date) VALUES (?, ?, ?, ?, ?, ?)";

  // Execute the query with the provided values
  db.query(
    query,
    [firstName, lastName, email, address, age, formattedDate],
    (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        res.status(500).send("Database error");
        return;
      }

      // Send submission_success.html if insertion is successful
      res.sendFile(path.join(__dirname, "public", "submission_success.html"));

      
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
