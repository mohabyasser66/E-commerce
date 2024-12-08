const Brand = require("../models/brandModel");
const asyncHandler = require("express");
const validateMongodbId = require("../utils/validateMongoId");

exports.createBrand = asyncHandler(async(req,res) => {
    const newBrand = await Brand.create(req.body);
    res.json(newBrand);
});

exports.updateBrand = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongodbId(id);
    const brand = await Brand.findByIdAndUpdate(id, req.body, {new: true});
    res.json(brand);
})

exports.deleteBrand = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongodbId(id);
    const brand = await Brand.findByIdAndDelete(id);
    res.json(brand);
});

exports.getBrand = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongodbId(id);
    const brand = await Brand.findById(id);
    res.json(brand);
});

exports.getAll = asyncHandler(async(req,res) => {
    const brand = await Brand.find();
    res.json(brand);
});