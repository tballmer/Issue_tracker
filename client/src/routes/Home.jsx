import React from "react";
import { Container, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  let navigate = useNavigate();

  const handleAuth = () => {
    navigate("/sign-in");
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box>
        {" "}
        <Button onClick={() => handleAuth()}>Get Started</Button>
      </Box>
    </Container>
  );
};

export default Home;
