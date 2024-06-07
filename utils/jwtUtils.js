const jwt = require('jsonwebtoken')
const { secretKey } = require('../configuration/jwtConfig')

function generateToken(user) {
    const payload = {
        id: user._id,
        email: user.email
    }
    return jwt.sign(payload, secretKey, { expiresIn: '1h' })
}

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]
    if (!token) return res.sendStatus(401)

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user
        next()
    });
}

module.exports = {
    generateToken,
    authenticateToken
}