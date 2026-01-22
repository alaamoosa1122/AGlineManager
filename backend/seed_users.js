
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

async function seedUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Mongo");

        const users = [
            { username: "admin", password: "123456", role: "admin" },
            { username: "user", password: "123456", role: "user" },
        ];

        for (const u of users) {
            const existing = await User.findOne({ username: u.username });
            if (!existing) {
                await new User(u).save();
                console.log(`Created user: ${u.username}`);
            } else {
                console.log(`User already exists: ${u.username}`);
            }
        }

        console.log("Seeding complete.");
    } catch (err) {
        console.error("Seeding failed:", err);
    } finally {
        await mongoose.disconnect();
    }
}

seedUsers();
