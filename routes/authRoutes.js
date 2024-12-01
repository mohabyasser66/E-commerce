const express = require("express");
const router = express.Router();
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const userController = require("../controllers/userCtrl");


router.post("/register", userController.createUser);

router.post("/login", userController.login);

router.get("/all-users",authMiddleware, isAdmin, userController.getAllUsers);

router.get("/:id",authMiddleware, isAdmin, userController.getUser);

router.delete("/:id", userController.deleteUser);

router.put("/edit-user", authMiddleware, userController.updateUser);

router.put("/block-user/:id", authMiddleware, isAdmin, userController.blockUser);

router.put("/unblock-user/:id", authMiddleware, isAdmin, userController.unblockUser);

router.get("/refresh", userController.handleRefreshToken);

router.get("/logout", userController.logout);

router.put("/password", authMiddleware, userController.updatePassword);

router.post("/forgot-password-token", userController.forgotPasswordToken);

router.post("/reset-password/:token", userController.resetPassword);


module.exports = router;