const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['pinedeposit', 'pinewithdrawal', 'pinewallettransfer' ],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
    
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
