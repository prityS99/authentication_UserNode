const express = require('express');
const AuthApiController = require('../contoller/authApiController');
const authCheck = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

router.post("/register", upload.single("profileImage"), AuthApiController.register);
router.post('/login', AuthApiController.login);
router.put("/users/update-profile-image", authCheck,upload.single("profileImage"),AuthApiController.updateProfileImage);
router.get('/dashboard', authCheck, AuthApiController.dashboard);
router.get('/blog', AuthApiController.blog);
router.get('/users', AuthApiController.getUsers); 


module.exports = router;

