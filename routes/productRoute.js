const express = require("express");
const router = express.Router();

const ProductCtrl = require("../controllers/productCtrl");
const {isAdmin, authMiddleware} = require("../middlewares/authMiddleware");

router.post("/create-product", authMiddleware, isAdmin, ProductCtrl.createProduct);

router.get("/:id", authMiddleware, isAdmin, ProductCtrl.getProduct);

router.get("/", authMiddleware, isAdmin, ProductCtrl.getAllProducts);

router.put("/:id", authMiddleware, isAdmin, ProductCtrl.updateProduct);

router.delete("/:id", authMiddleware, isAdmin, ProductCtrl.deleteProduct);


module.exports = router;