const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const PORT = process.env.PORT || 4000;

const dbConnect = require("./config/dbConnect");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoute");
const blogRoutes = require("./routes/blogRoutes");
const categoryRoutes = require("./routes/prodCategoryRoute");
const blogCategoryRoutes = require("./routes/blogCatRoute");
const brandRoutes = require("./routes/brandRoute");
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const test = require("./middlewares/test");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/category", categoryRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/user", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/blogCategory", blogCategoryRoutes);
app.use("/api/brand", brandRoutes);

app.use(notFound);
app.use(errorHandler);


dbConnect();
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});

