const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserToDeleted,
  deleteUser,
  checkUser,
  loginUser,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// Get All Users
router.get("/", protect, getUsers);

// Check if a User Exists
router.get("/check", protect, checkUser);

// User login
router.get("/login", protect, loginUser);

// Get a User
router.get("/me", protect, getUser);

// Create a user
router.post("/", createUser);

// Update a user
router.put("/:id", protect, updateUser);

// Update all foreign key instances of user
// to a foreign key referencing "deleted user" user.
router.put("/:id/delete_user", protect, updateUserToDeleted);

// Delete a user
router.delete("/:id", protect, deleteUser);

module.exports = router;
