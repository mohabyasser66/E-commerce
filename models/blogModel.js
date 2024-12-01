const mongoose = require('mongoose'); 

var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    numViews:{
        type:Number,
        default:0
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    isDisliked: {
        type: Boolean,
        default: false
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        reference: "User"
    }],
    dislikes:[{
        type: mongoose.Schema.Types.ObjectId,
        reference: "User"
    }],
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2dyYW1taW5nfGVufDB8fDB8fHww"
    },
    author:{
        type: String,
        default: "Admin"
    }
},
{
    toJSON:{
        virtuals: true
    },
    toObject:{
        virtuals: true
    },
    timestamps: true
}
);

module.exports = mongoose.model('Blog', blogSchema);