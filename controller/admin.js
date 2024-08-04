const Admin = require("../models/admin");
const User = require("../models/user");
const Transaction = require("../models/transaction");
const bcrypt = require("bcryptjs");
const generateAdminToken = require("../util/admintoken");

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists." });
        }

        const newAdmin = new Admin({ username, email, password });
        await newAdmin.save();

        const token = generateAdminToken(newAdmin);

        res.status(201).json({ token, message: "Admin created successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const token = generateAdminToken(admin);

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.admin.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};



// Update user by ID
exports.updateUserById = async (req, res) => {
    const { update } = req.body;
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};



exports.getTransactionsForUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const transactions = await Transaction.find({ userId });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllTransactionsByType = async (req, res) => {
    const { type } = req.params;
    try {
        console.log(type)
        const transactions = await Transaction.find({ type });
        console.log(transactions)
        const count = transactions.length;
        const cumulativeAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        res.json({ count, cumulativeAmount });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getAllTransactionsSummary = async (req, res) => {
    try {
        const types = ['pinedeposit', 'pinewithdrawal', 'pinewallettransfer', 'newTrade'];
        const summary = {};

        for (const type of types) {
            const transactions = await Transaction.find({ type });
            summary[type] = {
                count: transactions.length,
                cumulativeAmount: transactions.reduce((sum, transaction) => sum + transaction.amount, 0),
            };
        }

        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all transactions
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};