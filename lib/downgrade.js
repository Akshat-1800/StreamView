import connectDB from "@/lib/db";
import { Subscription } from "@/models/Subscription";
import { User } from "@/models/User";

export async function downgradeExpiredSubscriptions() {
  await connectDB();

  const now = new Date();

  // 1️⃣ Find expired active subscriptions
  const expiredSubs = await Subscription.find({
    status: "ACTIVE",
    endDate: { $lte: now },
  });

  for (const sub of expiredSubs) {
    // 2️⃣ Mark subscription as expired
    await Subscription.updateOne(
      { _id: sub._id },
      { status: "EXPIRED" }
    );

    // 3️⃣ Downgrade user
    await User.updateOne(
      { clerkUserId: sub.clerkUserId },
      {
        plan: "FREE",
        planExpiresAt: null,
      }
    );
  }
}
