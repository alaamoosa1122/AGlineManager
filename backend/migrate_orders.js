
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    abayaCode: { type: String, required: true },
    length: { type: String, required: true },
    width: { type: String, required: true },
    sleeveLength: { type: String, required: true },
    deliveryLocation: { type: String, required: true },
    price: { type: Number, required: true },
    deposit: { type: Number, default: 0 },
    notes: { type: String },
    isDelivered: { type: Boolean, default: false },
    status: { type: String, default: "New" },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

async function migrateOrders() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Mongo");

        const result = await Order.updateMany(
            { isDelivered: { $exists: false } },
            { $set: { isDelivered: false } }
        );

        console.log(`Migration complete.`);
        console.log(`Matched: ${result.matchedCount}`);
        console.log(`Modified: ${result.modifiedCount}`);

    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await mongoose.disconnect();
    }
}

migrateOrders();
