const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createBrand, updateBrand, deleteBrand, getBrand, getAll} = require("../controllers/brandCtrl");
const router = express.Router();
const test = require("../middlewares/test");


router.post('/create-brand', authMiddleware, isAdmin, createBrand);

router.put('/update-brand/:id', authMiddleware, isAdmin, updateBrand);

router.delete('/delete-brand/:id', authMiddleware, isAdmin, deleteBrand);

router.get('/get-brand/:id', authMiddleware, isAdmin, getBrand);

router.get('/get-all', authMiddleware, isAdmin, getAll);

module.exports = router;