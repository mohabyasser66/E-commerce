const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const blogCtrl = require("../controllers/blogCtrl");
const test = require("../middlewares/test");

router.post('/create', test, blogCtrl.createBlog);

router.put('/update-blog/:id', authMiddleware, isAdmin, blogCtrl.updateBlog);

router.put('/update-blog/:id', authMiddleware, isAdmin, blogCtrl.updateBlog);

router.get('/get-all', blogCtrl.getAll);

router.delete('/delete-blog/:id', authMiddleware, isAdmin, blogCtrl.deleteBlog);

router.put('/like-blog', authMiddleware, blogCtrl.likeBlog);

router.put('/dislike-blog', authMiddleware, blogCtrl.dislikeBlog);

router.get('/:id', blogCtrl.getBlog);

module.exports = router;