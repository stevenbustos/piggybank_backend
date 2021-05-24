const mongoose = require('mongoose');

const PiggyBankSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        balance: {
            type: Number,
            min: 0,
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }   
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Piggybank', PiggyBankSchema);