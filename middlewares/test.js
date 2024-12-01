const test = (req,res,next) => {
    console.log("this is a test middleware");
    next();
}

module.exports = test;