const jwt = require('jsonwebtoken')
const tokenSecret = process.env.JWT_TOKEN_SECRET

exports.verify = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(authHeader) {
        const token = req.headers.authorization
        if (!token) res.status(403).json({error: "please provide a token"})
        else {
            jwt.verify(token.split(" ")[1], tokenSecret, (err, value) => {
                if (err) res.status(500).json({error: 'failed to authenticate token'})
                req.user = value
                next()
            })
        }
    } else {
        res.status(401).json({error: "There is no header"})
    }
}