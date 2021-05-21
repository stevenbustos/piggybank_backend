const jwt = require('jsonwebtoken')
const tokenSecret = process.env.JWT_TOKEN_SECRET

generateToken = function (user) {
    return jwt.sign({ data: user }, tokenSecret, { expiresIn: '24h' })
}

module.exports = {
    generateToken
}