import mongoose from "mongoose";
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: String,
    avatarUrl: String,
    plan: {
      type: String,
      enum: ["FREE", "PREMIUM"],
      default: "FREE",
    },
    subscription: {
      razorpayPaymentId: String,
      startDate: Date,
      endDate: Date,
    },
    
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
