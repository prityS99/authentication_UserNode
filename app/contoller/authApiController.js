const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserValidation } = require("../utils/joiValidation");

class AuthApiController {
  async register(req, res) {
    try {
      
      const { error, value } = UserValidation.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }
      const { name, email, password, about } = value;

      // const { name, email, password, about } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Profile image is required",
        });
      }

      const profileImage = req.file.filename;

      if (!name || !email || !password || !about) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const existUser = await User.findOne({ email });
      if (existUser) {
        return res.status(400).json({
          success: false,
          message: "User already exist",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const userdata = new User({
        name,
        email,
        about,
        profileImage,
        password: hashPassword,
      });

      const data = await userdata.save();

      return res.status(201).json({
        success: true,
        message: "User Register successfully",
        data,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Password does not match" });
      }

      console.log("User found:", user.email, "Role:", user.is_admin);

      if (user.is_admin === "user") {
        if (!process.env.JWT_SECRET_KEY) {
          throw new Error("JWT_SECRET_KEY is missing in .env file");
        }

        const token = jwt.sign(
          {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.is_admin,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1h" },
        );

        return res.status(200).json({
          success: true,
          message: "Login successful",
          token,
        });
      } else {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized role" });
      }
    } catch (error) {
      console.error("Login Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async dashboard(req, res) {
    try {
      return res.status(200).json({
        success: true,
        message: "Welcome to user dashboard",
        data: req.user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async blog(req, res) {
    try {
      return res.status(200).json({
        success: true,
        message: "Welcome to your blog",
        data: req.user,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new AuthApiController();
