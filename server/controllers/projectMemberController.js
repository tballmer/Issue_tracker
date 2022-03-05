const db = require("../db");

// Get all project members
const getProjectMembers = async (req, res) => {
  try {
    const results = await db.query("select * from project_members");
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        project_members: results.rows,
      },
    });
  } catch (error) {
    console.error(error.message);
  }
};

// Get a Project Member
const getProjectMember = async (req, res) => {
  try {
    const results = await db.query(
      "select * from project_members where id = $1",
      [req.params.id]
    );
    res.status(200).json({
      status: "success",
      data: {
        project_member: results.rows,
      },
    });
  } catch (error) {
    console.error(error.message);
  }
};

// Create a Project Member
const createProjectMember = async (req, res) => {
  try {
    const results = await db.query(
      "insert into project_members (project_id, member_id) values ($1, $2) returning *",
      [req.body.project_id, req.body.member_id]
    );
    res.status(201).json({
      status: "success",
      data: {
        project_member: results.rows[0],
      },
    });
  } catch (error) {
    console.error(error.message);
  }
};

// Update a Project Member
const updateProjectMember = async (req, res) => {
  try {
    const results = await db.query(
      "Update project_members set project_id = $1, member_id = $2 where id = $3 returning *",
      [req.body.project_id, req.body.member_id, req.params.id]
    );
    res.status(200).json({
      status: "success",
      data: {
        project_member: results.rows[0],
      },
    });
  } catch (error) {
    console.error(error.message);
  }
};

// Delete a Project member
const deleteProjectMember = async (req, res) => {
  try {
    const results = await db.query(
      "delete from project_members where id = $1",
      [req.params.id]
    );
    res.status(202).json({
      status: "sucess",
    });
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  getProjectMembers,
  getProjectMember,
  createProjectMember,
  updateProjectMember,
  deleteProjectMember,
};
