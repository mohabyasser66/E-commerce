const Category = require("../models/prodCategoryModel");
const asyncHandler = require("express");
const validateMongodbId = require("../utils/validateMongoId");

exports.createCategory = asyncHandler(async(req,res) => {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);
});

exports.updateCategory = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongodbId(id);
    const category = await Category.findByIdAndUpdate(id, req.body, {new: true});
    res.json(category);
})

exports.deleteCategory = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongodbId(id);
    const category = await Category.findByIdAndDelete(id);
    res.json(category);
});

exports.getCategory = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongodbId(id);
    const category = await Category.findById(id);
    res.json(category);
});

exports.getAll = asyncHandler(async(req,res) => {
    const category = await Category.find();
    res.json(category);
});