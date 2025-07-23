require('dotenv').config(); 

const app = require("./app");
const authRoutes = require('./routes/authRoutes');

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
