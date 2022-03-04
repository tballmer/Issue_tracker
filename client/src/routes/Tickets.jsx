import React from "react";
import TicketList from "../components/TicketList";
import { useContext } from "react";
import { PageContext } from "../context/PageContext";
import { useEffect } from "react";
// import { useLocation } from "react-router-dom";

const Tickets = () => {
  const { setPage } = useContext(PageContext);
  //let location = useLocation();

  useEffect(() => {
    setPage("Tickets");
  }, []);

  return <TicketList></TicketList>;
};

export default Tickets;
