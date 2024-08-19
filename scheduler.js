const cron = require('node-cron');
const User = require('./models/user');
const { createTradeForUser, completeTradeForUser } = require("./controller/trade");

const tradeSchedule = () => {
    let months = 0;

    // Schedule trade creation for all users every minute
    cron.schedule('*/1 * * * *', async () => {
        months++;
        console.log('Trade creation started');
        try {
            const users = await User.find();
            for (const user of users) {
                await createTradeForUser(user._id);
            }
            console.log('Trade creation task executed successfully. Month:', months);

            // After trade creation is complete, start trade completion
            console.log('Trade completion started');
            for (const user of users) {
                await completeTradeForUser(user._id);
            }
            console.log('Trade completion task executed successfully for month', months);

        } catch (error) {
            console.error('Error executing trade creation/completion task:', error);
        }
    });
};

module.exports = tradeSchedule;

