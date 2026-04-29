export const getUsers = (req, res) => {
  res.json({
    message: "All users",
    users: []
  });
};

export const getUserById = (req, res) => {
  const { id } = req.params;

  res.json({
    message: `User ${id}`,
  });
};