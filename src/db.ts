import { Pool } from "pg";

const db = new Pool({
  user: "db",
  host: "db.dotconnor.com",
  database: "db",
  password: process.env.DB_PASS,
});

export default db;
