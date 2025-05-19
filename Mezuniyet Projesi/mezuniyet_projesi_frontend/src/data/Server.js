import express from "express";
import cors from "cors";
import mysql from "mysql2";

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Replace with your MySQL username
  password: "248669", // Replace with your MySQL password
  database: "finaldatabase", // Replace with your database name
});

// Test Database Connection
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

// Define the root route
app.get("/", (req, res) => {
  res.send("API is running!");
});

// const sqls = [{ query: "SELECT * FROM lisans_enrollment", url: "departments" },]

// Define the /data route
app.get("/departments", (req, res) => {
  const query = "SELECT * FROM lisans_enrollment"; // Replace with your table name
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data from the database:", err);
      res.status(500).json({ error: "Failed to fetch data" });
      return;
    }
    res.json(results); // Send the fetched data to the frontend
  });
});

app.get("/universities", (req, res) => {
  const query = "SELECT * FROM university"; // Replace with your table name
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data from the database:", err);
      res.status(500).json({ error: "Failed to fetch data" });
      return;
    }
    res.json(results); // Send the fetched data to the frontend
  });
});



// app.get(`"/${url}"`, (req, res) => {
//   const query = { query }; // Replace with your table name
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Error fetching data from the database:", err);
//       res.status(500).json({ error: "Failed to fetch data" });
//       return;
//     }
//     res.json(results); // Send the fetched data to the frontend
//   });
// });




// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
