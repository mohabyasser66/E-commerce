const express = require("express");
const router = express.Router();
const userController = require("../controllers/userCtrl");


router.post("/register", userController.createUser);

router.post("/login", userController.login);

router.get("/all-users", userController.getAllUsers);

module.exports = router;