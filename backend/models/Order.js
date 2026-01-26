import mongoose from "mongoose";

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
  isDelivered: { type: Boolean, default: false }, // ✅ مهم جداً
  status: { type: String, default: "New" },
  createdAt: { type: Date, default: Date.now }
});

orderSchema.index({ createdAt: -1 });

export default mongoose.model("Order", orderSchema);
