const cron = require('node-cron');
const User = require('./models/user');
const { createTradeForUser, completeTradeForUser } = require("./controller/trade");

const tradeSchedule = () => {
    cron.schedule('*/1 * * * *', async () => {
        console.log('Trade creation and completion started');
        try {
            const users = await User.find();

            for (const user of users) {
                // Perform trade creation
                await createTradeForUser(user._id);

                // Perform trade completion
                await completeTradeForUser(user._id);
            }

            console.log('Trade creation and completion tasks executed successfully.');
        } catch (error) {
            console.error('Error executing trade tasks:', error);
        }
    });
};

module.exports = tradeSchedule;
