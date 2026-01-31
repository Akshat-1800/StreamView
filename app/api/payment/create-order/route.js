import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config({path:".env.local"});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST() {
  try {
    const order = await razorpay.orders.create({
      amount: 19900, // ₹199
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}
