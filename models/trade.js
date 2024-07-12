const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    returns: {
        type: Number,
        required: true
    },
    status:{
        type:String,
        enum: ['Pending','Completed'],
        default:"Pending" 
    }
    
}, { timestamps: true });

module.exports = mongoose.model("Trade", tradeSchema);