import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // يمكنك تشفيرها لاحقًا بـ bcrypt
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

export default mongoose.model("User", userSchema);
