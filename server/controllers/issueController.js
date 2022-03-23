const db = require("../db");
const asyncHandler = require("express-async-handler");

// Get all issues
const getIssues = asyncHandler(async (req, res) => {
  const results = await db.query("select * from issues");
  res.status(200).json({
    status: "success",
    results: results.rows.length,
    data: {
      issues: results.rows,
    },
  });
});

// Get an issue
const getIssue = asyncHandler(async (req, res) => {
  const results = await db.query("select * from issues where id = $1", [
    req.params.id,
  ]);
  res.status(200).json({
    status: "success",
    data: {
      issue: results.rows,
    },
  });
});

// Create an issue
const createIssue = asyncHandler(async (req, res) => {
  const results = await db.query(
    "insert into issues (project_id, creator_id, title, description, priority, status) values ($1, $2, $3, $4, $5, $6) returning *",
    [
      req.body.project_id,
      req.body.creator_id,
      req.body.title,
      req.body.description,
      req.body.priority,
      req.body.status,
    ]
  );
  res.status(201).json({
    status: "success",
    data: {
      issue: results.rows[0],
    },
  });
});

// Update an issue
const updateIssue = asyncHandler(async (req, res) => {
  const results = await db.query(
    "Update issues set project_id = $1, creator_id = $2, title = $3, description = $4, priority = $5, status = $6 where id = $7 returning *",
    [
      req.body.project_id,
      req.body.creator_id,
      req.body.title,
      req.body.description,
      req.body.priority,
      req.body.status,
      req.params.id,
    ]
  );
  res.status(200).json({
    status: "success",
    data: {
      issue: results.rows[0],
    },
  });
});

// Delete an Issue
const deleteIssue = asyncHandler(async (req, res) => {
  const results = await db.query("delete from issues where id = $1", [
    req.params.id,
  ]);
  res.status(202).json({
    status: "sucess",
  });
});

module.exports = { getIssue, getIssues, createIssue, updateIssue, deleteIssue };
