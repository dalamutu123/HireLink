import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log("Starting migration...");
    
    // 1. Drop the existing constraint
    await client.query(`ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_status_check;`);
    console.log("Dropped old constraint.");

    // 2. Add the new constraint with 'interview' included
    await client.query(`ALTER TABLE applications ADD CONSTRAINT applications_status_check CHECK (status IN ('applied', 'interview', 'accepted', 'rejected'));`);
    console.log("Added new constraint.");

    // 3. Add interview_date column if it doesn't exist
    await client.query(`ALTER TABLE applications ADD COLUMN IF NOT EXISTS interview_date TIMESTAMP;`);
    console.log("Added interview_date column.");
    
    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    client.release();
    pool.end();
  }
}

runMigration();
