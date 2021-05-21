const Piggybank = require('../models/piggybank');
const User = require('../models/users');

piggybankCreate = async function (req, res) {
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

piggybankRead = async function (req, res) {
    try{
        const piggybanks = await Piggybank.find()
        res.json(piggybanks)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

deletePiggybankById = async function (req, res) {
    const ownerId = await req.params.userId

    await User.findOne({ _id: ownerId}, async (err, user) => {
        if(!user) res.status(404).json({error: 'No user with that id found'})
        else {
            try{
                user.piggybanks.pull({ _id: req.params.piggybankId });
                
                await Piggybank.findByIdAndRemove({ _id: req.params.piggybankId }, async (err, piggybank) => {
                    if(!piggybank) res.status(404).json({error: 'No piggybank with that id found'})
                    else {
                        res.status(201).json(piggybank)
                    }
                })

                await user.save((err, savedUser) => {
                    if(err) res.status(400).json({ message: err.message })
                })
            } catch (err) {
                res.status(500).json({ message: err.message })
            }
        }
    })     
}

module.exports = {
    piggybankCreate,
    piggybankRead,
    deletePiggybankById
}