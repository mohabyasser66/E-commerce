const express = require("express");
const router = express.Router();
const userController = require("../controllers/userCtrl");


router.post("/register", userController.createUser);

router.post("/login", userController.login);

router.get("/all-users", userController.getAllUsers);

router.get("/:id", userController.getUser);

router.delete("/:id", userController.deleteUser);

router.put("/:id", userController.updateUser);

module.exports = router;