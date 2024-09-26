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
const { notFound, errorHandler } = require('./middlewares/errorHandler');

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/user", authRoutes);
app.use("/api/product", productRoutes);


app.use(notFound);
app.use(errorHandler);


dbConnect();
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});

