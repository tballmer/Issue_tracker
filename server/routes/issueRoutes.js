const express = require("express");
const router = express.Router();
const db = require("../db");
const {
  getIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
} = require("../controllers/issueController");

// Get all issues
router.get("/", getIssues);

// Get an issue
router.get("/:id", getIssue);

// Create an issue
router.post("/", createIssue);

// Update an issue
router.put("/:id", updateIssue);

// Delete an Issue
router.delete("/:id", deleteIssue);

module.exports = router;
