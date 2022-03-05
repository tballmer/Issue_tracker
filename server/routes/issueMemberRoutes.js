const express = require("express");
const router = express.Router();
const db = require("../db");
const {
  getIssueMembers,
  getIssueMember,
  createIssueMember,
  updateIssueMember,
  deleteIssueMember,
} = require("../controllers/issueMemberController");

// Get all issue members
router.get("/", getIssueMembers);

// Get an issue member
router.get("/:id", getIssueMember);

// Create an issue member
router.post("/", createIssueMember);

// Update an issue member
router.put("/:id", updateIssueMember);

// Delete an issue member
router.delete("/:id", deleteIssueMember);

module.exports = router;
