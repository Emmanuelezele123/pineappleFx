const Rate = require("../models/rate");

const upsertRates = async (req, res) => {
    try {
        const {
            depositRateUSDToNaira,
            withdrawalRateUSDToNaira,
            depositRateNairaToUSD,
            withdrawalRateNairaToUSD,
        } = req.body;

        // Find the existing rate document
        let rate = await Rate.findOne();

        if (rate) {
            // Update the existing rate
            if (depositRateUSDToNaira !== undefined) rate.depositRateUSDToNaira = depositRateUSDToNaira;
            if (withdrawalRateUSDToNaira !== undefined) rate.withdrawalRateUSDToNaira = withdrawalRateUSDToNaira;
            if (depositRateNairaToUSD !== undefined) rate.depositRateNairaToUSD = depositRateNairaToUSD;
            if (withdrawalRateNairaToUSD !== undefined) rate.withdrawalRateNairaToUSD = withdrawalRateNairaToUSD;

            await rate.save();
            return res.status(200).json({ message: "Rates updated successfully", rates: rate });
        }

        // Create a new rate document if none exists
        rate = await Rate.create({
            depositRateUSDToNaira,
            withdrawalRateUSDToNaira,
            depositRateNairaToUSD,
            withdrawalRateNairaToUSD,
        });

        res.status(201).json({ message: "Rates created successfully", rates: rate });
    } catch (error) {
        res.status(500).json({ message: "Error processing rates", error: error.message });
    }
};

// Fetch the current rates
const getRates = async (req, res) => {
    try {
        let rate = await Rate.findOne();
        if (!rate) {
            rate = await Rate.create({}); // Create default rates if none exist
        }

        res.status(200).json({ message: "Rates fetched successfully", rates: rate });
    } catch (error) {
        res.status(500).json({ message: "Error fetching rates", error: error.message });
    }
};

module.exports = {
    upsertRates,
    getRates,
};
