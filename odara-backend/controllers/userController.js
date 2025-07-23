
const registerUser = (req, res) => {
  const { name, email, password } = req.body;

  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  
  return res.status(201).json({ message: 'User registered', user: { name, email } });
};

module.exports = { registerUser };
