const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express");
const validateMongodbId = require("../utils/validateMongoId");


exports.createBlog = asyncHandler(async (req,res) => {
    const newBlog = await Blog.create(req.body);
    console.log("hellooooooooooooooooo");
    res.json({
        status: "success",
        blog: newBlog
    })
})

exports.updateBlog = asyncHandler(async (req,res) => {
    const {id} = req.params;
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {new: true});
    res.json({
        status: "success",
        blog: updateBlog
    })
})

exports.getBlog = asyncHandler(async (req,res) => {
    const {id} = req.params;
    const Blog = await Blog.findById(id).populate('likes').populate("dislikes");
    await Blog.findByIdAndUpdate(id, {$inc: {numViews: 1}}, {new: true});
    res.json({
        status: "success",
        blog: Blog
    })
})


exports.getAll = asyncHandler(async(req,res) => {
    const blogs = await Blog.find();
    res.json(blogs);
});


exports.deleteBlog = asyncHandler(async (req,res) => {
    const {id} = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    res.json({
        status: "success",
        blog: blog
    })
});



exports.likeBlog = asyncHandler(async(req,res) => {
    const {blogId} = req.body;
    validateMongodbId(blogId);
    const blog = await Blog.findById(blogId);
    const currentUserId = req?.user?._id;
    const isLiked = blog.isLiked;
    const alreadyDisliked = blog.dislikes.find(userId => userId.toString()=== currentUserId.toString());
    if(alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {dislikes: currentUserId},
            isDisliked: false
        },{
            new: true
        });
        res.json(blog);
    }
    else if(isLiked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {likes: currentUserId},
            isLiked: false
        },{
            new: true
        });
        res.json(blog);
    }
    else{
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: {likes: currentUserId},
            isLiked: true
        },{
            new: true
        });
        res.json(blog);
    }
})


exports.dislikeBlog = asyncHandler(async(req,res) => {
    const {blogId} = req.body;
    validateMongodbId(blogId);
    const blog = await Blog.findById(blogId);
    const currentUserId = req?.user?._id;
    const isDisliked = blog.isDisliked;
    const alreadyLiked = blog.likes.find(userId => userId.toString()=== currentUserId.toString());
    if(alreadyLiked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {likes: currentUserId},
            isLiked: false
        },{
            new: true
        });
        res.json(blog);
    }
    else if(isDisliked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {dislikes: currentUserId},
            isDisiked: false
        },{
            new: true
        });
        res.json(blog);
    }
    else{
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: {dislikes: currentUserId},
            isDisliked: true
        },{
            new: true
        });
        res.json(blog);
    }
})