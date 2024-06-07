const express = require('express')
const cors = require('cors')
const { login } = require('../controllers/loginController')
const { authenticateToken } = require('../utils/jwtUtils');
const User = require('../models/User');

const router = express.Router()

router.use(cors())

router.post('/login', login)

router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (err) {
        res.status(500).send('Server error')
    }
})

module.exports = router