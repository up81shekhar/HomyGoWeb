import dotenv from "dotenv";
import mongoose from "mongoose";
import Listing from "../models/Listing.js";
import initData from "./data.js";

dotenv.config();

const uri = process.env.MONGO_URI;

async function main() {
    await mongoose.connect(uri);
    console.log("Database Connected");

    await seedData();
}

const seedData = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was deleted and new data was initialized");
};

main().catch((err) => {
    console.log("Error while connecting to Database:", err);
});