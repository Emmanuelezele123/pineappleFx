const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors'); 
const app = express();
const connectDb = require('./config/database');
const userRoutes = require("./routes/user");
const walletRoutes = require("./routes/pinewallet")
const transactionRoutes = require("./routes/transaction")
const tradeRoutes = require("./routes/trade")
const adminRoutes = require("./routes/admin")

const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware setup
app.use(cors({
  origin: '*', // Adjust this to your specific origin as needed
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
}));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/pinewallet",walletRoutes);
app.use("/api/v1/admin",adminRoutes);
app.use("/api/v1/transaction",transactionRoutes);
app.use("/api/v1/trade",tradeRoutes);
app.listen(port, async() => {
  connectDb();
  console.log(`Server listening on port ${port}`);
  
  
});