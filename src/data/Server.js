import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcrypt"; // Import bcrypt
import jwt from "jsonwebtoken"; // Import jsonwebtoken

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

// Secret key for JWT (should be stored securely, not hardcoded in production)
const jwtSecret = 'your_jwt_secret_key'; // Replace with a strong, random secret

// --- Authentication Endpoints ---

// Register Endpoint
app.post("/register", async (req, res) => {
  const { username, email, password, role, universityId } = req.body;

  // Basic validation
  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate role
  const validRoles = ['student', 'university', 'yok'];
  if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
  }

  // Validate universityId for university role
  if (role === 'university' && (universityId === undefined || universityId === null)) {
       return res.status(400).json({ message: "University ID is required for university role" });
  }

  try {
    // Check if user or email already exists
    const [existingUsers] = await db.promise().query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "Username or Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Insert user into database, including university_ref_id if provided
    const [result] = await db.promise().query(
        'INSERT INTO users (username, email, password, role, university_ref_id) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, role, role === 'university' ? universityId : null] // Use universityId only for university role
    );

    res.status(201).json({ message: "User registered successfully", userId: result.insertId });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login Endpoint
app.post("/login", async (req, res) => {
    const { username, password } = req.body; // Assuming login uses username or email

    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ message: "Username/Email and password are required" });
    }

    try {
        // Find user by username or email
        const [users] = await db.promise().query('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);

        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = users[0];

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            // TODO: Implement account lockout logic (FR-Auth-2)
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // TODO: Implement MFA if required for the role (FR-Auth-2)

        // Generate JWT Token (FR-Auth-4)
        const token = jwt.sign(
            { id: user.id, role: user.role, university_ref_id: user.university_ref_id }, // Include university_ref_id in token payload
            jwtSecret,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        console.log("JWT Payload:", jwt.decode(token)); // <<<< TEMPORARY LOG

        // Successful login - return user info (excluding password hash) and token
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token: token // Send token to frontend
        });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

    if (token == null) { // if there's no token
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            console.error("JWT verification error:", err);
            return res.sendStatus(403); // Forbidden (invalid token)
        }
        req.user = user; // Add user payload to request
        next(); // Proceed to the next middleware/route handler
    });
};

// --- Protected Routes ---

// Profile Endpoint (requires valid JWT)
app.get("/profile", verifyToken, async (req, res) => {
    // req.user is available here due to verifyToken middleware
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        // Fetch user details from database (excluding password)
        const [users] = await db.promise().query('SELECT id, username, email, role FROM users WHERE id = ?', [userId]);

        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = users[0];

        // Depending on the role, you might fetch additional profile data from other tables here
        // For student: maybe fetch student-specific data
        // For university: maybe fetch university-specific data
        // For now, just returning basic user info from the users table

        res.status(200).json({ user: user });

    } catch (error) {
        console.error("Error fetching profile data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// User profile update endpoint (requires authentication)
app.put('/update-profile', verifyToken, async (req, res) => {
  const userId = req.user.id; // User ID from the verified token
  const { username, email, currentPassword, newPassword } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: 'Username and email are required' });
  }

  let sql = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
  let values = [username, email, userId];

  // If new password is provided, validate current password and update password
  if (newPassword) {
    if (!currentPassword) {
      return res.status(400).json({ message: 'Current password is required to set a new password' });
    }

    try {
      // Fetch user to verify current password
      const [users] = await db.promise().query('SELECT password FROM users WHERE id = ?', [userId]);

      if (users.length === 0) {
         return res.status(404).json({ message: 'User not found' });
      }

      const user = users[0];

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect current password' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      sql = 'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?';
      values = [username, email, hashedPassword, userId];

    } catch (error) {
      console.error('Error during password update process:', error);
      return res.status(500).json({ message: 'Server error during password update' });
    }
  }

  try {
    await db.promise().query(sql, values);
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// --- End Protected Routes ---

// Define the root route
app.get("/", (req, res) => {
  res.send("API is running!");
});

// const sqls = [{ query: "SELECT * FROM lisans_enrollment", url: "departments" },]

// Define the /departments route
app.get("/departments", async (req, res) => {
  // Get filter parameters from query string
  const { universityName, departmentName, year, lastRank, lastScore } = req.query;

  let query = "SELECT * FROM lisans_enrollment";
  const conditions = [];
  const values = [];

  // Add filters based on query parameters
  if (universityName) {
    conditions.push("UNIVERSITY_NAME LIKE ?");
    values.push(`%${universityName}%`);
  }
  if (departmentName) {
    conditions.push("DEPARTMENT_NAME LIKE ?");
    values.push(`%${departmentName}%`);
  }
  if (year) {
    conditions.push("YEAR_ID = ?");
    values.push(parseInt(year));
  }
  if (lastRank) {
    conditions.push("LAST_RANK <= ?");
    values.push(parseInt(lastRank));
  }
  if (lastScore) {
    conditions.push("LAST_SCORE >= ?");
    values.push(parseFloat(lastScore));
  }

  // Construct the final query
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  // Add ORDER BY for better readability
  query += " ORDER BY UNIVERSITY_NAME, DEPARTMENT_NAME, YEAR_ID";

  console.log("Executing query:", query, values);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error fetching filtered data from the database:", err);
      res.status(500).json({ error: "Failed to fetch filtered data" });
      return;
    }
    console.log("Query results:", results.length, "rows found");
    res.json(results);
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

app.get("/predict", (req, res) => {
  const query = "SELECT * FROM prediction_2025"; // Replace with your table name
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data from the database:", err);
      res.status(500).json({ error: "Failed to fetch data" });
      return;
    }
    res.json(results); // Send the fetched data to the frontend
  });
});

app.get("/confirm", (req, res) => {
  const query = "SELECT * FROM prediction_2024"; // Replace with your table name
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data from the database:", err);
      res.status(500).json({ error: "Failed to fetch data" });
      return;
    }
    res.json(results); // Send the fetched data to the frontend
  });
});

