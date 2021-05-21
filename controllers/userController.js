const User = require('../models/users');
const Piggybank = require('../models/piggybank');

const AuthService = require('../services/authenticationService');

const bcrypt = require('bcrypt');
const saltRounds = 10;

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
                    else if (match) res.status(200).json({ token: AuthService.generateToken(user)})
                    else res.status(403).json({error: 'Password does not math'})
                })
            }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
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

getAllPiggybanksByUserId = async function (req, res) {
    const ownerId = await req.params.userId
    
    await User.findOne({ _id: ownerId}, async (err, user) => {
        if(!user) res.status(404).json({error: 'No user with that id found'})
        else {
            try{
                const piggybanks = user.piggybanks
                res.status(200).json(piggybanks)
                
            } catch (err) {
                res.status(500).json({ message: err.message })
            }
        }
    }).populate('piggybanks')
    .exec()
}

module.exports = {
    createUser,
    userLogin,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    getAllPiggybanksByUserId
}