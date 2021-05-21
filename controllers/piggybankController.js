const Piggybank = require('../models/piggybank');
const User = require('../models/users');

createPiggybankByUserId = async function (req, res) {
    const ownerId = await req.params.userId
    const piggybank = new Piggybank({
        name: req.body.name,
        balance: req.body.balance
    })

    await User.findOne({ _id: ownerId}, async (err, user) => {
        if(!user) res.status(404).json({error: 'No user with that id found'})
        else {
            user.piggybanks.push(piggybank);
            piggybank.owner = user
            
            await piggybank.save((err, savedPiggybank) => {
                if(err) res.status(400).json({ message: err.message })
                res.status(201).json(savedPiggybank)
            })

            await user.save((err, savedUser) => {
                if(err) res.status(400).json({ message: err.message })
            })
        }
    })
}

getAllPiggybanks = async function (req, res) {
    try{
        await Piggybank.find()
        .then((piggybanks) => {
            res.status(200).json(piggybanks)
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

getPiggybankById = async function (req, res) {
    try{
        await Piggybank.findOne({ _id: req.params.piggybankId}, async (err, piggybank) => {
            if(!piggybank) res.status(404).json({error: 'No piggybank with that id found'})
            else {
                res.status(200).json(piggybank)
            }   
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

updatePiggybankById = async function (req, res) {
    try{
        await Piggybank.findByIdAndUpdate({ _id: req.params.piggybankId}, req.body, async (err, piggybank) => {
            if(!piggybank) res.status(404).json({error: 'No user with that id found'})
            else {
                res.status(200).json(piggybank)
            }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

deletePiggybankById = async function (req, res) {
    await Piggybank.findByIdAndRemove({ _id: req.params.piggybankId }, async (err, piggybank) => {
        if(!piggybank) res.status(404).json({error: 'No piggybank with that id found'})
        else {
            const ownerId = piggybank.owner
            await User.findOne({ _id: ownerId}, async (err, user) => {
                if(!user) res.status(404).json({error: 'No user with that id found'})
                else {
                    try{
                        user.piggybanks.pull({ _id: req.params.piggybankId });
                        res.status(201).json(piggybank)

                        await user.save((err, savedUser) => {
                            if(err) res.status(400).json({ message: err.message })
                        })
                    } catch (err) {
                        res.status(500).json({ message: err.message })
                    }
                }
            })
        }
    })   
}

module.exports = {
    createPiggybankByUserId,
    getAllPiggybanks,
    getAllPiggybanksByUserId,
    getPiggybankById,
    updatePiggybankById,
    deletePiggybankById
}