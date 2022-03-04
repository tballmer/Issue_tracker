import React from "react";
import Projects from "../components/Projects";
import { useContext } from "react";
import { PageContext } from "../context/PageContext";
import { useEffect } from "react";

const Dashboard = () => {
  const { setPage } = useContext(PageContext);
  // let location = useLocation();

  useEffect(() => {
    setPage("Dashboard");
  }, []);

  return <Projects></Projects>;
};

export default Dashboard;
