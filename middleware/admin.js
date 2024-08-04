const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id);

        if (!admin) {
            throw new Error("Admin not found");
        }

        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ message: "Authentication failed", error: error.message });
    }
};

module.exports = adminAuth;
