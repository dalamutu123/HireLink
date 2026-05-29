import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL database"))
  .catch((err) => console.error("Database connection error:", err.message));

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle database client:", err);
});

export default pool;