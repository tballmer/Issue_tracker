const db = require("../db");
const asyncHandler = require("express-async-handler");

// Get All Users
const getUsers = asyncHandler(async (req, res) => {
  const results = await db.query("select * from users");
  res.status(200).json({
    status: "success",
    results: results.rows.length,
    data: {
      users: results.rows,
    },
  });
});

// Get a User
const getUser = asyncHandler(async (req, res) => {
  const results = await db.query("select * from users where id = $1", [
    req.params.id,
  ]);
  res.status(200).json({
    status: "success",
    data: {
      user: results.rows,
    },
  });
});

// Create a User
const createUser = asyncHandler(async (req, res) => {
  const results = await db.query(
    "insert into users (first_name, last_name, email, hashpass) values ($1, $2, $3, $4) returning *",
    [req.body.first_name, req.body.last_name, req.body.email, req.body.password]
  );

  res.status(201).json({
    status: "success",
    data: {
      user: results.rows[0],
    },
  });
});

// Check if user exists
const checkUser = asyncHandler(async (req, res) => {
  const check = await db.query("select id from users where email = $1", [
    req.body.email,
  ]);

  if (check.rows[0] !== undefined) {
    res.status(400);
    throw new Error("User already exists");
  }

  res.status(200).json({
    status: "User does not exist",
  });
});

// Update a user
const updateUser = asyncHandler(async (req, res) => {
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
});

// This needs to be updated to include projects and project_members
// Update all foreign key instances of user
// to a foreign key referencing "deleted user" user.
const updateUserToDeleted = asyncHandler(async (req, res) => {
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
});

// Delete a User
const deleteUser = asyncHandler(async (req, res) => {
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
});

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserToDeleted,
  deleteUser,
  checkUser,
};
