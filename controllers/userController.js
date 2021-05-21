const User = require('../models/users');
const Piggybank = require('../models/piggybank');

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
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    getAllPiggybanksByUserId
}