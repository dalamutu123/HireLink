export const registerUser = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  res.status(201).json({
    message: "User registered successfully",
    user: { name, email }
  });
};

export const loginUser = (req, res) => {
  const { email, password } = req.body;

  res.json({
    message: "User logged in",
    email
  });
};