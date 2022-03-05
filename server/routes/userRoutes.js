const express = require("express");
const router = express.Router();
const db = require("../db");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserToDeleted,
  deleteUser,
} = require("../controllers/userController");

// Get All Users
router.get("/", getUsers);

// Get a User
router.get("/:id", getUser);

// Create a user
router.post("/", createUser);

// Update a user
router.put("/:id", updateUser);

// Update all foreign key instances of user
// to a foreign key referencing "deleted user" user.
router.put("/:id/delete_user", updateUserToDeleted);

// Delete a user
router.delete("/:id", deleteUser);

module.exports = router;
