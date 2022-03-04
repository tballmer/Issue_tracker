import React from "react";
import { useContext, useEffect } from "react";
import { PageContext } from "../context/PageContext";
import { ProjectContext } from "../context/ProjectContext";
import { useParams } from "react-router-dom";

const Project = () => {
  const { setPage } = useContext(PageContext);
  const { projects } = useContext(ProjectContext);
  const { id } = useParams();

  useEffect(() => {
    let project_name;
    let int_id = parseInt(id, 10);
    for (let i = 0; i < projects.length; i += 1) {
      if (projects[i].id === int_id) {
        project_name = projects[i].title;
      }
    }
    setPage(`${project_name}`);
  });

  return <div>Test</div>;
};

export default Project;
