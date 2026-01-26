import mongoose from "mongoose";

const designSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true, // ما يتكرر الكود
      trim: true,
    },

    costPrice: {
      type: Number,
      required: true,
    },

    sellingPrice: {
      type: Number,
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },

    image: {
      type: String, // Base64 أو رابط
      required: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt تلقائي
  }
);

designSchema.index({ createdAt: -1 });

export default mongoose.model("Design", designSchema);
