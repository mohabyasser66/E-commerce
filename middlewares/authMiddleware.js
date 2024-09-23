const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async(req,res,next) => {
    let token;
    if(req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
        try{
            if(token){
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decodedToken.id);
                req.user = user;
                next();
            }
        }
        catch(err){
            throw new Error("authorization token expired, please login again.")
        }
    }else{
        throw new Error("Not Token Attached.")
    }
})


const isAdmin = asyncHandler(async(req,res,next) => {
    const {email} = req.user;
    const admin = await User.findOne({email: email});
    if(admin.role !== "admin"){
        throw new Error("Not authorized, Not Admin");
    }
    else{
        next();
    }
});

module.exports = {authMiddleware, isAdmin};