const Migration = require("./models/Migration");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));

app.get("/", (req, res) => {
  res.send("Migration Tool API Running");
});
// Create Migration
app.post("/migrations/create", async (req, res) => {
  const migration = await Migration.create(req.body);
  res.json(migration);
});

// Get All Migrations
app.get("/migrations", async (req, res) => {
  const migrations = await Migration.find();
  res.json(migrations);
});

// Run Migration (simple logic)
app.post("/migrations/run/:id", async (req, res) => {
  const migration = await Migration.findById(req.params.id);
  migration.status = "completed";
  migration.logs.push("Migration executed successfully");
  await migration.save();
  res.json({ message: "Migration executed", migration });
});

// Rollback Migration
app.post("/migrations/rollback/:id", async (req, res) => {
  const migration = await Migration.findById(req.params.id);
  migration.status = "rolled_back";
  migration.logs.push("Migration rolled back");
  await migration.save();
  res.json({ message: "Migration rolled back", migration });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});