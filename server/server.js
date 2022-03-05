require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Users
app.use("/api/v1/users", require("./routes/userRoutes"));

// Projects
app.use("/api/v1/projects", require("./routes/projectRoutes"));

// Project Members
app.use("/api/v1/project_members", require("./routes/projectMemberRoutes"));

// Issues
app.use("/api/v1/issues", require("./routes/issueRoutes"));

// Issue Members
app.use("/api/v1/issue_members", require("./routes/issueMemberRoutes"));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
