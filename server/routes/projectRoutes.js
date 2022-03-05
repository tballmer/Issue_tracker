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

// Get all projects
router.get("/", getProjects);

// Get a Project
router.get("/:id", getProject);

// Create a Project
router.post("/", createProject);

// Update a Project
router.put("/:id", updateProject);

// Delete a Project
router.delete("/:id", deleteProject);

module.exports = router;
