const db = require("../db");
const asyncHandler = require("express-async-handler");

// Get all project members
const getProjectMembers = asyncHandler(async (req, res) => {
  const results = await db.query("select * from project_members");
  res.status(200).json({
    status: "success",
    results: results.rows.length,
    data: {
      project_members: results.rows,
    },
  });
});

// Get all project members of the current project
const getCurrentProjectMembers = asyncHandler(async (req, res) => {
  const results = await db.query(
    "select * from project_members where project_id = $1",
    [req.user.rows[0].id]
  );
  if (!results.rows[0]) {
    res.status(404);
    throw new Error("Project not found");
  }
  res.status(200).json({
    status: "success",
    results: results.rows.length,
    data: {
      project_members: results.rows,
    },
  });
});

// Get a Project Member
const getProjectMember = asyncHandler(async (req, res) => {
  const results = await db.query(
    "select project_members.* from project_members, projects where project_members.project_id = $1 and projects.creator_id = $2",
    [req.params.id, req.user.rows[0].id]
  );
  if (!results.rows[0]) {
    res.status(404);
    throw new Error("Project member not found");
  }
  res.status(200).json({
    status: "success",
    data: {
      project_member: results.rows,
    },
  });
});

// Create a Project Member
const createProjectMember = asyncHandler(async (req, res) => {
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
});

// Add the project creator to a member of their project
const addProjectCreator = asyncHandler(async (req, res) => {
  const results = await db.query(
    "insert into project_members (project_id, member_id) values ($1, $2) returning *",
    [req.body.project_id, req.user.rows[0].id]
  );
  res.status(201).json({
    status: "success",
    data: {
      project_member: results.rows[0],
    },
  });
});

// The usecase of this controller is so rare. It may not appear in production
// Update a Project Member
const updateProjectMember = asyncHandler(async (req, res) => {
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
});

// Delete a Project member
const deleteProjectMember = asyncHandler(async (req, res) => {
  const results = await db.query("delete from project_members where id = $1", [
    req.params.id,
  ]);
  res.status(202).json({
    status: "sucess",
  });
});

module.exports = {
  getProjectMembers,
  getProjectMember,
  createProjectMember,
  addProjectCreator,
  updateProjectMember,
  deleteProjectMember,
};
