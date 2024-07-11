const Transaction = require("../models/transaction");

exports.getTransactions = async (req, res) => {
    const userId = req.user.id;

    try {
        const transactions = await Transaction.find({ userId });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
