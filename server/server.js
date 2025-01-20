const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "chatbot",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Create the messages table if it doesn't exist
const createMessagesTable = `
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL
)`;
db.query(createMessagesTable, (err) => {
  if (err) console.error("Error creating table:", err.message);
});

// API to get all messages
app.get("/api/messages", (req, res) => {
  db.query("SELECT * FROM messages", (err, results) => {
    if (err) {
      console.error("Error retrieving messages:", err.message);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.json(results);
  });
});

// API to send a message
app.post("/api/messages", (req, res) => {
  const { user_message } = req.body;
  const bot_response = `You said: "${user_message}". Here's a bot response!`; // Replace with AI logic

  const query = "INSERT INTO messages (user_message, bot_response) VALUES (?, ?)";
  db.query(query, [user_message, bot_response], (err, result) => {
    if (err) {
      console.error("Error saving message:", err.message);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.json({ id: result.insertId, user_message, bot_response });
  });
});

// API to delete a message
app.delete("/api/messages/:id", (req, res) => {
  const messageId = req.params.id;

  const query = "DELETE FROM messages WHERE id = ?";
  db.query(query, [messageId], (err, result) => {
    if (err) {
      console.error("Error deleting message:", err.message);
      res.status(500).json({ error: "Database error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Message not found" });
      return;
    }
    res.json({ message: "Message deleted successfully" });
  });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
