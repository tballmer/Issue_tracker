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
      "insert into users (name) values ($1) returning *",
      [req.body.name]
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
      "Update users set name = $1 where id = $2 returning *",
      [req.body.name, req.params.id]
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

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
