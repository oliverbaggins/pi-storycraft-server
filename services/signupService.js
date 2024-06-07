const User = require('../models/User')
const bcrypt = require('bcryptjs')

async function createUser(userData) {
    const { username, email, password } = userData
    const hashedPassword = await bcrypt.hash(password, 10)
    const createdUser = new User({
        username,
        email,
        password: hashedPassword
    })

    const savedUser = await createdUser.save()
    return savedUser
}

module.exports = { createUser }