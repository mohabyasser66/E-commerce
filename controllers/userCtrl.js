const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoId = require("../utils/validateMongoId");
const {generateRefreshToken} = require("../config/refreshtoken");

// create a user function
exports.createUser = asyncHandler( async (req,res,next) => {
    const email = req.body.email;
    const user = await User.findOne({email: email});
    if(!user){
        const newUser = await User.create(req.body);
        res.json(newUser);
    }
    else{
        throw new Error("User Already Exist.");
    }
});

// login function
exports.login = asyncHandler( async (req,res,next) => {
    const {email,password} = req.body;
    const user = await User.findOne({ email: email});
    if(user && (await user.isPasswordMatched(password))){
        const refreshtoken = await generateRefreshToken(user?._id);
        const updateUser = await User.findByIdAndUpdate(user._id, {
            refreshToken: refreshtoken
        },
        {
            new: true
        })
        res.cookie("refreshtoken", refreshtoken, {
            httpOnly: true,
            maxAge: 72*60*60*1000
        })
        res.status(200).json({
            _id: user?._id,
            firstname: user?.firstname,
            lastname: user?.lastname,
            email: user?.email,
            mobile: user?.mobile,
            token: generateToken(user?._id)
        });
    }
    else{
        throw new Error("Invalid Credentials.");
    }
    
})


// fetch all users
exports.getAllUsers = asyncHandler( async(req,res,next) => {
    try{
        const allUsers = await User.find();
        res.status(200).json(allUsers);
    }
    catch(error){
        throw new Error(error);
    }
})


// fetch a single user
exports.getUser = asyncHandler( async(req,res,next) => {
    const {id} = req.params;
    validateMongoId(id);
    try{
        const user = await User.findById(id);
        res.status(200).json(user);
    }catch(err){
        throw new Error(err);
    }
})


// delete a user
exports.deleteUser = asyncHandler( async(req,res,next) => {
    const {id} = req.params;
    validateMongoId(id);
    try{
        const user = await User.findByIdAndDelete(id);
        res.status(200).json(user);
    }catch(err){
        throw new Error(err);
    }
})


// update a user
exports.updateUser = asyncHandler(async (req,res,next) => {
    const {_id} = req.user;
    validateMongoId(_id);
    try{
        const user = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        },
        {
            new: true
        });
        res.status(200).json(user);
    }catch(err){
        throw new Error(err);
    }
})


exports.blockUser = asyncHandler(async (req,res,next) => {
    const id = req.params.id;
    validateMongoId(id);
    try{
        const blockedUser = await User.findByIdAndUpdate(id, {
            isBlocked: true
        },
        {
            new: true
        }
        );
        res.json({message: "user blocked."});
    }
    catch(err){
        throw new Error(err);
    }
});


exports.unblockUser = asyncHandler(async (req,res,next) => {
    const id = req.params.id;
    validateMongoId(id);
    try{
        const unBlockedUser = await User.findByIdAndUpdate(id, {
            isBlocked: false
        },
        {
            new: true
        }
        );
        res.json({message: "user unblocked."});
    }
    catch(err){
        throw new Error(err);
    }
});