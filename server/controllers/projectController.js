const db = require("../db");

// Get all projects
const getProjects = async (req, res) => {
  try {
    const results = await db.query("select * from projects");
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        projects: results.rows,
      },
    });
  } catch (error) {
    console.error(error.message);
  }
};

// Get a Project
const getProject = async (req, res) => {
  try {
    const results = await db.query("select * from projects where id = $1", [
      req.params.id,
    ]);
    res.status(200).json({
      status: "success",
      data: {
        project: results.rows,
      },
    });
  } catch (error) {
    console.error(error.message);
  }
};

// Create a Project
const createProject = async (req, res) => {
  try {
    const results = await db.query(
      "insert into projects (creator_id, title, description) values ($1, $2, $3) returning *",
      [req.body.creator_id, req.body.title, req.body.description]
    );
    res.status(201).json({
      status: "success",
      data: {
        project: results.rows[0],
      },
    });
  } catch (error) {
    console.error(error.message);
  }
};

// Update a Project
const updateProject = async (req, res) => {
  try {
    const results = await db.query(
      "Update projects set title = $1, description = $2 where id = $3 returning *",
      [req.body.title, req.body.description, req.params.id]
    );
    res.status(200).json({
      status: "success",
      data: {
        projects: results.rows[0],
      },
    });
  } catch (error) {
    console.error(error.message);
  }
};

// Delete a Project
const deleteProject = async (req, res) => {
  try {
    const deleteProjectMembers = await db.query(
      "delete from project_members where project_id = $1",
      [req.params.id]
    );
    // Issue_members are set to delete on cascade so the only query
    // needed to delete them is to issues
    const deleteIssues = await db.query(
      "delete from issues where project_id = $1",
      [req.params.id]
    );
    const deleteProject = await db.query("delete from projects where id = $1", [
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
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
