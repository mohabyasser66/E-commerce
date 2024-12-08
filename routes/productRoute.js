const express = require("express");
const router = express.Router();

const ProductCtrl = require("../controllers/productCtrl");
const {isAdmin, authMiddleware} = require("../middlewares/authMiddleware");

router.post("/create-product", authMiddleware, isAdmin, ProductCtrl.createProduct);

router.get("/get-product/:id", authMiddleware, isAdmin, ProductCtrl.getProduct);

router.get("/get-all", authMiddleware, isAdmin, ProductCtrl.getAllProducts);

router.put("/wishlist", authMiddleware, ProductCtrl.addToWishList);

router.put("/update/:id", authMiddleware, isAdmin, ProductCtrl.updateProduct);

router.delete("/delete/:id", authMiddleware, isAdmin, ProductCtrl.deleteProduct);

router.put("/rating", authMiddleware, isAdmin, ProductCtrl.rating);

module.exports = router;