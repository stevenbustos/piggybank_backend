const mongoose = require('mongoose');

const PiggyBankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }   
});

module.exports = mongoose.model('Piggybank', PiggyBankSchema);