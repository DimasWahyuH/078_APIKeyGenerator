// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');

// Login (Publik)
router.post('/login', adminController.login);

// Dashboard Data (Perlu Login/Token)
router.get('/dashboard', verifyToken, adminController.getDashboardData);

// Update Key (Perlu Login/Token) - Menggunakan method PUT
router.put('/key/:id', verifyToken, adminController.updateApiKey);

module.exports = router;