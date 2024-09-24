const User = require("../models/user");
const Transaction = require("../models/transaction");


exports.transferMoney = async (req, res) => {
    let { amount } = req.body;
    amount = Number(amount);
    const userId = req.user.id; 

    try {
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Transfer logic from pineWallet to pineVest
        if (user.pineWallet < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        user.pineWallet += amount;
        user.pineVest -= amount;
        await user.save();

        // Create transaction records for both wallet and vest
        const walletTransaction = new Transaction({
            userId,
            type: 'pinevestransfer',
            amount,
            description: `Transfer from pineVest to pinewallet`
        });
        await walletTransaction.save();

   

        res.json({ message: 'Transfer successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
