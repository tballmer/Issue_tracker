const db = require("../db");

// Get All Users
const getUsers = async (req, res) => {
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
};

// Get a User
const getUser = async (req, res) => {
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
};

// Create a User
const createUser = async (req, res) => {
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
};

// Update a user
const updateUser = async (req, res) => {
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
};

// Update all foreign key instances of user
// to a foreign key referencing "deleted user" user.
const updateUserToDeleted = async (req, res) => {
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
};

// Delete a User
const deleteUser = async (req, res) => {
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
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserToDeleted,
  deleteUser,
};
