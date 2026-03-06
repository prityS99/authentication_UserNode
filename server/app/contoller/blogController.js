const Post = require("../models/blogModel");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");


class BlogController{

// CREATE //

async createPost (req, res) {
  try {
    const { title, content } = req.body;

    if (!title || !content || !req.file) {
      return res.status(400).json({ message: "All fields are required" });
    }
   
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "blog_posts",
    });

    const post = await Post.create({
      title,
      content,
      coverImage: result.secure_url,
      author: req.user.id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET //

async getAllPosts (req, res) {
  try {

    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: posts
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET SINGLE POST //

async getSinglePost (req, res) {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email");

    if (!post) {
      return res.status(404).json({
        status: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      status: true,
      data: post,
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// SINGLE 
async getPostsByAuthor (req, res) {
  try {
    const posts = await Post.find({ author: req.params.id });

    res.json({
      success: true,
      data: posts
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE  //

async updatePost (req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }


    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        status: false,
        message: "You are not allowed to update this post",
      });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    await post.save();

    res.json({
      status: true,
      message: "Post updated successfully",
      data: post,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE //

async deletePost (req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

}


module.exports = new BlogController()