
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

async function checkOrders() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Mongo");

        // 1. Check existing orders (RAW)
        const orders = await Order.find().lean();
        console.log(`Found ${orders.length} orders.`);
        orders.forEach(o => {
            console.log(`Order ${o._id}: isDelivered = ${o.isDelivered} (Type: ${typeof o.isDelivered})`);
            console.log(`  Has own property? ${o.hasOwnProperty('isDelivered')}`);
        });

        // 2. Create a new order to verify it gets the default
        const newOrder = new Order({
            customerName: "Test User",
            phone: "12345678",
            abayaCode: "TEST-DELIVERY",
            length: "50",
            width: "20",
            sleeveLength: "30",
            deliveryLocation: "Muscat",
            price: 50
        });
        const saved = await newOrder.save();
        console.log("Created new order:", saved._id);
        // Check raw again for the new order
        const savedRaw = await Order.findById(saved._id).lean();
        console.log(`New Order Raw isDelivered: ${savedRaw.isDelivered}`);

        // Clean up test order
        await Order.findByIdAndDelete(saved._id);
        console.log("Deleted test order");

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkOrders();
