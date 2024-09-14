const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

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


// Get all users
exports.getAllUsers = asyncHandler( async(req,res,next) => {
    try{
        const allUsers = await User.find();
        res.status(200).json(allUsers);
    }
    catch(error){
        throw new Error(error);
    }
})