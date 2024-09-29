const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv").config();

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    governmentName: {
        type: String,
        required: true,
    },
    referrer: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    pineWallet: {
        type: Number,
        default: 0
    },
    pineVest: {
        type: Number,
        default: 0
    },
    referralPercentage: {
        type: Number,
        default: 0
    },
    referralEarning: {
        type: Number,
        default: 0
    },
    blocked: {
        type: Boolean,
        default: false
    },
    bankAccountDetails: {
        bankName: {
            type: String,
            required: false,
            default: ''
        },
        accountNumber: {
            type: String,
            required: false,
            default: ''
        },
        accountName: {
            type: String,
            required: false,
            default: ''
        }
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("User", userSchema);
