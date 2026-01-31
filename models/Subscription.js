import mongoose from "mongoose";
const { Schema } = mongoose;
const subscriptionSchema = new Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ["MONTHLY", "YEARLY"],
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "CANCELED", "EXPIRED"],
      required: true,
    },
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

export const Subscription =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);
