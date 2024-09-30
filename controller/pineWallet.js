const User = require("../models/user");
const Transaction = require("../models/transaction");

exports.deposit = async (req, res) => {
    let { amount } = req.body;
    amount = Number(amount);
    const userId = req.user.id; 

    try {
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Deposit logic
        user.pineWallet += amount;
        await user.save();

        // Create transaction record
        const transaction = new Transaction({
            userId,
            type: 'pinedeposit',
            amount,
            description: 'Deposit to pineWallet'
        });
        await transaction.save();

        res.json({ message: 'Deposit successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.withdraw = async (req, res) => {
    let { amount } = req.body;
    amount = Number(amount);
    const userId = req.user.id; 

    try {
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Withdrawal logic
        if (user.pineWallet < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }
        user.pineWallet -= amount;
        await user.save();

        // Create transaction record
        const transaction = new Transaction({
            userId,
            type: 'pinewithdrawal',
            amount,
            description: 'Withdrawal from pineWallet'
        });
        await transaction.save();

        res.json({ message: 'Withdrawal successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



exports.adminDeposit = async (req, res) => {
    let { amount, username } = req.body;
    amount = Number(amount);

    try {
        let user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Deposit logic
        user.pineWallet += amount;
        await user.save();

        // Create transaction record
        const transaction = new Transaction({
            userId: user._id,
            type: 'pinedeposit',
            amount,
            description: 'Deposit to pineWallet'
        });
        await transaction.save();

        res.json({ message: 'Deposit successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.adminWithdraw = async (req, res) => {
    let { amount, username } = req.body;
    amount = Number(amount);

    try {
        let user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Withdrawal logic
        if (user.pineWallet < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }
        user.pineWallet -= amount;
        await user.save();

        // Create transaction record
        const transaction = new Transaction({
            userId: user._id,
            type: 'pinewithdrawal',
            amount,
            description: 'Withdrawal from pineWallet'
        });
        await transaction.save();

        res.json({ message: ' withdrawal successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



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

        user.pineWallet -= amount;
        user.pineVest += amount;
        await user.save();

        // Create transaction records for both wallet and vest
        const walletTransaction = new Transaction({
            userId,
            type: 'pinewallettransfer',
            amount,
            description: `Transfer from pineWallet to pineVest`
        });
        await walletTransaction.save();

   

        res.json({ message: 'Transfer successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
