import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/* =======================
   MongoDB Connection
======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* =======================
   Models
======================= */
import Order from "./models/Order.js";
import Design from "./models/Design.js";

/* =======================
   Orders Routes
======================= */
app.post("/api/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "Username already exists" });

    const newUser = new User({ username, password, role });
    const saved = await newUser.save();

    res.status(201).json({ message: "User created", user: { username: saved.username, role: saved.role } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// تسجيل الدخول
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // تحقق من الباسورد مباشرة (يمكنك لاحقاً تشفيره)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // إذا كان صحيح، أرسل بيانات المستخدم
    res.json({
      username: user.username,
      role: user.role,
      id: user._id,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// جلب كل الطلبات
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// إضافة طلب
app.post("/api/orders", async (req, res) => {
  try {
    const order = new Order(req.body);
    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// تحديث الطلب (✔️ عند الاستلام تتغير الحالة تلقائيًا)
app.put("/api/orders/:id", async (req, res) => {
  try {
    const { isDelivered } = req.body; // تأكد أنه يأتي من العميل

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      {
        isDelivered,
        status: isDelivered ? "تم الاستلام" : "New",
      },
      { new: true } // لكي يرجع لك النسخة المحدثة
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// حذف طلب
app.delete("/api/orders/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =======================
   Designs Routes
======================= */

// جلب التصاميم
app.get("/api/designs", async (req, res) => {
  try {
    const designs = await Design.find().sort({ createdAt: -1 });
    res.json(designs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// إضافة تصميم
app.post("/api/designs", async (req, res) => {
  try {
    const design = new Design(req.body);
    const saved = await design.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// حذف تصميم
app.delete("/api/designs/:id", async (req, res) => {
  try {
    await Design.findByIdAndDelete(req.params.id);
    res.json({ message: "Design deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =======================
   Test Route
======================= */
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

/* =======================
   Server
======================= */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
