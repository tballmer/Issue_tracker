const express = require("express");
const router = express.Router();
const db = require("../db");
const {
  getProjectMembers,
  getProjectMember,
  createProjectMember,
  updateProjectMember,
  deleteProjectMember,
} = require("../controllers/projectMemberController");

// Get all project members
router.get("/", getProjectMembers);

// Get a Project Member
router.get("/:id", getProjectMember);

// Create a Project Member
router.post("/", createProjectMember);

// Update a Project Member
router.put("/:id", updateProjectMember);

// Delete a Project member
router.delete("/:id", deleteProjectMember);

module.exports = router;
