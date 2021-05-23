const User = require('../models/users');
const AuthService = require('../services/authenticationService');

const bcrypt = require('bcrypt');
const saltRounds = 10;

userSignup = async function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
        if (err) res.status(500).json(err)
        else {
            const user = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: hash,
            })
            try{  
                const newUser = await user.save()
                res.status(201).json({
                    user: newUser,
                    token: AuthService.generateToken(newUser)
                })
            } catch (err) {
                res.status(400).json({ message: err.message })
            }
        }
    })
}

userLogin = async function (req, res){
    try{
        await User.findOne({ email: req.body.email})
        .then(user => {
            if(!user) res.status(404).json({error: 'No user with that email found'})
            else {
                bcrypt.compare(req.body.password, user.password, (error, match) => {
                    if (error) res.status(500).json(error)
                    else if (match) res.status(200).json({ user:user, token: AuthService.generateToken(user)})
                    else res.status(403).json({error: 'Password does not math'})
                })
            }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = {
    userSignup,
    userLogin
}