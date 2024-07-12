const User = require("../models/user");
const Trade = require("../models/trade");
const Transaction = require("../models/transaction");

exports.createTrade = async (req, res) => {
    const userId = req.user.id; // Assuming req.user.id is available in your middleware

    try {
        // Calculate the date 30 days ago from today
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Check if there are pending trades or trades within the last 30 days
        const existingTrades = await Trade.find({
            userId: userId,
            $or: [
                { status: "Pending" },
                { createdAt: { $gte: thirtyDaysAgo } }
            ]
        });

        if (existingTrades.length > 0) {
            return res.status(200).json({
                message: "There are pending trades or trades within the last 30 days.",
                trades: existingTrades
            });
        }

        // If no pending trades or trades within the last 30 days, proceed to create a new trade
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const amount = user.pineVest;
        if (amount <= 0) {
            return res.status(400).json({ message: "Insufficient pineVest amount" });
        }

        // Calculate returns (30% of the principal + principal)
        const returns = amount * 0.3;

        // Create a new trade using the pineVest amount
        const newTrade = new Trade({
            userId: user._id,
            amount: amount,
            returns: returns
        });

        await newTrade.save();

        // Create a transaction record for the new trade
        const newTransaction = new Transaction({
            userId: user._id,
            type: 'newTrade',
            amount: amount,
            description: `New trade created with amount ${amount}`
        });

        await newTransaction.save();

        // Return success response
        return res.status(201).json({
            message: "Trade created successfully",
            trade: newTrade,
            transaction: newTransaction
        });
    } catch (error) {
        console.error("Error creating or fetching trades:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.pendingTrade = async (req,res) => {
    const userId = req.user.id;
    try {
        // Retrieve all pending trades for the specified user
        const pendingTrades = await Trade.find({
            userId,
            status: 'Pending'
        });

        if (pendingTrades.length === 0) {
            return res.status(200).json({
                message: "No pending trades found for this user.",
                trades: []
            });
        }

        return res.status(200).json({
            message: "Pending trades retrieved successfully.",
            trades: pendingTrades
        });
    } catch (err) {
        console.error("Error retrieving pending trades:", err);
        return res.status(500).json({
            message: "An error occurred while retrieving pending trades.",
            error: err.message
        });
    }
}
