CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) CHECK (role IN ('jobseeker', 'employer', 'admin')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobseeker_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  skills TEXT,
  experience VARCHAR(100),
  resume_url TEXT,
  location VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employer_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(150),
  company_description TEXT,
  industry VARCHAR(100),
  website VARCHAR(255),
  location VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);