const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const generateAdminToken = require("../util/admintoken");

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists." });
        }

        const newAdmin = new Admin({ username, email, password });
        await newAdmin.save();

        const token = generateAdminToken(newAdmin);

        res.status(201).json({ token, message: "Admin created successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const token = generateAdminToken(admin);

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};
