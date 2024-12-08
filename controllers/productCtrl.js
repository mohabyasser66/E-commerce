const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const User = require("../models/userModel");

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


exports.addToWishList = asyncHandler(async(req,res) => {
    const id = req.user._id;
    const {prodId} = req.body;
    let user = await User.findById(id);
    const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyAdded){
        user = await User.findOneAndUpdate(id, {
            $pull: {wishlist: prodId}
        }, {new: true});
        res.json(user);
    } else {
        user = await User.findOneAndUpdate(id, {
            $push: {wishlist: prodId}
        }, {new: true});
        res.json(user);
    }
})


exports.rating = asyncHandler(async(req,res) => {
    const {_id} = req.user;
    const {star, prodId} = req.body;
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find((userId) => userId.postedBy.toString() === _id.toString());
    console.log(alreadyRated);
    if(alreadyRated) {
        await Product.updateOne({
            ratings: {$elemMatch: alreadyRated}
        },{
            $set: {"ratings.$.star": star}
        },
        {new:true}
        );
    } else{
        await Product.findByIdAndUpdate(prodId, {
            $push: {
                ratings:{
                    star: star,
                    postedBy: _id
                }
            }
        }, {new: true});
    }
    const allRatings = await Product.findById(prodId);
    let totalRating = allRatings.ratings.length;
    let ratingSum = allRatings.ratings.map((item) => item.star).reduce((prev, current) => prev + current, 0);
    let actualRating = Math.round(ratingSum / totalRating);
    let finalProduct = await Product.findByIdAndUpdate(prodId, { totalRating: actualRating },{new: true});
    res.json(finalProduct);
})