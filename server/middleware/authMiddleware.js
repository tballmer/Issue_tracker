const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const db = require("../db/index");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = await db.query(
        "select id, first_name, last_name, email from users where id = $1",
        [decoded.id]
      );
      // console.log(req.user);
      next();
    } catch (error) {
      console.error(error.message);
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
