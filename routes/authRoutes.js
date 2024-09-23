const express = require("express");
const router = express.Router();
const userController = require("../controllers/userCtrl");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");


router.post("/register", userController.createUser);

router.post("/login", userController.login);

router.get("/all-users",authMiddleware, isAdmin, userController.getAllUsers);

router.get("/:id",authMiddleware, isAdmin, userController.getUser);

router.delete("/:id", userController.deleteUser);

router.put("/edit-user", authMiddleware, userController.updateUser);

router.put("/block-user/:id", authMiddleware, isAdmin, userController.blockUser);

router.put("/unblock-user/:id", authMiddleware, isAdmin, userController.unblockUser);

module.exports = router;