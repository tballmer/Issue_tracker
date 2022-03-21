const db = require("../db");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    req.user.rows[0].id,
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
  const hashpass = await bcrypt.hash(req.body.password, 10);

  const results = await db.query(
    "insert into users (first_name, last_name, email, hashpass) values ($1, $2, $3, $4) returning *",
    [req.body.first_name, req.body.last_name, req.body.email, hashpass]
  );

  res.status(201).json({
    status: "success",
    data: {
      user: [
        results.rows[0].id,
        results.rows[0].first_name,
        results.rows[0].last_name,
        results.rows[0].email,
        generateToken(results.rows[0].id),
      ],
    },
  });
});

// Check if user exists
const checkUser = asyncHandler(async (req, res) => {
  const check = await db.query("select id from users where email = $1", [
    req.body.email,
  ]);

  if (check.rows[0]) {
    res.status(400);
    throw new Error("User already exists");
  }

  res.status(200).json({
    status: "User does not exist",
  });
});

// Authenticate a user
const loginUser = asyncHandler(async (req, res) => {
  const user = await db.query("select * from users where email = $1", [
    req.body.email,
  ]);
  // console.log(user.rows[0]);

  if (
    user.rows[0] &&
    (await bcrypt.compare(req.body.password, user.rows[0].hashpass))
  ) {
    res.json({
      status: "success",
      data: {
        user: [
          user.rows[0].id,
          user.rows[0].first_name,
          user.rows[0].last_name,
          user.rows[0].email,
          generateToken(user.rows[0].id),
        ],
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
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

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserToDeleted,
  deleteUser,
  checkUser,
  loginUser,
};
