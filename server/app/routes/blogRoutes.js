const express = require('express')
const BlogController = require('../contoller/blogController')
const authCheck = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router()

router.post("/posts", authCheck, upload.single("coverImage"), BlogController.createPost);

router.get("/posts", BlogController.getAllPosts); 

router.get("/posts/:id", BlogController.getSinglePost); 

router.get("/posts/user/:id", BlogController.getPostsByAuthor); 

router.put("/posts/:id", authCheck, BlogController.updatePost);

router.delete("/posts/:id", authCheck, BlogController.deletePost);

module.exports= router

