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

// Get Current User
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

// Check if user already exists
const checkUser = asyncHandler(async (req, res) => {
  // console.log(req.headers);
  // console.log(req.body);
  const check = await db.query("select id from users where email = $1", [
    req.body.email,
  ]);

  //console.log(check.rows[0]);
  let doesExist = false;
  let status = "User does not exist";

  if (check.rows[0]) {
    doesExist = true;
    status = "User already exists";
  }

  res.status(200).json({
    status,
    doesExist,
  });
});

// Check if user is available
const checkUserAvailability = asyncHandler(async (req, res) => {
  const check = await db.query("select id from users where email = $1", [
    req.body.email,
  ]);

  if (check.rows[0]) {
    res.status(200).json({
      status: "User exists",
    });
  } else {
    res.status(400);
    throw new Error("User does not exist");
  }
});

// Authenticate a user
const loginUser = asyncHandler(async (req, res) => {
  const user = await db.query("select * from users where email = $1", [
    req.body.email,
  ]);

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
    [
      req.body.first_name,
      req.body.last_name,
      req.body.email,
      req.user.rows[0].id,
    ]
  );
  res.status(200).json({
    status: "success",
    data: {
      user: results.rows[0],
    },
  });
});

// Change Password
const changePassword = asyncHandler(async (req, res) => {
  const hashpass = await bcrypt.hash(req.body.password, 10);
  const results = await db.query(
    "update users set hashpass = $1 where id = $2 returning *",
    [hashpass, req.user.rows[0].id]
  );
  res.status(200).json({
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

// Update all foreign key instances of user
// to a foreign key referencing "deleted user" user.
const updateUserToDeleted = asyncHandler(async (req, res) => {
  const updateIssueMemebers = await db.query(
    "update issue_members set employee_id = $1, where employee_id = $2 returning *",
    [process.env.DELETED_USER_ID, req.user.rows[0].id]
  );
  const updateIssueCreator = await db.query(
    "update issues set creator_id = $1 where creator_id = $2 returning *",
    [process.env.DELETED_USER_ID, req.user.rows[0].id]
  );
  const updateProjectMembers = await db.query(
    "update project_members set member_id = $1 where member_id = $2 returning *",
    [process.env.DELETED_USER_ID, req.user.rows[0].id]
  );
  const updateProjectCreator = await db.query(
    "update projects set creator_id = $1 where creator_id = $2 returning *",
    [process.env.DELETED_USER_ID, req.user.rows[0].id]
  );
  res.status(200).json({
    status: "success",
    // data: {
    //   issueMember: updateIssueMemebers.rows[0],
    //   issueCreator: updateIssueCreator.rows[0],
    //   peoject
    // },
  });
});

// Delete a User
const deleteUser = asyncHandler(async (req, res) => {
  // const deleteProjectMember = await db.query(
  //   "delete from project_members where member_id = $1",
  //   [req.user.rows[0].id]
  // );
  const deleteUser = await db.query("delete from users where id = $1", [
    req.user.rows[0].id,
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
  changePassword,
  updateUserToDeleted,
  deleteUser,
  checkUser,
  loginUser,
  checkUserAvailability,
};
