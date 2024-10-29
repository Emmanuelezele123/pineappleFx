const User = require("../models/user");
const bcrypt = require("bcryptjs");
const generateToken = require("../util/token")


exports.registerUser = async (req, res) => {
    try {
        let { username, email, password,governmentName,referrer } = req.body;
      
       
       
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

   
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }


        if (referrer) {
            const referrerUser = await User.findOne({ username: referrer });
            if (!referrerUser) {
                return res.status(400).json({ message: "Referral Username does not exist" });
            }
        }
     
        const count = await User.countDocuments({ referrer: referrer});
        if (count <= 40 ) {
          console.log("You have used "+count+"/40 referrals before now")
        }else{
            referrer = ""
        }

        const newUser = new User({ username, email, password ,referrer,governmentName });
        await newUser.save();

        const token = generateToken(newUser);

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const token = generateToken(user);
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;

        // Debug log
        console.log("Starting password change for userId:", userId);

        // Validate input
        if (!userId || !newPassword) {
            return res.status(400).json({ message: "User ID and new password are required." });
        }

        // Find user by ID
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Hash the new password directly (bypass pre-save hook)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Update password using updateOne to bypass the pre-save middleware
        await User.updateOne(
            { _id: userId },
            { $set: { password: hashedPassword } }
        );

        console.log("Password updated successfully for user:", user.username);

        res.status(200).json({ message: "Password changed successfully." });
    } catch (error) {
        console.error("Error in changePassword:", error);
        res.status(500).json({ 
            message: "Internal server error.", 
            error: error.message 
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.updateBankAccount = async (req, res) => {
    try {
        const { bankName, accountNumber, accountName } = req.body;

        // Check if all fields are provided
        if (!bankName || !accountNumber || !accountName) {
            return res.status(400).json({ message: "Please provide all required bank account details." });
        }

        // Update the bank account details
        req.user.bankAccountDetails = {
            bankName,
            accountNumber,
            accountName
        };

        // Save the updated user
        await req.user.save();

        res.status(200).json({ message: "Bank account details updated successfully", bankAccountDetails: req.user.bankAccountDetails });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};





exports.getTopUsers = async (req, res) => {
    try {
        // Aggregate users and compute the combined sum of pineVest and pineWallet
        const topUsers = await User.aggregate([
            {
                $addFields: {
                    totalBalance: { $sum: ["$pineVest", "$pineWallet"] } // Combine pineVest and pineWallet
                }
            },
            {
                $sort: { totalBalance: -1 } // Sort by totalBalance in descending order
            },
            {
                $limit: 10 // Limit the result to 10 users
            },
            {
                $project: {
                    username: 1,
                    email: 1,
                    pineWallet: 1,
                    pineVest: 1,
                    totalBalance: 1 // Return total balance
                }
            }
        ]);

        // Send the response
        res.status(200).json({
            success: true,
            count: topUsers.length,
            data: topUsers
        });
    } catch (error) {
        console.error("Error fetching top users:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch top users"
        });
    }
};



// Controller to get referral count by username
exports.getReferralCount = async (req, res) => {
    try {
        const { username } = req.params;

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Count the users who have this user as a referrer
        const referralCount = await User.countDocuments({ referrer: username });

        return res.status(200).json({
            message: `Referral count for ${username}`,
            referralCount: referralCount
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

