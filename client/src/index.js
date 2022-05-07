import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Login";
import SignUp from "./routes/SignUp";
//import Dashboard from "./routes/Dashboard";
import Nav from "./components/Nav";
import Tickets from "./routes/Tickets";
// import Projects from "./components/Projects";
import Dashboard from "./routes/Dashboard";
import Project from "./routes/Project";
import { PageContextProvider } from "./context/PageContext";
import { ProjectContextProvider } from "./context/ProjectContext";
import { AuthContextProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <PageContextProvider>
        <ProjectContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="sign-in" element={<Login />} />
              <Route path="sign-up" element={<SignUp />} />
              <Route element={<RequireAuth />}>
                <Route path="user" element={<Nav />}>
                  <Route path="" element={<Dashboard />} />
                  <Route path="tickets" element={<Tickets />} />
                  <Route path="projects/:id" element={<Project />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </ProjectContextProvider>
      </PageContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
