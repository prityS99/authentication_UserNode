const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserValidation } = require("../utils/joiValidation");
const cloudinary = require("../config/cloudinary");

class AuthApiController {

  // REGISTER //

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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "student",
    });

    const imageUrl = result.secure_url;
    const imagePublicId = result.public_id;

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
  password: hashPassword,
  profileImage: {
    url: imageUrl,
    profileImageId: imagePublicId
  }
});

    const data = await userdata.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

  // LOGIN //

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

      if (user.is_admin === false) {
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
          { expiresIn: "1d" },
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

  //UPDATE PROFILE IMG //

  async updateProfileImage(req, res) {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image file is required",
        });
      }

      if (user.profileImageId) {
        await cloudinary.uploader.destroy(user.profileImageId);
      }

      user.profileImage = req.file.path;
      user.profileImageId = req.file.filename;

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Profile image updated successfully",
        data: user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  // DASHBOARD //

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

  // GET USERS //

  async getUsers(req, res) {
    try {
      const data = await User.find();
      console.log("Usersfetched : ", data.length);

      return res.status(201).json({
        success: true,
        message: "Users List",
        total: data.length,
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // BLOG //
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
