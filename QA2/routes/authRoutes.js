const express = require('express');
const router = express.Router();

const { register, login, logout } = require('../controllers/authController');
const csrfProtection = require('../middleware/csrfProtection');
router.post('/register', register, csrfProtection);
router.post('/login', login, csrfProtection);
router.get('/logout', logout);

module.exports = router;
