const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

require("dotenv").config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get('/', (req, res) => {
  res.send('Odara backend API running');
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));


module.exports = app;
