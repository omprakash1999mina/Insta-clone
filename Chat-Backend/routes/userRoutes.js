const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const UserController = require('../controllers/userController');

// router.get("/all",[auth],UserController);
router.post("/signup",UserController.registerUser);
router.post("/login", UserController.login);

module.exports = router;