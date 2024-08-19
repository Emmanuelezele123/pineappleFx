const cron = require('node-cron');
const User = require('./models/user');
const { createTradeForUser, completeTradeForUser } = require("./controller/trade");

const tradeSchedule = () => {
    // Schedule trade creation for all users every minute
    cron.schedule('*/1 * * * *', async () => {
        console.log('Trade creation started');
        try {
            const users = await User.find();
            for (const user of users) {
                await createTradeForUser(user._id);
            }
            console.log('Trade creation task executed successfully.');
        } catch (error) {
            console.error('Error executing trade creation task:', error);
        }
    });

    // Schedule trade completion for all users 2 minutes after the start of each 1-minute interval
    cron.schedule('*/2 * * * *', async () => {
        console.log('Trade completion started');
        try {
            const users = await User.find();
            for (const user of users) {
                await completeTr adeForUser(user._id);
            }
            console.log('Trade completion task executed successfully.');
        } catch (error) {
            console.error('Error executing trade completion task:', error);
        }
    });
};

module.exports = tradeSchedule;
