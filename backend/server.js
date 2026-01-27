import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/User.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not defined in environment variables!");
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:");
    console.error(err);
  });

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

// تحديث الطلب (✔️ يدعم تحديث جميع الحقول)
app.put("/api/orders/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };

    // إذا تم تغيير isDelivered، نحدث الحالة تلقائيًا
    if (updateData.isDelivered !== undefined) {
      updateData.status = updateData.isDelivered ? "تم الاستلام" : "New";
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Order not found" });
    }

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

// تحديث تصميم
app.put("/api/designs/:id", async (req, res) => {
  try {
    const updated = await Design.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Design not found" });
    }

    res.json(updated);
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

// Serve static files from the React app
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*path", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});
