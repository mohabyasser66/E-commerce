const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

exports.createProduct = asyncHandler(async(req,res,next) => {
    if(req.body.title){
        req.body.slug = slugify(req.body.title);
    }
    const product = await Product.create(req.body);
    res.json({newProduct: product});
});


exports.updateProduct = asyncHandler(async (req,res,next) => {
    if(req.body.title){
        req.body.slug = slugify(req.body.title);
    }
    const {id} = req.params;
    const updateProduct = await Product.findOneAndUpdate({_id: id}, req.body, {new: true});
    res.json(updateProduct);
});

exports.deleteProduct = asyncHandler(async (req,res,next) => {
    if(req.body.title){
        req.body.slug = slugify(req.body.title);
    }
    const {id} = req.params;
    const updateProduct = await Product.findOneAndDelete({_id: id});
    res.json(updateProduct);
});


exports.getProduct = asyncHandler(async (req,res,next) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.json(product);
});

exports.getAllProducts = asyncHandler(async (req,res,next) => {
    console.log("hello there");
    const allProducts = await Product.find();
    res.json(allProducts);
});