// New endpoint to get departments for a specific university
app.get('/university-departments', verifyToken, async (req, res) => {
    // verifyToken middleware adds user info to req.user
    // Use university_ref_id from the user object
    const universityId = req.user.university_ref_id; 

    // Check if the logged-in user is actually a university and has a linked university ID
    if (req.user.role !== 'university' || !universityId) {
        // Daha spesifik hata mesajları döndürülebilir
        if (req.user.role !== 'university') {
             return res.status(403).json({ message: 'Access denied. Only universities can view their departments.' });
        } else { // role === 'university' but !universityId
             return res.status(400).json({ message: 'University not linked to a valid ID.' });
        }
    }

    // Assuming lisans_enrollment table has UNIVERSITY_ID column (matching university_ref_id)
    const query = 'SELECT * FROM lisans_enrollment WHERE UNIVERSITY_ID = ?'; 

    try {
        console.log("Fetching departments for UNIVERSITY_ID:", universityId); // Log the ID being used
        const [departments] = await db.promise().query(query, [universityId]);
        console.log("Found", departments.length, "departments for UNIVERSITY_ID:", universityId); // Log results
        res.status(200).json(departments); // Send the departments data
    } catch (error) {
        console.error('Error fetching university departments:', error);
        res.status(500).json({ message: 'Failed to fetch university departments' });
    }
});

// Get unique university names
app.get("/universities-list", (req, res) => {
  const query = "SELECT DISTINCT UNIVERSITY_NAME FROM lisans_enrollment ORDER BY UNIVERSITY_NAME";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching universities:", err);
      res.status(500).json({ error: "Failed to fetch universities" });
      return;
    }
    res.json(results.map(row => row.UNIVERSITY_NAME));
  });
});

// Get unique department names
app.get("/departments-list", (req, res) => {
  const query = "SELECT DISTINCT DEPARTMENT_NAME FROM lisans_enrollment ORDER BY DEPARTMENT_NAME";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching departments:", err);
      res.status(500).json({ error: "Failed to fetch departments" });
      return;
    }
    res.json(results.map(row => row.DEPARTMENT_NAME));
  });
});

// Get University Details by ID Endpoint
app.get("/university-details/:id", verifyToken, async (req, res) => {
    const universityId = req.params.id;

    try {
        // Fetch university details from university table
        const [universities] = await db.promise().query(
            'SELECT UNIVERSITY_NAME, UNIVERSITY_TYPE, UNIVERSITY_CITY, UNIVERSITY_FOUNDATION_YEAR, UNIVERSITY_WEBSITE FROM university WHERE UNIVERSITY_ID = ? LIMIT 1',
            [universityId]
        );

        if (universities.length === 0) {
            return res.status(404).json({ message: "University not found" });
        }

        const university = universities[0];
        
        // Format the response
        const formattedUniversity = {
            name: university.UNIVERSITY_NAME,
            type: university.UNIVERSITY_TYPE,
            city: university.UNIVERSITY_CITY,
            foundationYear: university.UNIVERSITY_FOUNDATION_YEAR,
            website: university.UNIVERSITY_WEBSITE
        };

        res.status(200).json(formattedUniversity);
    } catch (error) {
        console.error("Error fetching university details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// --- Student Predictions ---
// POST /save-prediction: Öğrenci tahminini kaydet
app.post('/save-prediction', verifyToken, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can save predictions.' });
  }
  const studentId = req.user.id;
  const {
    university_name,
    department_name,
    student_rank,
    student_score,
    predicted_first_rank,
    predicted_last_rank,
    score_type
  } = req.body;
  if (!university_name || !department_name || !student_rank) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  try {
    await db.promise().query(
      `INSERT INTO student_predictions (student_id, university_name, department_name, student_rank, student_score, predicted_first_rank, predicted_last_rank, score_type, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [studentId, university_name, department_name, student_rank, student_score, predicted_first_rank, predicted_last_rank, score_type]
    );
    res.status(201).json({ message: 'Prediction saved successfully.' });
  } catch (error) {
    console.error('Error saving prediction:', error);
    res.status(500).json({ message: 'Failed to save prediction.' });
  }
});

// GET /student-predictions: Öğrencinin geçmiş tahminlerini getir
app.get('/student-predictions', verifyToken, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can view their predictions.' });
  }
  const studentId = req.user.id;
  try {
    const [predictions] = await db.promise().query(
      `SELECT * FROM student_predictions WHERE student_id = ? ORDER BY created_at DESC`,
      [studentId]
    );
    res.status(200).json(predictions);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({ message: 'Failed to fetch predictions.' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
