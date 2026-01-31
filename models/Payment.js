import mongoose from "mongoose";
const { Schema } = mongoose;
const paymentSchema = new Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      index: true,
    },
    amount: Number,
    currency: {
      type: String,
      default: "INR",
    },
    provider: {
      type: String,
      enum: ["STRIPE", "RAZORPAY"],
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "PENDING"],
    },
  },
  { timestamps: true }
);

export const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
