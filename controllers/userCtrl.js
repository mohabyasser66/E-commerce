const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoId = require("../utils/validateMongoId");
const {generateRefreshToken} = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const {sendEmail} = require("./mailCtrl");
const crypto = require("node:crypto");


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
        res.cookie("refreshToken", refreshtoken, {
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
    
});


//handle refresh token
exports.handleRefreshToken = asyncHandler(async (req,res,next) => {
    const cookie = req.cookies;
    if(!cookie.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken: refreshToken});
    if(!user) throw new Error("No user has this refresh token");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if(err || user._id.toString() !== decoded.id){
            throw new Error("there is an error with refresh token");
        }
        const accessToken = generateToken(user?._id);
        res.status(200).json({accessToken: accessToken});
    })
    
});


// logout function
exports.logout = asyncHandler(async (req,res,next) => {
    const cookie = req.cookies;
    if(!cookie.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken: refreshToken});
    if(!user){
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        });
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate({refreshToken: refreshToken}, {
        refreshToken: " ",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    });
    res.sendStatus(204);
});


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


exports.updatePassword = asyncHandler(async (req,res) => {
    const {_id} = req.user;
    const {password} = req.body;
    validateMongoId(_id);
    const user = await User.findById(_id);
    if(password){
        user.password = password;
        await user.save();
        res.json("Password Updated Successfully.");
    }
    else{
        res.json("Password didn't update, please provide the new password");
    }
    
})


exports.forgotPasswordToken = asyncHandler(async(req,res) => {
    const {email} = req.body;
    const user = await User.findOne({email: email});
    if(!user) throw new Error("Didn't find user with this email");
    try{
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetUrl = `Hello, Please follow this link to reset your password. this link is valid till 10 minutes from now. <a href='http://localhost:3000/api/user/reset-password/${token}'>Click Here </a>`
        const data = {
            to: email,
            subject: "Forgot Password Link",
            text: "Hello User",
            html: resetUrl
        }
        sendEmail(data);
        res.json(token);
    }
    catch(error){
        throw new Error(error);
    }
})

exports.resetPassword = asyncHandler(async(req,res) => {
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    });
    if(!user) throw new Error("Token Expired, please try again.");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
})