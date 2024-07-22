const cron = require('node-cron');
const User = require('./models/user'); 
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

cron.schedule('0 0 30 * *', async () => {
    try {
        // Find all users in the database
        const users = await User.find();

        // Loop through each user and increment pineWallet by 100
        for (let user of users) {
            user.pineWallet += 100;
            await user.save(); // Save the updated user back to the database
        }

        console.log('Added 100 to pineWallet for all users');
    } catch (error) {
        console.error('Error updating pineWallet:', error);
    }
});