const db = require("../db");
const asyncHandler = require("express-async-handler");

// Get all projects to a user
const getProjects = asyncHandler(async (req, res) => {
  const results = await db.query(
    "select * from projects where creator_id = $1",
    [req.user.rows[0].id]
  );
  res.status(200).json({
    status: "success",
    results: results.rows.length,
    data: {
      projects: results.rows,
    },
  });
});

// Get a Project
const getProject = asyncHandler(async (req, res) => {
  const results = await db.query(
    "select * from projects where id = $1 and creator_id = $2",
    [req.params.id, req.user.rows[0].id]
  );
  if (!results.rows[0]) {
    res.status(404);
    throw new Error("Project not found");
  }
  res.status(200).json({
    status: "success",
    data: {
      project: results.rows,
    },
  });
});

// Create a Project
const createProject = asyncHandler(async (req, res) => {
  const results = await db.query(
    "insert into projects (creator_id, title, description) values ($1, $2, $3) returning *",
    [req.user.rows[0].id, req.body.title, req.body.description]
  );
  res.status(201).json({
    status: "success",
    data: {
      project: results.rows[0],
    },
  });
});

// Update a Project
const updateProject = asyncHandler(async (req, res) => {
  const results = await db.query(
    "Update projects set title = $1, description = $2 where id = $3 and creator_id = $4 returning *",
    [req.body.title, req.body.description, req.params.id, req.user.rows[0].id]
  );
  if (!results.rows[0]) {
    res.status(404);
    throw new Error("Project not found");
  }
  res.status(200).json({
    status: "success",
    data: {
      projects: results.rows[0],
    },
  });
});

// WIP
// Delete a Project
const deleteProject = asyncHandler(async (req, res) => {
  // Query should condition on the current joined project_id matches, not just in general
  const deleteProjectMembers = await db.query(
    "delete from project_members using projects where project_members.project_id = $1 and projects.creator_id = $2",
    [req.params.id, req.user.rows[0].id]
  );
  // Need to implement error handling before reinstating the following functionality

  /*
  // Issue_members are set to delete on cascade so the only query
  // needed to delete them is to issues
  const deleteIssues = await db.query(
    "delete from issues using projects where issues.project_id = $1 and projects.creator_id = $2",
    [req.params.id, req.user.rows[0].id]
  );
  const deleteProject = await db.query(
    "delete from projects where id = $1 and creator_id = $2",
    [req.params.id, req.user.rows[0].id]
  );
  */
  res.status(202).json({
    status: "sucess",
  });
});

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
