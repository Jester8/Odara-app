const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/test", (req, res) => {
  res.json({ message: "Test route hit!" });
});


module.exports = router;
