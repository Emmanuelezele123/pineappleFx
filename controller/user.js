const User = require("../models/user");
const bcrypt =require("bcryptjs");
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

 
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

    
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

exports.getUser = async (req, res) => {
    try {
        res.json(req.user);
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
