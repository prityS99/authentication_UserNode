require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
// const RateLimit = require("./app/utils/limiter");

const app = express();

//Fs Link//
const fs = require("fs");

// CORS //
app.use(cors())


//DB Connction//
const DatabaseConnection = require("./app/config/dbcon");

//Database connection //
DatabaseConnection();

app.use(helmet());
// app.use(RateLimit);


//Define JSON//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Static files //
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/uploads", express.static("uploads"));


// AUTH //
const authRoute = require("./app/routes/authApiRoute");
app.use("/app/v1", authRoute);


// BLOG ROUTE //
const blogRoute = require("./app/routes/blogRoutes");
app.use("/app/v1", blogRoute);



const port = 3002;

app.listen(port, () => {
  console.log("server is running on port", port);
});

