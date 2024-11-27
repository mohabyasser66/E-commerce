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
    try{
        // filtering
        const queryObj = {...req.query};
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let query = Product.find(JSON.parse(queryStr));
        
        
        
        // sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        }else{
            query = query.sort("-createdAt")
        }

        // limiting fields
        if(req.query.fields){
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        }else{
            query = query.select("-__v")
        }

        // pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page-1) * limit;
        query = query.skip(skip).limit(limit);
        if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip >= productCount) throw new Error("this page doesn't exist");
        }
        
        const product = await query;
        res.json(product);
    }
    catch(err){
        throw new Error(err);
    }
});


