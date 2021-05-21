const User = require('../models/users');
const Piggybank = require('../models/piggybank');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken')
const tokenSecret = process.env.JWT_TOKEN_SECRET

createUser = async function (req, res) {
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
                    token: generateToken(newUser)
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
                    else if (match) res.status(200).json({token: generateToken(user)})
                    else res.status(403).json({error: 'Password does not math'})
                })
            }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

generateToken = function (user) {
    return jwt.sign({data: user}, tokenSecret, {expiresIn: '24h'})
}

getAllUsers = async function (req, res) {
    try{
        await User.find().populate('piggybanks')
        .exec()
        .then((users) => {
            res.status(200).json(users)
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

getUserById = async function (req, res) {
    try{
        await User.findOne({ _id: req.params.userId}, async (err, user) => {
            if(!user) res.status(404).json({error: 'No user with that id found'})
            else {
                res.status(200).json(user)
            }   
        }).populate('piggybanks')
        .exec()
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

updateUserById = async function (req, res) {
    try{
        await User.findByIdAndUpdate({ _id: req.params.userId}, req.body, async (err, user) => {
            if(!user) res.status(404).json({error: 'No user with that id found'})
            else {
                res.status(200).json(user)
            }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

deleteUserById = async function (req, res) {
    try{
        await User.findByIdAndRemove({ _id: req.params.userId}, async (err, user) => {
            if(!user) res.status(404).json({error: 'No user with that id found'})
            else {
                const piggybanks = user.piggybanks
                piggybanks.forEach( async (piggybank) => {
                    await Piggybank.findByIdAndRemove({ _id: piggybank._id }, async (err, piggybank) => {
                        if(!piggybank) res.status(404).json({error: 'No piggybank with that id found'})
                    })
                });
                res.status(201).json(user) 
            }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = {
    createUser,
    userLogin,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
}