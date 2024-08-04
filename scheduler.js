const cron = require('node-cron');
const User = require('./models/user'); 
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const {createTradeForUser} = require("./controller/trade");

    const schedulePineWalletUpdate = () => {
        cron.schedule('*/5 * * * *', async () => {
            try {
              // Get all users
              const users = await User.find();
        
              for (const user of users) {
                await createTradeForUser(user._id);
              }
        
              console.log('Trade creation task executed successfully.');
            } catch (error) {
              console.error('Error executing trade creation task:', error);
            }
          });
      };


module.exports = schedulePineWalletUpdate;