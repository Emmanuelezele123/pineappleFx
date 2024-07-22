const jwt = require("jsonwebtoken");

const adminToken = (admin) => {
    return jwt.sign(
        { id: admin._id, username: admin.username, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
    );
};

module.exports = adminToken;
