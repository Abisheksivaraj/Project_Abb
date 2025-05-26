const mongoose = require("mongoose");
require("dotenv").config({ path: "./backend/.env" });
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // This is undefined
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDb;
