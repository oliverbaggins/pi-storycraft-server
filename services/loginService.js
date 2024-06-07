const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { generateToken } = require('../utils/jwtUtils')

async function login(email, password) {
    try {
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            throw new Error('User not found')
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordValid) {
            throw new Error('Incorrect password')
        }

        const token = generateToken(existingUser)
        return token
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = {
    login
}