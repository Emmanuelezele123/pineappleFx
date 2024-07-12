const User = require("../models/user");
const Trade = require("../models/trade");

exports.createTrade = async (req, res) => {
    const userId = req.user.id;
    try {
      
          // Calculate the date 30 days ago from today
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Find trades that are either pending or created within the last 30 days
        const trades = await Trade.find({
            userId: userId,
            $or: [
                { status: "Pending" },
                { createdAt: { $gte: thirtyDaysAgo } }
            ]
        });

        if (trades.length > 0) {
            return res.status(200).json({
                message: "There are pending trades or trades within the last 30 days.",
            });
        } else {
            
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            const amount = user.pineVest;
            if (amount <= 0) {
                return res.status(400).json({ message: "Insufficient pineVest amount" });
            }
    
            // Step 2: Calculate returns (30% of the principal + principal)
            const returns = amount * 1.3;
    
            // Step 3: Create a new trade using the pineVest amount
            const newTrade = new Trade({
                userId: user._id,
                amount: amount,
                returns: returns
            });
    
            await newTrade.save();
    
            // Step 4: Create a transaction record for the new trade
            const newTransaction = new Transaction({
                userId: user._id,
                type: 'newTrade',
                amount: amount,
                description: `New trade created with amount ${amount}`
            });
    
            await newTransaction.save();
    
          
            return res.status(201).json({
                message: "Trade created successfully",
                trade: newTrade,
                transaction: newTransaction
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
