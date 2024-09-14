const mongoose = require('mongoose');

const dbConnect = () => {
    try{
        const conn = mongoose.connect(process.env.MONGO_URL);
        console.log("database connected");
    }
    catch(err){
        console.log("Database error");
    }
}

module.exports = dbConnect;