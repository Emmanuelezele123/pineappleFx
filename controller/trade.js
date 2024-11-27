const User = require("../models/user");
const Trade = require("../models/trade");
const Transaction = require("../models/transaction");

exports.createTradeForUser = async (userId) => {
    try {

      const user = await User.findById(userId);
      if (!user) {
        console.log(`User ${userId} not found.`);
        return;
      }
  
      const amount = user.pineVest;
      if (amount <= 0) {
        console.log(`User ${userId} has insufficient pineVest amount.`);
        return;
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

    /**  const referralUser =  await User.findOne({username:user.referrer})
      if(referralUser){
        referralUser.referralPercentage+=0.5
        await referralUser.save();
      }
   **/

      console.log(`Trade created successfully for user ${userId}`);
    } catch (error) {
      console.error(`Error creating trade for user ${userId}:`, error);
    }}


   
    
    exports.completeTradeForUser = async (userId) => {
        try {
            // Find the pending trade for the user
            const trade = await Trade.findOne({
                userId: userId,
                status: 'Pending'
            });
    
            if (!trade) {
                console.log(`No pending trade found for user ${userId}.`);
                return;
            }
    
            // Find the user associated with the trade
            const user = await User.findById(userId);
            if (!user) {
                console.log(`User ${userId} not found.`);
                return;  
            }

            var earnings = trade.amount * (user.referralPercentage /100)
            user.pineWallet += earnings
            user.referralPercentage = 0
           
            // Update the user's pineWallet with the trade returns
            user.pineWallet += trade.returns;
         
        
            await user.save();

            console.log("Trade Amount: ", trade.amount);
            console.log("User Referral Percentage: ", user.referralPercentage);
            console.log("Earnings: ", earnings);
            console.log("User Referral Earning: ", user.referralEarning);
    
            // Update the trade status to Completed
            trade.status = "Completed";
            await trade.save();

          
    
            // Create a transaction record for the trade returns
            const newTransaction = new Transaction({
                userId: user._id,
                type: 'tradereturns',
                amount: trade.returns,
                description: `Your pineWallet received returns of ${trade.returns}`
            });
            await newTransaction.save();
    
            console.log(`Trade for user ${userId} completed successfully and user's pineWallet updated to ${user.pineWallet}`);
        } catch (error) {
            console.error(`Error completing trade for user ${userId}:`, error);
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
