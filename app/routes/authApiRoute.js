const express = require('express');
const AuthApiController = require('../contoller/authApiController');
const authCheck = require('../middleware/authMiddleware');
const Upload = require('../utils/userImageUpload');
const authApiController = require('../contoller/authApiController');

const router = express.Router();

router.post("/register", Upload.single("profileImage"), authApiController.register);
router.post('/login', AuthApiController.login);
router.get('/dashboard', authCheck, AuthApiController.dashboard);
router.get('/blog', AuthApiController.blog);

module.exports = router;


