// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Endpoint publik untuk menyimpan data user dari form
router.post('/register', userController.registerUser);

module.exports = router;