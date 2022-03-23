const db = require("../db");
const asyncHandler = require("express-async-handler");

// Get all issue members
const getIssueMembers = asyncHandler(async (req, res) => {
  const results = await db.query("select * from issue_members");
  res.status(200).json({
    status: "success",
    results: results.rows.length,
    data: {
      issue_members: results.rows,
    },
  });
});

// Get an issue member
const getIssueMember = asyncHandler(async (req, res) => {
  const results = await db.query("select * from issue_members where id = $1", [
    req.params.id,
  ]);
  res.status(200).json({
    status: "success",
    data: {
      issue_member: results.rows,
    },
  });
});

// Create an issue member
const createIssueMember = asyncHandler(async (req, res) => {
  const results = await db.query(
    "insert into issue_members (issue_id, employee_id) values ($1, $2) returning *",
    [req.body.issue_id, req.body.employee_id]
  );
  res.status(201).json({
    status: "success",
    data: {
      issue_member: results.rows[0],
    },
  });
});

// Update an issue member
const updateIssueMember = asyncHandler(async (req, res) => {
  const results = await db.query(
    "Update issue_members set issue_id = $1, employee_id = $2 where id = $3 returning *",
    [req.body.issue_id, req.body.employee_id, req.params.id]
  );
  res.status(200).json({
    status: "success",
    data: {
      issue_member: results.rows[0],
    },
  });
});

// Delete an issue member
const deleteIssueMember = asyncHandler(async (req, res) => {
  try {
    const results = await db.query("delete from issue_members where id = $1", [
      req.params.id,
    ]);
    res.status(202).json({
      status: "sucess",
    });
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = {
  getIssueMembers,
  getIssueMember,
  createIssueMember,
  updateIssueMember,
  deleteIssueMember,
};
