const db = require("../db");

// Get all issue members
const getIssueMembers = async (req, res) => {
  try {
    const results = await db.query("select * from issue_members");
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        issue_members: results.rows,
      },
    });
  } catch (error) {
    console.error(error.message);
  }
};

// Get an issue member
const getIssueMember = async (req, res) => {
  try {
    const results = await db.query(
      "select * from issue_members where id = $1",
      [req.params.id]
    );
    res.status(200).json({
      status: "success",
      data: {
        issue_member: results.rows,
      },
    });
  } catch (error) {
    console.error(error.message);
  }
};

// Create an issue member
const createIssueMember = async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error.message);
  }
};

// Update an issue member
const updateIssueMember = async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error.message);
  }
};

// Delete an issue member
const deleteIssueMember = async (req, res) => {
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
};

module.exports = {
  getIssueMembers,
  getIssueMember,
  createIssueMember,
  updateIssueMember,
  deleteIssueMember,
};
