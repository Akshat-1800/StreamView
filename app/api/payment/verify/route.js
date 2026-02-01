import crypto from "crypto";
import { auth,currentUser } from "@clerk/nextjs/server";
import dbconnect from "@/lib/db";
import { User } from "@/models/User";
import { Subscription } from "@/models/Subscription";
// import dotenv from "dotenv";

// dotenv.config({path:".env.local"});

export async function POST(req) {
  try {
    const user = await currentUser();
    const userId = user?.id;
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();

    // 🔐 Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return new Response("Invalid signature", { status: 400 });
    }

    await dbconnect();

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMinutes(endDate.getMinutes() + 1); // ✅ 30 DAYS

    await Subscription.create({
      clerkUserId: userId,
      plan: "MONTHLY",
      status: "ACTIVE",
      startDate,
      endDate,
      razorpayPaymentId: razorpay_payment_id,
    });

    await User.findOneAndUpdate(
      { clerkUserId: userId },
      {
        plan: "PREMIUM",
        planExpiresAt: endDate,
      }
    );

    return new Response(
      JSON.stringify({ message: "Subscription activated" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
