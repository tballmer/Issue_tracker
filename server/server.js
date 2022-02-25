require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const db = require("./db");
const cors = require("cors");

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Get All Users
app.get("/api/v1/users", async (req, res) => {
  try {
    const results = await db.query("select * from users");
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        users: results.rows,
      },
    });
  } catch (error) {
    console.error(error.message);
  }
});

// Get a User
app.get("/api/v1/users/:id", async (req, res) => {
  try {
    const results = await db.query("select * from users where id = $1", [
      req.params.id,
    ]);
    res.status(200).json({
      status: "success",
      data: {
        user: results.rows,
      },
    });
  } catch (error) {
    console.error(error.message);
  }
});

// Create a user
app.post("/api/v1/users", async (req, res) => {
  try {
    const results = await db.query(
      "insert into users (first_name, last_name, email) values ($1, $2, $3) returning *",
      [req.body.first_name, req.body.last_name, req.body.email]
    );
    res.status(201).json({
      status: "success",
      data: {
        user: results.rows[0],
      },
    });
  } catch (error) {
    console.error(error.message);
  }
});

// Update a user
app.put("/api/v1/users/:id", async (req, res) => {
  try {
    const results = await db.query(
      "Update users set first_name = $1, last_name = $2, email = $3 where id = $4 returning *",
      [req.body.first_name, req.body.last_name, req.body.email, req.params.id]
    );
    res.status(200).json({
      status: "success",
      data: {
        user: results.rows[0],
      },
    });
  } catch (error) {
    console.error(error.message);
  }
});

// Update all foreign key instances of user
// to a foreign key referencing "deleted user" user.
app.put("/api/v1/users/:id/delete_user", async (req, res) => {
  try {
    const updateIssueMemebers = await db.query(
      "update issue_members set employee_id = 6 where employee_id = $1 returning *",
      [req.params.id]
    );
    const updateIssueCreator = await db.query(
      "update issues set creator_id = 6 where creator_id = $1 returning *",
      [req.params.id]
    );
    res.status(200).json({
      status: "success",
      data: {
        issueMember: updateIssueMemebers.rows[0],
        issueCreator: updateIssueCreator.rows[0],
      },
    });
  } catch (error) {
    console.error(error.message);
  }
});

// Delete a user
app.delete("/api/v1/users/:id", async (req, res) => {
  try {
    const deleteProjectMember = await db.query(
      "delete from project_members where member_id = $1",
      [req.params.id]
    );
    const deleteUser = await db.query("delete from users where id = $1", [
      req.params.id,
    ]);
    res.status(202).json({
      status: "sucess",
    });
  } catch (error) {
    console.error(error.message);
  }
});

// Get all projects
app.get("/api/v1/projects", async (req, res) => {
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
});

// Get a Project
app.get("/api/v1/projects/:id", async (req, res) => {
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
});

// Create a Project
app.post("/api/v1/projects", async (req, res) => {
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
});

// Update a Project
app.put("/api/v1/projects/:id", async (req, res) => {
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
});

// Delete a Project
app.delete("/api/v1/projects/:id", async (req, res) => {
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
});

// Get all project members
app.get("/api/v1/project_members", async (req, res) => {
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
});

// Get a Project Member
app.get("/api/v1/project_members/:id", async (req, res) => {
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
});

// Create a Project Member
app.post("/api/v1/project_members", async (req, res) => {
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
});

// Update a Project Member
app.put("/api/v1/project_members/:id", async (req, res) => {
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
});

// Delete a Project
app.delete("/api/v1/project_members/:id", async (req, res) => {
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
});

// Get all issues
app.get("/api/v1/issues", async (req, res) => {
  try {
    const results = await db.query("select * from issues");
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        issues: results.rows,
      },
    });
  } catch (error) {
    console.error(error.message);
  }
});

// Get an issue
app.get("/api/v1/issues/:id", async (req, res) => {
  try {
    const results = await db.query("select * from issues where id = $1", [
      req.params.id,
    ]);
    res.status(200).json({
      status: "success",
      data: {
        issue: results.rows,
      },
    });
  } catch (error) {
    console.error(error.message);
  }
});

// Create an issue
app.post("/api/v1/issues", async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error.message);
  }
});

// Update an issue
app.put("/api/v1/issues/:id", async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error.message);
  }
});

// Delete an Issue
app.delete("/api/v1/issues/:id", async (req, res) => {
  try {
    const results = await db.query("delete from issues where id = $1", [
      req.params.id,
    ]);
    res.status(202).json({
      status: "sucess",
    });
  } catch (error) {
    console.error(error.message);
  }
});

// Get all issue members
app.get("/api/v1/issue_members", async (req, res) => {
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
});

// Get an issue member
app.get("/api/v1/issue_members/:id", async (req, res) => {
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
});

// Create an issue member
app.post("/api/v1/issue_members", async (req, res) => {
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
});

// Update an issue member
app.put("/api/v1/issue_members/:id", async (req, res) => {
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
});

// Delete an issue member
app.delete("/api/v1/issue_members/:id", async (req, res) => {
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

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
