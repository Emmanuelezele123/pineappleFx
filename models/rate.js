const mongoose = require("mongoose");

const rateSchema = new mongoose.Schema({
    depositRateUSDToNaira: {
        type: Number,
        required: true,
        default: 750, // Default USD to Naira deposit rate
    },
    withdrawalRateUSDToNaira: {
        type: Number,
        required: true,
        default: 740, // Default USD to Naira withdrawal rate
    },
    depositRateNairaToUSD: {
        type: Number,
        required: true,
        default: 0.00133, // Default Naira to USD deposit rate
    },
    withdrawalRateNairaToUSD: {
        type: Number,
        required: true,
        default: 0.00135, // Default Naira to USD withdrawal rate
    },
}, { timestamps: true });

module.exports = mongoose.model("Rate", rateSchema);
