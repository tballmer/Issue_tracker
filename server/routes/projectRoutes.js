const express = require("express");
const router = express.Router();
const db = require("../db");
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");

// Get all projects to a user
router.get("/", protect, getProjects);

// Get a Project
router.get("/:id", protect, getProject);

// Create a Project
router.post("/", protect, createProject);

// Update a Project
router.put("/:id", protect, updateProject);

// Delete a Project
router.delete("/:id", protect, deleteProject);

module.exports = router;
