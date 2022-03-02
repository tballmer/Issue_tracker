import axios from "axios";

const db = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

export default db;
