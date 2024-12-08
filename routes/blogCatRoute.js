const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createCategory, updateCategory, deleteCategory, getCategory, getAll} = require("../controllers/blogCatCtrl");
const router = express.Router();
const test = require("../middlewares/test");


router.post('/create-category', authMiddleware, isAdmin, createCategory);

router.put('/update-category/:id', authMiddleware, isAdmin, updateCategory);

router.delete('/delete-category/:id', authMiddleware, isAdmin, deleteCategory);

router.get('/get-category/:id', authMiddleware, isAdmin, getCategory);

router.get('/get-all', authMiddleware, isAdmin, getAll);

module.exports = router;