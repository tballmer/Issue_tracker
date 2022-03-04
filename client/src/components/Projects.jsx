import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Button from "@mui/material/Button";
// import db from "../apis/ProjectFinder";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { ProjectContext } from "../context/ProjectContext";
import { useContext } from "react";

const Projects = () => {
  const { projects } = useContext(ProjectContext);
  let navigate = useNavigate();

  const handleProjectSelect = (id) => {
    navigate(`/user/projects/${id}`);
  };

  return (
    <Paper elevation={3} sx={{ width: "100%" }}>
      <TableContainer>
        <Table sx={{ minWidth: 500 }} aria-label="projects table">
          <TableHead>
            <TableRow>
              <TableCell>Project name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">
                <Button variant="contained" size="small">
                  New project
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { cursor: "pointer" },
                }}
                onClick={() => handleProjectSelect(row.id)}
              >
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell align="left">{row.description}</TableCell>
                <TableCell align="right">
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Projects;
